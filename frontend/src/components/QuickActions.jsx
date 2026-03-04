/**
 * Quick Actions Component
 * Shortcuts for common tasks
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  HiOutlinePlusCircle,
  HiOutlineDocumentText,
  HiOutlineCalendar,
  HiOutlineChartBar,
  HiOutlineUsers,
  HiOutlineCog
} from 'react-icons/hi';

const QuickActions = () => {
  const actions = [
    {
      title: 'New Task',
      description: 'Create a new task',
      icon: HiOutlinePlusCircle,
      color: 'from-blue-500 to-blue-600',
      link: '/tasks?action=create',
    },
    {
      title: 'New Project',
      description: 'Start a new project',
      icon: HiOutlineDocumentText,
      color: 'from-purple-500 to-purple-600',
      link: '/projects?action=create',
    },
    {
      title: 'Calendar',
      description: 'View your schedule',
      icon: HiOutlineCalendar,
      color: 'from-green-500 to-green-600',
      link: '/calendar',
    },
    {
      title: 'Analytics',
      description: 'Check your stats',
      icon: HiOutlineChartBar,
      color: 'from-yellow-500 to-yellow-600',
      link: '/analytics',
    },
    {
      title: 'Team',
      description: 'Collaborate with team',
      icon: HiOutlineUsers,
      color: 'from-pink-500 to-pink-600',
      link: '/team',
    },
    {
      title: 'Settings',
      description: 'Customize your app',
      icon: HiOutlineCog,
      color: 'from-gray-500 to-gray-600',
      link: '/settings',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Quick Actions
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {actions.map((action, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to={action.link}
              className="block p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
            >
              <div className={`w-12 h-12 mb-3 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center transform group-hover:scale-110 transition-transform`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                {action.title}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {action.description}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default QuickActions;