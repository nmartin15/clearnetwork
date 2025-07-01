import { createClient } from '@supabase/supabase-js';
import { config } from '../src/config';
import { readFile } from 'fs/promises';
import path from 'path';

async function runMigrations() {
  console.log('🚀 Starting database migrations...');
  
  // Initialize Supabase client
  const supabase = createClient(config.supabase.url, config.supabase.serviceRoleKey);
  
  try {
    // Read the migration file
    const migrationPath = path.join(__dirname, '../migrations/20230630000000_initial_schema.sql');
    const migrationSQL = await readFile(migrationPath, 'utf-8');
    
    // Execute the migration
    console.log('🔄 Running migration...');
    const { data, error } = await supabase.rpc('pgmigrate', {
      query: migrationSQL,
    });
    
    if (error) {
      throw error;
    }
    
    console.log('✅ Database migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error running migration:', error);
    process.exit(1);
  }
}

runMigrations();
