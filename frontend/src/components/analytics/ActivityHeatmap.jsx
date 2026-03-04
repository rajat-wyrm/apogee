/**
 * Activity Heatmap Component
 * GitHub-style contribution heatmap
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  format,
  eachDayOfInterval,
  subMonths,
  startOfMonth,
  endOfMonth,
  getDay
} from 'date-fns';

const ActivityHeatmap = ({ data = {} }) => {
  const [selectedMonth, setSelectedMonth] = useState(0);
  
  // Generate last 4 months
  const months = [];
  for (let i = 3; i >= 0; i--) {
    const date = subMonths(new Date(), i);
    months.push({
      name: format(date, 'MMMM yyyy'),
      start: startOfMonth(date),
      end: endOfMonth(date)
    });
  }

  // Generate days for selected month
  const selectedMonthData = months[selectedMonth];
  const days = eachDayOfInterval({
    start: selectedMonthData.start,
    end: selectedMonthData.end
  });

  // Create empty array for days of week (0-6)
  const weeks = [];
  let currentWeek = new Array(7).fill(null);
  
  // Fill in the days
  days.forEach(day => {
    const dayOfWeek = getDay(day);
    currentWeek[dayOfWeek] = day;
    
    if (dayOfWeek === 6) {
      weeks.push([...currentWeek]);
      currentWeek = new Array(7).fill(null);
    }
  });
  
  // Push remaining days
  if (currentWeek.some(d => d !== null)) {
    weeks.push(currentWeek);
  }

  const getActivityLevel = (date) => {
    if (!date) return 0;
    const dateStr = format(date, 'yyyy-MM-dd');
    const count = data[dateStr] || 0;
    
    if (count === 0) return 0;
    if (count < 3) return 1;
    if (count < 6) return 2;
    if (count < 10) return 3;
    return 4;
  };

  const getActivityColor = (level) => {
    const colors = [
      'bg-gray-100 dark:bg-gray-800', // level 0
      'bg-blue-200 dark:bg-blue-900/30', // level 1
      'bg-blue-400 dark:bg-blue-700', // level 2
      'bg-blue-600 dark:bg-blue-500', // level 3
      'bg-blue-800 dark:bg-blue-300' // level 4
    ];
    return colors[level];
  };

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const totalActivity = Object.values(data).reduce((sum, val) => sum + val, 0);
  const bestDay = Object.entries(data).reduce(
    (best, [date, count]) => count > (best?.count || 0) ? { date, count } : best,
    null
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Activity Heatmap
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {totalActivity} total contributions
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {months.map((month, index) => (
            <button
              key={month.name}
              onClick={() => setSelectedMonth(index)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                selectedMonth === index
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {month.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex">
        {/* Weekday labels */}
        <div className="mr-4 space-y-2">
          {weekdays.map(day => (
            <div key={day} className="h-8 flex items-center text-xs text-gray-500 dark:text-gray-400">
              {day}
            </div>
          ))}
        </div>

        {/* Heatmap grid */}
        <div className="flex-1 overflow-x-auto">
          <div className="inline-block min-w-full">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex mb-2">
                {week.map((day, dayIndex) => {
                  const level = day ? getActivityLevel(day) : 0;
                  const dateStr = day ? format(day, 'MMM d, yyyy') : '';
                  const count = day ? data[format(day, 'yyyy-MM-dd')] || 0 : 0;
                  
                  return (
                    <motion.div
                      key={dayIndex}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: (weekIndex * 7 + dayIndex) * 0.01 }}
                      className="group relative"
                    >
                      <div
                        className={`w-8 h-8 m-0.5 rounded ${getActivityColor(level)} transition-all hover:ring-2 hover:ring-blue-500 cursor-pointer`}
                      />
                      
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                        {day ? (
                          <>
                            <strong>{count} tasks</strong>
                            <br />
                            <span className="text-gray-400">{dateStr}</span>
                          </>
                        ) : (
                          'No data'
                        )}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend and stats */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Less</span>
              <div className="flex space-x-1">
                {[0, 1, 2, 3, 4].map(level => (
                  <div
                    key={level}
                    className={`w-4 h-4 rounded ${getActivityColor(level)}`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">More</span>
            </div>
          </div>

          {bestDay && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Best day: <span className="font-medium text-gray-900 dark:text-white">
                {format(new Date(bestDay.date), 'MMM d, yyyy')}
              </span> ({bestDay.count} tasks)
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ActivityHeatmap;