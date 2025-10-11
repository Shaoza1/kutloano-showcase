# Authentication Migration Notes

## Overview

Supabase Auth is a complex system with password hashing, JWT tokens, OAuth providers, and session management. This document outlines two approaches for handling authentication after migrating content to MySQL.

## Option 1: Keep Supabase Auth (RECOMMENDED)

**Pros:**
- ✅ Zero migration effort for auth
- ✅ Proven, secure authentication
- ✅ OAuth providers work out of the box
- ✅ MFA, magic links, etc. included
- ✅ Can migrate gradually

**Cons:**
- ⚠️ Still depends on Supabase for auth
- ⚠️ Requires internet connection

**Implementation:**
1. Migrate all content data to MySQL (done with this package)
2. Keep using `@supabase/supabase-js` client ONLY for auth
3. Configure your app to:
   - Use Supabase for: `supabase.auth.*` methods
   - Use MySQL for: All data queries

**Code Example:**
```javascript
import { supabase } from '@/integrations/supabase/client';
import { query } from '@/db/mysql_client';

// Auth: Use Supabase
const { data: { user } } = await supabase.auth.getUser();

// Data: Use MySQL
const projects = await query('SELECT * FROM portfolio_projects WHERE user_id = ?', [user.id]);
```

**Cost:** 
- Free tier includes 50,000 monthly active users
- No changes to existing auth flow

---

## Option 2: Migrate to Local Auth

**Pros:**
- ✅ Fully local, no external dependencies
- ✅ Complete control over auth logic

**Cons:**
- ⚠️ Requires significant development effort
- ⚠️ Password hashes are NOT transferable (Supabase uses bcrypt with specific settings)
- ⚠️ Need to implement: JWT generation, refresh tokens, password reset, email verification
- ⚠️ OAuth requires separate setup (Google, GitHub, etc.)

**Required Steps:**

### 1. Create Users Table

```sql
CREATE TABLE users (
    id CHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    avatar_url VARCHAR(500),
    role VARCHAR(50) DEFAULT 'user',
    email_verified TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 2. Export User Data from Supabase

**Warning:** Password hashes from Supabase cannot be reused directly. You'll need to force password resets.

```javascript
// Export user emails and metadata only
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const { data: users, error } = await supabase.auth.admin.listUsers();

// Insert into MySQL with temporary passwords
for (const user of users) {
  await query(
    'INSERT INTO users (id, email, full_name, password_hash, email_verified) VALUES (?, ?, ?, ?, ?)',
    [
      user.id,
      user.email,
      user.user_metadata?.full_name || null,
      'RESET_REQUIRED', // Placeholder - user must reset password
      user.email_confirmed_at ? 1 : 0
    ]
  );
}
```

### 3. Implement Local Auth System

You'll need to implement:

**a) Password hashing (bcrypt or argon2):**
```javascript
import bcrypt from 'bcrypt';

const hashedPassword = await bcrypt.hash(password, 10);
```

**b) JWT tokens:**
```javascript
import jwt from 'jsonwebtoken';

const token = jwt.sign(
  { userId: user.id, email: user.email, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);
```

**c) Login endpoint:**
```javascript
// Example Express route
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  const user = await query('SELECT * FROM users WHERE email = ?', [email]);
  if (!user.length) return res.status(401).json({ error: 'Invalid credentials' });
  
  const validPassword = await bcrypt.compare(password, user[0].password_hash);
  if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });
  
  const token = jwt.sign({ userId: user[0].id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  
  res.json({ token, user: { id: user[0].id, email: user[0].email } });
});
```

**d) Password reset flow:**
- Generate reset token
- Send email with reset link
- Verify token and update password

**e) Session management:**
- Store JWT in httpOnly cookie or localStorage
- Implement refresh token rotation
- Handle token expiration

### 4. OAuth Setup (if needed)

For Google, GitHub, etc., you'll need:
1. Register OAuth apps with each provider
2. Implement OAuth callback handlers
3. Exchange authorization codes for tokens
4. Create or link user accounts

**Example for Google OAuth:**
```javascript
// Redirect to Google
app.get('/auth/google', (req, res) => {
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=openid email profile`;
  res.redirect(googleAuthUrl);
});

// Handle callback
app.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query;
  // Exchange code for tokens, create/update user, generate JWT
});
```

### 5. Force Password Resets

**Send email to all users:**
```javascript
import nodemailer from 'nodemailer';

const users = await query('SELECT id, email FROM users WHERE password_hash = ?', ['RESET_REQUIRED']);

for (const user of users) {
  const resetToken = generateSecureToken();
  
  // Store token with expiration
  await query('INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?)', 
    [user.id, resetToken, new Date(Date.now() + 3600000)]); // 1 hour
  
  // Send email
  await sendEmail(user.email, `Reset your password: ${SITE_URL}/reset-password?token=${resetToken}`);
}
```

---

## Recommendation

**For most projects: Use Option 1 (Keep Supabase Auth)**

Only migrate auth to local if you:
- Need complete offline capability
- Have strict data sovereignty requirements
- Are comfortable implementing secure authentication from scratch
- Have time to properly test and secure auth flows

---

## Security Checklist (If Implementing Local Auth)

- [ ] Use bcrypt or argon2 for password hashing (never plain text or MD5)
- [ ] Store JWT secrets securely (never in git)
- [ ] Implement rate limiting on login endpoints
- [ ] Use HTTPS only (no HTTP in production)
- [ ] Hash password reset tokens
- [ ] Expire reset tokens after 1 hour
- [ ] Implement CSRF protection
- [ ] Use httpOnly cookies for tokens (prevents XSS)
- [ ] Validate and sanitize all inputs
- [ ] Log authentication events
- [ ] Implement account lockout after failed attempts
- [ ] Use secure random generators for tokens
- [ ] Test for SQL injection vulnerabilities
- [ ] Implement proper CORS policies

---

## Libraries to Consider

**For Local Auth:**
- [Passport.js](https://www.passportjs.org/) - Authentication middleware
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js) - Password hashing
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - JWT tokens
- [express-rate-limit](https://github.com/express-rate-limit/express-rate-limit) - Rate limiting
- [helmet](https://helmetjs.github.io/) - Security headers

**Alternative: Auth Services**
- [Auth0](https://auth0.com/) - Managed auth service
- [Firebase Auth](https://firebase.google.com/products/auth) - Google's auth service
- [Clerk](https://clerk.com/) - Modern auth platform

---

## Need Help?

For complex auth requirements, consider:
1. Consulting with a security expert
2. Using an established auth library/service
3. Thoroughly testing auth flows before going to production
4. Conducting a security audit

Remember: **Authentication security is critical**. When in doubt, use proven solutions (Option 1: Keep Supabase Auth).
