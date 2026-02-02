# Security Recommendations for Production

**Date:** January 26, 2026  
**Priority Levels:** 🔴 Critical | 🟡 High | 🟢 Medium | ⚪ Low

---

## 🔴 Critical Security Actions

### 1. Complete Database Password Rotation

**Status:** ⚠️ IN PROGRESS  
**Priority:** 🔴 CRITICAL  
**Time Required:** 5 minutes

**Current Situation:**
- Old password was exposed in documentation files
- New password has been generated and set in Neon
- Vercel environment variables need updating

**Action Required:**
```bash
# 1. Update Vercel Environment Variable
# Go to: Vercel Dashboard → Settings → Environment Variables
# Update: DATABASE_URL

# New connection string format:
postgresql://neondb_owner:[NEW_PASSWORD]@ep-proud-smoke-a78h2pb8-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# 2. Test connection
pnpm db:push

# 3. Delete PASSWORD_ROTATION_CHECKLIST.md
rm PASSWORD_ROTATION_CHECKLIST.md
```

**Verification:**
- [ ] Vercel environment variable updated
- [ ] Application connects to database
- [ ] No connection errors in logs
- [ ] PASSWORD_ROTATION_CHECKLIST.md deleted

---

### 2. Protect Cron Endpoints with Secret

**Status:** ❌ NOT CONFIGURED  
**Priority:** 🔴 CRITICAL  
**Time Required:** 2 minutes

**Current Situation:**
- Cron endpoints are publicly accessible
- No authentication required
- Could be triggered by unauthorized users

**Endpoints at Risk:**
- `/api/cron/backup`
- `/api/cron/review-requests`

**Action Required:**
```bash
# 1. Generate secure random secret
openssl rand -base64 32

# 2. Add to Vercel Environment Variables
# Variable name: CRON_SECRET
# Value: [generated secret from step 1]

# 3. Configure Vercel Cron Jobs (if using Vercel Cron)
# Vercel automatically adds Authorization header with CRON_SECRET
```

**Implementation:**
The code already checks for `CRON_SECRET`:
```typescript
// api/index.ts lines 50-56
const cronSecret = process.env.CRON_SECRET;
const providedSecret = req.headers.authorization?.replace("Bearer ", "") || req.query.secret;

if (cronSecret && providedSecret !== cronSecret) {
  return res.status(401).json({ error: "Unauthorized" });
}
```

**Verification:**
- [ ] CRON_SECRET set in Vercel
- [ ] Test endpoint without secret (should return 401)
- [ ] Test endpoint with secret (should work)
- [ ] Verify Vercel Cron includes secret in Authorization header

---

## 🟡 High Priority Security Improvements

### 3. Implement Rate Limiting

**Status:** ❌ NOT IMPLEMENTED  
**Priority:** 🟡 HIGH  
**Time Required:** 1-2 hours

**Vulnerable Endpoints:**
- Contact form: `/api/trpc/contact.submit`
- Payment: `/api/trpc/payment.createOrder`
- File uploads: `/api/trpc/intakeFileUpload.uploadFile`
- Authentication: `/api/oauth/*`
- Review requests: `/api/trpc/reviewRequest.*`

**Recommended Limits:**
```
Contact form: 5 requests per 15 minutes per IP
Payment: 10 requests per hour per IP
File uploads: 20 requests per hour per user
Authentication: 10 attempts per 15 minutes per IP
```

**Implementation Options:**

#### Option A: Vercel Pro Plan (Easiest)
```bash
# Upgrade to Vercel Pro
# Enable rate limiting in project settings
# Configure limits per endpoint
```

#### Option B: Custom Middleware (Free)
```bash
# Install rate limiting library
pnpm add express-rate-limit

# Create middleware
# server/middleware/rateLimit.ts
```

```typescript
import rateLimit from 'express-rate-limit';

export const contactFormLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

export const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: 'Too many payment attempts, please try again later.',
});

export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: 'Upload limit exceeded, please try again later.',
});
```

**Apply to Routes:**
```typescript
// server/_core/index.ts
import { contactFormLimiter, paymentLimiter } from './middleware/rateLimit';

// Apply to specific routes
app.use('/api/trpc/contact', contactFormLimiter);
app.use('/api/trpc/payment', paymentLimiter);
```

**Verification:**
- [ ] Rate limiting implemented
- [ ] Test exceeding limits
- [ ] Verify appropriate error messages
- [ ] Monitor for false positives

---

### 4. Sanitize Blog HTML Content (XSS Prevention)

**Status:** ⚠️ VULNERABLE  
**Priority:** 🟡 HIGH  
**Time Required:** 30 minutes

**Current Situation:**
- Blog content rendered with `dangerouslySetInnerHTML`
- No HTML sanitization
- Risk if blog content is compromised or user-generated

**Vulnerable File:**
- `client/src/components/BlogContent.tsx`

