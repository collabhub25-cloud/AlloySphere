/**
 * CSRF Protection Module
 * Implements Double Submit Cookie pattern for stateless CSRF protection
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const CSRF_COOKIE_NAME = '_csrf_token';
const CSRF_HEADER_NAME = 'x-csrf-token';
const CSRF_TOKEN_LENGTH = 32;
const CSRF_TOKEN_MAX_AGE = 24 * 60 * 60; // 24 hours

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

/**
 * Generate a cryptographically secure CSRF token
 */
export function generateCsrfToken(): string {
  return crypto.randomBytes(CSRF_TOKEN_LENGTH).toString('hex');
}

/**
 * Set CSRF cookie on response
 */
export function setCsrfCookie(response: NextResponse, token: string): NextResponse {
  response.cookies.set(CSRF_COOKIE_NAME, token, {
    httpOnly: false, // Must be readable by JS to send in header
    secure: IS_PRODUCTION,
    sameSite: 'strict',
    path: '/',
    maxAge: CSRF_TOKEN_MAX_AGE,
  });
  return response;
}

/**
 * Extract CSRF token from request cookie
 */
export function getCsrfTokenFromCookie(request: NextRequest): string | null {
  return request.cookies.get(CSRF_COOKIE_NAME)?.value || null;
}

/**
 * Extract CSRF token from request header
 */
export function getCsrfTokenFromHeader(request: NextRequest): string | null {
  return request.headers.get(CSRF_HEADER_NAME);
}

/**
 * Validate CSRF token using timing-safe comparison
 */
export function validateCsrfToken(request: NextRequest): { valid: boolean; error?: string } {
  const cookieToken = getCsrfTokenFromCookie(request);
  const headerToken = getCsrfTokenFromHeader(request);

  if (!cookieToken) {
    return { valid: false, error: 'CSRF cookie missing' };
  }

  if (!headerToken) {
    return { valid: false, error: 'CSRF header missing' };
  }

  // Timing-safe comparison to prevent timing attacks
  try {
    const cookieBuffer = Buffer.from(cookieToken, 'hex');
    const headerBuffer = Buffer.from(headerToken, 'hex');

    if (cookieBuffer.length !== headerBuffer.length) {
      return { valid: false, error: 'CSRF token length mismatch' };
    }

    if (!crypto.timingSafeEqual(cookieBuffer, headerBuffer)) {
      return { valid: false, error: 'CSRF token mismatch' };
    }

    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid CSRF token format' };
  }
}

/**
 * CSRF-protected routes (state-changing operations)
 */
export const CSRF_PROTECTED_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

/**
 * Routes exempt from CSRF (public auth endpoints, webhooks)
 */
export const CSRF_EXEMPT_ROUTES = new Set([
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/google',
  '/api/auth/google/callback',
  '/api/auth/refresh',
  '/api/auth/logout',
  '/api/webhooks/razorpay',
  '/api/webhooks/stripe',
  '/api/health',
]);

/**
 * Check if route requires CSRF protection
 */
export function requiresCsrfProtection(method: string, pathname: string): boolean {
  if (!CSRF_PROTECTED_METHODS.has(method)) {
    return false;
  }

  if (CSRF_EXEMPT_ROUTES.has(pathname)) {
    return false;
  }

  // Exempt webhook routes
  if (pathname.startsWith('/api/webhooks/')) {
    return false;
  }

  return true;
}

/**
 * Create CSRF validation middleware response
 */
export function csrfErrorResponse(error: string): NextResponse {
  return NextResponse.json(
    { error: 'CSRF validation failed', details: error },
    { status: 403 }
  );
}
