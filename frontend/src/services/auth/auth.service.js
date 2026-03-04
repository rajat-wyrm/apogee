/**
 * auth.service.js - Enterprise-grade authentication
 * Features: JWT, OAuth, 2FA, biometric, session management
 */

import core from '../../core/index.js';
import { security, sessionManager } from '../../utils/index.js';

class AuthService {
  constructor() {
    this.user = null;
    this.token = null;
    this.refreshToken = null;
    this.sessionId = null;
    this.mfaRequired = false;
    this.mfaMethods = ['app', 'sms', 'email', 'hardware'];
    this.listeners = new Set();
  }

  async initialize() {
    // Check for existing session
    const savedToken = sessionManager.getSession();
    if (savedToken) {
      try {
        await this.validateToken(savedToken);
      } catch (e) {
        this.logout();
      }
    }
  }

  async login(credentials, method = 'password') {
    const logger = core.getModule('logger').createLogger('Auth');
    
    try {
      logger.info('Login attempt', { method, email: credentials.email });

      // Rate limiting check
      if (!security.checkRateLimit(credentials.email, 5, 60000)) {
        throw new Error('Too many login attempts. Please try again later.');
      }

      // Validate input
      if (!security.validateEmail(credentials.email)) {
        throw new Error('Invalid email format');
      }

      // Simulate API call (replace with real endpoint)
      const response = await this.mockLogin(credentials);
      
      if (response.mfaRequired) {
        this.mfaRequired = true;
        return { mfaRequired: true, methods: response.methods };
      }

      await this.handleLoginResponse(response);
      
      logger.info('Login successful', { userId: this.user?.id });
      return { success: true, user: this.user };
      
    } catch (error) {
      logger.error('Login failed', error);
      throw error;
    }
  }

  async verifyMFA(code, method) {
    try {
      // Simulate MFA verification
      if (code.length === 6) {
        const response = await this.mockMFAVerify(code, method);
        await this.handleLoginResponse(response);
        this.mfaRequired = false;
        return { success: true };
      }
      throw new Error('Invalid MFA code');
    } catch (error) {
      throw error;
    }
  }

  async handleLoginResponse(response) {
    this.user = response.user;
    this.token = response.token;
    this.refreshToken = response.refreshToken;
    this.sessionId = response.sessionId;
    
    // Store session securely
    sessionManager.setSession(this.token, 24 * 60 * 60 * 1000);
    localStorage.setItem('user', security.encrypt(JSON.stringify(this.user)));
    
    this.notifyListeners('login', this.user);
  }

  async logout() {
    this.user = null;
    this.token = null;
    this.refreshToken = null;
    this.sessionId = null;
    
    sessionManager.clearSession();
    localStorage.removeItem('user');
    
    this.notifyListeners('logout', null);
  }

  async refreshToken() {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: this.refreshToken })
      });
      
      const data = await response.json();
      this.token = data.token;
      sessionManager.setSession(this.token);
      
      return data.token;
    } catch (error) {
      await this.logout();
      throw error;
    }
  }

  async validateToken(token) {
    try {
      const response = await fetch('/api/auth/validate', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        this.user = data.user;
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  async socialLogin(provider) {
    const logger = core.getModule('logger').createLogger('Auth');
    
    try {
      logger.info('Social login', { provider });
      
      // Open OAuth popup
      const width = 600;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      
      const popup = window.open(
        `/api/auth/${provider}`,
        'oauth',
        `width=${width},height=${height},left=${left},top=${top}`
      );
      
      // Wait for OAuth callback
      const result = await new Promise((resolve) => {
        window.addEventListener('message', (event) => {
          if (event.data.type === 'oauth-success') {
            resolve(event.data);
          }
        });
      });
      
      await this.handleLoginResponse(result);
      return { success: true, user: this.user };
      
    } catch (error) {
      logger.error('Social login failed', error);
      throw error;
    }
  }

  async register(userData) {
    const logger = core.getModule('logger').createLogger('Auth');
    
    try {
      logger.info('Registration', { email: userData.email });

      // Validate password strength
      const passwordCheck = security.validatePassword(userData.password);
      if (!passwordCheck.valid) {
        throw new Error(passwordCheck.message);
      }

      // Simulate API call
      const response = await this.mockRegister(userData);
      await this.handleLoginResponse(response);
      
      logger.info('Registration successful', { userId: this.user?.id });
      return { success: true, user: this.user };
      
    } catch (error) {
      logger.error('Registration failed', error);
      throw error;
    }
  }

  async setup2FA(method = 'app') {
    try {
      const response = await fetch('/api/auth/2fa/setup', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ method })
      });
      
      const data = await response.json();
      
      if (method === 'app') {
        return {
          qrCode: data.qrCode,
          secret: data.secret,
          backupCodes: data.backupCodes
        };
      }
      
      return { success: true };
      
    } catch (error) {
      throw error;
    }
  }

  async verify2FA(code) {
    try {
      const response = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code })
      });
      
      return response.ok;
      
    } catch (error) {
      return false;
    }
  }

  async changePassword(currentPassword, newPassword) {
    try {
      const passwordCheck = security.validatePassword(newPassword);
      if (!passwordCheck.valid) {
        throw new Error(passwordCheck.message);
      }

      const response = await fetch('/api/auth/password', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      
      return response.ok;
      
    } catch (error) {
      throw error;
    }
  }

  async requestPasswordReset(email) {
    try {
      await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      return { success: true };
      
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(token, newPassword) {
    try {
      const passwordCheck = security.validatePassword(newPassword);
      if (!passwordCheck.valid) {
        throw new Error(passwordCheck.message);
      }

      const response = await fetch('/api/auth/reset-password/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
      });
      
      return response.ok;
      
    } catch (error) {
      throw error;
    }
  }

  getCurrentUser() {
    return this.user;
  }

  isAuthenticated() {
    return !!this.token && !!this.user;
  }

  getToken() {
    return this.token;
  }

  addListener(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners(event, data) {
    this.listeners.forEach(callback => {
      try {
        callback(event, data);
      } catch (e) {
        console.error('Listener error:', e);
      }
    });
  }

  // Mock methods for demo (replace with real API calls)
  async mockLogin(credentials) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (credentials.email === 'test@apogee.com' && credentials.password === 'password') {
      return {
        user: {
          id: '1',
          name: 'Test User',
          email: credentials.email,
          role: 'user',
          avatar: 'TU'
        },
        token: 'jwt_token_' + Date.now(),
        refreshToken: 'refresh_token_' + Date.now(),
        sessionId: 'session_' + Date.now(),
        mfaRequired: false
      };
    }
    
    if (credentials.email === 'admin@apogee.com') {
      return {
        mfaRequired: true,
        methods: ['app', 'sms']
      };
    }
    
    throw new Error('Invalid credentials');
  }

  async mockMFAVerify(code, method) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      user: {
        id: '2',
        name: 'Admin User',
        email: 'admin@apogee.com',
        role: 'admin',
        avatar: 'AU'
      },
      token: 'jwt_token_' + Date.now(),
      refreshToken: 'refresh_token_' + Date.now(),
      sessionId: 'session_' + Date.now()
    };
  }

  async mockRegister(userData) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      user: {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        role: 'user',
        avatar: userData.name.split(' ').map(n => n[0]).join('')
      },
      token: 'jwt_token_' + Date.now(),
      refreshToken: 'refresh_token_' + Date.now(),
      sessionId: 'session_' + Date.now()
    };
  }
}

const authService = new AuthService();
authService.initialize();

export default authService;
