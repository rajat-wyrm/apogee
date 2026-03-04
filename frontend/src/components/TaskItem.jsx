/**
 * Task Item Component
 * Displays individual task with actions
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  HiOutlinePencil, 
  HiOutlineTrash, 
  HiOutlineClock,
  HiOutlineFlag,
  HiOutlineTag,
  HiOutlineCalendar,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle
} from 'react-icons/hi';
import { formatDistanceToNow, format } from 'date-fns';

const TaskItem = ({ task, onToggle, onEdit, onDelete, viewMode = 'list' }) => {
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'critical':
        return {
          bg: 'bg-red-100 dark:bg-red-900/20',
          text: 'text-red-600 dark:text-red-400',
          border: 'border-red-200 dark:border-red-800',
          icon: 'text-red-500'
        };
      case 'high':
        return {
          bg: 'bg-orange-100 dark:bg-orange-900/20',
          text: 'text-orange-600 dark:text-orange-400',
          border: 'border-orange-200 dark:border-orange-800',
          icon: 'text-orange-500'
        };
      case 'medium':
        return {
          bg: 'bg-yellow-100 dark:bg-yellow-900/20',
          text: 'text-yellow-600 dark:text-yellow-400',
          border: 'border-yellow-200 dark:border-yellow-800',
          icon: 'text-yellow-500'
        };
      case 'low':
        return {
          bg: 'bg-green-100 dark:bg-green-900/20',
          text: 'text-green-600 dark:text-green-400',
          border: 'border-green-200 dark:border-green-800',
          icon: 'text-green-500'
        };
      default:
        return {
          bg: 'bg-gray-100 dark:bg-gray-900/20',
          text: 'text-gray-600 dark:text-gray-400',
          border: 'border-gray-200 dark:border-gray-800',
          icon: 'text-gray-500'
        };
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <HiOutlineCheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress':
        return <HiOutlineClock className="w-5 h-5 text-yellow-500" />;
      case 'pending':
        return <HiOutlineExclamationCircle className="w-5 h-5 text-gray-400" />;
      default:
        return <HiOutlineClock className="w-5 h-5 text-gray-400" />;
    }
  };

  const isOverdue = (dueDate) => {
    if (!dueDate || task.status === 'completed') return false;
    return new Date(dueDate) < new Date();
  };

  const priorityStyle = getPriorityColor(task.priority);
  
  const taskVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -100 }
  };

  if (viewMode === 'grid') {
    return (
      <motion.div
        variants={taskVariants}
        layout
        initial="hidden"
        animate="visible"
        exit="exit"
        whileHover={{ y: -5 }}
        className={`group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${
          task.status === 'completed' ? 'opacity-75' : ''
        }`}
      >
        {/* Status Bar */}
        <div className={`h-2 w-full bg-gradient-to-r ${
          task.status === 'completed' ? 'from-green-500 to-green-600' :
          isOverdue(task.due_date) ? 'from-red-500 to-red-600' :
          'from-blue-500 to-purple-500'
        }`} />

        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => onToggle(task.id)}
                className={`w-6 h-6 rounded-lg border-2 transition-all ${
                  task.status === 'completed'
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400'
                } flex items-center justify-center`}
              >
                {task.status === 'completed' && <HiOutlineCheckCircle className="w-4 h-4" />}
              </button>
              <h3 className={`text-lg font-semibold ${
                task.status === 'completed' 
                  ? 'text-gray-500 dark:text-gray-400 line-through' 
                  : 'text-gray-900 dark:text-white'
              }`}>
                {task.title}
              </h3>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 text-xs rounded-full ${priorityStyle.bg} ${priorityStyle.text} border ${priorityStyle.border}`}>
                {task.priority}
              </span>
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Metadata */}
          <div className="flex flex-wrap gap-3 mb-4">
            {task.project_name && (
              <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                <HiOutlineTag className="w-4 h-4" />
                <span>{task.project_name}</span>
              </div>
            )}
            
            {task.due_date && (
              <div className={`flex items-center space-x-1 text-xs ${
                isOverdue(task.due_date) && task.status !== 'completed'
                  ? 'text-red-600 dark:text-red-400 font-medium'
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                <HiOutlineCalendar className="w-4 h-4" />
                <span>{format(new Date(task.due_date), 'MMM d, yyyy')}</span>
                {isOverdue(task.due_date) && task.status !== 'completed' && (
                  <span className="ml-1 px-1.5 py-0.5 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full text-xs">
                    Overdue
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
              {getStatusIcon(task.status)}
              <span>
                {task.status === 'completed' 
                  ? 'Completed'
                  : task.status === 'in_progress'
                  ? 'In Progress'
                  : 'Pending'}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onEdit(task)}
                className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <HiOutlinePencil className="w-4 h-4" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onDelete(task.id)}
                className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <HiOutlineTrash className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // List view
  return (
    <motion.div
      variants={taskVariants}
      layout
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 ${
        task.status === 'completed' ? 'opacity-75' : ''
      }`}
    >
      <div className="p-4">
        <div className="flex items-center gap-4">
          {/* Checkbox */}
          <button
            onClick={() => onToggle(task.id)}
            className={`w-6 h-6 rounded-lg border-2 transition-all flex-shrink-0 ${
              task.status === 'completed'
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400'
            } flex items-center justify-center`}
          >
            {task.status === 'completed' && <HiOutlineCheckCircle className="w-4 h-4" />}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h3 className={`text-base font-medium truncate ${
                task.status === 'completed' 
                  ? 'text-gray-500 dark:text-gray-400 line-through' 
                  : 'text-gray-900 dark:text-white'
              }`}>
                {task.title}
              </h3>
              
              <span className={`flex-shrink-0 px-2 py-0.5 text-xs rounded-full ${priorityStyle.bg} ${priorityStyle.text} border ${priorityStyle.border}`}>
                {task.priority}
              </span>

              {isOverdue(task.due_date) && task.status !== 'completed' && (
                <span className="flex-shrink-0 px-2 py-0.5 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full text-xs">
                  Overdue
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              {task.project_name && (
                <div className="flex items-center gap-1">
                  <HiOutlineTag className="w-3 h-3" />
                  <span>{task.project_name}</span>
                </div>
              )}
              
              {task.due_date && (
                <div className={`flex items-center gap-1 ${
                  isOverdue(task.due_date) && task.status !== 'completed'
                    ? 'text-red-600 dark:text-red-400'
                    : ''
                }`}>
                  <HiOutlineCalendar className="w-3 h-3" />
                  <span>{format(new Date(task.due_date), 'MMM d, yyyy')}</span>
                </div>
              )}

              <div className="flex items-center gap-1">
                {getStatusIcon(task.status)}
                <span>
                  {task.status === 'completed' 
                    ? 'Completed'
                    : task.status === 'in_progress'
                    ? 'In Progress'
                    : 'Pending'}
                </span>
              </div>

              {task.created_at && (
                <span>
                  Created {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onEdit(task)}
              className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <HiOutlinePencil className="w-4 h-4" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onDelete(task.id)}
              className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <HiOutlineTrash className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskItem;