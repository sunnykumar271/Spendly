// src/components/charts/CategoryPieChart.jsx
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { CHART_COLORS } from '../../constants'

const CategoryPieChart = ({ report = [] }) => {
  const data = report
    .filter((r) => r.spent > 0)
    .map((r, i) => ({ name: r.category.name, value: r.spent, color: CHART_COLORS[i % CHART_COLORS.length] }))

  if (!data.length) return (
    <div className="h-40 flex items-center justify-center text-sm text-surface-400">No spending data</div>
  )

  return (
    <ResponsiveContainer width="100%" height={190}>
      <PieChart>
        <Pie data={data} cx="50%" cy="45%" innerRadius={48} outerRadius={72} paddingAngle={3} dataKey="value">
          {data.map((entry, i) => <Cell key={i} fill={entry.color} strokeWidth={0} />)}
        </Pie>
        <Tooltip formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, 'Spent']} />
        <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ fontSize: 11, color: '#64748B' }}>{v}</span>} />
      </PieChart>
    </ResponsiveContainer>
  )
}

export default CategoryPieChart
