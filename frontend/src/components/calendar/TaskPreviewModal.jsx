/**
 * Task Preview Modal
 * Beautiful modal for viewing and editing tasks from calendar
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineX,
  HiOutlineClock,
  HiOutlineFlag,
  HiOutlineTag,
  HiOutlineUser,
  HiOutlineCheckCircle,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineCalendar,
  HiOutlineBell
} from 'react-icons/hi';
import { format } from 'date-fns';

const TaskPreviewModal = ({ isOpen, onClose, task, onEdit, onDelete, onComplete }) => {
  if (!task) return null;

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'text-red-600 bg-red-100 dark:bg-red-900/20',
      medium: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20',
      low: 'text-green-600 bg-green-100 dark:bg-green-900/20'
    };
    return colors[priority] || colors.medium;
  };

  const getStatusColor = (status) => {
    return status === 'completed'
      ? 'text-green-600 bg-green-100 dark:bg-green-900/20'
      : 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-lg mx-4 pointer-events-auto overflow-hidden border border-gray-200 dark:border-gray-700">
              {/* Header with gradient */}
              <div className="relative h-32 bg-gradient-to-r from-blue-600 to-purple-600">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-xl text-white transition-colors backdrop-blur-sm"
                >
                  <HiOutlineX className="w-5 h-5" />
                </button>
                
                <div className="absolute -bottom-8 left-6">
                  <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl shadow-xl flex items-center justify-center">
                    <HiOutlineCalendar className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="pt-10 p-6">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {task.title}
                  </h2>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </div>
                </div>

                {task.description && (
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {task.description}
                  </p>
                )}

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <HiOutlineClock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Due Date</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {task.due_date ? format(new Date(task.due_date), 'MMM d, yyyy') : 'No due date'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <HiOutlineFlag className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Priority</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                        {task.priority}
                      </p>
                    </div>
                  </div>

                  {task.project_name && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <HiOutlineTag className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Project</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {task.project_name}
                        </p>
                      </div>
                    </div>
                  )}

                  {task.assigned_to && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <HiOutlineUser className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Assigned to</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {task.assigned_to}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Reminder Section */}
                {task.reminder && (
                  <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center space-x-3">
                      <HiOutlineBell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <div>
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
                          Reminder set
                        </p>
                        <p className="text-xs text-blue-700 dark:text-blue-400">
                          {format(new Date(task.reminder), 'MMM d, yyyy h:mm a')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      onComplete(task.id);
                      onClose();
                    }}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all flex items-center justify-center space-x-2"
                  >
                    <HiOutlineCheckCircle className="w-5 h-5" />
                    <span>{task.status === 'completed' ? 'Reopen' : 'Complete'}</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      onEdit(task);
                      onClose();
                    }}
                    className="px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <HiOutlinePencil className="w-5 h-5" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this task?')) {
                        onDelete(task.id);
                        onClose();
                      }
                    }}
                    className="px-4 py-3 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
                  >
                    <HiOutlineTrash className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TaskPreviewModal;