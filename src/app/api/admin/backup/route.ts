/**
 * Backup Management API
 * Admin endpoint for creating and managing backups
 */

import { NextRequest, NextResponse } from 'next/server';
import { backupManager } from '@/lib/backup';
import { logger } from '@/lib/logger';

/**
 * GET /api/admin/backup
 * List all available backups
 */
export async function GET(request: NextRequest) {
  try {
    const backups = backupManager.listBackups();

    return NextResponse.json({
      success: true,
      data: {
        backups: backups.map((b) => ({
          path: b.path,
          timestamp: b.metadata.timestamp,
          files: b.metadata.files.length,
          size: b.metadata.size,
        })),
        total: backups.length,
      },
    });
  } catch (error) {
    logger.error('Failed to list backups', error as Error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to list backups',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/backup
 * Create a new backup
 */
export async function POST(request: NextRequest) {
  try {
    const backupPath = await backupManager.createBackup();

    return NextResponse.json({
      success: true,
      data: {
        backupPath,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.error('Failed to create backup', error as Error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create backup',
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/backup
 * Restore from a backup
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { backupPath } = body;

    if (!backupPath) {
      return NextResponse.json(
        {
          success: false,
          error: 'backupPath is required',
        },
        { status: 400 }
      );
    }

    await backupManager.restoreBackup(backupPath);

    return NextResponse.json({
      success: true,
      message: 'Backup restored successfully',
    });
  } catch (error) {
    logger.error('Failed to restore backup', error as Error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to restore backup',
      },
      { status: 500 }
    );
  }
}
