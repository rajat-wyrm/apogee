/**
 * Recent Tasks Component
 * Displays the most recent tasks with status
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  HiOutlineClock, 
  HiOutlineCheckCircle, 
  HiOutlineExclamationCircle,
  HiOutlineArrowRight 
} from 'react-icons/hi';
import { formatDistanceToNow } from 'date-fns';

const RecentTasks = ({ tasks, loading }) => {
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
      case 'critical':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <HiOutlineCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case 'in_progress':
        return <HiOutlineClock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
      case 'pending':
        return <HiOutlineExclamationCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
      default:
        return <HiOutlineClock className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="w-32 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="w-20 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              <div className="w-40 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Tasks
        </h3>
        <Link
          to="/tasks"
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center space-x-1 group"
        >
          <span>View all</span>
          <HiOutlineArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="space-y-4">
        {tasks && tasks.length > 0 ? (
          tasks.slice(0, 5).map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between py-2 group hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg px-2 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${getPriorityColor(task.priority)}`}>
                  {getStatusIcon(task.status)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {task.title}
                  </p>
                  {task.project_name && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {task.project_name}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {task.created_at ? formatDistanceToNow(new Date(task.created_at), { addSuffix: true }) : 'Recently'}
                </span>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <HiOutlineClipboardList className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">No tasks yet</p>
            <Link
              to="/tasks"
              className="inline-block mt-4 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              Create your first task
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RecentTasks;