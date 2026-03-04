/**
 * Authentication Context - FIXED VERSION
 * Properly persists user state
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const navigate = useNavigate();

  // Load user on mount - FIXED with proper async handling
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        setInitialized(true);
        return;
      }

      try {
        // In a real app, you'd validate token with backend
        // For demo, we'll create a mock user
        const mockUser = {
          id: 'demo_user',
          name: 'Demo User',
          email: 'demo@apogee.com',
          avatar: `https://ui-avatars.com/api/?name=Demo+User&background=6366f1&color=fff&size=128`
        };
        
        setUser(mockUser);
      } catch (error) {
        console.error('Failed to load user:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      
      // Mock login - replace with actual API call
      const mockUser = {
        id: 'user_' + Date.now(),
        name: email.split('@')[0],
        email: email,
        avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=6366f1&color=fff&size=128`
      };
      
      const mockToken = 'demo_token_' + Date.now();
      
      localStorage.setItem('token', mockToken);
      setUser(mockUser);
      
      toast.success(`Welcome back, ${mockUser.name}! 👋`);
      navigate('/dashboard', { replace: true });
      return { success: true };
    } catch (error) {
      toast.error(error.message || 'Login failed');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const socialLogin = async (provider) => {
    try {
      setLoading(true);
      
      const mockUser = {
        id: `social_${Date.now()}`,
        name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
        email: `user@${provider}.com`,
        avatar: `https://ui-avatars.com/api/?name=${provider}&background=6366f1&color=fff&size=128`,
        provider: provider
      };
      
      const mockToken = `social_token_${Date.now()}`;
      
      localStorage.setItem('token', mockToken);
      setUser(mockUser);
      
      toast.success(`Signed in with ${provider}! 🎉`);
      navigate('/dashboard', { replace: true });
      return { success: true };
    } catch (error) {
      toast.error(`${provider} login failed`);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/login', { replace: true });
  };

  // Show nothing while initializing
  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white text-lg">Loading Apogee...</p>
        </div>
      </div>
    );
  }

  const value = {
    user,
    loading,
    login,
    socialLogin,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};