#!/usr/bin/env node
/**
 * Database Setup Script for Neon PostgreSQL
 * 
 * This script helps set up and migrate the Neon database.
 * It checks the connection, verifies the schema, and runs migrations.
 */

import { config } from 'dotenv';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { sql } from 'drizzle-orm';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATABASE_URL = process.env.DATABASE_URL;

async function checkDatabaseConnection() {
  console.log('🔍 Checking database connection...\n');
  
  if (!DATABASE_URL) {
    console.error('❌ ERROR: DATABASE_URL environment variable is not set!');
    console.log('\n📝 Please set DATABASE_URL in your .env file:');
    console.log('   DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require\n');
    process.exit(1);
  }

  // Validate connection string format
  if (!DATABASE_URL.startsWith('postgresql://')) {
    console.error('❌ ERROR: DATABASE_URL must start with postgresql://');
    process.exit(1);
  }

  console.log('✓ DATABASE_URL is set');
  console.log(`✓ Connection string format: ${DATABASE_URL.substring(0, 30)}...\n`);

  let client;
  try {
    client = postgres(DATABASE_URL, { max: 1 });
    const db = drizzle(client);
    
    // Test connection
    console.log('🔄 Testing database connection...');
    const result = await db.execute(sql`SELECT version(), current_database(), current_user`);
    const rows = result.rows || [];
    const firstRow = rows[0] || {};
    const version = firstRow.version || firstRow.version || 'Unknown';
    const database = firstRow.current_database || firstRow.current_database || 'Unknown';
    const user = firstRow.current_user || firstRow.current_user || 'Unknown';
    
    console.log('✓ Database connection successful!');
    console.log(`  Database: ${database}`);
    console.log(`  User: ${user}`);
    console.log(`  PostgreSQL Version: ${version.split(' ')[0]} ${version.split(' ')[1]}\n`);
    
    return { client, db };
  } catch (error) {
    console.error('❌ Database connection failed!');
    console.error(`   Error: ${error.message}\n`);
    console.log('💡 Troubleshooting tips:');
    console.log('   1. Verify your DATABASE_URL is correct');
    console.log('   2. Check that your Neon database is active');
    console.log('   3. Ensure SSL mode is set to "require"');
    console.log('   4. Verify network connectivity\n');
    process.exit(1);
  }
}

async function checkExistingTables(db) {
  console.log('🔍 Checking existing database tables...\n');
  
  try {
    const result = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    
    const tables = result.rows.map(row => row.table_name);
    
    if (tables.length === 0) {
      console.log('⚠️  No tables found in database. This appears to be a fresh database.\n');
      return { tables: [], isEmpty: true };
    }
    
    console.log(`✓ Found ${tables.length} existing table(s):`);
    tables.forEach(table => console.log(`   - ${table}`));
    console.log('');
    
    return { tables, isEmpty: false };
  } catch (error) {
    console.error('❌ Error checking tables:', error.message);
    return { tables: [], isEmpty: true };
  }
}

async function checkMigrationsStatus(db) {
  console.log('🔍 Checking migration status...\n');
  
  try {
    // Check if drizzle migrations table exists
    const migrationTableCheck = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = '__drizzle_migrations'
      )
    `);
    
    const hasMigrationsTable = migrationTableCheck.rows[0]?.exists || false;
    
    if (!hasMigrationsTable) {
      console.log('⚠️  No migrations table found. Database may need initial migration.\n');
      return { hasMigrationsTable: false, appliedMigrations: [] };
    }
    
    // Get applied migrations
    const migrations = await db.execute(sql`
      SELECT id, hash, created_at 
      FROM __drizzle_migrations 
      ORDER BY created_at
    `);
    
    const appliedMigrations = migrations.rows.map(row => ({
      id: row.id,
      hash: row.hash,
      createdAt: row.created_at
    }));
    
    console.log(`✓ Found ${appliedMigrations.length} applied migration(s)`);
    if (appliedMigrations.length > 0) {
      console.log('   Latest migrations:');
      appliedMigrations.slice(-5).forEach(m => {
        console.log(`   - ${m.id} (${new Date(m.createdAt).toLocaleDateString()})`);
      });
    }
    console.log('');
    
    return { hasMigrationsTable: true, appliedMigrations };
  } catch (error) {
    console.log('⚠️  Could not check migration status:', error.message);
    return { hasMigrationsTable: false, appliedMigrations: [] };
  }
}

async function main() {
  console.log('🚀 Neon Database Setup Script\n');
  console.log('=' .repeat(50) + '\n');
  
  // Check connection
  const { client, db } = await checkDatabaseConnection();
  
  // Check existing tables
  const { tables, isEmpty } = await checkExistingTables(db);
  
  // Check migration status
  const { hasMigrationsTable, appliedMigrations } = await checkMigrationsStatus(db);
  
  // Summary
  console.log('📊 Database Status Summary\n');
  console.log('=' .repeat(50));
  console.log(`Connection: ✓ Connected`);
  console.log(`Tables: ${tables.length} found`);
  console.log(`Migrations Table: ${hasMigrationsTable ? '✓ Exists' : '✗ Not found'}`);
  console.log(`Applied Migrations: ${appliedMigrations.length}`);
  console.log('=' .repeat(50) + '\n');
  
  // Recommendations
  console.log('📋 Next Steps:\n');
  
  if (isEmpty || !hasMigrationsTable) {
    console.log('1. Run migrations to set up the database schema:');
    console.log('   pnpm db:push\n');
    console.log('   OR use drizzle-kit directly:');
    console.log('   pnpm drizzle-kit push\n');
  } else if (appliedMigrations.length > 0) {
    console.log('1. Database appears to be set up.');
    console.log('2. To apply any new migrations, run:');
    console.log('   pnpm db:push\n');
  }
  
  console.log('3. Verify your schema matches your needs in drizzle/schema.ts');
  console.log('4. Check the Neon dashboard for monitoring: https://console.neon.tech\n');
  
  // Cleanup
  await client.end();
  console.log('✅ Setup check complete!\n');
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
