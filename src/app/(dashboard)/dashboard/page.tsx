'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
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

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Buenos días'
  if (h < 19) return 'Buenas tardes'
  return 'Buenas noches'
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
  const greeting = getGreeting()

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto md:max-w-none">

      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-6 fade-up">
        <div>
          <p className="text-sm font-semibold mb-0.5" style={{ color: 'rgb(var(--text-2))' }}>
            {greeting}
          </p>
          <h1
            className="font-bold text-[1.9rem] md:text-[2.4rem] capitalize leading-none"
            style={{ color: 'rgb(var(--text))', letterSpacing: '-0.03em' }}
          >
            {monthLabel}
          </h1>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-2 mt-1">
          <Link
            href="/transactions"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all active:scale-[0.96]"
            style={{
              background: 'rgba(var(--income),0.12)',
              color: 'rgb(var(--income))',
            }}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Nueva</span>
          </Link>
          <Link
            href="/calendar"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all active:scale-[0.96]"
            style={{
              background: 'rgba(var(--glass-border))',
              color: 'rgb(var(--text-2))',
            }}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="hidden sm:inline">Calendario</span>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          <div className="skeleton rounded-3xl h-52" />
          <div className="grid grid-cols-2 gap-3">
            <div className="skeleton rounded-3xl h-32" />
            <div className="skeleton rounded-3xl h-32" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="skeleton rounded-3xl h-52" />
            <div className="skeleton rounded-3xl h-52" />
          </div>
        </div>
      ) : !data ? (
        <div className="glass rounded-3xl p-12 text-center">
          <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: 'rgba(var(--danger-dim))' }}>
            <svg className="w-7 h-7 text-expense" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <p className="font-semibold mb-1" style={{ color: 'rgb(var(--text))' }}>Error cargando datos</p>
          <p className="text-sm" style={{ color: 'rgb(var(--text-2))' }}>Recarga la página para intentarlo de nuevo</p>
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
