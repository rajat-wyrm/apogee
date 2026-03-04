/**
 * core/monitoring/PerformanceMonitor.js
 * Performance monitoring system
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.marks = new Map();
    this.measures = new Map();
    this.observers = new Set();
    this.thresholds = {
      fcp: 2000,
      lcp: 2500,
      fid: 100,
      cls: 0.1,
      ttfb: 600
    };
  }

  init() {
    if (typeof window === 'undefined' || !window.performance) return;

    this.observeWebVitals();
    this.observeLongTasks();
    this.observeResourceTiming();
    this.observeMemoryUsage();
    
    setInterval(() => this.reportMetrics(), 60000);
  }

  observeWebVitals() {
    if ('PerformanceObserver' in window) {
      // First Contentful Paint
      this.observeMetric('paint', 'first-contentful-paint', 'fcp');
      
      // Largest Contentful Paint
      this.observeMetric('largest-contentful-paint', 'lcp');
      
      // First Input Delay
      this.observeFirstInputDelay();
      
      // Cumulative Layout Shift
      this.observeLayoutShift();
    }
  }

  observeMetric(type, name, metricName = name) {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.name === name || entry.entryType === type) {
            this.recordMetric(metricName, entry.startTime);
          }
        });
      });
      
      observer.observe({ entryTypes: [type] });
    } catch (e) {
      logger.debug('PerformanceObserver not supported for', type);
    }
  }

  observeFirstInputDelay() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          this.recordMetric('fid', entry.processingStart - entry.startTime);
        });
      });
      
      observer.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      // Fallback
      window.addEventListener('load', () => {
        setTimeout(() => {
          this.recordMetric('fid', 0);
        }, 0);
      });
    }
  }

  observeLayoutShift() {
    try {
      let clsValue = 0;
      
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        this.recordMetric('cls', clsValue);
      });
      
      observer.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      // Fallback
    }
  }

  observeLongTasks() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          this.recordMetric('long-task', entry.duration);
        });
      });
      
      observer.observe({ entryTypes: ['longtask'] });
    } catch (e) {
      // Fallback
    }
  }

  observeResourceTiming() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.entryType === 'resource') {
            this.recordResourceMetric(entry);
          }
        });
      });
      
      observer.observe({ entryTypes: ['resource'] });
    } catch (e) {
      // Fallback
    }
  }

  observeMemoryUsage() {
    if (performance.memory) {
      setInterval(() => {
        this.recordMetric('memory-js', performance.memory.usedJSHeapSize);
        this.recordMetric('memory-total', performance.memory.totalJSHeapSize);
        this.recordMetric('memory-limit', performance.memory.jsHeapSizeLimit);
      }, 30000);
    }
  }

  recordMetric(name, value, tags = {}) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    const metric = {
      name,
      value,
      tags,
      timestamp: Date.now()
    };
    
    this.metrics.get(name).push(metric);
    
    // Keep only last 100 values
    const arr = this.metrics.get(name);
    if (arr.length > 100) {
      arr.shift();
    }
    
    this.notifyObservers(metric);
    
    // Check thresholds
    if (this.thresholds[name] && value > this.thresholds[name]) {
      logger.warn(`Performance threshold exceeded for ${name}: ${value} > ${this.thresholds[name]}`);
    }
  }

  recordResourceMetric(resource) {
    const metrics = {
      name: resource.name,
      duration: resource.duration,
      size: resource.transferSize,
      type: resource.initiatorType
    };
    
    this.recordMetric('resource-duration', resource.duration, metrics);
    this.recordMetric('resource-size', resource.transferSize, metrics);
  }

  mark(name) {
    if (typeof performance !== 'undefined') {
      performance.mark(name);
      this.marks.set(name, performance.now());
    }
  }

  measure(name, startMark, endMark) {
    if (typeof performance !== 'undefined') {
      try {
        performance.measure(name, startMark, endMark);
        const entries = performance.getEntriesByName(name);
        if (entries.length > 0) {
          this.recordMetric(name, entries[0].duration);
        }
      } catch (e) {
        logger.debug('Failed to measure', name, e);
      }
    }
  }

  getMetrics(name, limit = 10) {
    const metrics = this.metrics.get(name);
    if (!metrics) return [];
    return metrics.slice(-limit);
  }

  getAverage(name, window = 10) {
    const metrics = this.getMetrics(name, window);
    if (metrics.length === 0) return 0;
    const sum = metrics.reduce((acc, m) => acc + m.value, 0);
    return sum / metrics.length;
  }

  getPercentile(name, percentile, window = 100) {
    const metrics = this.getMetrics(name, window);
    if (metrics.length === 0) return 0;
    
    const sorted = metrics.map(m => m.value).sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[index];
  }

  getSummary() {
    return {
      fcp: this.getAverage('fcp'),
      lcp: this.getAverage('lcp'),
      fid: this.getAverage('fid'),
      cls: this.getAverage('cls'),
      ttfb: this.getAverage('ttfb'),
      longTasks: this.getAverage('long-task'),
      memory: {
        used: this.getAverage('memory-js'),
        total: this.getAverage('memory-total'),
        limit: this.getAverage('memory-limit')
      }
    };
  }

  addObserver(callback) {
    this.observers.add(callback);
  }

  removeObserver(callback) {
    this.observers.delete(callback);
  }

  notifyObservers(metric) {
    this.observers.forEach(callback => {
      try {
        callback(metric);
      } catch (e) {
        logger.error('Observer callback failed', e);
      }
    });
  }

  reportMetrics() {
    const summary = this.getSummary();
    logger.info('Performance summary:', summary);
    
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(summary),
        keepalive: true
      }).catch(() => {});
    }
  }

  clearMetrics() {
    this.metrics.clear();
    this.marks.clear();
    this.measures.clear();
  }
}

const performanceMonitor = new PerformanceMonitor();
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => performanceMonitor.init());
}

export default performanceMonitor;