**Action Required:**

```bash
# 1. Install DOMPurify
pnpm add dompurify
pnpm add -D @types/dompurify
```

```typescript
// 2. Update BlogContent.tsx
import { useMemo } from 'react';
import DOMPurify from 'dompurify';
import './BlogContent.css';

type BlogContentProps = {
  content: string;
};

export default function BlogContent({ content }: BlogContentProps) {
  const sanitizedContent = useMemo(() => {
    if (!content) return '';
    
    // Sanitize HTML to prevent XSS
    return DOMPurify.sanitize(content, {
      ALLOWED_TAGS: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'br', 'hr',
        'strong', 'em', 'u', 's', 'code', 'pre',
        'ul', 'ol', 'li',
        'a', 'img',
        'blockquote',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'div', 'span'
      ],
      ALLOWED_ATTR: [
        'href', 'target', 'rel',
        'src', 'alt', 'title',
        'class', 'id',
        'width', 'height'
      ],
      ALLOW_DATA_ATTR: false,
    });
  }, [content]);

  return (
    <div 
      className="blog-content-html"
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}
```

**Verification:**
- [ ] DOMPurify installed
- [ ] BlogContent.tsx updated
- [ ] Test blog posts render correctly
- [ ] Test with malicious HTML (should be sanitized)
- [ ] Verify no legitimate content is broken

---

### 5. Restrict CORS Origins

**Status:** ⚠️ OVERLY PERMISSIVE  
**Priority:** 🟡 HIGH  
**Time Required:** 10 minutes

**Current Situation:**
- CORS headers allow all origins (`*`)
- Acceptable for public API
- Should restrict if API contains sensitive operations

**Action Required:**

```json
// vercel.json - Update headers section
{
  "source": "/api/(.*)",
  "headers": [
    {
      "key": "Access-Control-Allow-Origin",
      "value": "https://allresumeservices.com.au"
    },
    {
      "key": "Access-Control-Allow-Methods",
      "value": "GET, POST, PUT, DELETE, OPTIONS"
    },
    {
      "key": "Access-Control-Allow-Headers",
      "value": "Content-Type, Authorization"
    },
    {
      "key": "Access-Control-Allow-Credentials",
      "value": "true"
    }
  ]
}
```

**For Multiple Domains:**
```typescript
// server/middleware/cors.ts
export function corsMiddleware(req: Request, res: Response, next: Function) {
  const allowedOrigins = [
    'https://allresumeservices.com.au',
    'https://www.allresumeservices.com.au',
    'https://admin.allresumeservices.com.au'
  ];
  
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  
  next();
}
```

**Verification:**
- [ ] CORS configured for production domain
- [ ] Test API calls from allowed domains
- [ ] Test API calls from disallowed domains (should fail)
- [ ] Verify credentials are handled correctly

---

## 🟢 Medium Priority Security Enhancements

### 6. Add Security Headers

**Priority:** 🟢 MEDIUM  
**Time Required:** 15 minutes

**Recommended Headers:**

```json
// vercel.json - Add to headers array
{
  "source": "/(.*)",
  "headers": [
    {
      "key": "X-Content-Type-Options",
      "value": "nosniff"
    },
    {
      "key": "X-Frame-Options",
      "value": "DENY"
    },
    {
      "key": "X-XSS-Protection",
      "value": "1; mode=block"
    },
    {
      "key": "Referrer-Policy",
      "value": "strict-origin-when-cross-origin"
    },
    {
      "key": "Permissions-Policy",
      "value": "camera=(), microphone=(), geolocation=()"
    },
    {
      "key": "Strict-Transport-Security",
      "value": "max-age=31536000; includeSubDomains"
    }
  ]
}
```

**Content Security Policy (Advanced):**
```json
{
  "key": "Content-Security-Policy",
  "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.paypal.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.manus.im https://api.paypal.com;"
}
```

---

### 7. Implement Request Logging

**Priority:** 🟢 MEDIUM  
**Time Required:** 30 minutes

**Purpose:**
- Track suspicious activity
- Debug issues
- Audit trail for security incidents

**Implementation:**

```typescript
// server/middleware/requestLogger.ts
import { Request, Response, NextFunction } from 'express';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  
  // Log request
  console.log({
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    ip: req.ip || req.headers['x-forwarded-for'],
    userAgent: req.headers['user-agent'],
  });
  
  // Log response
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log({
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
    });
  });
  
  next();
}
```

**Apply Middleware:**
```typescript
// server/_core/index.ts
import { requestLogger } from './middleware/requestLogger';

app.use(requestLogger);
```

---

### 8. Add Input Validation Middleware

**Priority:** 🟢 MEDIUM  
**Time Required:** 1 hour

**Current Status:**
- Zod validation in tRPC procedures (✅ Good)
- Could add additional validation layer

**Enhanced Validation:**

