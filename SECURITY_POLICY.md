# NEXORA Security Policy

> **Comprehensive security practices, compliance frameworks, and vulnerability disclosure policy.**

---

## Security Overview

NEXORA implements enterprise-grade security controls across infrastructure, application, and data layers. This document outlines our security commitments, frameworks, and processes.

---

## Security Commitment

We take security seriously. Our commitment:

✅ **Defense in Depth**: Multiple security layers
✅ **Regular Audits**: Third-party security reviews
✅ **Vulnerability Management**: Fast response to findings
✅ **Compliance**: SOC 2, GDPR, CCPA, HIPAA-ready
✅ **Transparency**: Clear communication about incidents

---

## Vulnerability Disclosure

### Reporting Security Issues

**DO NOT** open public GitHub issues for security vulnerabilities.

**Instead**, email: **security@nexora.ai**

Include:
- Vulnerability description
- Steps to reproduce
- Impact assessment
- Proof of concept (if applicable)
- Your contact information

### Response Timeline

1. **24 hours**: Acknowledgment of report
2. **5 days**: Initial assessment & reproduction
3. **15 days**: Patch development & testing
4. **30 days**: Public disclosure (after patch release)

### Bug Bounty Program

We're preparing a formal bug bounty program. Details coming Q3 2026.

**Current**: Acknowledge and credit security researchers in release notes.

---

## Authentication & Authorization

### Session Management

| Control | Implementation |
|---------|-----------------|
| **JWT Tokens** | RSA-256, 7-day expiration |
| **Refresh Tokens** | Stored in secure HTTP-only cookies |
| **Session Storage** | Redis with 30-day TTL |
| **CSRF Protection** | SameSite cookies (Strict) |
| **Rate Limiting** | 5 failed attempts → 15-minute lockout |

### RBAC (Role-Based Access Control)

```
Roles:
├── ADMIN (all permissions)
├── USER (own resources + team collaboration)
├── VIEWER (read-only on shared resources)
└── GUEST (public resources only)

Permissions:
├── Resource: brands, projects, agents, analytics
├── Action: create, read, update, delete
└── Scope: own, team, organization, all
```

### Planned Authentication Methods

| Method | Status | Timeline |
|--------|--------|----------|
| JWT + Refresh | ✅ Live | Now |
| OAuth 2.1 | 🚧 In Progress | Q3 2026 |
| OpenID Connect | 🚧 In Progress | Q3 2026 |
| Passkeys (WebAuthn) | ❌ Planned | Q4 2026 |

---

## Data Protection

### Encryption at Rest

| Data Type | Encryption | Storage |
|-----------|-----------|---------|
| User passwords | bcrypt (cost 10) | PostgreSQL |
| API keys | AES-256-GCM | PostgreSQL `pgcrypto` |
| Sensitive metadata | AES-256-GCM | PostgreSQL |
| Session tokens | Signed JWT | Redis (TLS) |
| Files/uploads | Server-side encryption | S3/R2 |

### Encryption in Transit

- **HTTPS**: TLS 1.3 mandatory
- **API**: All endpoints HTTPS-only
- **WebSocket**: WSS (secure) only
- **Database**: TLS for all connections
- **HSTS**: 365-day enforcement header

### Data Retention

| Data Type | Retention | Deletion |
|-----------|-----------|----------|
| User profile | Account lifetime | On account deletion (cascade) |
| API logs | 90 days | Automatic purge |
| Audit logs | 2 years | Compliance archival |
| Generated artifacts | Customer configured | On deletion or download |
| Analytics | 12 months | Aggregated, anonymized |

---

## Input Validation & Sanitization

### Backend

```typescript
// ✅ DO: Validate all inputs
@Post()
async create(@Body() dto: CreateBrandDto) {
  // Class-validator ensures:
  // - Type checking
  // - String length limits
  // - Email format validation
  // - URL format validation
  // - Custom validation rules
  return this.brandsService.create(dto);
}

// Input Validation Rules
class CreateBrandDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @IsEmail()
  email: string;

  @IsUrl()
  website?: string;

  @IsIn(['STARTUP', 'GROWTH', 'ENTERPRISE'])
  plan: string;
}
```

