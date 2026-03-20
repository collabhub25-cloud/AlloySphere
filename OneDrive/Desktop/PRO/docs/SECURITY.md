# Production Security Implementation Guide

## Overview

This document outlines the comprehensive security implementation for the CollabHub platform, designed for production-level deployment.

## Security Features Implemented

### 1. Authentication & Authorization

#### JWT-based Authentication
- **Access Token**: 15-minute expiry, stored in httpOnly cookie
- **Refresh Token**: 7-day expiry, stored in httpOnly cookie
- **Token Rotation**: Refresh tokens are rotated on each use
- **Secure Cookies**: `httpOnly`, `secure` (production), `sameSite: lax`

#### Password Security
- **Hashing**: bcrypt with 12 rounds
- **Requirements**: 
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - No spaces allowed

#### Environment Security
- JWT_SECRET must be set in production (fails fast if missing)
- Minimum 32 characters required for JWT_SECRET
- No development fallbacks allowed in production

### 2. CSRF Protection

#### Implementation: Double Submit Cookie Pattern
- CSRF token stored in non-httpOnly cookie (readable by JavaScript)
- Token sent in `x-csrf-token` header with state-changing requests
- Timing-safe comparison to prevent timing attacks

#### Protected Methods
- POST, PUT, PATCH, DELETE

#### Exempt Routes
- Authentication endpoints (login, register, etc.)
- Webhook endpoints
- Health check endpoint

### 3. Rate Limiting

#### Global API Rate Limit
- 100 requests per minute per IP

#### Endpoint-Specific Limits
| Endpoint | Window | Max Requests |
|----------|--------|--------------|
| Login | 1 minute | 5 |
| Register | 1 hour | 3 |
| Password Reset | 5 minutes | 3 |
| Payments | 1 minute | 5 |
| KYC | 1 hour | 3 |

### 4. Account Lockout

#### Configuration
- **Max Failed Attempts**: 5
- **Initial Lockout**: 15 minutes
- **Progressive Lockout**: Duration doubles with each subsequent lockout

#### Features
- Automatically clears on successful login
- Admin unlock capability
- Audit logging of all lockout events

### 5. Security Headers

All responses include:
```
X-DNS-Prefetch-Control: on
X-XSS-Protection: 1; mode=block
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Content-Security-Policy: [comprehensive policy]
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload (production only)
```

### 6. Request ID Tracking

- Unique request ID generated for every request
- Format: `req_[timestamp]_[random]`
- Included in response headers and error responses
- Enables request tracing for debugging

### 7. Input Validation & Sanitization

#### Zod Schema Validation
- All API inputs validated against strict schemas
- Type coercion for numeric fields
- Length limits on all string fields

#### XSS Prevention
- HTML entity escaping
- Script tag neutralization
- URL scheme validation (blocks javascript:, data:, vbscript:)

#### MongoDB Injection Prevention
- Removal of MongoDB operators ($, {, }) from inputs
- Regex character escaping for search queries

### 8. Audit Logging

#### Logged Events
- Login success/failure
- Account lockouts
- Password changes
- Session operations
- Permission denials
- Rate limit violations
- CSRF violations
- Suspicious activity
- Payment operations
- KYC operations

#### Log Format
```json
{
  "timestamp": "ISO8601",
  "action": "LOGIN_SUCCESS",
  "userId": "...",
  "ip": "...",
  "userAgent": "...",
  "success": true,
  "metadata": {}
}
```

### 9. Suspicious Activity Detection

Monitors for:
- Bot-like user agents
- Missing/invalid user agents
- Excessive login attempts
- Known TOR exit nodes

Risk scoring system triggers alerts at threshold.

## File Structure

```
src/lib/security/
├── index.ts           # Central exports
├── config.ts          # Security configuration constants
├── csrf.ts            # CSRF protection utilities
├── audit.ts           # Security audit logging
├── account-lockout.ts # Brute force protection
└── request-validation.ts # Request validation helpers
```

## Usage Examples

### Protected API Route
```typescript
import { requireAuth, securityAudit, getClientInfo } from '@/lib/security';

export async function POST(request: NextRequest) {
  const { ip, userAgent } = getClientInfo(request);
  
  // Check authentication
  const auth = await requireAuth(request);
  if (!auth.success) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  // Your logic here...

  // Audit log sensitive operations
  securityAudit({
    action: 'DATA_MODIFICATION',
    userId: auth.user.userId,
    ip,
    userAgent,
    success: true,
    metadata: { /* details */ }
  });
}
```

### Client-Side API Calls
```typescript
import { apiFetch } from '@/lib/api-client';

// CSRF token automatically included for state-changing requests
const response = await apiFetch('/api/resource', {
  method: 'POST',
  body: JSON.stringify(data)
});
```

## Production Checklist

- [ ] Set `JWT_SECRET` environment variable (min 32 chars, no dev values)
- [ ] Set `JWT_REFRESH_SECRET` environment variable
- [ ] Set `NODE_ENV=production`
- [ ] Configure MongoDB with authentication
- [ ] Enable HTTPS
- [ ] Set up Redis for distributed rate limiting (recommended)
- [ ] Configure external audit log storage
- [ ] Set up security monitoring/alerting
- [ ] Review CSP directives for your domains

## Future Enhancements

1. **Redis-based Rate Limiting**: For horizontal scaling
2. **External SIEM Integration**: Send audit logs to security platform
3. **IP Reputation Service**: Block known malicious IPs
4. **Device Fingerprinting**: Detect compromised sessions
5. **Two-Factor Authentication**: Additional login security
6. **API Key Management**: For programmatic access
