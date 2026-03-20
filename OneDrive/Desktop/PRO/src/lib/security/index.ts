/**
 * Security Module Index
 * Central export for all security utilities
 */

// CSRF Protection
export {
  generateCsrfToken,
  setCsrfCookie,
  getCsrfTokenFromCookie,
  getCsrfTokenFromHeader,
  validateCsrfToken,
  requiresCsrfProtection,
  csrfErrorResponse,
  CSRF_PROTECTED_METHODS,
  CSRF_EXEMPT_ROUTES,
} from './csrf';

// Audit Logging
export {
  securityAudit,
  getClientInfo,
  detectSuspiciousActivity,
  type AuditAction,
  type AuditEntry,
  type SuspiciousActivityResult,
} from './audit';

// Account Lockout
export {
  isAccountLocked,
  recordFailedAttempt,
  clearFailedAttempts,
  getLockoutMessage,
  unlockAccount,
} from './account-lockout';

// Request Validation
export {
  generateRequestId,
  validateContentType,
  validateBodySize,
  addSecurityHeaders,
  sanitizeErrorMessage,
  isValidObjectId,
  sanitizeForLogging,
  parseJsonBody,
  errorResponse,
  successResponse,
  API_SECURITY_HEADERS,
} from './request-validation';

// Re-export from existing security module for backward compatibility
export {
  checkRateLimit,
  getRateLimitKey,
  RATE_LIMITS,
  requireAuth,
  requireRole,
  requireAdmin,
  requirePlan,
  checkPlanLimit,
  unauthorizedResponse,
  forbiddenResponse,
  rateLimitResponse,
  validationErrorResponse,
  getClientIp,
  getUserAgent,
  isAuthenticated,
  getCurrentUserId,
  escapeRegex,
  sanitizeSearchQuery,
  type AuthResult,
  type AuthError,
  type RateLimitConfig,
} from '@/lib/security';
