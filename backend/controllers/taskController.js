const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const { project, user } = req.query;
    
    // Build filter object based on query parameters
    let filter = {};
    if (project) filter.project = project;
    if (user) filter.assignedTo = user;

    // Role-based visibility logic
    if (req.user.role !== 'Admin') {
      // Members can only see tasks assigned to them
      filter.assignedTo = req.user._id;
    }

    const tasks = await Task.find(filter)
      .populate('project', 'title')
      .populate('assignedTo createdBy', 'name email');
      
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project', 'title')
      .populate('assignedTo createdBy', 'name email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Role-based access check
    if (
      req.user.role !== 'Admin' && 
      (!task.assignedTo || task.assignedTo._id.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({ message: 'Not authorized to view this task' });
    }

    res.status(200).json(task);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private/Admin
const createTask = async (req, res) => {
  try {
    const { title, description, project, assignedTo, dueDate, priority } = req.body;

    if (!title || !project) {
      return res.status(400).json({ message: 'Please provide task title and project ID' });
    }

    // Validate if project exists
    const projectExists = await Project.findById(project);
    if (!projectExists) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const task = new Task({
      title,
      description,
      project,
      assignedTo,
      dueDate,
      priority,
      createdBy: req.user._id,
    });

    const createdTask = await task.save();
    res.status(201).json(createdTask);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Update a task (Admin full update)
// @route   PUT /api/tasks/:id
// @access  Private/Admin
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('project assignedTo', 'title name');

    res.status(200).json(updatedTask);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Update task status (Member and Admin)
// @route   PATCH /api/tasks/:id/status
// @access  Private/Admin,Member
const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: 'Please provide a status' });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // If user is member, ensure they are assigned to this task
    if (
      req.user.role !== 'Admin' && 
      (!task.assignedTo || task.assignedTo.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({ message: 'Not authorized to update this task status' });
    }

    task.status = status;
    await task.save();

    res.status(200).json(task);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.deleteOne();
    res.status(200).json({ message: 'Task removed', id: req.params.id });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
