/**
 * core/errors/ErrorHandler.js
 * Centralized error handling system
 */

class AppError extends Error {
  constructor(message, code = 'UNKNOWN_ERROR', status = 500, meta = {}) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
    this.meta = meta;
    this.timestamp = new Date().toISOString();
    this.isOperational = true;
  }
}

class ValidationError extends AppError {
  constructor(message, fields = {}) {
    super(message, 'VALIDATION_ERROR', 400, { fields });
    this.name = 'ValidationError';
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 'AUTH_ERROR', 401);
    this.name = 'AuthenticationError';
  }
}

class AuthorizationError extends AppError {
  constructor(message = 'Not authorized') {
    super(message, 'FORBIDDEN', 403);
    this.name = 'AuthorizationError';
  }
}

class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

class NetworkError extends AppError {
  constructor(message = 'Network error occurred') {
    super(message, 'NETWORK_ERROR', 503);
    this.name = 'NetworkError';
  }
}

const ErrorHandler = {
  errors: [],
  listeners: [],
  
  init() {
    // Global error handlers
    if (typeof window !== 'undefined') {
      window.addEventListener('error', this.handleGlobalError.bind(this));
      window.addEventListener('unhandledrejection', this.handlePromiseRejection.bind(this));
    }
    
    // Override console.error
    const originalError = console.error;
    console.error = (...args) => {
      this.captureConsoleError(args);
      originalError.apply(console, args);
    };
  },
  
  handleError(error, context = {}) {
    const errorObject = this.normalizeError(error);
    errorObject.context = context;
    errorObject.id = this.generateErrorId();
    
    this.errors.push(errorObject);
    this.notifyListeners(errorObject);
    this.logError(errorObject);
    
    if (!errorObject.isOperational) {
      this.handleCriticalError(errorObject);
    }
    
    return errorObject;
  },
  
  normalizeError(error) {
    if (error instanceof AppError) return error;
    
    if (error instanceof Error) {
      return new AppError(error.message, 'UNCAUGHT_ERROR', 500, {
        stack: error.stack,
        name: error.name
      });
    }
    
    return new AppError(
      typeof error === 'string' ? error : 'Unknown error occurred',
      'UNKNOWN_ERROR',
      500,
      { originalValue: error }
    );
  },
  
  handleGlobalError(event) {
    this.handleError(event.error || event.message, {
      type: 'global',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
    return false;
  },
  
  handlePromiseRejection(event) {
    this.handleError(event.reason, {
      type: 'promise',
      promise: event.promise
    });
  },
  
  captureConsoleError(args) {
    if (args[0] instanceof Error) {
      this.handleError(args[0], { source: 'console.error' });
    }
  },
  
  generateErrorId() {
    return 'err_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  },
  
  logError(error) {
    const logEntry = {
      id: error.id,
      timestamp: error.timestamp,
      name: error.name,
      code: error.code,
      message: error.message,
      status: error.status,
      context: error.context,
      stack: error.stack
    };
    
    // Store in localStorage for debugging
    try {
      const errors = JSON.parse(localStorage.getItem('app_errors') || '[]');
      errors.unshift(logEntry);
      if (errors.length > 100) errors.pop();
      localStorage.setItem('app_errors', JSON.stringify(errors));
    } catch (e) {
      // Ignore storage errors
    }
    
    // Send to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoring(logEntry);
    }
  },
  
  async sendToMonitoring(error) {
    try {
      await fetch('/api/logs/error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(error),
        keepalive: true
      });
    } catch (e) {
      // Fail silently
    }
  },
  
  handleCriticalError(error) {
    // Show user-friendly message
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('critical-error', { detail: error });
      window.dispatchEvent(event);
    }
  },
  
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  },
  
  notifyListeners(error) {
    this.listeners.forEach(listener => {
      try {
        listener(error);
      } catch (e) {
        // Ignore listener errors
      }
    });
  },
  
  getRecentErrors(limit = 10) {
    return this.errors.slice(0, limit);
  },
  
  clearErrors() {
    this.errors = [];
    try {
      localStorage.removeItem('app_errors');
    } catch (e) {
      // Ignore
    }
  },
  
  wrap(fn, context = {}) {
    return (...args) => {
      try {
        return fn(...args);
      } catch (error) {
        this.handleError(error, context);
        throw error;
      }
    };
  },
  
  async wrapAsync(fn, context = {}) {
    try {
      return await fn();
    } catch (error) {
      this.handleError(error, context);
      throw error;
    }
  }
};

ErrorHandler.init();

export {
  ErrorHandler,
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  NetworkError
};
