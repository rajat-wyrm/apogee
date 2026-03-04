/**
 * Team Analytics Component
 * Beautiful analytics for team performance
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import {
  HiOutlineTrendingUp,
  HiOutlineUserGroup,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineStar
} from 'react-icons/hi';

const TeamAnalytics = ({ data }) => {
  // Sample data - replace with real API data
  const memberProductivity = [
    { name: 'Alice', tasks: 45, completed: 38, efficiency: 84 },
    { name: 'Bob', tasks: 38, completed: 32, efficiency: 82 },
    { name: 'Charlie', tasks: 42, completed: 35, efficiency: 83 },
    { name: 'Diana', tasks: 50, completed: 45, efficiency: 90 },
    { name: 'Eve', tasks: 35, completed: 30, efficiency: 86 }
  ];

  const taskDistribution = [
    { name: 'Development', value: 45, color: '#3B82F6' },
    { name: 'Design', value: 25, color: '#8B5CF6' },
    { name: 'Review', value: 15, color: '#10B981' },
    { name: 'Testing', value: 10, color: '#F59E0B' },
    { name: 'Documentation', value: 5, color: '#6366F1' }
  ];

  const teamSkills = [
    { subject: 'React', A: 90, B: 85, fullMark: 100 },
    { subject: 'Node.js', A: 85, B: 80, fullMark: 100 },
    { subject: 'Python', A: 70, B: 75, fullMark: 100 },
    { subject: 'UI/UX', A: 75, B: 85, fullMark: 100 },
    { subject: 'DevOps', A: 60, B: 55, fullMark: 100 },
    { subject: 'Testing', A: 80, B: 70, fullMark: 100 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-gray-600 dark:text-gray-400">{entry.name}:</span>
              <span className="font-medium text-gray-900 dark:text-white">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
              <HiOutlineUserGroup className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm text-green-600 bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded-full">
              +12%
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Team Members</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">8 active now</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-xl">
              <HiOutlineCheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-sm text-green-600 bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded-full">
              +8%
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Tasks Completed</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">245</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">This month</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
              <HiOutlineClock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-sm text-green-600 bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded-full">
              +5%
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Avg Response Time</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">2.4h</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">↓ 0.3h from last week</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl">
              <HiOutlineStar className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <span className="text-sm text-green-600 bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded-full">
              +15%
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Team Rating</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">4.8</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">out of 5</p>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Member Productivity Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Member Productivity
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={memberProductivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="tasks" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Task Distribution Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Task Distribution by Type
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {taskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Team Skills Radar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Team Skills Matrix
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={teamSkills}>
                <PolarGrid stroke="#374151" strokeDasharray="3 3" />
                <PolarAngleAxis dataKey="subject" stroke="#6B7280" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#6B7280" />
                <Radar
                  name="Current Team"
                  dataKey="A"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.3}
                />
                <Radar
                  name="Target"
                  dataKey="B"
                  stroke="#8B5CF6"
                  fill="#8B5CF6"
                  fillOpacity={0.3}
                />
                <Legend />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TeamAnalytics;