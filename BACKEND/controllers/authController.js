const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.register = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      age,
      gender,
      weight,
      height,
      fitnessLevel,
      activityLevel,
    } = req.body;

    if (!age || !gender) {
      return res.status(400).json({ 
        success: false,
        message: 'Age and gender are required' 
      });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ 
        success: false,
        message: 'Email already exists' 
      });
    }

    user = new User({
      username,
      email,
      password,
      age: Number(age),
      gender,
      weight: weight !== undefined ? Number(weight) : undefined,
      height: height !== undefined ? Number(height) : undefined,
      fitnessLevel,
      activityLevel,
    });
    await user.save();

    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.username,
        email: user.email,
        role: user.role,
        age: user.age,
        gender: user.gender,
        fitnessLevel: user.fitnessLevel,
        activityLevel: user.activityLevel,
        weight: user.weight,
        height: user.height,
      },
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    const token = generateToken(user._id);
    res.json({ 
      success: true,
      token, 
      user: { 
        id: user._id, 
        name: user.username, 
        email: user.email, 
        role: user.role 
      } 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

exports.getAllUserCount = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    res.status(200).json({ 
      success: true,
      userCount 
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ 
    success: true,
    message: 'Successfully logged out' 
  });
};

exports.getUsers = async (req, res) => {
  try {
    const requestingUser = await User.findById(req.user?._id).select('role');

    if (!requestingUser || requestingUser.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized' 
      });
    }

    const users = await User.find({ role: { $ne: 'admin' } })
      .select('username email role age gender fitnessLevel activityLevel weight height');

    res.status(200).json({ 
      success: true,
      users 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message || 'Failed to fetch users' 
    });
  }
};


/*
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'Email already exists' });

    user = new User({ username, email, password });
    await user.save();

    const token = generateToken(user._id);
    res.json({ token, user: { id: user._id, name: user.username, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id);
    res.json({ token, user: { id: user._id, name: user.username, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get User Count
exports.getAllUserCount = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    res.status(200).json({ userCount })
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message })
  }
}

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Successfully logged out' });
};
*/