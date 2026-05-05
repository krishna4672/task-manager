const User = require('../models/User');

// @desc    Get all users (for task assignment dropdowns)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

module.exports = { getUsers };
