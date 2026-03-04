/**
 * Dashboard Page
 * Main overview page with all components
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { taskAPI, projectAPI } from '../services/api';
import DashboardStats from '../components/DashboardStats';
import RecentTasks from '../components/RecentTasks';
import ProductivityChart from '../components/ProductivityChart';
import QuickActions from '../components/QuickActions';
import { HiOutlineRefresh } from 'react-icons/hi';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgress: 0,
    overdue: 0,
    productivity: 0,
    focusScore: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [chartData, setChartData] = useState([]);

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      
      // Fetch task stats
      const taskStatsRes = await taskAPI.getStats();
      setStats(taskStatsRes.data.data);
      
      // Fetch recent tasks
      const tasksRes = await taskAPI.getAll({ limit: 5 });
      setRecentTasks(tasksRes.data.data);
      
      // Fetch weekly data for chart
      // You can create a separate endpoint for this or calculate from tasks
      const weeklyData = generateWeeklyData(tasksRes.data.data);
      setChartData(weeklyData);
      
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const generateWeeklyData = (tasks) => {
    // This is sample data - you can implement actual logic
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => ({
      day,
      completed: Math.floor(Math.random() * 10) + 1,
      created: Math.floor(Math.random() * 10) + 1,
    }));
  };

  const handleRefresh = async () => {
    await fetchDashboardData();
    toast.success('Dashboard updated');
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {getGreeting()}, {user?.name || 'User'}! 👋
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Here's what's happening with your projects today
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow disabled:opacity-50"
          >
            <HiOutlineRefresh className={`w-5 h-5 text-gray-600 dark:text-gray-400 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Refresh
            </span>
          </motion.button>
        </motion.div>

        {/* Stats Grid */}
        <DashboardStats stats={stats} loading={loading} />

        {/* Main Content Grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Recent Tasks */}
          <div className="lg:col-span-2">
            <RecentTasks tasks={recentTasks} loading={loading} />
          </div>

          {/* Right Column - Quick Actions */}
          <div>
            <QuickActions />
          </div>
        </div>

        {/* Productivity Chart */}
        <div className="mt-8">
          <ProductivityChart data={chartData} loading={loading} />
        </div>

        {/* Motivation Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400 italic">
            "The secret of getting ahead is getting started." — Mark Twain
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;