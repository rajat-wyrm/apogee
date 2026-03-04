/**
 * Analytics and monitoring system
 */

export const analytics = {
  events: [] as any[],
  config: {
    enabled: true,
    endpoint: '/api/analytics',
    batchSize: 10,
    flushInterval: 5000
  },
  
  init: (config?: Partial<typeof analytics.config>) => {
    Object.assign(analytics.config, config);
    setInterval(analytics.flush, analytics.config.flushInterval);
  },
  
  track: (event: string, data?: any) => {
    if (!analytics.config.enabled) return;
    
    analytics.events.push({
      event,
      data,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent
    });
    
    if (analytics.events.length >= analytics.config.batchSize) {
      analytics.flush();
    }
  },
  
  flush: async () => {
    if (analytics.events.length === 0) return;
    
    const events = [...analytics.events];
    analytics.events = [];
    
    try {
      if (navigator.onLine) {
        await fetch(analytics.config.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ events }),
          keepalive: true
        });
      }
    } catch (error) {
      console.error('Failed to send analytics:', error);
      analytics.events.unshift(...events);
    }
  },
  
  trackPageView: (page: string) => {
    analytics.track('page_view', { page });
  },
  
  trackUserAction: (action: string, element: string, details?: any) => {
    analytics.track('user_action', { action, element, details });
  },
  
  trackError: (error: Error, context?: any) => {
    analytics.track('error', {
      message: error.message,
      stack: error.stack,
      context
    });
  },
  
  trackPerformance: (metric: string, value: number) => {
    analytics.track('performance', { metric, value });
  }
};

export const logger = {
  levels: {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
  },
  
  currentLevel: 1,
  
  setLevel: (level: keyof typeof logger.levels) => {
    logger.currentLevel = logger.levels[level];
  },
  
  debug: (...args: any[]) => {
    if (logger.currentLevel <= logger.levels.debug) {
      console.debug('🔍 [DEBUG]', ...args);
    }
  },
  
  info: (...args: any[]) => {
    if (logger.currentLevel <= logger.levels.info) {
      console.info('ℹ️ [INFO]', ...args);
    }
  },
  
  warn: (...args: any[]) => {
    if (logger.currentLevel <= logger.levels.warn) {
      console.warn('⚠️ [WARN]', ...args);
    }
  },
  
  error: (...args: any[]) => {
    if (logger.currentLevel <= logger.levels.error) {
      console.error('❌ [ERROR]', ...args);
      analytics.trackError(args[0] instanceof Error ? args[0] : new Error(args.join(' ')));
    }
  },
  
  group: (label: string) => {
    console.group(label);
  },
  
  groupEnd: () => {
    console.groupEnd();
  }
};

export const metrics = {
  values: new Map<string, number[]>(),
  
  record: (name: string, value: number) => {
    if (!metrics.values.has(name)) {
      metrics.values.set(name, []);
    }
    metrics.values.get(name)!.push(value);
    
    // Keep only last 100 values
    const arr = metrics.values.get(name)!;
    if (arr.length > 100) {
      arr.shift();
    }
  },
  
  average: (name: string): number => {
    const values = metrics.values.get(name);
    if (!values || values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  },
  
  min: (name: string): number => {
    const values = metrics.values.get(name);
    if (!values || values.length === 0) return 0;
    return Math.min(...values);
  },
  
  max: (name: string): number => {
    const values = metrics.values.get(name);
    if (!values || values.length === 0) return 0;
    return Math.max(...values);
  },
  
  percentile: (name: string, p: number): number => {
    const values = metrics.values.get(name);
    if (!values || values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil((p / 100) * sorted.length) - 1;
    return sorted[index];
  },
  
  reset: (name?: string) => {
    if (name) {
      metrics.values.delete(name);
    } else {
      metrics.values.clear();
    }
  }
};
