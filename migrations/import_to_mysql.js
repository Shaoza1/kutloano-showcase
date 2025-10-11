#!/usr/bin/env node

/**
 * Import to MySQL from Exported Supabase Data
 * 
 * Imports JSONL files into MySQL and copies storage files to public/uploads/
 * 
 * Usage: node migrations/import_to_mysql.js [--dry-run]
 */

import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { promises as fsPromises } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

const EXPORT_DIR = path.join(__dirname, 'export');
const STORAGE_DIR = path.join(EXPORT_DIR, 'storage');
const UPLOADS_DIR = path.join(process.cwd(), process.env.UPLOADS_DIR || 'public/uploads');
const BATCH_SIZE = parseInt(process.env.MIGRATION_BATCH_SIZE || '500');
const DRY_RUN = process.argv.includes('--dry-run');

const MYSQL_CONFIG = {
  host: process.env.MYSQL_HOST || '127.0.0.1',
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'portfolio_local',
  multipleStatements: true
};

let connection;

// Generate short hash for file naming
function generateHash(str, length = 6) {
  return crypto.createHash('md5').update(str).digest('hex').substring(0, length);
}

// Safe filename (prevent path traversal)
function sanitizeFilename(filename) {
  return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
}

// Read JSONL file and parse rows
async function readJSONL(filePath) {
  const content = await fsPromises.readFile(filePath, 'utf-8');
  return content
    .trim()
    .split('\n')
    .filter(line => line.trim())
    .map(line => JSON.parse(line));
}

// Import single table
async function importTable(tableName) {
  console.log(`\n📊 Importing ${tableName}...`);
  
  const jsonlFile = path.join(EXPORT_DIR, `${tableName}.jsonl`);
  
  if (!fs.existsSync(jsonlFile)) {
    console.log(`  ⚠️  File not found: ${tableName}.jsonl (skipping)`);
    return { imported: 0, skipped: 0, errors: [] };
  }
  
  const rows = await readJSONL(jsonlFile);
  
  if (rows.length === 0) {
    console.log(`  ℹ️  No data to import`);
    return { imported: 0, skipped: 0, errors: [] };
  }
  
  // Get column names from first row
  const columns = Object.keys(rows[0]);
  const placeholders = columns.map(() => '?').join(', ');
  const columnList = columns.map(col => `\`${col}\``).join(', ');
  
  const insertQuery = `INSERT INTO ${tableName} (${columnList}) VALUES (${placeholders})`;
  
  let imported = 0;
  let skipped = 0;
  const errors = [];
  
  if (DRY_RUN) {
    console.log(`  [DRY RUN] Would import ${rows.length} rows`);
    return { imported: rows.length, skipped: 0, errors: [] };
  }
  
  // Process in batches with transactions
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    
    try {
      await connection.beginTransaction();
      
      for (const row of batch) {
        try {
          // Convert arrays/objects to JSON strings
          const values = columns.map(col => {
            const value = row[col];
            if (value === null || value === undefined) return null;
            if (Array.isArray(value) || typeof value === 'object') {
              return JSON.stringify(value);
            }
            return value;
          });
          
          await connection.execute(insertQuery, values);
          imported++;
        } catch (error) {
          skipped++;
          errors.push({ row: row.id || i, error: error.message });
        }
      }
      
      await connection.commit();
      process.stdout.write(`  Imported ${imported}/${rows.length} rows...\r`);
      
    } catch (error) {
      await connection.rollback();
      console.error(`\n  ❌ Batch import failed:`, error.message);
      skipped += batch.length;
    }
  }
  
  console.log(`  ✅ Imported ${imported} rows (${skipped} skipped)`);
  
  return { imported, skipped, errors };
}

// Copy storage files
async function copyStorageFiles() {
  console.log('\n\n📦 COPYING STORAGE FILES');
  console.log('═══════════════════════════════════════════════');
  
  if (!fs.existsSync(STORAGE_DIR)) {
    console.log('  ℹ️  No storage files to copy');
    return { copied: 0, skipped: 0, errors: [] };
  }
  
  // Ensure uploads directory exists
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
  
  let copied = 0;
  let skipped = 0;
  const errors = [];
  const fileMap = {}; // Original path -> new path
  
  // Recursively copy files
  async function copyDirectory(sourceDir, destDir, relativePath = '') {
    const entries = await fsPromises.readdir(sourceDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const sourcePath = path.join(sourceDir, entry.name);
      
      if (entry.isDirectory()) {
        const newDestDir = path.join(destDir, entry.name);
        if (!fs.existsSync(newDestDir)) {
          fs.mkdirSync(newDestDir, { recursive: true });
        }
        await copyDirectory(sourcePath, newDestDir, path.join(relativePath, entry.name));
      } else {
        try {
          const filename = sanitizeFilename(entry.name);
          let destPath = path.join(destDir, filename);
          
          // Handle name collisions
          if (fs.existsSync(destPath)) {
            const ext = path.extname(filename);
            const base = path.basename(filename, ext);
            const hash = generateHash(sourcePath);
            const newFilename = `${base}-${hash}${ext}`;
            destPath = path.join(destDir, newFilename);
          }
          
          if (DRY_RUN) {
            console.log(`  [DRY RUN] Would copy: ${entry.name}`);
          } else {
            await fsPromises.copyFile(sourcePath, destPath);
          }
          
          // Track mapping for URL updates
          const originalRelPath = path.join(relativePath, entry.name);
          const newRelPath = path.relative(UPLOADS_DIR, destPath);
          fileMap[originalRelPath] = `/uploads/${newRelPath.replace(/\\/g, '/')}`;
          
          copied++;
          process.stdout.write(`  Copied ${copied} files...\r`);
          
        } catch (error) {
          skipped++;
          errors.push({ file: entry.name, error: error.message });
        }
      }
    }
  }
  
  await copyDirectory(STORAGE_DIR, UPLOADS_DIR);
  
  console.log(`\n  ✅ Copied ${copied} files (${skipped} skipped)`);
  
  return { copied, skipped, errors, fileMap };
}

