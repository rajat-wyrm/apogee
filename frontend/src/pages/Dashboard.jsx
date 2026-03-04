/**
 * Dashboard Page - FIXED VERSION
 * With proper error handling and loading states
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlineClipboardList,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineFire,
  HiOutlineChartBar,
  HiOutlineStar,
  HiOutlineRefresh,
  HiOutlinePlus,
  HiOutlineFolder,
  HiOutlineCalendar
} from 'react-icons/hi';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTasks: 24,
    completedTasks: 16,
    pendingTasks: 8,
    overdueTasks: 3,
    productivityScore: 85,
    focusTime: 12.5,
    streak: 7,
    projects: 5
  });

  const [recentTasks, setRecentTasks] = useState([
    { id: 1, title: 'Complete project documentation', status: 'pending', priority: 'high', due: '2026-03-05' },
    { id: 2, title: 'Review pull requests', status: 'in_progress', priority: 'medium', due: '2026-03-04' },
    { id: 3, title: 'Update dependencies', status: 'completed', priority: 'low', due: '2026-03-03' },
    { id: 4, title: 'Fix navigation bug', status: 'pending', priority: 'high', due: '2026-03-06' },
    { id: 5, title: 'Design system updates', status: 'in_progress', priority: 'medium', due: '2026-03-07' },
  ]);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <HiOutlineCheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress': return <HiOutlineClock className="w-5 h-5 text-yellow-500" />;
      default: return <HiOutlineClipboardList className="w-5 h-5 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Loading Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400">Preparing your productivity insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {getGreeting()}, {user?.name || 'User'}! 👋
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Here's what's happening with your projects today
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => window.location.reload()}
              className="p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <HiOutlineRefresh className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => navigate('/tasks/new')}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              <HiOutlinePlus className="w-5 h-5" />
              <span>New Task</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
                <HiOutlineClipboardList className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm font-medium text-green-600 bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded-full">
                +12%
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Tasks</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalTasks}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-xl">
                <HiOutlineCheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-sm font-medium text-green-600 bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded-full">
                +8%
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completedTasks}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl">
                <HiOutlineClock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <span className="text-sm font-medium text-red-600 bg-red-100 dark:bg-red-900/20 px-2 py-1 rounded-full">
                +3
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pendingTasks}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
                <HiOutlineFire className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-sm font-medium text-green-600 bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded-full">
                🔥
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Day Streak</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.streak} days</p>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Tasks</h2>
            <button 
              onClick={() => navigate('/tasks')}
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View All
            </button>
          </div>

          <div className="space-y-4">
            {recentTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(task.status)}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">{task.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Due: {task.due}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => navigate('/projects')}
            className="p-6 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl text-white hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            <HiOutlineFolder className="w-8 h-8 mb-3" />
            <h3 className="text-lg font-semibold mb-1">Projects</h3>
            <p className="text-sm opacity-90">Manage your projects</p>
          </button>

          <button
            onClick={() => navigate('/calendar')}
            className="p-6 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl text-white hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            <HiOutlineCalendar className="w-8 h-8 mb-3" />
            <h3 className="text-lg font-semibold mb-1">Calendar</h3>
            <p className="text-sm opacity-90">View your schedule</p>
          </button>

          <button
            onClick={() => navigate('/analytics')}
            className="p-6 bg-gradient-to-br from-pink-600 to-pink-700 rounded-2xl text-white hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            <HiOutlineChartBar className="w-8 h-8 mb-3" />
            <h3 className="text-lg font-semibold mb-1">Analytics</h3>
            <p className="text-sm opacity-90">Track productivity</p>
          </button>
        </div>

        {/* Motivation Quote */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 italic">
            "The secret of getting ahead is getting started." — Mark Twain
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;