```typescript
// server/middleware/validation.ts
import { z } from 'zod';

// Email validation
export const emailSchema = z.string().email().max(255);

// Phone validation (Australian format)
export const phoneSchema = z.string().regex(/^(\+61|0)[2-478]\d{8}$/);

// Sanitize strings
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .slice(0, 1000); // Limit length
}

// File upload validation
export function validateFileUpload(file: {
  size: number;
  mimetype: string;
  filename: string;
}) {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (file.size > maxSize) {
    throw new Error('File too large');
  }
  
  if (!allowedTypes.includes(file.mimetype)) {
    throw new Error('Invalid file type');
  }
  
  // Check filename for path traversal
  if (file.filename.includes('..') || file.filename.includes('/')) {
    throw new Error('Invalid filename');
  }
  
  return true;
}
```

---

## ⚪ Low Priority Security Improvements

### 9. Implement Session Management

**Priority:** ⚪ LOW  
**Time Required:** 2-3 hours

**Current:** OAuth-based authentication (adequate)  
**Enhancement:** Add session timeout and refresh

---

### 10. Add Honeypot Fields to Forms

**Priority:** ⚪ LOW  
**Time Required:** 30 minutes

**Purpose:** Catch spam bots

```typescript
// Add hidden field to contact form
<input
  type="text"
  name="website"
  style={{ display: 'none' }}
  tabIndex={-1}
  autoComplete="off"
/>

// Server-side check
if (formData.website) {
  // Likely a bot, reject silently
  return { success: true }; // Fake success
}
```

---

## 📊 Security Monitoring

### Recommended Monitoring Tools

1. **Sentry** (Already Configured ✅)
   - Error tracking
   - Performance monitoring
   - Release tracking

2. **Vercel Analytics** (Optional)
   - Traffic patterns
   - Performance metrics
   - User behavior

3. **Uptime Monitoring**
   - UptimeRobot (free)
   - Pingdom
   - StatusCake

4. **Security Scanning**
   - Snyk (dependency vulnerabilities)
   - npm audit (built-in)
   - OWASP ZAP (penetration testing)

---

## 🔒 Security Checklist

### Before Deployment
- [ ] Database password rotated
- [ ] CRON_SECRET configured
- [ ] All environment variables set
- [ ] No secrets in code
- [ ] .gitignore properly configured
- [ ] Dependencies up to date (`pnpm audit`)

### After Deployment
- [ ] Rate limiting active
- [ ] HTML sanitization working
- [ ] CORS properly configured
- [ ] Security headers present
- [ ] Monitoring tools active
- [ ] Backup system working

### Ongoing
- [ ] Monitor Sentry for errors
- [ ] Review Vercel logs weekly
- [ ] Update dependencies monthly
- [ ] Run security audits quarterly
- [ ] Review access logs for suspicious activity

---

## 🚨 Incident Response Plan

### If Security Breach Detected

1. **Immediate Actions:**
   - Rotate all credentials immediately
   - Review recent access logs
   - Check for unauthorized database changes
   - Disable affected services if necessary

2. **Investigation:**
   - Identify breach vector
   - Assess scope of compromise
   - Document timeline of events
   - Check for data exfiltration

3. **Remediation:**
   - Patch vulnerability
   - Update security measures
   - Notify affected users (if applicable)
   - File incident report

4. **Prevention:**
   - Implement additional security measures
   - Update security policies
   - Train team on new procedures
   - Schedule security audit

---

## 📞 Security Resources

### Tools
- **OWASP ZAP:** https://www.zaproxy.org/
- **Snyk:** https://snyk.io/
- **npm audit:** Built into npm/pnpm
- **DOMPurify:** https://github.com/cure53/DOMPurify

### Documentation
- **OWASP Top 10:** https://owasp.org/www-project-top-ten/
- **Vercel Security:** https://vercel.com/docs/security
- **Node.js Security:** https://nodejs.org/en/docs/guides/security/

### Reporting
- **Security Issues:** Create private issue in repository
- **Vercel Issues:** https://vercel.com/support
- **Neon Issues:** https://neon.tech/docs/introduction/support

---

## ✅ Priority Implementation Order

1. **Week 1 (Critical):**
   - [ ] Update database password in Vercel
   - [ ] Set CRON_SECRET
   - [ ] Verify all environment variables

2. **Week 2 (High Priority):**
   - [ ] Implement rate limiting
   - [ ] Add HTML sanitization
   - [ ] Configure CORS properly

3. **Week 3-4 (Medium Priority):**
   - [ ] Add security headers
   - [ ] Implement request logging
   - [ ] Enhanced input validation

4. **Month 2+ (Low Priority):**
   - [ ] Session management improvements
   - [ ] Honeypot fields
   - [ ] Advanced monitoring

---

**Last Updated:** January 26, 2026  
**Next Security Review:** After implementation of high-priority items
