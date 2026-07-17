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

function SkeletonCard({ h = 'h-32' }: { h?: string }) {
  return <div className={`skeleton rounded-2xl ${h}`} />
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
  const month = now.toLocaleString('es-MX', { month: 'long', year: 'numeric' })

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto md:max-w-none">
      <div className="mb-6 fade-up">
        <h1 className="font-display font-bold text-2xl md:text-3xl" style={{color:'rgb(var(--text))'}}>
          Buen día 👋
        </h1>
        <p className="text-sm capitalize mt-0.5" style={{color:'rgb(var(--text-2))'}}>
          {month}
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          <SkeletonCard h="h-44" />
          <div className="grid grid-cols-2 gap-3">
            <SkeletonCard h="h-24" />
            <SkeletonCard h="h-24" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <SkeletonCard h="h-40" />
            <SkeletonCard h="h-40" />
          </div>
        </div>
      ) : !data ? (
        <div className="glass rounded-2xl p-8 text-center">
          <p style={{color:'rgb(var(--text-2))'}}>Error cargando datos</p>
        </div>
      ) : (
        <div className="space-y-3">
          <StatsCards balance={data.balance} monthlyIncome={data.monthlyIncome} monthlyExpenses={data.monthlyExpenses} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <ExpensePieChart topCategories={data.topCategories} />
            <RecentTransactions transactions={data.recentTransactions} />
          </div>
        </div>
      )}
    </div>
  )
}
