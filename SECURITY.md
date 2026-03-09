# Security Policy

## Supported Versions

Currently supported versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.2.x   | :white_check_mark: |
| 1.1.x   | :white_check_mark: |
| < 1.1   | :x:                |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please follow these steps:

### 1. Do Not Open a Public Issue

Please **DO NOT** open a public GitHub issue for security vulnerabilities. This could put all users at risk.

### 2. Report Privately

Send an email to: **security@pharmaos.example.com** (or create a private GitHub security advisory)

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### 3. What to Expect

- **Initial Response**: Within 48 hours
- **Status Updates**: Every 3-5 business days
- **Fix Timeline**: Critical issues within 7 days, others within 30 days
- **Credit**: You'll be credited in release notes (unless you prefer anonymity)

## Security Measures

### Authentication & Authorization

#### Demo Mode
- Limited to demo user account
- Isolated from production data
- No cross-user data access
- Automatic cleanup of old demo sessions

#### Production Authentication
- Firebase Authentication (OAuth 2.0)
- JWT tokens with expiration
- Refresh token rotation
- Session management
- No passwords stored locally

#### Authorization
- Role-based access control (RBAC)
- Organization-level data isolation
- User-level permissions
- API endpoint authorization checks

### Data Protection

#### Encryption at Rest
- All data encrypted in Supabase PostgreSQL
- AES-256 encryption for database
- Encrypted backups
- Encrypted document storage

#### Encryption in Transit
- TLS 1.3 for all connections
- HTTPS enforced on frontend (HSTS)
- Secure WebSocket connections
- Certificate pinning for API calls

#### Data Isolation
- Organization-level data separation
- No cross-organization queries
- UUID-based resource IDs (not sequential)
- Row-level security in database

### Input Validation & Sanitization

#### Frontend Validation
```typescript
// All user input validated before sending to backend
const validateInput = (input: string) => {
  // Length checks
  // Format validation
  // XSS prevention
};
```

#### Backend Validation
```typescript
// All requests validated at multiple layers:
// 1. Express middleware
// 2. Service layer validation
// 3. Database schema constraints
```

#### File Upload Security
- File type validation (magic number checking)
- File size limits enforced
- Virus scanning (future enhancement)
- Content type verification
- Filename sanitization

### API Security

#### Rate Limiting
```
Demo Mode:     100 requests / 15 minutes per IP
Authenticated: 1000 requests / 15 minutes per user
```

#### CORS Configuration
```typescript
// Strict CORS policy
cors({
  origin: process.env.CORS_ORIGIN, // Only production frontend
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
})
```

#### API Key Security
- Gemini API keys stored in environment variables
- Never exposed in frontend
- Rotated regularly
- Access logged and monitored

### Database Security

#### PostgreSQL Security
- Connection via SSL/TLS only
- Parameterized queries (no SQL injection)
- Minimal permissions (principle of least privilege)
- Connection pooling to prevent exhaustion
- Query timeouts to prevent DoS

#### Supabase Security
- Service role key for backend only
- Anon key not used in production
- Row-level security (RLS) policies
- Automatic backups
- Point-in-time recovery

### Secrets Management

#### Environment Variables
```bash
# ✅ Good - Stored in platform secrets:
DATABASE_URL=***
GEMINI_API_KEY=***
SUPABASE_SERVICE_KEY=***

# ❌ Bad - Never commit:
# DATABASE_URL=postgresql://user:pass@host:5432/db
```

#### Best Practices
- Never commit secrets to Git
- Use platform secret management (Vercel/Render)
- Rotate keys every 90 days
- Different keys for dev/staging/prod
- Audit secret access logs

### Dependency Security

#### Automated Scanning
```bash
# Run security audit:
npm audit

# Fix vulnerabilities:
npm audit fix

# Check for updates:
npm outdated
```

#### Update Policy
- Dependencies reviewed monthly
- Critical security updates within 24 hours
- Major version updates tested thoroughly
- Lock files committed to repo

#### Known Vulnerabilities
- Dependabot enabled
- Automated pull requests for security updates
- Manual review before merging

### Logging & Monitoring

#### Security Logging
```typescript
// All security events logged:
- Authentication attempts
- Authorization failures
- API rate limit hits
- File upload attempts
- Database query errors
- Suspicious activity patterns
```

#### Log Storage
- Logs stored securely
- No sensitive data in logs (passwords, tokens, PII)
- 90-day retention
- Access restricted to admins

#### Monitoring
- Real-time error alerts
- Unusual activity detection
- Performance degradation alerts
- Database connection monitoring

### Compliance

#### HIPAA Considerations
- If handling PHI, enable Business Associate Agreement (BAA)
- Encrypt all data at rest and in transit
- Maintain audit logs
- Implement access controls
- Regular security assessments

#### GDPR Compliance
- Data minimization
- Purpose limitation
- Right to erasure (delete user data)
- Data portability (export user data)
- Privacy by design

#### SOC 2 Considerations
- Infrastructure security (Supabase, Render, Vercel)
- Access controls
- Encryption
- Monitoring and logging
- Incident response plan

### Incident Response

#### Response Plan

1. **Detection** (T+0)
   - Identify security incident
   - Assess severity
   - Alert security team

2. **Containment** (T+1 hour)
   - Isolate affected systems
   - Prevent further damage
   - Preserve evidence

3. **Investigation** (T+4 hours)
   - Determine root cause
   - Assess impact
   - Identify affected users

4. **Remediation** (T+24 hours)
   - Deploy fixes
   - Restore services
   - Verify security

5. **Communication** (T+48 hours)
   - Notify affected users
   - Public disclosure (if needed)
   - Update documentation

6. **Post-Mortem** (T+1 week)
   - Review incident
   - Update procedures
   - Implement improvements

### Security Best Practices for Users

#### For Developers
- Keep dependencies updated
- Run `npm audit` regularly
- Review code for security issues
- Don't commit secrets
- Use environment variables
- Enable 2FA on GitHub

#### For End Users
- Use strong, unique passwords
- Enable 2FA on Firebase account
- Don't share authentication tokens
- Log out when finished
- Report suspicious activity
- Keep browser updated

### Security Testing

#### Automated Testing
```bash
# Security linting:
npm run lint:security

# Dependency audit:
npm audit

# SAST (Static Application Security Testing):
npm run test:security
```

#### Manual Testing
- Periodic penetration testing
- Code security reviews
- Access control testing
- Input validation testing

### Disclosure Policy

#### Coordinated Disclosure
- 90-day disclosure timeline
- Work with reporter to verify fix
- Credit in security advisory
- CVE assignment for critical issues

#### Public Disclosure
- Security advisories published on GitHub
- Changelog includes security fixes
- Email notifications to users
- Blog post for major issues

## Security Resources

- **OWASP Top 10**: https://owasp.org/www-project-top-ten/
- **CWE Top 25**: https://cwe.mitre.org/top25/
- **Supabase Security**: https://supabase.com/docs/guides/platform/security
- **Firebase Security**: https://firebase.google.com/support/guides/security

## Contact

- **Security Email**: security@pharmaos.example.com
- **GitHub Security Advisories**: https://github.com/yourusername/pharmaos/security/advisories
- **Response Time**: Within 48 hours

---

Last Updated: March 9, 2026
