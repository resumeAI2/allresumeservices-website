import cron from 'node-cron';
import { createDatabaseBackup, getDatabaseStats } from '../services/databaseBackup';

let backupHistory: { timestamp: string; success: boolean; tables: number; totalRows: number }[] = [];

/**
 * Initialize the daily database backup cron job
 * Runs every day at 2:00 AM server time
 */
export function initDatabaseBackupCron() {
  // Run daily at 2:00 AM
  cron.schedule('0 2 * * *', async () => {
    console.log('[Database Backup Cron] Starting scheduled backup...');
    
    try {
      const result = await createDatabaseBackup();
      
      if (result.success) {
        const stats = await getDatabaseStats();
        
        // Keep last 30 backup records
        backupHistory.unshift({
          timestamp: result.timestamp,
          success: true,
          tables: result.tables.length,
          totalRows: stats.totalRows,
        });
        
        if (backupHistory.length > 30) {
          backupHistory = backupHistory.slice(0, 30);
        }
        
        console.log(`[Database Backup Cron] Backup completed successfully at ${result.timestamp}`);
        console.log(`[Database Backup Cron] Backed up ${result.tables.length} tables with ${stats.totalRows} total rows`);
      } else {
        console.error('[Database Backup Cron] Backup failed:', result.error);
        
        backupHistory.unshift({
          timestamp: result.timestamp,
          success: false,
          tables: 0,
          totalRows: 0,
        });
      }
    } catch (error) {
      console.error('[Database Backup Cron] Unexpected error:', error);
    }
  });

  console.log('[Database Backup Cron] Scheduled daily backups at 2:00 AM');
}

/**
 * Get backup history for monitoring
 */
export function getBackupHistory() {
  return backupHistory;
}

/**
 * Manually trigger a backup (for testing or on-demand)
 */
export async function triggerManualBackup() {
  console.log('[Database Backup] Manual backup triggered...');
  const result = await createDatabaseBackup();
  
  if (result.success) {
    const stats = await getDatabaseStats();
    backupHistory.unshift({
      timestamp: result.timestamp,
      success: true,
      tables: result.tables.length,
      totalRows: stats.totalRows,
    });
  }
  
  return result;
}
