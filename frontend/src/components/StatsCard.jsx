/**
 * Stats Card Component
 * Reusable statistics card with icon and trend
 */

import React from 'react';
import { motion } from 'framer-motion';
import { HiOutlineArrowUp, HiOutlineArrowDown } from 'react-icons/hi';

const StatsCard = ({ title, value, icon: Icon, trend, color = 'blue', prefix = '', suffix = '' }) => {
  const getColorClasses = () => {
    const colors = {
      blue: {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        text: 'text-blue-600 dark:text-blue-400',
        icon: 'text-blue-600 dark:text-blue-400',
        gradient: 'from-blue-600 to-blue-700'
      },
      green: {
        bg: 'bg-green-50 dark:bg-green-900/20',
        text: 'text-green-600 dark:text-green-400',
        icon: 'text-green-600 dark:text-green-400',
        gradient: 'from-green-600 to-green-700'
      },
      purple: {
        bg: 'bg-purple-50 dark:bg-purple-900/20',
        text: 'text-purple-600 dark:text-purple-400',
        icon: 'text-purple-600 dark:text-purple-400',
        gradient: 'from-purple-600 to-purple-700'
      },
      yellow: {
        bg: 'bg-yellow-50 dark:bg-yellow-900/20',
        text: 'text-yellow-600 dark:text-yellow-400',
        icon: 'text-yellow-600 dark:text-yellow-400',
        gradient: 'from-yellow-600 to-yellow-700'
      },
      red: {
        bg: 'bg-red-50 dark:bg-red-900/20',
        text: 'text-red-600 dark:text-red-400',
        icon: 'text-red-600 dark:text-red-400',
        gradient: 'from-red-600 to-red-700'
      }
    };
    return colors[color] || colors.blue;
  };

  const colors = getColorClasses();

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${colors.bg}`}>
          <Icon className={`w-6 h-6 ${colors.icon}`} />
        </div>
        
        {trend && (
          <div className={`flex items-center space-x-1 text-sm ${
            trend > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend > 0 ? (
              <HiOutlineArrowUp className="w-4 h-4" />
            ) : (
              <HiOutlineArrowDown className="w-4 h-4" />
            )}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</p>
      
      <div className="flex items-baseline">
        {prefix && <span className="text-lg text-gray-500 dark:text-gray-400 mr-1">{prefix}</span>}
        <span className="text-3xl font-bold text-gray-900 dark:text-white">{value}</span>
        {suffix && <span className="text-lg text-gray-500 dark:text-gray-400 ml-1">{suffix}</span>}
      </div>

      {/* Sparkline bar (decorative) */}
      <div className="mt-4 h-1 flex space-x-1">
        {[...Array(7)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${Math.random() * 100}%` }}
            transition={{ delay: i * 0.1 }}
            className={`w-full bg-gradient-to-t ${colors.gradient} rounded-full`}
            style={{ height: `${Math.random() * 60 + 20}%` }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default StatsCard;