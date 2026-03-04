/**
 * Task Controller
 * Handles all task-related operations
 */

const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const taskData = {
      title: req.body.title,
      description: req.body.description || '',
      status: req.body.status || 'pending',
      priority: req.body.priority || 'medium',
      due_date: req.body.due_date || null,
      project_id: req.body.project_id || null
    };

    // Verify project exists if project_id is provided
    if (taskData.project_id) {
      const project = await Project.findById(taskData.project_id, req.user.id);
      if (!project) {
        return res.status(400).json({
          success: false,
          error: 'Project not found'
        });
      }
    }

    const task = await Task.create(taskData, req.user.id);

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get all tasks for current user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const filters = {
      status: req.query.status || 'all',
      project_id: req.query.project_id || null,
      priority: req.query.priority || null,
      search: req.query.search || null
    };

    const tasks = await Task.findByUser(req.user.id, filters);

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id, req.user.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id, req.user.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    const updates = {
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      priority: req.body.priority,
      due_date: req.body.due_date,
      project_id: req.body.project_id
    };

    // Verify project exists if project_id is being updated
    if (updates.project_id && updates.project_id !== task.project_id) {
      const project = await Project.findById(updates.project_id, req.user.id);
      if (!project) {
        return res.status(400).json({
          success: false,
          error: 'Project not found'
        });
      }
    }

    const updatedTask = await Task.update(req.params.id, updates, req.user.id);

    res.status(200).json({
      success: true,
      data: updatedTask
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id, req.user.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    await Task.delete(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Toggle task completion
// @route   PATCH /api/tasks/:id/toggle
// @access  Private
const toggleTaskComplete = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id, req.user.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    const updatedTask = await Task.toggleComplete(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      data: updatedTask
    });
  } catch (error) {
    console.error('Toggle task error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get task statistics
// @route   GET /api/tasks/stats
// @access  Private
const getTaskStats = async (req, res) => {
  try {
    const stats = await Task.getStats(req.user.id);

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get task stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Bulk delete tasks
// @route   DELETE /api/tasks/bulk
// @access  Private
const bulkDeleteTasks = async (req, res) => {
  try {
    const { taskIds } = req.body;

    if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide an array of task IDs'
      });
    }

    const deleted = await Task.bulkDelete(taskIds, req.user.id);

    res.status(200).json({
      success: true,
      count: deleted.length,
      data: deleted
    });
  } catch (error) {
    console.error('Bulk delete error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  toggleTaskComplete,
  getTaskStats,
  bulkDeleteTasks
};