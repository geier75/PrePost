/**
 * Automated Backup System for Local Database
 * Provides backup, restore, and data recovery functionality
 */

import { existsSync, mkdirSync, copyFileSync, readdirSync, statSync, unlinkSync } from 'fs';
import { join } from 'path';
import { logger } from './logger';

const DATA_DIR = join(process.cwd(), 'data');
const BACKUP_DIR = join(process.cwd(), 'backups');
const MAX_BACKUPS = 10; // Keep last 10 backups

interface BackupMetadata {
  timestamp: string;
  files: string[];
  size: number;
}

export class BackupManager {
  constructor() {
    this.ensureBackupDirectory();
  }

  private ensureBackupDirectory() {
    if (!existsSync(BACKUP_DIR)) {
      mkdirSync(BACKUP_DIR, { recursive: true });
      logger.info('Backup directory created', { path: BACKUP_DIR });
    }
  }

  /**
   * Create a backup of all data files
   */
  async createBackup(): Promise<string> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = join(BACKUP_DIR, `backup-${timestamp}`);
      
      mkdirSync(backupPath, { recursive: true });

      if (!existsSync(DATA_DIR)) {
        logger.warn('Data directory does not exist, creating empty backup');
        return backupPath;
      }

      const files = readdirSync(DATA_DIR);
      let totalSize = 0;

      for (const file of files) {
        const sourcePath = join(DATA_DIR, file);
        const destPath = join(backupPath, file);
        
        if (statSync(sourcePath).isFile()) {
          copyFileSync(sourcePath, destPath);
          totalSize += statSync(sourcePath).size;
        }
      }

      // Write metadata
      const metadata: BackupMetadata = {
        timestamp: new Date().toISOString(),
        files,
        size: totalSize,
      };

      require('fs').writeFileSync(
        join(backupPath, 'metadata.json'),
        JSON.stringify(metadata, null, 2)
      );

      logger.info('Backup created successfully', {
        path: backupPath,
        files: files.length,
        size: totalSize,
      });

      // Cleanup old backups
      await this.cleanupOldBackups();

      return backupPath;
    } catch (error) {
      logger.error('Backup creation failed', error as Error);
      throw error;
    }
  }

  /**
   * Restore data from a backup
   */
  async restoreBackup(backupPath: string): Promise<void> {
    try {
      if (!existsSync(backupPath)) {
        throw new Error(`Backup not found: ${backupPath}`);
      }

      // Create data directory if it doesn't exist
      if (!existsSync(DATA_DIR)) {
        mkdirSync(DATA_DIR, { recursive: true });
      }

      const files = readdirSync(backupPath);

      for (const file of files) {
        if (file === 'metadata.json') continue;

        const sourcePath = join(backupPath, file);
        const destPath = join(DATA_DIR, file);
        
        if (statSync(sourcePath).isFile()) {
          copyFileSync(sourcePath, destPath);
        }
      }

      logger.info('Backup restored successfully', { path: backupPath });
    } catch (error) {
      logger.error('Backup restoration failed', error as Error);
      throw error;
    }
  }

  /**
   * List all available backups
   */
  listBackups(): Array<{ path: string; metadata: BackupMetadata }> {
    try {
      if (!existsSync(BACKUP_DIR)) {
        return [];
      }

      const backups = readdirSync(BACKUP_DIR)
        .filter((name) => name.startsWith('backup-'))
        .map((name) => {
          const backupPath = join(BACKUP_DIR, name);
          const metadataPath = join(backupPath, 'metadata.json');
          
          let metadata: BackupMetadata = {
            timestamp: name.replace('backup-', ''),
            files: [],
            size: 0,
          };

          if (existsSync(metadataPath)) {
            metadata = JSON.parse(require('fs').readFileSync(metadataPath, 'utf-8'));
          }

          return { path: backupPath, metadata };
        })
        .sort((a, b) => b.metadata.timestamp.localeCompare(a.metadata.timestamp));

      return backups;
    } catch (error) {
      logger.error('Failed to list backups', error as Error);
      return [];
    }
  }

  /**
   * Delete old backups, keeping only MAX_BACKUPS most recent
   */
  private async cleanupOldBackups(): Promise<void> {
    try {
      const backups = this.listBackups();

      if (backups.length <= MAX_BACKUPS) {
        return;
      }

      const toDelete = backups.slice(MAX_BACKUPS);

      for (const backup of toDelete) {
        const files = readdirSync(backup.path);
        for (const file of files) {
          unlinkSync(join(backup.path, file));
        }
        require('fs').rmdirSync(backup.path);
        
        logger.info('Old backup deleted', { path: backup.path });
      }
    } catch (error) {
      logger.error('Failed to cleanup old backups', error as Error);
    }
  }

  /**
   * Get the most recent backup
   */
  getLatestBackup(): string | null {
    const backups = this.listBackups();
    return backups.length > 0 ? backups[0].path : null;
  }
}

// Singleton instance
export const backupManager = new BackupManager();

// Convenience functions
export const createBackup = () => backupManager.createBackup();
export const restoreBackup = (path: string) => backupManager.restoreBackup(path);
export const listBackups = () => backupManager.listBackups();
export const getLatestBackup = () => backupManager.getLatestBackup();
