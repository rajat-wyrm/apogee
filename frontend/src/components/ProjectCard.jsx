/**
 * Project Card Component
 * Displays individual project with actions
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  HiOutlinePencil, 
  HiOutlineTrash, 
  HiOutlineExternalLink,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle
} from 'react-icons/hi';
import { formatDistanceToNow } from 'date-fns';

const ProjectCard = ({ project, onEdit, onDelete }) => {
  const getProgressColor = (completed, total) => {
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    if (percentage >= 75) return 'from-green-500 to-green-600';
    if (percentage >= 50) return 'from-yellow-500 to-yellow-600';
    if (percentage >= 25) return 'from-orange-500 to-orange-600';
    return 'from-red-500 to-red-600';
  };

  const getStatusIcon = () => {
    const completed = project.completed_tasks || 0;
    const total = project.task_count || 0;
    
    if (total === 0) return <HiOutlineClock className="w-5 h-5 text-gray-400" />;
    if (completed === total) return <HiOutlineCheckCircle className="w-5 h-5 text-green-500" />;
    return <HiOutlineExclamationCircle className="w-5 h-5 text-yellow-500" />;
  };

  const progress = project.task_count > 0 
    ? Math.round((project.completed_tasks / project.task_count) * 100) 
    : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      {/* Color Accent Bar */}
      <div 
        className="h-2 w-full bg-gradient-to-r from-blue-600 to-purple-600"
        style={{ backgroundColor: project.color }}
      />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {project.name}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
              {project.description || 'No description provided'}
            </p>
          </div>
          
          {/* Status Icon */}
          <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
            {getStatusIcon()}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600 dark:text-gray-400">Progress</span>
            <span className="font-medium text-gray-900 dark:text-white">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.2 }}
              className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(
                project.completed_tasks || 0,
                project.task_count || 0
              )}`}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {project.task_count || 0}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Tasks</p>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {project.completed_tasks || 0}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Completed</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
            <HiOutlineClock className="w-4 h-4" />
            <span>
              Updated {project.updated_at 
                ? formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })
                : 'recently'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onEdit(project)}
              className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <HiOutlinePencil className="w-5 h-5" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onDelete(project.id)}
              className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <HiOutlineTrash className="w-5 h-5" />
            </motion.button>
            
            <Link
              to={`/projects/${project.id}`}
              className="p-2 text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <HiOutlineExternalLink className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;