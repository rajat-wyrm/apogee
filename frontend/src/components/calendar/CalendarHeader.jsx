/**
 * Calendar Header Component
 */

import React from 'react';
import { HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlineRefresh } from 'react-icons/hi';

const CalendarHeader = ({ currentDate, onPrevMonth, onNextMonth, onToday, onRefresh }) => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={onPrevMonth}
          className="p-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <HiOutlineChevronLeft className="w-5 h-5" />
        </button>
        
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        
        <button
          onClick={onNextMonth}
          className="p-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <HiOutlineChevronRight className="w-5 h-5" />
        </button>

        <button
          onClick={onToday}
          className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          Today
        </button>
      </div>

      <button
        onClick={onRefresh}
        className="p-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <HiOutlineRefresh className="w-5 h-5" />
      </button>
    </div>
  );
};

export default CalendarHeader;
