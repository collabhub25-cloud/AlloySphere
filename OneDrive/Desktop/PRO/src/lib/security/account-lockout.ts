/**
 * Account Lockout Module
 * Protects against brute force attacks by locking accounts after failed attempts
 */

import { connectDB } from '@/lib/mongodb';
import { User } from '@/lib/models';
import { createLogger } from '@/lib/logger';
import { securityAudit, getClientInfo } from './audit';

const log = createLogger('account-lockout');

// Configuration
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const PROGRESSIVE_LOCKOUT_MULTIPLIER = 2; // Double lockout time for each subsequent lock

// In-memory store for failed attempts (use Redis in production)
interface FailedAttempt {
  count: number;
  firstAttempt: number;
  lockoutUntil?: number;
  lockoutCount: number;
}

const failedAttempts = new Map<string, FailedAttempt>();

// Cleanup expired entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of failedAttempts.entries()) {
      // Remove entries older than lockout duration
      if (entry.lockoutUntil && now > entry.lockoutUntil + LOCKOUT_DURATION_MS) {
        failedAttempts.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

/**
 * Check if account is locked
 */
export function isAccountLocked(identifier: string): { locked: boolean; remainingMs?: number } {
  const entry = failedAttempts.get(identifier);
  
  if (!entry || !entry.lockoutUntil) {
    return { locked: false };
  }

  const now = Date.now();
  if (now < entry.lockoutUntil) {
    return { 
      locked: true, 
      remainingMs: entry.lockoutUntil - now 
    };
  }

  return { locked: false };
}

/**
 * Record a failed login attempt
 */
export async function recordFailedAttempt(
  identifier: string,
  ip: string,
  userAgent: string
): Promise<{ locked: boolean; attemptsRemaining: number; lockoutUntil?: number }> {
  const now = Date.now();
  let entry = failedAttempts.get(identifier);

  if (!entry) {
    entry = {
      count: 1,
      firstAttempt: now,
      lockoutCount: 0,
    };
    failedAttempts.set(identifier, entry);
  } else {
    // Reset if first attempt was more than lockout duration ago
    if (now - entry.firstAttempt > LOCKOUT_DURATION_MS) {
      entry.count = 1;
      entry.firstAttempt = now;
      entry.lockoutUntil = undefined;
    } else {
      entry.count++;
    }
  }

  const attemptsRemaining = Math.max(0, MAX_FAILED_ATTEMPTS - entry.count);

  // Log the failed attempt
  log.warn(`Failed login attempt for ${identifier}`, {
    attempt: entry.count,
    attemptsRemaining,
    ip,
  });

  // Lock account if max attempts reached
  if (entry.count >= MAX_FAILED_ATTEMPTS) {
    const lockoutDuration = LOCKOUT_DURATION_MS * Math.pow(PROGRESSIVE_LOCKOUT_MULTIPLIER, entry.lockoutCount);
    entry.lockoutUntil = now + lockoutDuration;
    entry.lockoutCount++;

    // Audit log the lockout
    securityAudit({
      action: 'ACCOUNT_LOCKED',
      targetId: identifier,
      targetType: 'user_email',
      ip,
      userAgent,
      success: false,
      reason: `Too many failed attempts (${entry.count})`,
      metadata: {
        lockoutDuration: lockoutDuration / 1000,
        lockoutCount: entry.lockoutCount,
      },
    });

    log.error(`Account locked: ${identifier}`, {
      lockoutDuration: lockoutDuration / 1000,
      lockoutCount: entry.lockoutCount,
    });

    return {
      locked: true,
      attemptsRemaining: 0,
      lockoutUntil: entry.lockoutUntil,
    };
  }

  return {
    locked: false,
    attemptsRemaining,
  };
}

/**
 * Clear failed attempts on successful login
 */
export function clearFailedAttempts(identifier: string): void {
  failedAttempts.delete(identifier);
}

/**
 * Get lockout status message
 */
export function getLockoutMessage(remainingMs: number): string {
  const minutes = Math.ceil(remainingMs / 60000);
  if (minutes > 60) {
    const hours = Math.ceil(minutes / 60);
    return `Account temporarily locked. Please try again in ${hours} hour${hours > 1 ? 's' : ''}.`;
  }
  return `Account temporarily locked. Please try again in ${minutes} minute${minutes > 1 ? 's' : ''}.`;
}

/**
 * Admin function to unlock account
 */
export async function unlockAccount(identifier: string, adminId: string): Promise<boolean> {
  const entry = failedAttempts.get(identifier);
  
  if (!entry) {
    return false;
  }

  failedAttempts.delete(identifier);

  securityAudit({
    action: 'ACCOUNT_UNLOCKED',
    userId: adminId,
    targetId: identifier,
    targetType: 'user_email',
    ip: 'admin_action',
    userAgent: 'admin_action',
    success: true,
    reason: 'Manual unlock by admin',
  });

  log.info(`Account unlocked by admin: ${identifier}`, { adminId });

  return true;
}
