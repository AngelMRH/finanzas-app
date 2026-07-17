interface StatsCardsProps {
  balance: number
  monthlyIncome: number
  monthlyExpenses: number
}

function fmt(n: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n)
}

export function StatsCards({ balance, monthlyIncome, monthlyExpenses }: StatsCardsProps) {
  const isPositive = balance >= 0
  const savingsRate = monthlyIncome > 0 ? Math.round((balance / monthlyIncome) * 100) : 0

  return (
    <div className="space-y-3">
      {/* Balance principal — card grande */}
      <div className="glass rounded-2xl p-6 fade-up fade-up-1">
        <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{color:'rgb(var(--text-2))'}}>
          Balance del mes
        </p>
        <p className={`stat-number text-5xl md:text-6xl mb-4 ${isPositive ? 'text-income' : 'text-expense'}`}>
          {fmt(balance)}
        </p>
        <div className="flex items-center gap-2">
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
            isPositive ? 'bg-income-dim text-income' : 'bg-expense-dim text-expense'
          }`}>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d={isPositive ? 'M5 10l7-7m0 0l7 7m-7-7v18' : 'M19 14l-7 7m0 0l-7-7m7 7V3'} />
            </svg>
            {isPositive ? 'Superávit' : 'Déficit'}
          </div>
          {monthlyIncome > 0 && (
            <span className="text-xs" style={{color:'rgb(var(--text-2))'}}>
              {savingsRate}% de tus ingresos
            </span>
          )}
        </div>
      </div>

      {/* Ingresos y Gastos — 2 cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass rounded-2xl p-4 fade-up fade-up-2">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium" style={{color:'rgb(var(--text-2))'}}>Ingresos</p>
            <div className="w-6 h-6 rounded-lg bg-income-dim flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-income" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </div>
          </div>
          <p className="stat-number text-2xl text-income">{fmt(monthlyIncome)}</p>
        </div>

        <div className="glass rounded-2xl p-4 fade-up fade-up-3">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium" style={{color:'rgb(var(--text-2))'}}>Gastos</p>
            <div className="w-6 h-6 rounded-lg bg-expense-dim flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-expense" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
          <p className="stat-number text-2xl text-expense">{fmt(monthlyExpenses)}</p>
        </div>
      </div>
    </div>
  )
}
