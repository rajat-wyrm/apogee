import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
  toggleTheme: () => void;
  colors: typeof colors;
}

const colors = {
  light: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    secondary: {
      50: '#f5f3ff',
      100: '#ede9fe',
      200: '#ddd6fe',
      300: '#c4b5fd',
      400: '#a78bfa',
      500: '#8b5cf6',
      600: '#7c3aed',
      700: '#6d28d9',
      800: '#5b21b6',
      900: '#4c1d95',
    },
    background: '#ffffff',
    foreground: '#111827',
    muted: '#f3f4f6',
    mutedForeground: '#6b7280',
    border: '#e5e7eb',
    input: '#f9fafb',
    ring: '#3b82f6',
  },
  dark: {
    primary: {
      50: '#1e3a8a',
      100: '#1e40af',
      200: '#1d4ed8',
      300: '#2563eb',
      400: '#3b82f6',
      500: '#60a5fa',
      600: '#93c5fd',
      700: '#bfdbfe',
      800: '#dbeafe',
      900: '#eff6ff',
    },
    secondary: {
      50: '#4c1d95',
      100: '#5b21b6',
      200: '#6d28d9',
      300: '#7c3aed',
      400: '#8b5cf6',
      500: '#a78bfa',
      600: '#c4b5fd',
      700: '#ddd6fe',
      800: '#ede9fe',
      900: '#f5f3ff',
    },
    background: '#111827',
    foreground: '#f9fafb',
    muted: '#1f2937',
    mutedForeground: '#9ca3af',
    border: '#374151',
    input: '#1f2937',
    ring: '#3b82f6',
  }
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme') as Theme;
    return saved || 'system';
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const updateTheme = () => {
      if (theme === 'system') {
        setResolvedTheme(mediaQuery.matches ? 'dark' : 'light');
      } else {
        setResolvedTheme(theme);
      }
    };

    updateTheme();
    mediaQuery.addEventListener('change', updateTheme);
    
    return () => mediaQuery.removeEventListener('change', updateTheme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
  }, [theme, resolvedTheme]);

  const toggleTheme = () => {
    setTheme(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme, 
      resolvedTheme, 
      toggleTheme,
      colors: colors[resolvedTheme]
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
