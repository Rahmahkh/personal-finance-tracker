const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getProfile, updateProfile, changePassword, deleteAccount } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const updateProfileValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Please enter a valid email').normalizeEmail(),
];

const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
];

router.get('/profile',  protect,                              getProfile);
router.put('/profile',  protect, updateProfileValidation,    updateProfile);
router.put('/password', protect, changePasswordValidation,   changePassword);
router.delete('/account', protect, deleteAccount);

module.exports = router;
