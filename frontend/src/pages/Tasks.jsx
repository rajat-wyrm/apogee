/**
 * Tasks Page
 * Complete task management with filters and bulk actions
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { taskAPI, projectAPI } from '../services/api';
import TaskItem from '../components/TaskItem';
import TaskForm from '../components/TaskForm';
import { 
  HiOutlinePlus, 
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineSortAscending,
  HiOutlineViewGrid,
  HiOutlineViewList,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineExclamationCircle,
  HiOutlineTrash
} from 'react-icons/hi';
import toast from 'react-hot-toast';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState(new Set());
  const [bulkMode, setBulkMode] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    project: 'all',
  });

  // Sort
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tasksRes, projectsRes] = await Promise.all([
        taskAPI.getAll(),
        projectAPI.getAll()
      ]);
      setTasks(tasksRes.data.data || []);
      setProjects(projectsRes.data.data || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateTask = async (taskData) => {
    try {
      const response = await taskAPI.create(taskData);
      setTasks([response.data.data, ...tasks]);
      toast.success('Task created successfully! 🎉');
      setModalOpen(false);
    } catch (error) {
      toast.error(error.message || 'Failed to create task');
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      const response = await taskAPI.update(selectedTask.id, taskData);
      setTasks(tasks.map(t => t.id === selectedTask.id ? response.data.data : t));
      toast.success('Task updated successfully! ✨');
      setModalOpen(false);
      setSelectedTask(null);
    } catch (error) {
      toast.error(error.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await taskAPI.delete(id);
      setTasks(tasks.filter(t => t.id !== id));
      toast.success('Task deleted successfully! 🗑️');
    } catch (error) {
      toast.error(error.message || 'Failed to delete task');
    }
  };

  const handleToggleTask = async (id) => {
    try {
      const response = await taskAPI.toggleComplete(id);
      setTasks(tasks.map(t => t.id === id ? response.data.data : t));
    } catch (error) {
      toast.error(error.message || 'Failed to toggle task');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedTasks.size === 0) return;
    
    if (!window.confirm(`Delete ${selectedTasks.size} selected tasks?`)) return;
    
    try {
      await taskAPI.bulkDelete(Array.from(selectedTasks));
      setTasks(tasks.filter(t => !selectedTasks.has(t.id)));
      setSelectedTasks(new Set());
      setBulkMode(false);
      toast.success(`${selectedTasks.size} tasks deleted successfully! 🗑️`);
    } catch (error) {
      toast.error(error.message || 'Failed to delete tasks');
    }
  };

  const handleBulkComplete = async () => {
    if (selectedTasks.size === 0) return;
    
    try {
      await Promise.all(
        Array.from(selectedTasks).map(id => taskAPI.toggleComplete(id))
      );
      await fetchData(); // Refresh to get updated tasks
      setSelectedTasks(new Set());
      setBulkMode(false);
      toast.success(`${selectedTasks.size} tasks completed! ✅`);
    } catch (error) {
      toast.error(error.message || 'Failed to complete tasks');
    }
  };

  const handleSelectAll = () => {
    if (selectedTasks.size === filteredTasks.length) {
      setSelectedTasks(new Set());
    } else {
      setSelectedTasks(new Set(filteredTasks.map(t => t.id)));
    }
  };

  // Filter and sort tasks
  const filteredTasks = tasks
    .filter(task => {
      // Search filter
      if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !task.description?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Status filter
      if (filters.status !== 'all' && task.status !== filters.status) {
        return false;
      }
      
      // Priority filter
      if (filters.priority !== 'all' && task.priority !== filters.priority) {
        return false;
      }
      
      // Project filter
      if (filters.project !== 'all' && task.project_id !== filters.project) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (sortBy === 'priority') {
        const priorityWeight = { critical: 4, high: 3, medium: 2, low: 1 };
        comparison = (priorityWeight[a.priority] || 0) - (priorityWeight[b.priority] || 0);
      } else if (sortBy === 'due_date') {
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        comparison = new Date(a.due_date) - new Date(b.due_date);
      } else if (sortBy === 'status') {
        comparison = (a.status || '').localeCompare(b.status || '');
      } else {
        comparison = new Date(a.created_at || 0) - new Date(b.created_at || 0);
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    overdue: tasks.filter(t => 
      t.due_date && t.status !== 'completed' && new Date(t.due_date) < new Date()
    ).length,
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Tasks
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Manage and track your daily tasks
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setModalOpen(true)}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
          >
            <HiOutlinePlus className="w-5 h-5" />
            <span>New Task</span>
          </motion.button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">In Progress</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
            <p className="text-2xl font-bold text-gray-600 dark:text-gray-300">{stats.pending}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Overdue</p>
            <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
          </div>
        </motion.div>

        {/* Filters and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 mb-8"
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
            {/* Search */}
            <div className="flex-1 relative w-full">
              <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <HiOutlineFilter className="w-5 h-5 text-gray-400" />
              
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              <select
                value={filters.priority}
                onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>

              <select
                value={filters.project}
                onChange={(e) => setFilters({ ...filters, project: e.target.value })}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
              >
                <option value="all">All Projects</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <HiOutlineSortAscending className="w-5 h-5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
              >
                <option value="created_at">Date Created</option>
                <option value="title">Title</option>
                <option value="priority">Priority</option>
                <option value="due_date">Due Date</option>
                <option value="status">Status</option>
              </select>
              
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>

            {/* View Toggle */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <HiOutlineViewGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <HiOutlineViewList className="w-5 h-5" />
              </button>
            </div>

            {/* Bulk Actions Toggle */}
            <button
              onClick={() => setBulkMode(!bulkMode)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                bulkMode
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {bulkMode ? 'Exit Bulk Mode' : 'Bulk Actions'}
            </button>
          </div>

          {/* Bulk Actions Bar */}
          {bulkMode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleSelectAll}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <HiOutlineCheckCircle className="w-5 h-5" />
                    <span>{selectedTasks.size === filteredTasks.length ? 'Deselect All' : 'Select All'}</span>
                  </button>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedTasks.size} tasks selected
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleBulkComplete}
                    disabled={selectedTasks.size === 0}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <HiOutlineCheckCircle className="w-5 h-5" />
                    <span>Complete</span>
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    disabled={selectedTasks.size === 0}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <HiOutlineTrash className="w-5 h-5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Tasks Grid/List */}
        {loading ? (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
          }>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredTasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <HiOutlineSearch className="w-12 h-12 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No tasks found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {searchTerm || filters.status !== 'all' || filters.priority !== 'all' || filters.project !== 'all'
                ? 'Try adjusting your filters'
                : 'Create your first task to get started'}
            </p>
            {!searchTerm && filters.status === 'all' && filters.priority === 'all' && filters.project === 'all' && (
              <button
                onClick={() => setModalOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Create Task
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-3'
            }
          >
            <AnimatePresence>
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => bulkMode && setSelectedTasks(prev => {
                    const newSet = new Set(prev);
                    if (newSet.has(task.id)) {
                      newSet.delete(task.id);
                    } else {
                      newSet.add(task.id);
                    }
                    return newSet;
                  })}
                  className={bulkMode ? 'cursor-pointer' : ''}
                >
                  {bulkMode && (
                    <div className={`absolute top-2 right-2 w-6 h-6 rounded-lg border-2 ${
                      selectedTasks.has(task.id)
                        ? 'bg-purple-600 border-purple-600 text-white'
                        : 'border-gray-300 dark:border-gray-600'
                    } flex items-center justify-center`}>
                      {selectedTasks.has(task.id) && <HiOutlineCheckCircle className="w-4 h-4" />}
                    </div>
                  )}
                  <TaskItem
                    task={task}
                    onToggle={handleToggleTask}
                    onEdit={(task) => {
                      setSelectedTask(task);
                      setModalOpen(true);
                    }}
                    onDelete={handleDeleteTask}
                    viewMode={viewMode}
                  />
                </div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Task Form Modal */}
        <TaskForm
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedTask(null);
          }}
          onSubmit={selectedTask ? handleUpdateTask : handleCreateTask}
          task={selectedTask}
          projects={projects}
        />
      </div>
    </div>
  );
};

export default Tasks;