'use client'

import { useEffect, useState } from 'react'
import { StatsCards } from '@/components/dashboard/StatsCards'
import { ExpensePieChart } from '@/components/dashboard/ExpensePieChart'
import { RecentTransactions } from '@/components/dashboard/RecentTransactions'

interface DashboardData {
  balance: number
  monthlyIncome: number
  monthlyExpenses: number
  topCategories: Array<{ name: string; amount: number }>
  recentTransactions: Array<{
    id: string; amount: number; description: string; date: string
    category: { name: string; type: string }
  }>
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard')
      .then(r => r.json())
      .then(d => { if (!d.error) setData(d) })
      .finally(() => setLoading(false))
  }, [])

  const now = new Date()
  const monthLabel = now.toLocaleString('es-MX', { month: 'long', year: 'numeric' })

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto md:max-w-none">

      {/* Header */}
      <div className="mb-6 fade-up">
        <h1
          className="font-bold text-3xl md:text-4xl capitalize tracking-tight"
          style={{ color: 'rgb(var(--text))', letterSpacing: '-0.02em' }}
        >
          {monthLabel}
        </h1>
        <p className="text-sm mt-1 font-medium" style={{ color: 'rgb(var(--text-2))' }}>
          Resumen financiero
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {/* Balance skeleton */}
          <div className="skeleton rounded-3xl h-52" />
          {/* Income/expense skeleton */}
          <div className="grid grid-cols-2 gap-3">
            <div className="skeleton rounded-3xl h-28" />
            <div className="skeleton rounded-3xl h-28" />
          </div>
          {/* Chart + list skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="skeleton rounded-3xl h-48" />
            <div className="skeleton rounded-3xl h-48" />
          </div>
        </div>
      ) : !data ? (
        <div className="glass rounded-3xl p-10 text-center">
          <p className="font-medium" style={{ color: 'rgb(var(--text-2))' }}>
            Error cargando datos. Recarga la página.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <StatsCards
            balance={data.balance}
            monthlyIncome={data.monthlyIncome}
            monthlyExpenses={data.monthlyExpenses}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <ExpensePieChart topCategories={data.topCategories} />
            <RecentTransactions transactions={data.recentTransactions} />
          </div>
        </div>
      )}
    </div>
  )
}
