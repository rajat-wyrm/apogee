/**
 * Application configuration
 */

// Safe browser checks that work everywhere
const isBrowser = typeof window !== 'undefined';

export const config = {
  app: {
    name: 'Apogee',
    version: '5.0.0',
    buildTime: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    wsUrl: process.env.REACT_APP_WS_URL || 'ws://localhost:5000',
    sentryDsn: process.env.REACT_APP_SENTRY_DSN,
    analyticsId: process.env.REACT_APP_ANALYTICS_ID
  },
  
  features: {
    darkMode: true,
    animations: true,
    keyboardShortcuts: true,
    notifications: true,
    realtimeUpdates: true,
    offlineMode: true,
    fileUploads: true,
    teamCollaboration: true,
    analytics: true,
    aiAssistant: false,
    voiceCommands: false
  },
  
  limits: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxAttachments: 10,
    maxTeamSize: 50,
    maxProjects: 100,
    maxTasks: 1000,
    maxComments: 500
  },
  
  cache: {
    ttl: 5 * 60 * 1000, // 5 minutes
    maxSize: 100,
    storage: 'localStorage'
  },
  
  api: {
    timeout: 30000,
    retries: 3,
    retryDelay: 1000,
    batchSize: 50
  },
  
  ui: {
    animations: {
      duration: 300,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    },
    theme: {
      default: 'dark',
      storageKey: 'theme'
    },
    sidebar: {
      defaultOpen: true,
      width: 280,
      collapsedWidth: 80
    },
    notifications: {
      position: 'top-right',
      duration: 5000,
      maxVisible: 3
    }
  },
  
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100,
    pageSizes: [10, 20, 50, 100]
  },
  
  validation: {
    password: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumber: true,
      requireSpecial: true
    },
    username: {
      minLength: 3,
      maxLength: 50,
      pattern: /^[a-zA-Z0-9_-]+$/
    }
  },
  
  get: (path) => {
    return path.split('.').reduce((obj, key) => obj?.[key], config);
  }
};

// Environment utilities - SAFE version with null checks
export const environment = {
  isDevelopment: config.app.environment === 'development',
  isProduction: config.app.environment === 'production',
  isTest: config.app.environment === 'test',
  
  isBrowser: isBrowser,
  isServer: !isBrowser,
  
  isMobile: () => {
    if (!isBrowser) return false;
    try {
      return window.innerWidth <= 768;
    } catch (e) {
      return false;
    }
  },
  
  isTablet: () => {
    if (!isBrowser) return false;
    try {
      return window.innerWidth > 768 && window.innerWidth <= 1024;
    } catch (e) {
      return false;
    }
  },
  
  isDesktop: () => {
    if (!isBrowser) return false;
    try {
      return window.innerWidth > 1024;
    } catch (e) {
      return false;
    }
  },
  
  isTouch: () => {
    if (!isBrowser) return false;
    try {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    } catch (e) {
      return false;
    }
  },
  
  isReducedMotion: () => {
    if (!isBrowser) return false;
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      return false;
    }
  },
  
  isHighContrast: () => {
    if (!isBrowser) return false;
    try {
      return window.matchMedia('(prefers-contrast: high)').matches;
    } catch (e) {
      return false;
    }
  }
};
