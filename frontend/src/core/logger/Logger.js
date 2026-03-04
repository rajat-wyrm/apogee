/**
 * core/logger/Logger.js
 * Comprehensive logging system with multiple transports
 */

class Logger {
  constructor() {
    this.levels = {
      DEBUG: 0,
      INFO: 1,
      WARN: 2,
      ERROR: 3,
      FATAL: 4
    };
    
    this.currentLevel = process.env.NODE_ENV === 'production' ? 1 : 0;
    this.logs = [];
    this.maxLogs = 1000;
    this.handlers = new Set();
    this.transports = new Set();
    this.sessionId = this.generateSessionId();
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    
    // Add default console transport
    this.addTransport({
      name: 'console',
      level: this.currentLevel,
      handler: (entry) => this.consoleOutput(entry)
    });
    
    // Add storage transport for persistence
    this.addTransport({
      name: 'storage',
      level: 1,
      handler: (entry) => this.storageOutput(entry)
    });
    
    this.initialized = true;
    this.info('Logger initialized', { sessionId: this.sessionId });
  }

  generateSessionId() {
    return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  setLevel(level) {
    if (typeof level === 'string') {
      this.currentLevel = this.levels[level.toUpperCase()] ?? 1;
    } else {
      this.currentLevel = level;
    }
  }

  debug(...args) {
    this.log('DEBUG', ...args);
  }

  info(...args) {
    this.log('INFO', ...args);
  }

  warn(...args) {
    this.log('WARN', ...args);
  }

  error(...args) {
    this.log('ERROR', ...args);
  }

  fatal(...args) {
    this.log('FATAL', ...args);
  }

  log(level, ...args) {
    if (this.levels[level] < this.currentLevel) return;

    const entry = this.createLogEntry(level, args);
    this.logs.push(entry);
    
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    this.processTransports(entry);
    this.notifyHandlers(entry);
  }

  createLogEntry(level, args) {
    return {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      level,
      message: this.formatMessage(args),
      data: args.map(arg => this.serializeArg(arg)),
      stack: new Error().stack,
      url: typeof window !== 'undefined' ? window.location.href : 'server',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
      memory: typeof performance !== 'undefined' && performance.memory ? {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
      } : null
    };
  }

  serializeArg(arg) {
    if (arg instanceof Error) {
      return {
        type: 'Error',
        name: arg.name,
        message: arg.message,
        stack: arg.stack
      };
    }
    
    if (arg instanceof Date) {
      return {
        type: 'Date',
        value: arg.toISOString()
      };
    }
    
    if (typeof arg === 'object' && arg !== null) {
      try {
        return JSON.parse(JSON.stringify(arg));
      } catch (e) {
        return { type: 'Object', stringified: String(arg) };
      }
    }
    
    return arg;
  }

  formatMessage(args) {
    return args.map(arg => {
      if (arg instanceof Error) return arg.message;
      if (typeof arg === 'object' && arg !== null) {
        try {
          return JSON.stringify(arg);
        } catch (e) {
          return String(arg);
        }
      }
      return String(arg);
    }).join(' ');
  }

  generateId() {
    return 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  consoleOutput(entry) {
    const prefix = `[${entry.timestamp}] [${entry.level}] [${entry.sessionId.slice(0, 8)}]`;
    
    switch (entry.level) {
      case 'DEBUG':
        console.debug(prefix, ...entry.data);
        break;
      case 'INFO':
        console.info(prefix, ...entry.data);
        break;
      case 'WARN':
        console.warn(prefix, ...entry.data);
        break;
      case 'ERROR':
      case 'FATAL':
        console.error(prefix, ...entry.data);
        break;
      default:
        console.log(prefix, ...entry.data);
    }
  }

  storageOutput(entry) {
    try {
      const logs = JSON.parse(localStorage.getItem('app_logs') || '[]');
      logs.unshift(entry);
      
      // Keep only last 100 logs in storage
      if (logs.length > 100) logs.pop();
      
      localStorage.setItem('app_logs', JSON.stringify(logs));
    } catch (e) {
      // Ignore storage errors
    }
  }

  addTransport(transport) {
    this.transports.add(transport);
  }

  removeTransport(transportName) {
    for (const transport of this.transports) {
      if (transport.name === transportName) {
        this.transports.delete(transport);
        break;
      }
    }
  }

  processTransports(entry) {
    for (const transport of this.transports) {
      try {
        if (this.levels[entry.level] >= transport.level) {
          transport.handler(entry);
        }
      } catch (e) {
        console.error('Transport failed:', transport.name, e);
      }
    }
  }

  addHandler(handler) {
    this.handlers.add(handler);
  }

  removeHandler(handler) {
    this.handlers.delete(handler);
  }

  notifyHandlers(entry) {
    this.handlers.forEach(handler => {
      try {
        handler(entry);
      } catch (e) {
        // Ignore handler errors
      }
    });
  }

  getLogs(filter = {}) {
    let filtered = this.logs;

    if (filter.level) {
      filtered = filtered.filter(log => log.level === filter.level);
    }

    if (filter.since) {
      filtered = filtered.filter(log => new Date(log.timestamp) > filter.since);
    }

    if (filter.until) {
      filtered = filtered.filter(log => new Date(log.timestamp) < filter.until);
    }

    if (filter.session) {
      filtered = filtered.filter(log => log.sessionId === filter.session);
    }

    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(searchLower)
      );
    }

    return filtered.slice(0, filter.limit || filtered.length);
  }

  getSessionLogs(sessionId = this.sessionId, limit = 100) {
    return this.getLogs({ session: sessionId, limit });
  }

  getErrorLogs(limit = 50) {
    return this.getLogs({ 
      level: 'ERROR', 
      limit 
    }).concat(this.getLogs({ level: 'FATAL', limit }));
  }

  clearLogs() {
    this.logs = [];
    try {
      localStorage.removeItem('app_logs');
    } catch (e) {
      // Ignore
    }
  }

  exportLogs(format = 'json', filter = {}) {
    const logs = this.getLogs(filter);
    
    if (format === 'json') {
      return JSON.stringify(logs, null, 2);
    }
    
    if (format === 'csv') {
      const headers = ['timestamp', 'level', 'sessionId', 'message'];
      const rows = logs.map(log => [
        log.timestamp,
        log.level,
        log.sessionId,
        log.message.replace(/,/g, ';').replace(/\n/g, ' ')
      ]);
      return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    return logs;
  }

  downloadLogs(format = 'json', filter = {}) {
    const content = this.exportLogs(format, filter);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs-${new Date().toISOString()}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  getStats() {
    const stats = {
      total: this.logs.length,
      byLevel: {},
      bySession: {},
      timeRange: {
        earliest: this.logs.length ? this.logs[this.logs.length - 1].timestamp : null,
        latest: this.logs.length ? this.logs[0].timestamp : null
      }
    };

    for (const log of this.logs) {
      stats.byLevel[log.level] = (stats.byLevel[log.level] || 0) + 1;
      stats.bySession[log.sessionId] = (stats.bySession[log.sessionId] || 0) + 1;
    }

    return stats;
  }

  createLogger(module) {
    return {
      debug: (...args) => this.debug(`[${module}]`, ...args),
      info: (...args) => this.info(`[${module}]`, ...args),
      warn: (...args) => this.warn(`[${module}]`, ...args),
      error: (...args) => this.error(`[${module}]`, ...args),
      fatal: (...args) => this.fatal(`[${module}]`, ...args)
    };
  }
}

const logger = new Logger();
logger.init();

export default logger;
