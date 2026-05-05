const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// All task routes require authentication
router.use(protect);

router.route('/')
  .get(getTasks) 
  .post(authorize('Admin'), createTask);

router.route('/:id')
  .get(getTaskById)
  .put(authorize('Admin'), updateTask)
  .delete(authorize('Admin'), deleteTask);

// Specialized route for status updates
router.route('/:id/status')
  .patch(authorize('Admin', 'Member'), updateTaskStatus);

module.exports = router;
