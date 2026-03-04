/**
 * core/index.js
 * Main core initialization system
 */

import { ErrorHandler } from './errors/ErrorHandler.js';
import securityManager from './security/SecurityManager.js';
import validator from './validation/Validator.js';
import logger from './logger/Logger.js';
import performanceMonitor from './monitoring/PerformanceMonitor.js';

class CoreSystem {
  constructor() {
    this.initialized = false;
    this.modules = new Map();
  }

  async initialize() {
    if (this.initialized) return;

    logger.info('Initializing core system...');

    try {
      // Initialize in correct order
      this.initErrorHandler();
      this.initSecurity();
      this.initValidation();
      this.initPerformance();
      
      this.initialized = true;
      logger.info('Core system initialized successfully');
      
      return true;
    } catch (error) {
      logger.fatal('Failed to initialize core system', error);
      throw error;
    }
  }

  initErrorHandler() {
    this.registerModule('errorHandler', ErrorHandler);
    logger.debug('ErrorHandler initialized');
  }

  initSecurity() {
    this.registerModule('security', securityManager);
    logger.debug('Security initialized');
  }

  initValidation() {
    this.registerModule('validator', validator);
    logger.debug('Validator initialized');
  }

  initPerformance() {
    this.registerModule('performance', performanceMonitor);
    logger.debug('Performance monitor initialized');
  }

  registerModule(name, module) {
    this.modules.set(name, module);
  }

  getModule(name) {
    return this.modules.get(name);
  }

  async withErrorHandling(fn, context = {}) {
    try {
      return await fn();
    } catch (error) {
      ErrorHandler.handleError(error, context);
      throw error;
    }
  }

  createSafeContext() {
    return {
      core: this,
      errorHandler: ErrorHandler,
      security: securityManager,
      validator,
      logger,
      performance: performanceMonitor
    };
  }
}

const core = new CoreSystem();

// Auto-initialize
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => core.initialize());
}

export default core;
