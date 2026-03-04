/**
 * Calendar Header Component
 * Beautiful header with month navigation and view toggles
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineCalendar,
  HiOutlineViewGrid,
  HiOutlineViewList,
  HiOutlineViewBoards,
  HiOutlineRefresh
} from 'react-icons/hi';
import { format } from 'date-fns';

const CalendarHeader = ({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onToday,
  onViewChange,
  currentView,
  onRefresh
}) => {
  const views = [
    { id: 'dayGridMonth', name: 'Month', icon: HiOutlineViewGrid },
    { id: 'timeGridWeek', name: 'Week', icon: HiOutlineViewBoards },
    { id: 'timeGridDay', name: 'Day', icon: HiOutlineViewList }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Month Navigation */}
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.1, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={onPrevMonth}
            className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
          >
            <HiOutlineChevronLeft className="w-5 h-5" />
          </motion.button>

          <motion.div
            key={currentDate.toISOString()}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-3"
          >
            <HiOutlineCalendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={onNextMonth}
            className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
          >
            <HiOutlineChevronRight className="w-5 h-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToday}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            Today
          </motion.button>
        </div>

        {/* View Toggle and Refresh */}
        <div className="flex items-center space-x-3">
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
            {views.map((view) => (
              <motion.button
                key={view.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onViewChange(view.id)}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
                  currentView === view.id
                    ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <view.icon className="w-4 h-4" />
                <span className="hidden md:inline">{view.name}</span>
              </motion.button>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05, rotate: 90 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRefresh}
            className="p-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <HiOutlineRefresh className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default CalendarHeader;