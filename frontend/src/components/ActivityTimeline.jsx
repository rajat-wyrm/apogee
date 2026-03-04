/**
 * Activity Timeline Component
 * Shows user's recent activities in a beautiful timeline
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  HiOutlineCheckCircle, 
  HiOutlinePlusCircle, 
  HiOutlinePencil, 
  HiOutlineTrash,
  HiOutlineUserCircle,
  HiOutlineStar
} from 'react-icons/hi';
import { formatDistanceToNow } from 'date-fns';

const ActivityTimeline = ({ activities = [] }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'task_created':
        return { icon: HiOutlinePlusCircle, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/20' };
      case 'task_completed':
        return { icon: HiOutlineCheckCircle, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/20' };
      case 'task_updated':
        return { icon: HiOutlinePencil, color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/20' };
      case 'task_deleted':
        return { icon: HiOutlineTrash, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/20' };
      case 'project_created':
        return { icon: HiOutlineStar, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/20' };
      default:
        return { icon: HiOutlineUserCircle, color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-900/20' };
    }
  };

  const sampleActivities = activities.length > 0 ? activities : [
    { id: 1, type: 'task_created', description: 'Created task "Complete project documentation"', time: new Date(Date.now() - 1000 * 60 * 30) },
    { id: 2, type: 'task_completed', description: 'Completed task "Review pull requests"', time: new Date(Date.now() - 1000 * 60 * 120) },
    { id: 3, type: 'project_created', description: 'Created project "Website Redesign"', time: new Date(Date.now() - 1000 * 60 * 180) },
    { id: 4, type: 'task_updated', description: 'Updated task "Fix navigation bug"', time: new Date(Date.now() - 1000 * 60 * 240) },
    { id: 5, type: 'task_deleted', description: 'Deleted task "Old backlog item"', time: new Date(Date.now() - 1000 * 60 * 300) },
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
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
        <span className="w-1 h-6 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full mr-3"></span>
        Recent Activity
      </h3>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 to-purple-600 opacity-20" />

        <div className="space-y-6">
          {sampleActivities.map((activity, index) => {
            const { icon: Icon, color, bg } = getActivityIcon(activity.type);
            
            return (
              <motion.div
                key={activity.id}
                variants={itemVariants}
                className="relative flex items-start group"
              >
                {/* Icon */}
                <div className={`relative z-10 w-10 h-10 rounded-xl ${bg} flex items-center justify-center mr-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white font-medium">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatDistanceToNow(activity.time, { addSuffix: true })}
                  </p>
                </div>

                {/* Hover dot */}
                <div className="absolute left-5 top-5 w-2 h-2 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform -translate-x-1/2" />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* View all link */}
      <motion.button
        whileHover={{ x: 5 }}
        className="mt-6 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center space-x-2 transition-colors"
      >
        <span>View all activity</span>
        <HiOutlineArrowRight className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
};

export default ActivityTimeline;