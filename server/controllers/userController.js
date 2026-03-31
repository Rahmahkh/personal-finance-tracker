const { validationResult } = require('express-validator');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { asyncHandler, createError } = require('../middleware/errorMiddleware');

const getProfile = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.user });
});

const updateProfile = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }

  const { name, email } = req.body;

  if (email && email !== req.user.email) {
    const taken = await User.findOne({ email });
    if (taken) {
      throw createError('Email is already in use by another account', 409);
    }
  }

  const updated = await User.findByIdAndUpdate(
    req.user._id,
    { name: name || req.user.name, email: email || req.user.email },
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: updated,
  });
});

const changePassword = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }

  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.matchPassword(currentPassword))) {
    throw createError('Current password is incorrect', 401);
  }

  user.password = newPassword;
  await user.save();

  res.json({ success: true, message: 'Password changed successfully' });
});

const deleteAccount = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  await Transaction.deleteMany({ user: userId });
  await User.findByIdAndDelete(userId);
  res.json({ success: true, message: 'Account deleted successfully' });
});

module.exports = { getProfile, updateProfile, changePassword, deleteAccount };
