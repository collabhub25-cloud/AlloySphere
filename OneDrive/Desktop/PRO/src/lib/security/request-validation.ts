/**
 * Request Validation & Security Utilities
 * Comprehensive request validation for production security
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * Generate unique request ID for tracing
 */
export function generateRequestId(): string {
  return `req_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
}

/**
 * Validate Content-Type header for JSON endpoints
 */
export function validateContentType(request: NextRequest): { valid: boolean; error?: string } {
  const contentType = request.headers.get('content-type');
  
  if (!contentType) {
    return { valid: false, error: 'Content-Type header is required' };
  }

  if (!contentType.includes('application/json')) {
    return { valid: false, error: 'Content-Type must be application/json' };
  }

  return { valid: true };
}

/**
 * Validate request body size (prevent DoS via large payloads)
 */
export function validateBodySize(
  contentLength: string | null,
  maxSizeBytes: number = 1024 * 1024 // 1MB default
): { valid: boolean; error?: string } {
  if (!contentLength) {
    return { valid: true }; // Let streaming handle it
  }

  const size = parseInt(contentLength, 10);
  if (isNaN(size)) {
    return { valid: false, error: 'Invalid Content-Length header' };
  }

  if (size > maxSizeBytes) {
    return { 
      valid: false, 
      error: `Request body too large. Maximum size is ${Math.round(maxSizeBytes / 1024)}KB` 
    };
  }

  return { valid: true };
}

/**
 * Security headers for API responses
 */
export const API_SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
};

/**
 * Add security headers to response
 */
export function addSecurityHeaders(response: NextResponse, requestId?: string): NextResponse {
  for (const [key, value] of Object.entries(API_SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }
  
  if (requestId) {
    response.headers.set('X-Request-Id', requestId);
  }
  
  return response;
}

/**
 * Sanitize error messages for production
 */
export function sanitizeErrorMessage(error: unknown, isProduction: boolean): string {
  if (!isProduction) {
    if (error instanceof Error) {
      return error.message;
    }
    return String(error);
  }

  // In production, return generic messages
  if (error instanceof Error) {
    // Allow specific error types through
    const safeErrorTypes = [
      'ValidationError',
      'AuthenticationError',
      'AuthorizationError',
      'NotFoundError',
      'RateLimitError',
    ];

    if (safeErrorTypes.some(type => error.name === type)) {
      return error.message;
    }
  }

  return 'An unexpected error occurred. Please try again.';
}

/**
 * Validate MongoDB ObjectId format
 */
export function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

/**
 * Sanitize string for safe logging (remove potential injection)
 */
export function sanitizeForLogging(str: string, maxLength: number = 200): string {
  return str
    .replace(/[\r\n]/g, ' ')
    .replace(/[<>]/g, '')
    .substring(0, maxLength);
}

/**
 * Validate and parse JSON body safely
 */
export async function parseJsonBody<T = unknown>(
  request: NextRequest,
  maxSize: number = 1024 * 1024
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    // Check content type
    const contentTypeCheck = validateContentType(request);
    if (!contentTypeCheck.valid) {
      return { success: false, error: contentTypeCheck.error! };
    }

    // Check body size
    const contentLength = request.headers.get('content-length');
    const sizeCheck = validateBodySize(contentLength, maxSize);
    if (!sizeCheck.valid) {
      return { success: false, error: sizeCheck.error! };
    }

    const body = await request.json();
    return { success: true, data: body as T };
  } catch (error) {
    if (error instanceof SyntaxError) {
      return { success: false, error: 'Invalid JSON in request body' };
    }
    return { success: false, error: 'Failed to parse request body' };
  }
}

/**
 * Create standardized error response
 */
export function errorResponse(
  message: string,
  status: number,
  details?: unknown,
  requestId?: string
): NextResponse {
  const body: Record<string, unknown> = {
    error: message,
    status,
  };

  if (details && process.env.NODE_ENV !== 'production') {
    body.details = details;
  }

  if (requestId) {
    body.requestId = requestId;
  }

  const response = NextResponse.json(body, { status });
  return addSecurityHeaders(response, requestId);
}

/**
 * Create standardized success response
 */
export function successResponse<T>(
  data: T,
  status: number = 200,
  requestId?: string
): NextResponse {
  const response = NextResponse.json(data, { status });
  return addSecurityHeaders(response, requestId);
}
