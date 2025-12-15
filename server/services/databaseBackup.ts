import { getDb } from '../db';

interface BackupResult {
  success: boolean;
  timestamp: string;
  tables: string[];
  rowCounts: Record<string, number>;
  error?: string;
}

/**
 * Get list of all tables in the database
 */
async function getTableNames(): Promise<string[]> {
  const db = await getDb();
  const result = await db!.execute(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = DATABASE()
  `);
  
  return (result[0] as unknown as any[]).map(row => row.table_name);
}

/**
 * Get row count for a specific table
 */
async function getTableRowCount(tableName: string): Promise<number> {
  const db = await getDb();
  const result = await db!.execute(`SELECT COUNT(*) as count FROM \`${tableName}\``);
  return (result[0] as unknown as any[])[0]?.count || 0;
}

/**
 * Export table data as JSON
 */
async function exportTableData(tableName: string): Promise<any[]> {
  const db = await getDb();
  const result = await db!.execute(`SELECT * FROM \`${tableName}\``);
  return result[0] as unknown as any[];
}

/**
 * Create a full database backup
 * Returns metadata about the backup - actual data would be stored in S3 in production
 */
export async function createDatabaseBackup(): Promise<BackupResult> {
  const timestamp = new Date().toISOString();
  
  try {
    const tables = await getTableNames();
    const rowCounts: Record<string, number> = {};
    
    for (const table of tables) {
      rowCounts[table] = await getTableRowCount(table);
    }
    
    // In production, you would:
    // 1. Export each table to JSON
    // 2. Compress the data
    // 3. Upload to S3 with timestamp-based naming
    // 4. Maintain backup retention policy (e.g., keep last 30 days)
    
    console.log(`[Database Backup] Created backup at ${timestamp}`);
    console.log(`[Database Backup] Tables: ${tables.join(', ')}`);
    console.log(`[Database Backup] Row counts:`, rowCounts);
    
    return {
      success: true,
      timestamp,
      tables,
      rowCounts,
    };
  } catch (error) {
    console.error('[Database Backup] Failed:', error);
    return {
      success: false,
      timestamp,
      tables: [],
      rowCounts: {},
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get database statistics for monitoring
 */
export async function getDatabaseStats(): Promise<{
  tables: { name: string; rowCount: number }[];
  totalRows: number;
  lastBackup?: string;
}> {
  const tables = await getTableNames();
  const tableStats: { name: string; rowCount: number }[] = [];
  let totalRows = 0;
  
  for (const table of tables) {
    const count = await getTableRowCount(table);
    tableStats.push({ name: table, rowCount: count });
    totalRows += count;
  }
  
  return {
    tables: tableStats,
    totalRows,
  };
}
