/**
 * core/security/SecurityManager.js
 * Enterprise-grade security system
 */

class SecurityManager {
  constructor() {
    this.csrfToken = null;
    this.rateLimits = new Map();
    this.blockedIPs = new Set();
    this.allowedOrigins = ['http://localhost:5173', 'http://localhost:5000'];
    this.maxRequestSize = 10 * 1024 * 1024; // 10MB
    this.allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
  }

  init() {
    this.generateCSRFToken();
    this.setupSecurityHeaders();
    this.setupInputSanitizer();
    this.setupXSSProtection();
    this.setupCSP();
  }

  generateCSRFToken() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    this.csrfToken = Array.from(array, byte => 
      byte.toString(16).padStart(2, '0')
    ).join('');
    
    // Store in session
    sessionStorage.setItem('csrf_token', this.csrfToken);
    return this.csrfToken;
  }

  validateCSRFToken(token) {
    return token === this.csrfToken || token === sessionStorage.getItem('csrf_token');
  }

  setupSecurityHeaders() {
    if (typeof document !== 'undefined') {
      const meta = document.createElement('meta');
      meta.httpEquiv = 'Content-Security-Policy';
      meta.content = this.getCSPHeader();
      document.head.appendChild(meta);
    }
  }

  getCSPHeader() {
    return [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com https://cdn.jsdelivr.net",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self' http://localhost:5000 ws://localhost:5000",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ');
  }

  setupXSSProtection() {
    if (typeof document !== 'undefined') {
      const meta = document.createElement('meta');
      meta.httpEquiv = 'X-XSS-Protection';
      meta.content = '1; mode=block';
      document.head.appendChild(meta);
    }
  }

  setupCSP() {
    if (typeof document !== 'undefined') {
      const meta = document.createElement('meta');
      meta.httpEquiv = 'X-Content-Type-Options';
      meta.content = 'nosniff';
      document.head.appendChild(meta);
    }
  }

  sanitizeInput(input) {
    if (input === null || input === undefined) return input;
    
    const stringInput = String(input);
    
    // Remove dangerous characters
    let sanitized = stringInput
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/onerror/gi, '')
      .replace(/onload/gi, '')
      .replace(/onclick/gi, '')
      .replace(/onmouseover/gi, '')
      .replace(/data:/gi, '')
      .replace(/vbscript:/gi, '');
    
    // HTML entity encode
    sanitized = sanitized
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
    
    return sanitized;
  }

  sanitizeObject(obj) {
    if (!obj || typeof obj !== 'object') return obj;
    
    const sanitized = Array.isArray(obj) ? [] : {};
    
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        sanitized[key] = this.sanitizeInput(value);
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }

  checkRateLimit(key, maxAttempts = 5, windowMs = 60000) {
    const now = Date.now();
    const record = this.rateLimits.get(key);
    
    if (!record) {
      this.rateLimits.set(key, { count: 1, firstAttempt: now });
      return true;
    }
    
    if (now - record.firstAttempt > windowMs) {
      this.rateLimits.set(key, { count: 1, firstAttempt: now });
      return true;
    }
    
    if (record.count >= maxAttempts) {
      return false;
    }
    
    record.count++;
    return true;
  }

  validateFile(file) {
    if (!file) return { valid: false, error: 'No file provided' };
    
    if (file.size > this.maxRequestSize) {
      return { valid: false, error: 'File too large' };
    }
    
    if (!this.allowedFileTypes.includes(file.type)) {
      return { valid: false, error: 'File type not allowed' };
    }
    
    return { valid: true };
  }

  validateOrigin(origin) {
    return this.allowedOrigins.includes(origin);
  }

  encrypt(data) {
    try {
      // Simple encryption for demo - use proper encryption in production
      const str = JSON.stringify(data);
      return btoa(encodeURIComponent(str));
    } catch (e) {
      console.error('Encryption failed:', e);
      return null;
    }
  }

  decrypt(data) {
    try {
      const str = decodeURIComponent(atob(data));
      return JSON.parse(str);
    } catch (e) {
      console.error('Decryption failed:', e);
      return null;
    }
  }

  generateSecureId() {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => 
      byte.toString(16).padStart(2, '0')
    ).join('');
  }

  hashPassword(password) {
    // In production, use bcrypt or Argon2
    // This is just a simple hash for demo
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(16);
  }

  validatePassword(password) {
    const checks = {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    const score = Object.values(checks).filter(Boolean).length;
    
    return {
      valid: score >= 4,
      score,
      checks,
      strength: score >= 4 ? 'strong' : score >= 3 ? 'medium' : 'weak'
    };
  }

  blockIP(ip) {
    this.blockedIPs.add(ip);
  }

  isIPBlocked(ip) {
    return this.blockedIPs.has(ip);
  }

  getSecurityHeaders() {
    return {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
    };
  }
}

const securityManager = new SecurityManager();
securityManager.init();

export default securityManager;
