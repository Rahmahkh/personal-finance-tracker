const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');
const { ALL_CATEGORIES } = require('../models/Transaction');

const transactionValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('amount')
    .isFloat({ gt: 0 })
    .withMessage('Amount must be a positive number'),
  body('type')
    .isIn(['income', 'expense'])
    .withMessage('Type must be income or expense'),
  body('category')
    .isIn(ALL_CATEGORIES)
    .withMessage('Invalid category'),
  body('date').notEmpty().withMessage('Date is required'),
];

router.route('/')
  .get(protect, getTransactions)
  .post(protect, transactionValidation, createTransaction);

router.route('/:id')
  .get(protect, getTransaction)
  .put(protect, transactionValidation, updateTransaction)
  .delete(protect, deleteTransaction);

module.exports = router;
