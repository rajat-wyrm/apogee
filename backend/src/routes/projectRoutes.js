/**
 * Project Routes
 */

const express = require('express');
const router = express.Router();
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectStats
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');
const { validateProject, validateId } = require('../middleware/validation');

// All project routes are protected
router.use(protect);

// Stats route (specific first)
router.get('/stats', getProjectStats);

// CRUD routes
router.route('/')
  .get(getProjects)
  .post(validateProject, createProject);

router.route('/:id')
  .get(validateId, getProjectById)
  .put(validateId, validateProject, updateProject)
  .delete(validateId, deleteProject);

module.exports = router;