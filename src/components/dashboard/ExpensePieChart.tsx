'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

interface ExpensePieChartProps {
  topCategories: Array<{ name: string; amount: number }>
}

const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ec4899', '#14b8a6']

function fmt(n: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n)
}

export function ExpensePieChart({ topCategories }: ExpensePieChartProps) {
  if (topCategories.length === 0) {
    return (
      <div className="glass rounded-2xl p-6 fade-up fade-up-3">
        <p className="text-sm font-semibold mb-4" style={{color:'rgb(var(--text))'}}>Top categorías</p>
        <div className="flex items-center justify-center h-32">
          <p className="text-sm" style={{color:'rgb(var(--text-2))'}}>Sin gastos este mes</p>
        </div>
      </div>
    )
  }

  const total = topCategories.reduce((s, c) => s + c.amount, 0)

  return (
    <div className="glass rounded-2xl p-6 fade-up fade-up-3">
      <p className="text-sm font-semibold mb-4" style={{color:'rgb(var(--text))'}}>Top categorías</p>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="w-32 h-32 sm:w-28 sm:h-28 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={topCategories} dataKey="amount" cx="50%" cy="50%"
                innerRadius={30} outerRadius={56} paddingAngle={3} strokeWidth={0}>
                {topCategories.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v) => [fmt(typeof v === 'number' ? v : Number(v)), '']}
                contentStyle={{
                  background: 'rgba(12,18,32,0.95)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: '#f8fafc',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-full flex-1 space-y-2 min-w-0">
          {topCategories.map((c, i) => (
            <div key={c.name} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
              <span className="text-xs truncate flex-1" style={{color:'rgb(var(--text-2))'}}>{c.name}</span>
              <span className="text-xs font-semibold stat-number shrink-0" style={{color:'rgb(var(--text))'}}>
                {Math.round((c.amount / total) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
