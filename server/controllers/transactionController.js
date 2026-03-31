const { validationResult } = require('express-validator');
const Transaction = require('../models/Transaction');
const { asyncHandler, createError } = require('../middleware/errorMiddleware');

const getTransactions = asyncHandler(async (req, res) => {
  const { type, category, startDate, endDate, search, page = 1, limit = 20 } = req.query;

  const filter = { user: req.user._id };

  if (type && ['income', 'expense'].includes(type)) {
    filter.type = type;
  }

  if (category) {
    filter.category = category;
  }

  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate)   filter.date.$lte = new Date(endDate);
  }

  if (search) {
    filter.title = { $regex: search, $options: 'i' };
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Transaction.countDocuments(filter);

  const transactions = await Transaction.find(filter)
    .sort({ date: -1, createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  res.json({
    success: true,
    data: transactions,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      limit: Number(limit),
    },
  });
});

const getTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!transaction) {
    throw createError('Transaction not found', 404);
  }

  res.json({ success: true, data: transaction });
});

const createTransaction = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }

  const { title, amount, type, category, date, description } = req.body;

  const transaction = await Transaction.create({
    user: req.user._id,
    title,
    amount,
    type,
    category,
    date,
    description,
  });

  res.status(201).json({
    success: true,
    message: 'Transaction added successfully',
    data: transaction,
  });
});

const updateTransaction = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }

  let transaction = await Transaction.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!transaction) {
    throw createError('Transaction not found', 404);
  }

  const { title, amount, type, category, date, description } = req.body;

  transaction = await Transaction.findByIdAndUpdate(
    req.params.id,
    { title, amount, type, category, date, description },
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    message: 'Transaction updated successfully',
    data: transaction,
  });
});

const deleteTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!transaction) {
    throw createError('Transaction not found', 404);
  }

  await transaction.deleteOne();

  res.json({
    success: true,
    message: 'Transaction deleted successfully',
    data: { _id: req.params.id },
  });
});

module.exports = {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
