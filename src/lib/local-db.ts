/**
 * Local File-Based Database for Manus Deployment
 * No external dependencies - runs completely standalone
 */

import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

const DB_DIR = path.join(process.cwd(), 'data');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DB_DIR);
  } catch {
    await fs.mkdir(DB_DIR, { recursive: true });
  }
}

// Database Collections
export interface User {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  created_at: string;
  last_login: string | null;
  settings: {
    language: string;
    notifications: boolean;
  };
}

export interface Analysis {
  id: string;
  user_id: string;
  content: string;
  platform: string;
  overall_risk: 'none' | 'low' | 'medium' | 'high';
  risk_score: number;
  recommendation: 'safe' | 'revise' | 'danger';
  categories: Array<{
    name: string;
    score: number;
    severity: 'low' | 'medium' | 'high';
    description?: string;
  }>;
  suggestions: string[];
  improved_version?: string;
  confidence: number;
  reasoning?: string;
  created_at: string;
}

export interface Session {
  id: string;
  user_id: string;
  token: string;
  expires_at: string;
  created_at: string;
}

// Generic database operations
class LocalDB<T extends { id: string }> {
  constructor(private collection: string) {}

  private getFilePath(): string {
    return path.join(DB_DIR, `${this.collection}.json`);
  }

  async getAll(): Promise<T[]> {
    await ensureDataDir();
    try {
      const data = await fs.readFile(this.getFilePath(), 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  async save(items: T[]): Promise<void> {
    await ensureDataDir();
    await fs.writeFile(
      this.getFilePath(),
      JSON.stringify(items, null, 2),
      'utf-8'
    );
  }

  async findById(id: string): Promise<T | null> {
    const items = await this.getAll();
    return items.find(item => item.id === id) || null;
  }

  async findOne(predicate: (item: T) => boolean): Promise<T | null> {
    const items = await this.getAll();
    return items.find(predicate) || null;
  }

  async findMany(predicate: (item: T) => boolean): Promise<T[]> {
    const items = await this.getAll();
    return items.filter(predicate);
  }

  async create(data: Omit<T, 'id'>): Promise<T> {
    const items = await this.getAll();
    const newItem = {
      ...data,
      id: randomUUID(),
    } as T;
    items.push(newItem);
    await this.save(items);
    return newItem;
  }

  async update(id: string, updates: Partial<T>): Promise<T | null> {
    const items = await this.getAll();
    const index = items.findIndex(item => item.id === id);
    if (index === -1) {
      return null;
    }
    items[index] = { ...items[index], ...updates };
    await this.save(items);
    return items[index];
  }

  async delete(id: string): Promise<boolean> {
    const items = await this.getAll();
    const filtered = items.filter(item => item.id !== id);
    if (filtered.length === items.length) {
      return false;
    }
    await this.save(filtered);
    return true;
  }

  async deleteMany(predicate: (item: T) => boolean): Promise<number> {
    const items = await this.getAll();
    const filtered = items.filter(item => !predicate(item));
    const deletedCount = items.length - filtered.length;
    if (deletedCount > 0) {
      await this.save(filtered);
    }
    return deletedCount;
  }
}

// Database instances
export const usersDB = new LocalDB<User>('users');
export const analysesDB = new LocalDB<Analysis>('analyses');
export const sessionsDB = new LocalDB<Session>('sessions');

// Helper functions

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  return usersDB.findOne(user => user.email.toLowerCase() === email.toLowerCase());
}

/**
 * Create user
 */
export async function createUser(data: {
  email: string;
  password_hash: string;
  full_name: string;
}): Promise<User> {
  return usersDB.create({
    ...data,
    created_at: new Date().toISOString(),
    last_login: null,
    settings: {
      language: 'de',
      notifications: true,
    },
  });
}

/**
 * Create session
 */
export async function createSession(userId: string): Promise<Session> {
  const token = randomUUID();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

  return sessionsDB.create({
    user_id: userId,
    token,
    expires_at: expiresAt.toISOString(),
    created_at: new Date().toISOString(),
  });
}

/**
 * Get session by token
 */
export async function getSessionByToken(token: string): Promise<Session | null> {
  const session = await sessionsDB.findOne(s => s.token === token);
  if (!session) {
    return null;
  }

  // Check if expired
  if (new Date(session.expires_at) < new Date()) {
    await sessionsDB.delete(session.id);
    return null;
  }

  return session;
}

/**
 * Delete session
 */
export async function deleteSession(token: string): Promise<boolean> {
  const session = await sessionsDB.findOne(s => s.token === token);
  if (!session) {
    return false;
  }
  return sessionsDB.delete(session.id);
}

/**
 * Create analysis
 */
export async function createAnalysis(data: Omit<Analysis, 'id' | 'created_at'>): Promise<Analysis> {
  return analysesDB.create({
    ...data,
    created_at: new Date().toISOString(),
  });
}

/**
 * Get user's analyses
 */
export async function getUserAnalyses(
  userId: string,
  options: {
    limit?: number;
    offset?: number;
  } = {}
): Promise<{ data: Analysis[]; total: number }> {
  const { limit = 10, offset = 0 } = options;
  
  const allAnalyses = await analysesDB.findMany(a => a.user_id === userId);
  
  // Sort by created_at descending
  allAnalyses.sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const data = allAnalyses.slice(offset, offset + limit);
  
  return {
    data,
    total: allAnalyses.length,
  };
}

/**
 * Get user statistics
 */
export async function getUserStatistics(userId: string): Promise<{
  totalAnalyses: number;
  riskDistribution: Record<string, number>;
  averageRiskScore: number;
}> {
  const analyses = await analysesDB.findMany(a => a.user_id === userId);

  const riskDistribution = {
    none: 0,
    low: 0,
    medium: 0,
    high: 0,
  };

  let totalRiskScore = 0;

  analyses.forEach(analysis => {
    riskDistribution[analysis.overall_risk]++;
    totalRiskScore += analysis.risk_score;
  });

  const averageRiskScore = analyses.length > 0
    ? Math.round(totalRiskScore / analyses.length)
    : 0;

  return {
    totalAnalyses: analyses.length,
    riskDistribution,
    averageRiskScore,
  };
}

/**
 * Clean up expired sessions (call periodically)
 */
export async function cleanupExpiredSessions(): Promise<number> {
  const now = new Date();
  return sessionsDB.deleteMany(session => new Date(session.expires_at) < now);
}

/**
 * Delete all user data (GDPR)
 */
export async function deleteUserData(userId: string): Promise<boolean> {
  try {
    await analysesDB.deleteMany(a => a.user_id === userId);
    await sessionsDB.deleteMany(s => s.user_id === userId);
    await usersDB.delete(userId);
    return true;
  } catch {
    return false;
  }
}
