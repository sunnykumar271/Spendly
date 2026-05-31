// src/components/charts/ExpenseBarChart.jsx
import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { format, parseISO, startOfWeek, addDays } from 'date-fns'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="card px-3 py-2 text-sm shadow-soft">
      <p className="font-medium text-surface-700 dark:text-surface-200">{label}</p>
      <p className="text-primary-600 font-semibold">₹{payload[0]?.value?.toLocaleString('en-IN')}</p>
    </div>
  )
}

const ExpenseBarChart = ({ expenses = [] }) => {
  // Group expenses by day of week
  const data = useMemo(() => {
    const groups = {}
    expenses.forEach((e) => {
      try {
        const day = format(parseISO(e.date), 'EEE')
        groups[day] = (groups[day] || 0) + e.amount
      } catch {}
    })
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    return days.map((d) => ({ day: d, amount: Math.round(groups[d] || 0) }))
  }, [expenses])

  if (!expenses.length) return (
    <div className="h-40 flex items-center justify-center text-sm text-surface-400">No data yet</div>
  )

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} barSize={28}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.1)" vertical={false} />
        <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} width={45}
          tickFormatter={(v) => `₹${v >= 1000 ? (v/1000).toFixed(0)+'k' : v}`} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(37,99,235,0.05)', radius: 6 }} />
        <Bar dataKey="amount" fill="#2563EB" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default ExpenseBarChart
