import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import { Subscription } from '@/lib/models';
import { authenticateUser, sanitizeUser, setAuthCookies } from '@/lib/auth';
import { LoginSchema, validateInput } from '@/lib/validation/schemas';
import { checkRateLimit, getRateLimitKey, rateLimitResponse, RATE_LIMITS } from '@/lib/security';
import { 
  isAccountLocked, 
  recordFailedAttempt, 
  clearFailedAttempts, 
  getLockoutMessage 
} from '@/lib/security/account-lockout';
import { securityAudit, getClientInfo, detectSuspiciousActivity } from '@/lib/security/audit';

export async function POST(request: NextRequest) {
  const { ip, userAgent } = getClientInfo(request);
  
  try {
    // Rate limiting - important for login to prevent brute force
    const rateLimitKey = getRateLimitKey(request, 'login');
    const rateLimitResult = checkRateLimit(rateLimitKey, RATE_LIMITS.login);

    if (!rateLimitResult.allowed) {
      securityAudit({
        action: 'RATE_LIMIT_EXCEEDED',
        ip,
        userAgent,
        success: false,
        reason: 'Login rate limit exceeded',
      });
      return rateLimitResponse(rateLimitResult.resetTime, RATE_LIMITS.login.message);
    }

    await connectDB();

    const body = await request.json();

    // Zod validation
    const validation = validateInput(LoginSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors, fields: validation.fields },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // Check account lockout BEFORE attempting authentication
    const lockoutStatus = isAccountLocked(email.toLowerCase());
    if (lockoutStatus.locked) {
      securityAudit({
        action: 'LOGIN_FAILED',
        targetId: email,
        targetType: 'email',
        ip,
        userAgent,
        success: false,
        reason: 'Account locked',
      });
      return NextResponse.json(
        { error: getLockoutMessage(lockoutStatus.remainingMs!) },
        { status: 429 }
      );
    }

    // Detect suspicious activity
    const suspicious = detectSuspiciousActivity(ip, userAgent);
    if (suspicious.suspicious) {
      securityAudit({
        action: 'SUSPICIOUS_ACTIVITY',
        targetId: email,
        targetType: 'email',
        ip,
        userAgent,
        success: false,
        reason: suspicious.reasons.join(', '),
        metadata: { riskScore: suspicious.riskScore },
      });
    }

    // Authenticate user
    const result = await authenticateUser(email, password);
    if (!result) {
      // Record failed attempt and check for lockout
      const lockoutResult = await recordFailedAttempt(email.toLowerCase(), ip, userAgent);
      
      securityAudit({
        action: 'LOGIN_FAILED',
        targetId: email,
        targetType: 'email',
        ip,
        userAgent,
        success: false,
        reason: 'Invalid credentials',
        metadata: { attemptsRemaining: lockoutResult.attemptsRemaining },
      });

      // Don't reveal whether email exists or not
      const message = lockoutResult.locked
        ? getLockoutMessage(lockoutResult.lockoutUntil! - Date.now())
        : `Invalid email or password${lockoutResult.attemptsRemaining > 0 ? `. ${lockoutResult.attemptsRemaining} attempts remaining.` : ''}`;
      
      return NextResponse.json(
        { error: message },
        { status: 401 }
      );
    }

    // Clear failed attempts on successful login
    clearFailedAttempts(email.toLowerCase());

    // Log successful login
    securityAudit({
      action: 'LOGIN_SUCCESS',
      userId: result.user._id.toString(),
      ip,
      userAgent,
      success: true,
    });

    // Explicitly fetch subscription to ensure frontend has accurate plan
    const sub = await Subscription.findOne({ userId: result.user._id });
    const userPlan = sub ? sub.plan : 'free';

    const sanitizedUser = sanitizeUser(result.user);
    (sanitizedUser as any).plan = userPlan;

    // Set cookies — no token in response body
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: sanitizedUser,
    });

    return setAuthCookies(response, result.accessToken, result.refreshToken);
  } catch (error) {
    console.error('Login error:', error);
    securityAudit({
      action: 'LOGIN_FAILED',
      ip,
      userAgent,
      success: false,
      reason: 'Internal server error',
    });
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}
