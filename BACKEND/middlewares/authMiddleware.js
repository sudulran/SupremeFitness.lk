const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // Make sure this path is correct

module.exports = async function (req, res, next) {
  const authHeader = req.header('Authorization');
  if (!authHeader) return res.status(401).json({ message: 'No token, access denied' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token, access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from DB
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(401).json({ message: 'User not found' });

    // Attach user info to req
    req.user = {
      _id: user._id,
      role: user.role,       // <-- role added for isAdmin check
      username: user.username,
      email: user.email,
    };

    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
