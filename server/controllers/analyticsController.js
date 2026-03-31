const Transaction = require('../models/Transaction');
const { asyncHandler } = require('../middleware/errorMiddleware');

const getSummary = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const totals = await Transaction.aggregate([
    { $match: { user: userId } },
    { $group: { _id: '$type', total: { $sum: '$amount' } } },
  ]);

  let totalIncome = 0;
  let totalExpense = 0;
  totals.forEach((t) => {
    if (t._id === 'income')  totalIncome  = t.total;
    if (t._id === 'expense') totalExpense = t.total;
  });

  const recentTransactions = await Transaction.find({ user: userId })
    .sort({ date: -1, createdAt: -1 })
    .limit(5);

  res.json({
    success: true,
    data: {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      recentTransactions,
    },
  });
});

const getMonthlyBreakdown = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const year = parseInt(req.query.year) || new Date().getFullYear();

  const monthly = await Transaction.aggregate([
    {
      $match: {
        user: userId,
        date: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { month: { $month: '$date' }, type: '$type' },
        total: { $sum: '$amount' },
      },
    },
    { $sort: { '_id.month': 1 } },
  ]);

  const months = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    income: 0,
    expense: 0,
  }));

  monthly.forEach(({ _id, total }) => {
    const idx = _id.month - 1;
    months[idx][_id.type] = total;
  });

  res.json({ success: true, data: months });
});

const getCategoryBreakdown = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { type = 'expense', startDate, endDate } = req.query;

  const match = { user: userId, type };
  if (startDate || endDate) {
    match.date = {};
    if (startDate) match.date.$gte = new Date(startDate);
    if (endDate)   match.date.$lte = new Date(endDate);
  }

  const breakdown = await Transaction.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { total: -1 } },
  ]);

  res.json({
    success: true,
    data: breakdown.map((b) => ({
      category: b._id,
      total: b.total,
      count: b.count,
    })),
  });
});

module.exports = { getSummary, getMonthlyBreakdown, getCategoryBreakdown };
