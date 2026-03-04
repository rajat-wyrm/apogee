/**
 * Task Preview Modal Component
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineX, HiOutlineClock, HiOutlineFlag, HiOutlineTag } from 'react-icons/hi';

const TaskPreviewModal = ({ isOpen, onClose, task }) => {
  if (!task) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 pointer-events-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {task.title}
                  </h3>
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <HiOutlineX className="w-5 h-5" />
                  </button>
                </div>

                {task.description && (
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {task.description}
                  </p>
                )}

                <div className="space-y-3">
                  {task.due_date && (
                    <div className="flex items-center space-x-3 text-sm">
                      <HiOutlineClock className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Due: {new Date(task.due_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  {task.priority && (
                    <div className="flex items-center space-x-3 text-sm">
                      <HiOutlineFlag className="w-5 h-5 text-gray-500" />
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        task.priority === 'high' ? 'bg-red-100 text-red-700' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  )}

                  {task.project_name && (
                    <div className="flex items-center space-x-3 text-sm">
                      <HiOutlineTag className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {task.project_name}
                      </span>
                    </div>
                  )}
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
