# Supabase → MySQL Migration: Quick Steps

Complete migration in 15 minutes. Full details in [migrations/README.md](migrations/README.md).

## Prerequisites

- ✅ Node.js installed (v16+)
- ✅ XAMPP installed
- ✅ Supabase Service Role Key

## Steps

### 1. Configure Environment

```bash
# Copy example environment file
cp config/example.env.local .env

# Edit .env and fill in:
# - SUPABASE_URL (from Supabase Dashboard)
# - SUPABASE_SERVICE_KEY (from Supabase Dashboard → Settings → API)
# - MySQL credentials (defaults work for XAMPP)
nano .env  # or use your preferred editor
```

### 2. Start XAMPP

- Launch XAMPP Control Panel
- Start **Apache** (for file serving)
- Start **MySQL** (for database)
- Verify both are green/running

### 3. Install Dependencies

```bash
npm install
```

### 4. Export from Supabase

```bash
npm run migrate:export
```

⏱️ **Takes 2-10 minutes** depending on data size.

✅ Creates `migrations/export/` with all data and files.

### 5. Create MySQL Database

```bash
# Windows (XAMPP)
"C:\xampp\mysql\bin\mysql.exe" -u root

# Mac/Linux
mysql -u root
```

Then in MySQL prompt:

```sql
CREATE DATABASE portfolio_local CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### 6. Import Schema

```bash
# Windows (XAMPP)
"C:\xampp\mysql\bin\mysql.exe" -u root portfolio_local < migrations/supabase_to_mysql_schema.sql

# Mac/Linux
mysql -u root portfolio_local < migrations/supabase_to_mysql_schema.sql
```

### 7. Import Data

```bash
npm run migrate:import
```

⏱️ **Takes 1-5 minutes**.

✅ Imports all data and copies files to `public/uploads/`.

### 8. Verify Migration

```bash
npm run migrate:verify
```

Expected output:
```
✅ portfolio_projects: 12 → 12 rows
✅ portfolio_skills: 8 → 8 rows
✅ Storage files: 45 → 45 files
✅ Migration verified successfully
```

## Done! 🎉

Your data is now in MySQL and files are in `public/uploads/`.

## Next Steps

1. **Update your app** to use MySQL instead of Supabase for data queries
2. **Keep Supabase Auth** (recommended) or migrate auth separately
3. **Test locally** to ensure everything works

## Troubleshooting

**MySQL Connection Failed?**
- Ensure XAMPP MySQL is running (green in Control Panel)
- Check port 3306 isn't blocked

**Data Mismatch?**
- Check `migrations/import_report.json` for errors
- Re-run import if needed (script is idempotent)

**Files Not Showing?**
- Verify `public/uploads/` directory exists
- Check file permissions (755 on Linux/Mac)

## Full Documentation

See [migrations/README.md](migrations/README.md) for:
- Detailed troubleshooting
- Dry-run mode
- Auth migration options
- Security considerations

## Scripts Reference

```bash
npm run migrate:export   # Export from Supabase
npm run migrate:import   # Import to MySQL
npm run migrate:verify   # Verify migration
```

All scripts use `.env` for configuration.

## Support

Issues? Check:
1. `migrations/import_report.json` for detailed errors
2. `migrations/README.md` for troubleshooting guide
3. XAMPP logs: `xampp/mysql/data/mysql_error.log`
