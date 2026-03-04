/**
 * Productivity Metrics Component
 * Displays key productivity metrics with animated counters
 */

import React from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import {
  HiOutlineTrendingUp,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineSparkles,
  HiOutlineFire,
  HiOutlineStar
} from 'react-icons/hi';

const ProductivityMetrics = ({ data }) => {
  const metrics = [
    {
      title: 'Productivity Score',
      value: data?.productivityScore || 85,
      suffix: '%',
      icon: HiOutlineTrendingUp,
      color: 'from-blue-600 to-blue-700',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400',
      trend: '+12%',
      description: 'vs last month'
    },
    {
      title: 'Focus Time',
      value: data?.focusTime || 128,
      suffix: 'hrs',
      icon: HiOutlineClock,
      color: 'from-purple-600 to-purple-700',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400',
      trend: '+8%',
      description: 'vs last month'
    },
    {
      title: 'Tasks Completed',
      value: data?.completedTasks || 234,
      icon: HiOutlineCheckCircle,
      color: 'from-green-600 to-green-700',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400',
      trend: '+23%',
      description: 'vs last month'
    },
    {
      title: 'Current Streak',
      value: data?.streak || 12,
      suffix: 'days',
      icon: HiOutlineFire,
      color: 'from-orange-600 to-orange-700',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      textColor: 'text-orange-600 dark:text-orange-400',
      trend: '🔥',
      description: 'personal best'
    },
    {
      title: 'Efficiency Rate',
      value: data?.efficiency || 92,
      suffix: '%',
      icon: HiOutlineSparkles,
      color: 'from-yellow-600 to-yellow-700',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      textColor: 'text-yellow-600 dark:text-yellow-400',
      trend: '+5%',
      description: 'above average'
    },
    {
      title: 'Quality Score',
      value: data?.qualityScore || 4.8,
      suffix: '/5',
      icon: HiOutlineStar,
      color: 'from-pink-600 to-pink-700',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20',
      textColor: 'text-pink-600 dark:text-pink-400',
      trend: 'A+',
      description: 'rating'
    }
  ];

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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {metrics.map((metric, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          whileHover={{ y: -5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl ${metric.bgColor}`}>
              <metric.icon className={`w-6 h-6 ${metric.textColor}`} />
            </div>
            <span className="text-sm font-medium text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
              {metric.trend}
            </span>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{metric.title}</p>
          
          <div className="flex items-baseline">
            <CountUp
              end={metric.value}
              duration={2.5}
              className="text-3xl font-bold text-gray-900 dark:text-white"
            />
            {metric.suffix && (
              <span className="ml-1 text-lg text-gray-500 dark:text-gray-400">{metric.suffix}</span>
            )}
          </div>

          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{metric.description}</p>

          {/* Mini sparkline */}
          <div className="mt-4 h-1 flex space-x-1">
            {[...Array(7)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${Math.random() * 100}%` }}
                transition={{ delay: index * 0.1 + i * 0.05 }}
                className={`w-full bg-gradient-to-t ${metric.color} rounded-full`}
                style={{ height: `${Math.random() * 60 + 20}%` }}
              />
            ))}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ProductivityMetrics;