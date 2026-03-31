import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { getMonthName } from '../../utils/formatters';
import './Charts.css';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{getMonthName(label)}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }} className="chart-tooltip-value">
          {p.name}: ${p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

const renderLegend = ({ payload }) => (
  <div className="chart-legend">
    {payload.map((entry) => (
      <div key={entry.dataKey} className="chart-legend-item">
        <span className="chart-legend-dot" style={{ background: entry.color }} />
        <span className="chart-legend-label">{entry.value}</span>
      </div>
    ))}
  </div>
);

const IncomeExpenseChart = ({ data }) => {
  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <h3 className="chart-card-title">Income vs Expenses</h3>
        <p className="chart-card-subtitle">Monthly overview for this year</p>
      </div>
      <div className="chart-body">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#34d399" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#f87171" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#f87171" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="0" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="month"
              tickFormatter={getMonthName}
              tick={{ fontSize: 11, fill: '#3d5272' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#3d5272' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v}`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.06)', strokeWidth: 1 }} />
            <Legend content={renderLegend} />
            <Area
              type="monotone"
              dataKey="income"
              name="Income"
              stroke="#34d399"
              strokeWidth={2}
              fill="url(#colorIncome)"
              dot={false}
              activeDot={{ r: 5, fill: '#34d399', strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="expense"
              name="Expenses"
              stroke="#f87171"
              strokeWidth={2}
              fill="url(#colorExpense)"
              dot={false}
              activeDot={{ r: 5, fill: '#f87171', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IncomeExpenseChart;
