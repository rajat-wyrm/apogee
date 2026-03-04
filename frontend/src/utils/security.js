/**
 * Security utilities for the application
 */

export const security = {
  sanitize: (input) => {
    if (!input) return input;
    return String(input)
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/onerror/gi, '')
      .replace(/onload/gi, '');
  },
  
  validateEmail: (email) => {
    if (!email) return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email));
  },
  
  validatePassword: (password) => {
    if (!password) {
      return { valid: false, strength: 'weak', message: 'Password is required' };
    }
    
    const passStr = String(password);
    const checks = {
      length: passStr.length >= 8,
      uppercase: /[A-Z]/.test(passStr),
      lowercase: /[a-z]/.test(passStr),
      number: /[0-9]/.test(passStr),
      special: /[!@#$%^&*]/.test(passStr)
    };
    
    const score = Object.values(checks).filter(Boolean).length;
    
    if (score <= 2) {
      return { 
        valid: false, 
        strength: 'weak',
        message: 'Password is too weak' 
      };
    }
    
    if (score <= 4) {
      return { 
        valid: true, 
        strength: 'medium',
        message: 'Password strength: medium' 
      };
    }
    
    return { 
      valid: true, 
      strength: 'strong',
      message: 'Password strength: strong' 
    };
  },
  
  encrypt: (data) => {
    try {
      if (!data) return '';
      return btoa(encodeURIComponent(data));
    } catch (e) {
      console.error('Encryption error:', e);
      return '';
    }
  },
  
  decrypt: (data) => {
    try {
      if (!data) return '';
      return decodeURIComponent(atob(data));
    } catch (e) {
      console.error('Decryption error:', e);
      return '';
    }
  },
  
  generateCSRFToken: () => {
    try {
      const array = new Uint8Array(32);
      crypto.getRandomValues(array);
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    } catch (e) {
      return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
  },
  
  maskSensitiveData: (data, visibleCount = 4) => {
    if (!data) return '';
    const dataStr = String(data);
    if (dataStr.length <= visibleCount) return '*'.repeat(dataStr.length);
    const visible = dataStr.slice(-visibleCount);
    return '*'.repeat(dataStr.length - visibleCount) + visible;
  }
};

export const rateLimiter = {
  attempts: new Map(),
  
  check: (key, maxAttempts = 5, windowMs = 15 * 60 * 1000) => {
    if (!key) return true;
    
    const now = Date.now();
    const record = rateLimiter.attempts.get(String(key));
    
    if (!record) {
      rateLimiter.attempts.set(String(key), { count: 1, timestamp: now });
      return true;
    }
    
    if (now - record.timestamp > windowMs) {
      rateLimiter.attempts.set(String(key), { count: 1, timestamp: now });
      return true;
    }
    
    if (record.count >= maxAttempts) {
      return false;
    }
    
    record.count++;
    return true;
  },
  
  reset: (key) => {
    if (key) {
      rateLimiter.attempts.delete(String(key));
    }
  }
};

export const sessionManager = {
  setSession: (token, expiresIn = 24 * 60 * 60 * 1000) => {
    try {
      const expiry = Date.now() + expiresIn;
      localStorage.setItem('session_token', String(token));
      localStorage.setItem('session_expiry', String(expiry));
      return true;
    } catch (e) {
      console.error('Session set error:', e);
      return false;
    }
  },
  
  getSession: () => {
    try {
      const token = localStorage.getItem('session_token');
      const expiry = localStorage.getItem('session_expiry');
      
      if (!token || !expiry) return null;
      if (Date.now() > parseInt(expiry)) {
        sessionManager.clearSession();
        return null;
      }
      
      return token;
    } catch (e) {
      return null;
    }
  },
  
  clearSession: () => {
    try {
      localStorage.removeItem('session_token');
      localStorage.removeItem('session_expiry');
    } catch (e) {
      console.error('Session clear error:', e);
    }
  },
  
  isValid: () => {
    return !!sessionManager.getSession();
  }
};
