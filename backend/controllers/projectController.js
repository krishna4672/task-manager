const Project = require('../models/Project');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'Admin') {
      // Admins see all projects
      projects = await Project.find().populate('createdBy teamMembers', 'name email');
    } else {
      // Members see only projects they are assigned to
      projects = await Project.find({ teamMembers: req.user._id }).populate('createdBy teamMembers', 'name email');
    }
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('createdBy teamMembers', 'name email');
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check permissions
    if (
      req.user.role !== 'Admin' && 
      !project.teamMembers.some(member => member._id.toString() === req.user._id.toString())
    ) {
      return res.status(403).json({ message: 'Not authorized to view this project' });
    }

    res.status(200).json(project);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Private/Admin
const createProject = async (req, res) => {
  try {
    const { title, description, teamMembers } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Please add a project title' });
    }

    const project = new Project({
      title,
      description,
      createdBy: req.user._id,
      teamMembers: teamMembers || [],
    });

    const createdProject = await project.save();
    res.status(201).json(createdProject);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private/Admin
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy teamMembers', 'name email');

    res.status(200).json(updatedProject);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await project.deleteOne();
    res.status(200).json({ message: 'Project removed', id: req.params.id });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
