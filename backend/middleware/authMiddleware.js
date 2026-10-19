const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Please login to add products to your cart.',
    });
  }

  try {
    const token = authorization.slice('Bearer '.length).trim();
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Please login to add products to your cart.',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed.',
      });
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found. Please login again.',
      });
    }

    req.user = user;
    return next();
  } catch (error) {
    console.error('Authentication failed:', error);
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token failed.',
    });
  }
};

module.exports = { protect };