// Update asset URLs in database
async function updateAssetUrls(fileMap) {
  console.log('\n📝 Updating asset URLs...');
  
  if (DRY_RUN) {
    console.log('  [DRY RUN] Would update asset URLs');
    return;
  }
  
  try {
    // Update CV management file paths
    const cvFiles = await connection.query('SELECT id, file_path FROM cv_management');
    for (const row of cvFiles[0]) {
      const basename = path.basename(row.file_path);
      const newUrl = fileMap[`cv-files/${basename}`] || `/uploads/${basename}`;
      await connection.execute(
        'UPDATE cv_management SET file_path = ? WHERE id = ?',
        [newUrl, row.id]
      );
    }
    
    console.log('  ✅ Updated asset URLs');
  } catch (error) {
    console.error('  ⚠️  Failed to update some URLs:', error.message);
  }
}

// Generate import report
function generateReport(tableResults, storageResults) {
  const report = {
    importDate: new Date().toISOString(),
    dryRun: DRY_RUN,
    tables: tableResults,
    storage: storageResults,
    totals: {
      rowsImported: Object.values(tableResults).reduce((sum, r) => sum + r.imported, 0),
      rowsSkipped: Object.values(tableResults).reduce((sum, r) => sum + r.skipped, 0),
      filesCopied: storageResults.copied,
      filesSkipped: storageResults.skipped
    },
    errors: {
      tables: Object.entries(tableResults)
        .filter(([_, r]) => r.errors.length > 0)
        .map(([name, r]) => ({ table: name, errors: r.errors })),
      storage: storageResults.errors
    }
  };
  
  const reportPath = path.join(__dirname, 'import_report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log('\n✅ Generated import_report.json');
  return report;
}

// Main import function
async function main() {
  console.log(DRY_RUN ? '🧪 DRY RUN MODE - No data will be committed\n' : '🚀 Starting MySQL Import\n');
  console.log('═══════════════════════════════════════════════\n');
  
  // Validate environment
  if (!process.env.MYSQL_DATABASE) {
    console.error('❌ Missing MYSQL_DATABASE in .env');
    process.exit(1);
  }
  
  // Check export files exist
  if (!fs.existsSync(EXPORT_DIR)) {
    console.error('❌ Export directory not found. Run export first: npm run migrate:export');
    process.exit(1);
  }
  
  // Connect to MySQL
  console.log('🔗 Connecting to MySQL...');
  try {
    connection = await mysql.createConnection(MYSQL_CONFIG);
    console.log(`✅ Connected to MySQL: ${MYSQL_CONFIG.host}:${MYSQL_CONFIG.port}\n`);
  } catch (error) {
    console.error('❌ Failed to connect to MySQL:', error.message);
    console.error('\nTroubleshooting:');
    console.error('  1. Ensure XAMPP MySQL is running');
    console.error('  2. Check credentials in .env');
    console.error('  3. Verify database exists: CREATE DATABASE portfolio_local;');
    process.exit(1);
  }
  
  // Import tables
  console.log('📊 IMPORTING TABLES');
  console.log('═══════════════════════════════════════════════');
  
  const tableResults = {};
  
  const tables = [
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
  
  for (const tableName of tables) {
    try {
      const result = await importTable(tableName);
      tableResults[tableName] = result;
    } catch (error) {
      console.error(`❌ Failed to import ${tableName}:`, error.message);
      tableResults[tableName] = { imported: 0, skipped: 0, errors: [{ error: error.message }] };
    }
  }
  
  // Copy storage files
  const storageResults = await copyStorageFiles();
  
  // Update asset URLs
  if (!DRY_RUN && storageResults.copied > 0) {
    await updateAssetUrls(storageResults.fileMap);
  }
  
  // Generate report
  console.log('\n\n📋 GENERATING REPORT');
  console.log('═══════════════════════════════════════════════');
  
  const report = generateReport(tableResults, storageResults);
  
  // Close connection
  await connection.end();
  
  // Summary
  console.log('\n\n✅ IMPORT COMPLETE!');
  console.log('═══════════════════════════════════════════════');
  console.log(`📊 Total rows imported: ${report.totals.rowsImported}`);
  console.log(`📦 Total files copied: ${report.totals.filesCopied}`);
  console.log(`⚠️  Rows skipped: ${report.totals.rowsSkipped}`);
  console.log(`⚠️  Files skipped: ${report.totals.filesSkipped}`);
  console.log(`📁 Report: migrations/import_report.json`);
  console.log('\nNext step:');
  console.log('  Verify migration: npm run migrate:verify\n');
}

// Run import
main().catch((error) => {
  console.error('\n❌ Import failed:', error);
  if (connection) connection.end();
  process.exit(1);
});
