/**
 * Built-in Authentication System for Manus
 * No external dependencies - completely standalone
 */

import { createHash, randomBytes, pbkdf2 } from 'crypto';
import { promisify } from 'util';
import {
  getUserByEmail,
  createUser,
  createSession,
  getSessionByToken,
  deleteSession,
  usersDB,
} from './local-db';

const pbkdf2Async = promisify(pbkdf2);

// Password hashing configuration
const SALT_LENGTH = 32;
const ITERATIONS = 100000;
const KEY_LENGTH = 64;
const DIGEST = 'sha512';

/**
 * Hash password with PBKDF2
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_LENGTH).toString('hex');
  const hash = await pbkdf2Async(password, salt, ITERATIONS, KEY_LENGTH, DIGEST);
  return `${salt}:${hash.toString('hex')}`;
}

/**
 * Verify password against hash
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  const [salt, originalHash] = hashedPassword.split(':');
  const hash = await pbkdf2Async(password, salt, ITERATIONS, KEY_LENGTH, DIGEST);
  return hash.toString('hex') === originalHash;
}

/**
 * Register new user
 */
export async function registerUser(data: {
  email: string;
  password: string;
  full_name: string;
}): Promise<{ success: boolean; error?: string; userId?: string }> {
  try {
    // Validate email
    if (!data.email || !data.email.includes('@')) {
      return { success: false, error: 'Invalid email address' };
    }

    // Validate password
    if (!data.password || data.password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters' };
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(data.email);
    if (existingUser) {
      return { success: false, error: 'Email already registered' };
    }

    // Hash password
    const password_hash = await hashPassword(data.password);

    // Create user
    const user = await createUser({
      email: data.email,
      password_hash,
      full_name: data.full_name,
    });

    return { success: true, userId: user.id };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'Registration failed' };
  }
}

/**
 * Login user
 */
export async function loginUser(data: {
  email: string;
  password: string;
}): Promise<{ success: boolean; error?: string; token?: string; user?: any }> {
  try {
    // Find user
    const user = await getUserByEmail(data.email);
    if (!user) {
      return { success: false, error: 'Invalid email or password' };
    }

    // Verify password
    const isValid = await verifyPassword(data.password, user.password_hash);
    if (!isValid) {
      return { success: false, error: 'Invalid email or password' };
    }

    // Update last login
    await usersDB.update(user.id, {
      last_login: new Date().toISOString(),
    });

    // Create session
    const session = await createSession(user.id);

    // Return user data without password
    const { password_hash, ...userData } = user;

    return {
      success: true,
      token: session.token,
      user: userData,
    };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Login failed' };
  }
}

/**
 * Logout user
 */
export async function logoutUser(token: string): Promise<boolean> {
  return deleteSession(token);
}

/**
 * Get current user from token
 */
export async function getCurrentUser(token: string | null): Promise<any | null> {
  if (!token) {
    return null;
  }

  const session = await getSessionByToken(token);
  if (!session) {
    return null;
  }

  const user = await usersDB.findById(session.user_id);
  if (!user) {
    return null;
  }

  // Return user without password
  const { password_hash, ...userData } = user;
  return userData;
}

/**
 * Verify session token
 */
export async function verifyToken(token: string): Promise<boolean> {
  const session = await getSessionByToken(token);
  return session !== null;
}

/**
 * Change password
 */
export async function changePassword(
  userId: string,
  oldPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await usersDB.findById(userId);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Verify old password
    const isValid = await verifyPassword(oldPassword, user.password_hash);
    if (!isValid) {
      return { success: false, error: 'Current password is incorrect' };
    }

    // Validate new password
    if (newPassword.length < 8) {
      return { success: false, error: 'New password must be at least 8 characters' };
    }

    // Hash new password
    const password_hash = await hashPassword(newPassword);

    // Update user
    await usersDB.update(userId, { password_hash });

    return { success: true };
  } catch (error) {
    console.error('Change password error:', error);
    return { success: false, error: 'Failed to change password' };
  }
}

/**
 * Reset password (simple version without email)
 */
export async function resetPassword(
  email: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Validate new password
    if (newPassword.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters' };
    }

    // Hash new password
    const password_hash = await hashPassword(newPassword);

    // Update user
    await usersDB.update(user.id, { password_hash });

    return { success: true };
  } catch (error) {
    console.error('Reset password error:', error);
    return { success: false, error: 'Failed to reset password' };
  }
}