### Frontend

```typescript
// ✅ DO: Sanitize user input
import DOMPurify from 'dompurify';

// Sanitize HTML content
const sanitized = DOMPurify.sanitize(userInput, {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
  ALLOWED_ATTR: ['href'],
});

// ✅ DO: Escape template variables
const message = `Welcome ${user.name}!`;  // React escapes by default

// ❌ DON'T: Use innerHTML
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

### SQL Injection Prevention

- **Use**: Prisma ORM (parameterized queries)
- **Avoid**: String concatenation
- **Never**: Template literals with raw SQL

### XSS Prevention

- **React**: Escapes template expressions by default
- **Sanitize**: User-generated HTML with DOMPurify
- **CSP**: Content Security Policy headers

---

## API Security

### Rate Limiting

```
Per-User Limits:
├── API requests: 100/minute
├── Authentication: 5 failures → 15-min lockout
├── Password reset: 3/day
└── File uploads: 50GB/month

Per-IP Limits:
├── Public endpoints: 1000/minute
├── Auth endpoints: 100/minute
└── File uploads: 100GB/day
```

### CORS Configuration

```typescript
@Module({
  imports: [
    TypeOrmModule.forRoot(),
  ],
})
export class AppModule {}

// Allowed origins (environment-specific)
const allowedOrigins = ['https://app.nexora.ai', 'https://staging.nexora.ai'];

app.enableCors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

### API Key Security

- ✅ Rotated every 90 days
- ✅ Hashed before storage (never plain text)
- ✅ Included in audit logs (masked)
- ✅ Revocable per key
- ✅ Scoped permissions per key

---

## Infrastructure Security

### Network Security

| Layer | Control | Implementation |
|-------|---------|-----------------|
| **Perimeter** | DDoS protection | Cloudflare |
| **WAF** | Web application firewall | Cloudflare WAF rules |
| **TLS** | Encryption in transit | TLS 1.3 |
| **VPC** | Network isolation | AWS/GCP VPC |
| **Firewall** | Inbound/outbound rules | Restrictive defaults |

### Container Security

- ✅ Images scanned for vulnerabilities (Trivy)
- ✅ Non-root user in containers
- ✅ Read-only root filesystem
- ✅ Resource limits (CPU, memory)
- ✅ Health checks enabled

### Database Security

```sql
-- Create restricted user (not admin)
CREATE USER app_user WITH PASSWORD 'strong_password';
GRANT CONNECT ON DATABASE nexora TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;

-- Enable SSL
ssl = on
ssl_cert_file = '/etc/postgresql/server.crt'
ssl_key_file = '/etc/postgresql/server.key'

-- Audit logging
CREATE EXTENSION IF NOT EXISTS pgaudit;
ALTER SYSTEM SET pgaudit.log = 'WRITE, DDL, ROLE';
```

---

## Compliance Frameworks

### GDPR (EU Data Protection)

✅ **Implemented**:
- Data processing agreements (DPA)
- Privacy policy (clear, accessible)
- Data subject rights (export, deletion)
- Breach notification (72 hours)
- Privacy by design

### CCPA (California Privacy Law)

✅ **Implemented**:
- Consumer rights (access, deletion, opt-out)
- Privacy notice (opt-in for "sale" of data)
- Vendor disclosures
- Opt-out mechanism

### SOC 2 Type II

🚧 **In Progress** (Target: Q3 2026):
- Security controls audit
- Availability & performance testing
- Data confidentiality assessment
- System integrity verification

### HIPAA-Ready (for healthcare customers)

🚧 **In Progress** (Target: Q4 2026):
- PHI encryption (at rest, in transit)
- Access logging & audit trails
- Risk analysis & management
- Breach notification procedures

---

## Threat Detection & Response

### Security Monitoring

