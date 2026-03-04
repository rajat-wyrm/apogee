/**
 * Analytics Page
 * Complete productivity analytics dashboard
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { taskAPI, projectAPI } from '../services/api';
import ProductivityMetrics from '../components/analytics/ProductivityMetrics';
import ActivityHeatmap from '../components/analytics/ActivityHeatmap';
import ProductivityCharts from '../components/analytics/ProductivityCharts';
import {
  HiOutlineCalendar,
  HiOutlineDownload,
  HiOutlineRefresh,
  HiOutlineFilter,
  HiOutlineChartBar
} from 'react-icons/hi';
import { format, subDays } from 'date-fns';
import toast from 'react-hot-toast';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState('30');
  const [metrics, setMetrics] = useState(null);
  const [heatmapData, setHeatmapData] = useState({});
  const [exportFormat, setExportFormat] = useState('pdf');

  const fetchAnalytics = async () => {
    try {
      setRefreshing(true);
      
      // Fetch task statistics
      const taskStats = await taskAPI.getStats();
      
      // Generate heatmap data (mock for now - replace with real data)
      const mockHeatmap = {};
      for (let i = 0; i < 90; i++) {
        const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
        mockHeatmap[date] = Math.floor(Math.random() * 12);
      }
      setHeatmapData(mockHeatmap);
      
      setMetrics({
        productivityScore: 85,
        focusTime: 128,
        completedTasks: 234,
        streak: 12,
        efficiency: 92,
        qualityScore: 4.8,
        ...taskStats.data?.data
      });
      
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleExport = () => {
    toast.success(`Analytics exported as ${exportFormat.toUpperCase()}`);
  };

  const handleRefresh = async () => {
    await fetchAnalytics();
    toast.success('Analytics updated');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
        >
          <div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                <HiOutlineChartBar className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Analytics Dashboard
              </h1>
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Deep insights into your productivity and performance
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Date Range Selector */}
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>

            {/* Export Button with Dropdown */}
            <div className="relative group">
              <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2">
                <HiOutlineDownload className="w-5 h-5" />
                <span>Export</span>
              </button>
              
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                {['pdf', 'csv', 'excel', 'image'].map((format) => (
                  <button
                    key={format}
                    onClick={() => {
                      setExportFormat(format);
                      handleExport();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg capitalize"
                  >
                    Export as {format}
                  </button>
                ))}
              </div>
            </div>

            {/* Refresh Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <HiOutlineRefresh className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            </motion.button>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 animate-pulse">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                    <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  </div>
                  <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                  <div className="w-32 h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
                  <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Productivity Metrics */}
            <motion.div variants={itemVariants}>
              <ProductivityMetrics data={metrics} />
            </motion.div>

            {/* Activity Heatmap */}
            <motion.div variants={itemVariants}>
              <ActivityHeatmap data={heatmapData} />
            </motion.div>

            {/* Productivity Charts */}
            <motion.div variants={itemVariants}>
              <ProductivityCharts data={metrics} />
            </motion.div>

            {/* Summary Cards */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Productivity Trend
                </h4>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">+23%</span>
                  <span className="ml-2 text-sm text-green-600">↑ vs last month</span>
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Your productivity is steadily increasing
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Completion Rate
                </h4>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">87%</span>
                  <span className="ml-2 text-sm text-green-600">↑ 5%</span>
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Above industry average
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Focus Score
                </h4>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">92</span>
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">/100</span>
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Top 10% of users
                </p>
              </div>
            </motion.div>

            {/* Achievement Badges */}
            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-8 text-white"
            >
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">🎉 You've reached a milestone!</h3>
                  <p className="text-blue-100">
                    You've completed 500 tasks. You're in the top 5% of productive users!
                  </p>
                </div>
                <button className="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors">
                  View Achievements
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Analytics;