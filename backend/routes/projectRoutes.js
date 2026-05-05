const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// All project routes require authentication
router.use(protect);

router.route('/')
  .get(getProjects) 
  .post(authorize('Admin'), createProject);

router.route('/:id')
  .get(getProjectById)
  .put(authorize('Admin'), updateProject)
  .delete(authorize('Admin'), deleteProject);

module.exports = router;