| Alert | Threshold | Action |
|-------|-----------|--------|
| Brute force | 5 failed logins in 10 min | Lock account, email user |
| Impossible travel | Login from 2+ continents in 1h | Verify, freeze account |
| Data exfiltration | 100+ MB download in 10 min | Alert security team |
| SQL injection attempt | Detected by WAF | Block IP, log incident |
| Malware signature | File upload flagged | Quarantine, notify user |

### Incident Response Plan

1. **Detection** (minutes)
   - Automated alerts to security team
   - Severity assessment (1-5 scale)

2. **Containment** (hours)
   - Isolate affected systems
   - Revoke compromised credentials
   - Disable affected user accounts

3. **Investigation** (24-48 hours)
   - Forensic analysis
   - Root cause determination
   - Impact assessment

4. **Remediation** (24-72 hours)
   - Patch or mitigate vulnerability
   - Update security controls
   - Test in staging

5. **Communication** (immediate)
   - Notify affected users (if applicable)
   - Transparency report to stakeholders
   - Publish post-incident review

### Security Audit Log

Every action is logged:

```
timestamp: 2026-06-27T10:30:45Z
action: USER_LOGIN
user_id: user-123
ip_address: 192.0.2.1
user_agent: Mozilla/5.0...
status: SUCCESS

timestamp: 2026-06-27T10:31:20Z
action: BRAND_CREATE
user_id: user-123
resource_id: brand-456
changes: { name: "Acme Corp", industry: "Tech" }
status: SUCCESS

timestamp: 2026-06-27T10:32:00Z
action: UNAUTHORIZED_ACCESS_ATTEMPT
resource_id: brand-789
ip_address: 192.0.2.2
status: DENIED
reason: INSUFFICIENT_PERMISSIONS
```

---

## Dependency Management

### Vulnerability Scanning

```bash
# Check for known vulnerabilities
pnpm audit

# Update dependencies safely
pnpm up --interactive

# Security patches only
pnpm up --latest --depth 0 --filter '@types/*'
```

### Dependency Policy

- ✅ Keep dependencies up-to-date (weekly checks)
- ✅ Review changelogs before updates
- ✅ Test changes in staging before production
- ✅ Pin versions in production (`pnpm-lock.yaml`)
- ✅ Remove unused dependencies (regular audits)

---

## Security Checklist (Pre-Release)

- [ ] All dependencies updated and audited
- [ ] Secrets rotated (API keys, database passwords)
- [ ] Security headers configured (Helmet.js)
- [ ] HTTPS enforced across all endpoints
- [ ] Rate limiting enabled
- [ ] CORS configured restrictively
- [ ] Input validation on all endpoints
- [ ] CSRF tokens implemented
- [ ] Audit logging verified
- [ ] Backup verified (test restore)
- [ ] Incident response plan reviewed
- [ ] Legal review (privacy policy, TOS)
- [ ] Third-party security scan passed

---

## Security Best Practices for Users

### For Administrators

1. **Enable 2FA** (coming Q3 2026)
2. **Rotate API keys** every 90 days
3. **Review audit logs** monthly
4. **Monitor team permissions** quarterly
5. **Enable HTTPS only** in settings
6. **Maintain backups** daily

### For Developers

1. **Use `.env`** for secrets, never commit
2. **Validate all inputs** before use
3. **Use parameterized queries** (Prisma)
4. **Escape output** in templates
5. **Avoid hardcoded credentials**
6. **Review code** before commit
7. **Update dependencies** regularly

---

## Contact & Reporting

- **General Security Questions**: security@nexora.ai
- **Vulnerability Reports**: security@nexora.ai (PRIVATE, no public disclosure)
- **Compliance Questions**: compliance@nexora.ai
- **Data Privacy**: privacy@nexora.ai

---

## Policy Updates

This policy is reviewed and updated quarterly. Changes will be announced via:
- Email to registered users
- Blog announcement
- GitHub release notes

Last Updated: June 26, 2026 | Version: 0.2.0 | Next Review: Q3 2026
