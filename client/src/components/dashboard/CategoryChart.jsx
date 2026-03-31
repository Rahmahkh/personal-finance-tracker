import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { CATEGORY_COLORS } from '../../utils/categories';
import { formatCurrency } from '../../utils/formatters';
import './Charts.css';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{name}</p>
      <p className="chart-tooltip-value">{formatCurrency(value)}</p>
    </div>
  );
};

const RADIAN = Math.PI / 180;
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.06) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="rgba(255,255,255,0.9)" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CategoryChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-card">
        <div className="chart-card-header">
          <h3 className="chart-card-title">Expenses by Category</h3>
        </div>
        <div className="chart-empty">No expense data yet</div>
      </div>
    );
  }

  const chartData = data.map((d) => ({
    name: d.category,
    value: d.total,
  }));

  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <h3 className="chart-card-title">Expenses by Category</h3>
        <p className="chart-card-subtitle">Where your money goes</p>
      </div>
      <div className="chart-body chart-body--donut">
        <div className="chart-donut-wrap">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={62}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                labelLine={false}
                label={renderCustomLabel}
                strokeWidth={0}
              >
                {chartData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={CATEGORY_COLORS[entry.name] || '#5b8ef7'}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="chart-donut-center">
            <p className="chart-donut-total">{formatCurrency(total)}</p>
            <p className="chart-donut-label">Total</p>
          </div>
        </div>

        <div className="chart-category-legend">
          {chartData.map((entry) => (
            <div key={entry.name} className="chart-category-item">
              <span
                className="chart-category-dot"
                style={{ background: CATEGORY_COLORS[entry.name] || '#5b8ef7' }}
              />
              <span className="chart-category-name">{entry.name}</span>
              <span className="chart-category-value">{formatCurrency(entry.value)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryChart;
