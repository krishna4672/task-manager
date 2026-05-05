const Project = require('../models/Project');
const Task = require('../models/Task');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    let projectFilter = {};
    let taskFilter = {};

    // Apply role-based filtering for statistics
    if (req.user.role !== 'Admin') {
      projectFilter.teamMembers = req.user._id;
      taskFilter.assignedTo = req.user._id;
    }

    // Execute all queries concurrently for performance
    const [
      totalProjects,
      totalTasks,
      pendingTasks,
      inProgressTasks,
      completedTasks,
      overdueTasks
    ] = await Promise.all([
      Project.countDocuments(projectFilter),
      Task.countDocuments(taskFilter),
      Task.countDocuments({ ...taskFilter, status: 'Pending' }),
      Task.countDocuments({ ...taskFilter, status: 'In Progress' }),
      Task.countDocuments({ ...taskFilter, status: 'Completed' }),
      Task.countDocuments({ 
        ...taskFilter, 
        status: { $ne: 'Completed' }, 
        dueDate: { $lt: new Date() } 
      })
    ]);

    res.status(200).json({
      totalProjects,
      totalTasks,
      pendingTasks,
      inProgressTasks,
      completedTasks,
      overdueTasks
    });

  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

module.exports = {
  getDashboardStats
};
