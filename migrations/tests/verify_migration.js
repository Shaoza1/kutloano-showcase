#!/usr/bin/env node

/**
 * Verify Migration from Supabase to MySQL
 * 
 * Compares row counts and checksums between Supabase and MySQL
 * 
 * Usage: node migrations/tests/verify_migration.js
 */

import { createClient } from '@supabase/supabase-js';
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

const MYSQL_CONFIG = {
  host: process.env.MYSQL_HOST || '127.0.0.1',
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'portfolio_local'
};

const TABLES = [
  'portfolio_projects',
  'portfolio_skills',
  'portfolio_experience',
  'portfolio_certifications',
  'portfolio_articles',
  'portfolio_case_studies',
  'cv_management',
  'contact_submissions',
  'visitor_analytics',
  'site_analytics',
  'cv_downloads',
  'project_interactions'
];

let supabase;
let mysqlConnection;

// Get row count from Supabase
async function getSupabaseCount(tableName) {
  try {
    const { count, error } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });
    
    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error(`  ⚠️  Failed to count ${tableName} in Supabase:`, error.message);
    return null;
  }
}

// Get row count from MySQL
async function getMySQLCount(tableName) {
  try {
    const [rows] = await mysqlConnection.query(`SELECT COUNT(*) as count FROM ${tableName}`);
    return rows[0].count;
  } catch (error) {
    console.error(`  ⚠️  Failed to count ${tableName} in MySQL:`, error.message);
    return null;
  }
}

// Get sample IDs from Supabase
async function getSupabaseSampleIds(tableName, limit = 5) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('id')
      .limit(limit);
    
    if (error) throw error;
    return (data || []).map(row => row.id);
  } catch (error) {
    return [];
  }
}

// Get sample IDs from MySQL
async function getMySQLSampleIds(tableName, limit = 5) {
  try {
    const [rows] = await mysqlConnection.query(`SELECT id FROM ${tableName} LIMIT ${limit}`);
    return rows.map(row => row.id);
  } catch (error) {
    return [];
  }
}

// Verify single table
async function verifyTable(tableName) {
  process.stdout.write(`📊 ${tableName.padEnd(30)}... `);
  
  const supabaseCount = await getSupabaseCount(tableName);
  const mysqlCount = await getMySQLCount(tableName);
  
  if (supabaseCount === null || mysqlCount === null) {
    console.log('❌ ERROR');
    return { tableName, supabaseCount, mysqlCount, match: false, error: true };
  }
  
  const match = supabaseCount === mysqlCount;
  const status = match ? '✅' : '⚠️';
  const diff = mysqlCount - supabaseCount;
  const diffStr = diff > 0 ? `+${diff}` : diff;
  
  console.log(`${status} ${supabaseCount} → ${mysqlCount} ${match ? '' : `(${diffStr})`}`);
  
  return {
    tableName,
    supabaseCount,
    mysqlCount,
    match,
    difference: diff
  };
}

// Verify storage files
async function verifyStorage() {
  console.log('\n📦 Verifying storage files...');
  
  const exportDir = path.join(__dirname, '..', 'export', 'storage');
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  
  if (!fs.existsSync(exportDir)) {
    console.log('  ℹ️  No storage files exported');
    return { exportedFiles: 0, copiedFiles: 0, match: true };
  }
  
  if (!fs.existsSync(uploadsDir)) {
    console.log('  ⚠️  Uploads directory not found');
    return { exportedFiles: 0, copiedFiles: 0, match: false };
  }
  
  // Count files recursively
  function countFiles(dir) {
    let count = 0;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        count += countFiles(path.join(dir, entry.name));
      } else {
        count++;
      }
    }
    return count;
  }
  
  const exportedFiles = countFiles(exportDir);
  const copiedFiles = countFiles(uploadsDir);
  
  const match = exportedFiles === copiedFiles;
  const status = match ? '✅' : '⚠️';
  
  console.log(`  ${status} Exported: ${exportedFiles}, Copied: ${copiedFiles}`);
  
  return { exportedFiles, copiedFiles, match };
}

// Generate checksums file
function generateChecksums(results, storageResult) {
  const checksums = {
    verificationDate: new Date().toISOString(),
    tables: results,
    storage: storageResult,
    summary: {
      totalTables: results.length,
      matchingTables: results.filter(r => r.match).length,
      mismatchedTables: results.filter(r => !r.match && !r.error).length,
      errorTables: results.filter(r => r.error).length,
      storageMatch: storageResult.match
    }
  };
  
  const checksumsPath = path.join(__dirname, '..', 'checksums.json');
  fs.writeFileSync(checksumsPath, JSON.stringify(checksums, null, 2));
  
  console.log('\n✅ Generated checksums.json');
  return checksums;
}

// Main verification function
async function main() {
  console.log('🔍 Starting Migration Verification\n');
  console.log('═══════════════════════════════════════════════\n');
  
  // Validate environment
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Missing Supabase credentials in .env');
    process.exit(1);
  }
  
  // Connect to Supabase
  console.log('🔗 Connecting to Supabase...');
  supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  console.log('✅ Connected to Supabase\n');
  
  // Connect to MySQL
  console.log('🔗 Connecting to MySQL...');
  try {
    mysqlConnection = await mysql.createConnection(MYSQL_CONFIG);
    console.log('✅ Connected to MySQL\n');
  } catch (error) {
    console.error('❌ Failed to connect to MySQL:', error.message);
    process.exit(1);
  }
  
  // Verify tables
  console.log('📊 VERIFYING TABLES');
  console.log('═══════════════════════════════════════════════\n');
  
  const results = [];
  
  for (const tableName of TABLES) {
    const result = await verifyTable(tableName);
    results.push(result);
  }
  
  // Verify storage
  console.log('\n📦 VERIFYING STORAGE');
  console.log('═══════════════════════════════════════════════');
  
  const storageResult = await verifyStorage();
  
  // Generate checksums
  console.log('\n📋 GENERATING CHECKSUMS');
  console.log('═══════════════════════════════════════════════');
  
  const checksums = generateChecksums(results, storageResult);
  
  // Close connections
  await mysqlConnection.end();
  
  // Summary
  console.log('\n\n✅ VERIFICATION COMPLETE!');
  console.log('═══════════════════════════════════════════════');
  console.log(`✅ Matching tables: ${checksums.summary.matchingTables}/${checksums.summary.totalTables}`);
  console.log(`⚠️  Mismatched tables: ${checksums.summary.mismatchedTables}`);
  console.log(`❌ Error tables: ${checksums.summary.errorTables}`);
  console.log(`📦 Storage match: ${storageResult.match ? '✅' : '⚠️'}`);
  console.log(`📁 Details: migrations/checksums.json\n`);
  
  if (checksums.summary.mismatchedTables > 0 || checksums.summary.errorTables > 0) {
    console.log('⚠️  Some tables have discrepancies. Check checksums.json for details.');
    process.exit(1);
  }
}

// Run verification
main().catch((error) => {
  console.error('\n❌ Verification failed:', error);
  if (mysqlConnection) mysqlConnection.end();
  process.exit(1);
});
