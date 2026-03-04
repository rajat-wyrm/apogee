/**
 * Productivity Chart Component
 * Displays weekly task completion trends
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const ProductivityChart = ({ data, loading }) => {
  const defaultData = [
    { day: 'Mon', completed: 4, created: 6 },
    { day: 'Tue', completed: 6, created: 8 },
    { day: 'Wed', completed: 8, created: 7 },
    { day: 'Thu', completed: 5, created: 5 },
    { day: 'Fri', completed: 9, created: 10 },
    { day: 'Sat', completed: 3, created: 4 },
    { day: 'Sun', completed: 2, created: 3 },
  ];

  const chartData = data || defaultData;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${entry.name === 'Completed' ? 'bg-blue-600' : 'bg-purple-600'}`} />
              <span className="text-gray-600 dark:text-gray-400">{entry.name}:</span>
              <span className="font-medium text-gray-900 dark:text-white">{entry.value} tasks</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="w-48 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-6"></div>
        <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Weekly Productivity
      </h3>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis 
              dataKey="day" 
              stroke="#6B7280"
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <YAxis 
              stroke="#6B7280"
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{
                paddingTop: '20px',
              }}
            />
            <Area
              type="monotone"
              dataKey="completed"
              stroke="#3B82F6"
              strokeWidth={2}
              fill="url(#colorCompleted)"
              name="Completed"
            />
            <Area
              type="monotone"
              dataKey="created"
              stroke="#8B5CF6"
              strokeWidth={2}
              fill="url(#colorCreated)"
              name="Created"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default ProductivityChart;