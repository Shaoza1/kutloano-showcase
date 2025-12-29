import { migrateCertificatesToSupabase } from './src/lib/migrateCertificates.ts';

async function runMigration() {
  console.log('Starting certificate migration to Supabase...');
  const result = await migrateCertificatesToSupabase();
  
  if (result.success) {
    console.log('✅ Migration completed successfully!');
  } else {
    console.error('❌ Migration failed:', result.error);
  }
}

runMigration();