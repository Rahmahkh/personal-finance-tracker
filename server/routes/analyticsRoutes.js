const express = require('express');
const router = express.Router();
const {
  getSummary,
  getMonthlyBreakdown,
  getCategoryBreakdown,
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/summary',    protect, getSummary);
router.get('/monthly',    protect, getMonthlyBreakdown);
router.get('/categories', protect, getCategoryBreakdown);

module.exports = router;
