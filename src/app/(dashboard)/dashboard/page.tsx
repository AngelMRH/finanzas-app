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
    id: string
    amount: number
    description: string
    date: string
    category: { name: string; type: string }
  }>
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard')
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  const now = new Date()
  const monthName = now.toLocaleString('es-MX', { month: 'long', year: 'numeric' })

  if (loading) {
    return (
      <div className="p-6">
        <div className="h-8 bg-slate-700 rounded w-48 mb-6 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-28 bg-slate-800 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="p-6">
        <p className="text-red-400">Error cargando el dashboard</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 text-sm capitalize mt-1">{monthName}</p>
      </div>

      <StatsCards
        balance={data.balance}
        monthlyIncome={data.monthlyIncome}
        monthlyExpenses={data.monthlyExpenses}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ExpensePieChart topCategories={data.topCategories} />
        <RecentTransactions transactions={data.recentTransactions} />
      </div>
    </div>
  )
}
