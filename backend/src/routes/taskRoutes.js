/**
 * Task Routes
 */

const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  toggleTaskComplete,
  getTaskStats,
  bulkDeleteTasks
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { validateTask, validateId, validatePagination } = require('../middleware/validation');

// All task routes are protected
router.use(protect);

// Stats route (specific first)
router.get('/stats', getTaskStats);

// Bulk operations
router.delete('/bulk', bulkDeleteTasks);

// Toggle completion
router.patch('/:id/toggle', validateId, toggleTaskComplete);

// CRUD routes
router.route('/')
  .get(validatePagination, getTasks)
  .post(validateTask, createTask);

router.route('/:id')
  .get(validateId, getTaskById)
  .put(validateId, validateTask, updateTask)
  .delete(validateId, deleteTask);

module.exports = router;