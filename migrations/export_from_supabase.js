#!/usr/bin/env node

/**
 * Export from Supabase to Local Files
 * 
 * Exports all tables and storage from Supabase to local JSONL files
 * and downloads storage bucket files.
 * 
 * Usage: node migrations/export_from_supabase.js
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
const EXPORT_DIR = path.join(__dirname, 'export');
const STORAGE_DIR = path.join(EXPORT_DIR, 'storage');
const BATCH_SIZE = parseInt(process.env.MIGRATION_BATCH_SIZE || '1000');

// Tables to export
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

// Storage buckets to export
const STORAGE_BUCKETS = process.env.STORAGE_BUCKETS?.split(',') || ['cv-files'];

let supabase;

// Utility: Retry with exponential backoff
async function retryWithBackoff(fn, maxRetries = 3, initialDelay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const delay = initialDelay * Math.pow(2, i);
      console.log(`  ⚠️  Retry ${i + 1}/${maxRetries} after ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Utility: Download file from URL
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {}); // Delete partial file
      reject(err);
    });
  });
}

// Initialize export directories
function initDirectories() {
  console.log('📁 Initializing export directories...\n');
  
  if (!fs.existsSync(EXPORT_DIR)) {
    fs.mkdirSync(EXPORT_DIR, { recursive: true });
  }
  
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
  }
}

// Export single table
async function exportTable(tableName) {
  console.log(`\n📊 Exporting ${tableName}...`);
  
  const outputFile = path.join(EXPORT_DIR, `${tableName}.jsonl`);
  const writeStream = fs.createWriteStream(outputFile);
  
  let offset = 0;
  let totalRows = 0;
  let hasMore = true;
  
  while (hasMore) {
    const { data, error } = await retryWithBackoff(async () => {
      return await supabase
        .from(tableName)
        .select('*')
        .range(offset, offset + BATCH_SIZE - 1);
    });
    
    if (error) {
      console.error(`  ❌ Error exporting ${tableName}:`, error.message);
      writeStream.end();
      return 0;
    }
    
    if (!data || data.length === 0) {
      hasMore = false;
      break;
    }
    
    // Write each row as newline-delimited JSON
    for (const row of data) {
      writeStream.write(JSON.stringify(row) + '\n');
      totalRows++;
    }
    
    offset += BATCH_SIZE;
    process.stdout.write(`  Exported ${totalRows} rows...\r`);
    
    if (data.length < BATCH_SIZE) {
      hasMore = false;
    }
  }
  
  writeStream.end();
  console.log(`  ✅ Exported ${totalRows} rows to ${tableName}.jsonl`);
  
  return totalRows;
}

// Export storage bucket
async function exportStorageBucket(bucketName) {
  console.log(`\n📦 Exporting storage bucket: ${bucketName}...`);
  
  const bucketDir = path.join(STORAGE_DIR, bucketName);
  if (!fs.existsSync(bucketDir)) {
    fs.mkdirSync(bucketDir, { recursive: true });
  }
  
  // List all files in bucket
  const { data: files, error } = await retryWithBackoff(async () => {
    return await supabase.storage.from(bucketName).list('', {
      limit: 1000,
      sortBy: { column: 'name', order: 'asc' }
    });
  });
  
  if (error) {
    console.error(`  ❌ Error listing bucket ${bucketName}:`, error.message);
    return 0;
  }
  
  if (!files || files.length === 0) {
    console.log(`  ℹ️  Bucket ${bucketName} is empty`);
    return 0;
  }
  
  let downloadedCount = 0;
  
  for (const file of files) {
    if (file.id === null) continue; // Skip folders
    
    try {
      const { data: publicUrl } = supabase.storage
        .from(bucketName)
        .getPublicUrl(file.name);
      
      const destPath = path.join(bucketDir, file.name);
      
      await retryWithBackoff(async () => {
        await downloadFile(publicUrl.publicUrl, destPath);
      });
      
      downloadedCount++;
      process.stdout.write(`  Downloaded ${downloadedCount}/${files.length} files...\r`);
    } catch (error) {
      console.error(`\n  ⚠️  Failed to download ${file.name}:`, error.message);
    }
  }
  
  console.log(`  ✅ Downloaded ${downloadedCount} files from ${bucketName}`);
  return downloadedCount;
}

// Generate manifest
function generateManifest(tableCounts, storageCounts) {
  const manifest = {
    exportDate: new Date().toISOString(),
    supabaseUrl: SUPABASE_URL,
    tables: tableCounts,
    storage: storageCounts,
    totals: {
      totalRows: Object.values(tableCounts).reduce((sum, count) => sum + count, 0),
      totalFiles: Object.values(storageCounts).reduce((sum, count) => sum + count, 0)
    }
  };
  
  const manifestPath = path.join(EXPORT_DIR, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  
  console.log('\n✅ Generated manifest.json');
  return manifest;
}

// Main export function
async function main() {
  console.log('🚀 Starting Supabase Export\n');
  console.log('═══════════════════════════════════════════════\n');
  
  // Validate environment
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Missing required environment variables:');
    console.error('   SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in .env');
    process.exit(1);
  }
  
  // Initialize Supabase client
  supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  console.log(`🔗 Connected to: ${SUPABASE_URL}\n`);
  
  // Initialize directories
  initDirectories();
  
  // Export tables
  console.log('📊 EXPORTING TABLES');
  console.log('═══════════════════════════════════════════════');
  
  const tableCounts = {};
  
  for (const tableName of TABLES) {
    try {
      const count = await exportTable(tableName);
      tableCounts[tableName] = count;
    } catch (error) {
      console.error(`❌ Failed to export ${tableName}:`, error.message);
      tableCounts[tableName] = 0;
    }
  }
  
  // Export storage
  console.log('\n\n📦 EXPORTING STORAGE');
  console.log('═══════════════════════════════════════════════');
  
  const storageCounts = {};
  
  for (const bucketName of STORAGE_BUCKETS) {
    try {
      const count = await exportStorageBucket(bucketName);
      storageCounts[bucketName] = count;
    } catch (error) {
      console.error(`❌ Failed to export bucket ${bucketName}:`, error.message);
      storageCounts[bucketName] = 0;
    }
  }
  
  // Generate manifest
  console.log('\n\n📋 GENERATING MANIFEST');
  console.log('═══════════════════════════════════════════════');
  
  const manifest = generateManifest(tableCounts, storageCounts);
  
  // Summary
  console.log('\n\n✅ EXPORT COMPLETE!');
  console.log('═══════════════════════════════════════════════');
  console.log(`📊 Total rows exported: ${manifest.totals.totalRows}`);
  console.log(`📦 Total files downloaded: ${manifest.totals.totalFiles}`);
  console.log(`📁 Export location: ${EXPORT_DIR}`);
  console.log('\nNext steps:');
  console.log('  1. Import MySQL schema: mysql -u root portfolio_local < migrations/supabase_to_mysql_schema.sql');
  console.log('  2. Import data: npm run migrate:import');
  console.log('  3. Verify: npm run migrate:verify\n');
}

// Run export
main().catch((error) => {
  console.error('\n❌ Export failed:', error);
  process.exit(1);
});
