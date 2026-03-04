/**
 * Performance monitoring and optimization utilities
 */

export const performanceMonitor = {
  marks: new Map<string, number>(),
  
  start: (label: string) => {
    performanceMonitor.marks.set(label, performance.now());
  },
  
  end: (label: string) => {
    const start = performanceMonitor.marks.get(label);
    if (start) {
      const duration = performance.now() - start;
      console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
      performanceMonitor.marks.delete(label);
      
      // Report to analytics if duration is too long
      if (duration > 100) {
        console.warn(`⚠️ Slow operation detected: ${label} took ${duration.toFixed(2)}ms`);
      }
    }
  },
  
  measure: async <T>(label: string, fn: () => Promise<T>): Promise<T> => {
    const start = performance.now();
    try {
      return await fn();
    } finally {
      const duration = performance.now() - start;
      console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
    }
  }
};

export const lazyLoad = <T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: { fallback?: React.ReactNode; ssr?: boolean } = {}
) => {
  const LazyComponent = React.lazy(importFn);
  
  return (props: React.ComponentProps<T>) => (
    <React.Suspense fallback={options.fallback || <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-32" />}>
      <LazyComponent {...props} />
    </React.Suspense>
  );
};

export const cache = {
  data: new Map<string, { value: any; expiry: number }>(),
  
  set: <T>(key: string, value: T, ttl: number = 5 * 60 * 1000) => {
    cache.data.set(key, { value, expiry: Date.now() + ttl });
  },
  
  get: <T>(key: string): T | null => {
    const item = cache.data.get(key);
    if (!item) return null;
    if (Date.now() > item.expiry) {
      cache.data.delete(key);
      return null;
    }
    return item.value as T;
  },
  
  clear: () => cache.data.clear(),
  
  remove: (key: string) => cache.data.delete(key)
};

export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  wait: number
): ((...args: Parameters<F>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<F>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <F extends (...args: any[]) => any>(
  func: F,
  limit: number
): ((...args: Parameters<F>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<F>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export const memoize = <T extends (...args: any[]) => any>(
  func: T,
  resolver?: (...args: Parameters<T>) => string
): T => {
  const cache = new Map<string, ReturnType<T>>();
  
  return ((...args: Parameters<T>) => {
    const key = resolver ? resolver(...args) : JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = func(...args);
    cache.set(key, result);
    return result;
  }) as T;
};
