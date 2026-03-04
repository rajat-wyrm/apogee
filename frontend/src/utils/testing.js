/**
 * Testing and debugging utilities
 */

export const testUtils = {
  mockData: {
    generateTasks: (count: number = 10) => {
      return Array.from({ length: count }, (_, i) => ({
        id: `task_${i + 1}`,
        title: `Task ${i + 1}`,
        description: `Description for task ${i + 1}`,
        projectId: `proj_${Math.floor(i / 3) + 1}`,
        projectName: `Project ${Math.floor(i / 3) + 1}`,
        status: ['pending', 'in_progress', 'completed'][Math.floor(Math.random() * 3)],
        priority: ['critical', 'high', 'medium', 'low'][Math.floor(Math.random() * 4)],
        assignee: ['Alex', 'Emma', 'Mike', 'Sarah'][Math.floor(Math.random() * 4)],
        dueDate: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        completedAt: Math.random() > 0.5 ? new Date() : null,
        progress: Math.floor(Math.random() * 100),
        comments: Math.floor(Math.random() * 10),
        attachments: Math.floor(Math.random() * 5)
      }));
    },
    
    generateProjects: (count: number = 5) => {
      return Array.from({ length: count }, (_, i) => ({
        id: `proj_${i + 1}`,
        name: `Project ${i + 1}`,
        description: `Description for project ${i + 1}`,
        color: ['blue', 'purple', 'green', 'orange', 'red'][i % 5],
        progress: Math.floor(Math.random() * 100),
        tasks: Math.floor(Math.random() * 30) + 10,
        completedTasks: Math.floor(Math.random() * 20),
        deadline: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000)
      }));
    },
    
    generateTeam: (count: number = 6) => {
      const names = ['Alex Chen', 'Emma Watson', 'Mike Johnson', 'Sarah Lee', 'John Doe', 'Lisa Wang'];
      return names.slice(0, count).map((name, i) => ({
        id: `user_${i + 1}`,
        name,
        email: name.toLowerCase().replace(' ', '.') + '@apogee.com',
        avatar: name.split(' ').map(n => n[0]).join(''),
        role: ['Lead', 'Developer', 'Designer', 'Manager'][i % 4],
        status: ['online', 'away', 'busy'][Math.floor(Math.random() * 3)],
        skills: ['React', 'TypeScript', 'Node.js', 'Python', 'Figma'].slice(0, Math.floor(Math.random() * 3) + 2)
      }));
    }
  },
  
  simulateNetworkDelay: (ms: number = 1000) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  
  measurePerformance: async (fn: () => Promise<any>, label: string = 'Operation') => {
    const start = performance.now();
    await fn();
    const duration = performance.now() - start;
    console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
    return duration;
  },
  
  generateReport: () => {
    const memory = (performance as any).memory;
    return {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      screen: `${window.screen.width}x${window.screen.height}`,
      memory: memory ? {
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
        totalJSHeapSize: memory.totalJSHeapSize,
        usedJSHeapSize: memory.usedJSHeapSize
      } : 'Not available',
      navigation: performance.getEntriesByType('navigation')[0],
      resources: performance.getEntriesByType('resource').length
    };
  }
};

export const debug = {
  enabled: process.env.NODE_ENV === 'development',
  
  log: (...args: any[]) => {
    if (debug.enabled) {
      console.log('🐛 [DEBUG]', ...args);
    }
  },
  
  table: (data: any) => {
    if (debug.enabled) {
      console.table(data);
    }
  },
  
  time: (label: string) => {
    if (debug.enabled) {
      console.time(label);
    }
  },
  
  timeEnd: (label: string) => {
    if (debug.enabled) {
      console.timeEnd(label);
    }
  },
  
  trace: () => {
    if (debug.enabled) {
      console.trace();
    }
  },
  
  inspect: (obj: any, depth: number = 2) => {
    if (debug.enabled) {
      console.dir(obj, { depth });
    }
  }
};
