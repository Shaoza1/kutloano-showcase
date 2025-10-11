# Supabase to XAMPP MySQL Migration Guide

Complete migration package to export all content from Supabase and import into local XAMPP MySQL database.

## Prerequisites

- **Node.js** (v16+)
- **XAMPP** installed and running (Apache + MySQL)
- **MySQL client** (usually included with XAMPP)
- **Supabase Service Role Key** (get from Supabase Dashboard → Settings → API)

## Quick Start

See [README_MIGRATION_QUICKSTEPS.md](../README_MIGRATION_QUICKSTEPS.md) for the fastest path.

## Detailed Steps

### 1. Environment Setup

Copy the example environment file:
```bash
cp config/example.env.local .env
```

Edit `.env` and fill in:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_KEY` - Service role key (NOT anon key)
- MySQL connection details (defaults work for standard XAMPP)

### 2. Install Dependencies

```bash
npm install
```

The migration scripts require:
- `@supabase/supabase-js`
- `mysql2`
- `node-fetch`

### 3. Start XAMPP

- Launch XAMPP Control Panel
- Start **Apache** and **MySQL** services
- Verify MySQL is running on port 3306

### 4. Export from Supabase

```bash
npm run migrate:export
```

This will:
- Connect to your Supabase project (read-only)
- Export all table data to `migrations/export/*.jsonl` (newline-delimited JSON)
- Download all storage bucket files to `migrations/export/storage/`
- Generate `migrations/export/manifest.json` with counts and metadata
- Take 2-10 minutes depending on data size

**Safety**: This script only reads from Supabase, never writes or deletes.

### 5. Create MySQL Database

Open MySQL command line:
```bash
# Windows (XAMPP)
C:\xampp\mysql\bin\mysql.exe -u root

# Mac/Linux
mysql -u root
```

Create the database:
```sql
CREATE DATABASE portfolio_local CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE portfolio_local;
```

### 6. Import Schema

```bash
# Windows (XAMPP)
C:\xampp\mysql\bin\mysql.exe -u root portfolio_local < migrations/supabase_to_mysql_schema.sql

# Mac/Linux
mysql -u root portfolio_local < migrations/supabase_to_mysql_schema.sql
```

Verify tables were created:
```sql
USE portfolio_local;
SHOW TABLES;
```

### 7. Import Data

```bash
npm run migrate:import
```

This will:
- Read exported `.jsonl` files
- Bulk-insert data into MySQL with transactions
- Copy storage files to `public/uploads/`
- Update asset URLs to point to local files
- Generate `migrations/import_report.json` with statistics
- Take 1-5 minutes depending on data volume

### 8. Verify Migration

```bash
npm run migrate:verify
```

Checks:
- Row counts match between Supabase and MySQL
- Sample data checksums
- File counts in storage
- Generates `migrations/checksums.json`

Expected output:
```
✓ contact_submissions: 45 rows (Supabase) → 45 rows (MySQL)
✓ portfolio_projects: 12 rows (Supabase) → 12 rows (MySQL)
✓ Storage files: 78 files → 78 files in public/uploads/
✓ Migration verified successfully
```

## File Structure

```
migrations/
├── README.md (this file)
├── supabase_to_mysql_schema.sql      # MySQL table definitions
├── seed_sample_data.sql               # Optional test data
├── export_from_supabase.js            # Export script
├── import_to_mysql.js                 # Import script
├── storage_copy_helper.sh             # File copy helper
├── auth_migration_notes.md            # Auth considerations
├── export/                            # Generated during export
│   ├── manifest.json
│   ├── contact_submissions.jsonl
│   ├── portfolio_projects.jsonl
│   └── storage/                       # Downloaded files
├── import_report.json                 # Generated during import
├── checksums.json                     # Generated during verify
└── tests/
    └── verify_migration.js

config/
└── example.env.local                  # Environment template

db/
└── mysql_client.js                    # MySQL connection helper
```

## Troubleshooting

### Connection Refused (MySQL)

**Error**: `ECONNREFUSED 127.0.0.1:3306`

**Solution**:
1. Open XAMPP Control Panel
2. Ensure MySQL is running (green status)
3. Check port 3306 isn't blocked by firewall
4. Verify `MYSQL_PORT=3306` in `.env`

### Authentication Failed

**Error**: `Access denied for user 'root'@'localhost'`

**Solution**:
1. Check `MYSQL_PASSWORD` in `.env`
2. Default XAMPP has empty password for root
3. If you set a password, update `.env`: `MYSQL_PASSWORD=yourpassword`

### JSON Field Errors

**Error**: `Invalid JSON value for column X`

**Solution**:
- MySQL 5.7+ required for JSON columns
- Check XAMPP MySQL version: `mysql --version`
- Update XAMPP or edit schema to use TEXT instead of JSON

### Permission Denied (Storage)

**Error**: `EACCES: permission denied, mkdir 'public/uploads'`

**Solution**:
```bash
# Create directory manually
mkdir -p public/uploads

# Windows: Run terminal as Administrator
# Mac/Linux: 
chmod 755 public/uploads
```

### Supabase Rate Limiting

**Error**: `429 Too Many Requests`

**Solution**:
- Export script has built-in retry with exponential backoff
- Large datasets: script automatically paginates (1000 rows/batch)
- Wait 1-2 minutes and re-run if needed

### Duplicate Entry Errors

**Error**: `Duplicate entry 'X' for key 'PRIMARY'`

**Solution**:
1. Drop and recreate tables:
```bash
mysql -u root portfolio_local < migrations/supabase_to_mysql_schema.sql
```
2. Re-run import:
```bash
npm run migrate:import
```

### File Name Collisions

Files with same name are automatically renamed with hash suffix:
- Original: `profile.jpg`
- Renamed: `profile-a3f2b9.jpg`

Check `migrations/import_report.json` for renamed files.

## Dry Run Mode

Test import without committing:
```bash
node migrations/import_to_mysql.js --dry-run
```

Shows what would be inserted without actually inserting.

## Rollback

If import fails partway:
```bash
# Drop all data
mysql -u root portfolio_local < migrations/supabase_to_mysql_schema.sql

# Re-run import
npm run migrate:import
```

## Performance Tips

- **Large datasets** (10k+ rows): Import runs in batches of 500 with transactions
- **Many files**: Storage copy uses streams and parallel processing
- **Network issues**: Export script retries failed requests automatically

## Auth Migration

See [migrations/auth_migration_notes.md](./auth_migration_notes.md) for two paths:
1. Keep Supabase Auth (recommended, fastest)
2. Migrate to local auth (requires additional setup)

## Next Steps

After successful migration:

1. **Update app config** to use MySQL connection instead of Supabase
2. **Test locally**: Start dev server and verify all content displays
3. **Update file references**: Ensure image paths point to `/uploads/`
4. **Keep Supabase project** for Auth (recommended) or migrate auth separately

## Support

For issues:
1. Check `migrations/import_report.json` for detailed errors
2. Review console output from each script
3. Check XAMPP error logs: `xampp/mysql/data/mysql_error.log`

## Safety Notes

- ✅ Export script is **read-only** (never modifies Supabase)
- ✅ Original Supabase data remains untouched
- ✅ Can re-run export/import multiple times safely
- ⚠️ `.env` file contains secrets - **DO NOT commit to git**
