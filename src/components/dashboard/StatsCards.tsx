interface StatsCardsProps {
  balance: number
  monthlyIncome: number
  monthlyExpenses: number
  monthlyBudget?: number | null
}

function fmt(n: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n)
}

function fmtFull(n: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n)
}

export function StatsCards({ balance, monthlyIncome, monthlyExpenses, monthlyBudget }: StatsCardsProps) {
  const isPositive = balance >= 0
  const savingsRate = monthlyIncome > 0 ? Math.max(0, Math.min(100, Math.round((balance / monthlyIncome) * 100))) : 0
  const budgetUsed = monthlyBudget && monthlyBudget > 0 ? monthlyExpenses : null
  const budgetPct = budgetUsed !== null && monthlyBudget ? Math.min(100, (budgetUsed / monthlyBudget) * 100) : null
  const budgetRemaining = monthlyBudget ? monthlyBudget - monthlyExpenses : null
  const budgetColor = budgetPct !== null ? (budgetPct < 70 ? 'rgb(var(--income))' : budgetPct < 90 ? 'rgb(var(--apple-blue))' : 'rgb(var(--expense))') : ''

  return (
    <div className="space-y-3">
      {/* Hero balance card */}
      <div
        className="glass rounded-3xl p-6 fade-up fade-up-1 relative overflow-hidden"
      >
        {/* Subtle tinted background orb */}
        <div
          className="absolute -top-12 -right-12 w-48 h-48 rounded-full pointer-events-none"
          style={{
            background: isPositive
              ? 'radial-gradient(circle, rgba(var(--income),0.12) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(var(--expense),0.12) 0%, transparent 70%)',
          }}
        />

        <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: 'rgb(var(--text-2))' }}>
          Balance del mes
        </p>

        <p
          className={`stat-number text-5xl md:text-6xl mb-5 ${isPositive ? 'text-income' : 'text-expense'}`}
        >
          {fmt(balance)}
        </p>

        {/* Savings rate bar */}
        {monthlyIncome > 0 && (
          <div className="mb-5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs" style={{ color: 'rgb(var(--text-2))' }}>
                Tasa de ahorro
              </span>
              <span className="text-xs font-bold" style={{ color: isPositive ? 'rgb(var(--income))' : 'rgb(var(--expense))' }}>
                {savingsRate}%
              </span>
            </div>
            <div
              className="h-1.5 rounded-full overflow-hidden"
              style={{ background: 'rgba(var(--glass-border))' }}
            >
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${Math.abs(savingsRate)}%`,
                  background: isPositive ? 'rgb(var(--income))' : 'rgb(var(--expense))',
                }}
              />
            </div>
          </div>
        )}

        {/* Status chip */}
        <div className="flex items-center gap-2">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
            style={{
              background: isPositive ? 'rgba(var(--income),0.12)' : 'rgba(var(--expense),0.12)',
              color: isPositive ? 'rgb(var(--income))' : 'rgb(var(--expense))',
            }}
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d={isPositive ? 'M5 10l7-7m0 0l7 7m-7-7v18' : 'M19 14l-7 7m0 0l-7-7m7 7V3'} />
            </svg>
            {isPositive ? 'Superávit' : 'Déficit'}
          </div>
        </div>
      </div>

      {/* Income + Expense cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass rounded-3xl p-4 fade-up fade-up-2 relative overflow-hidden">
          <div
            className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(var(--income),0.10) 0%, transparent 70%)' }}
          />
          <div
            className="w-9 h-9 rounded-2xl flex items-center justify-center mb-3"
            style={{ background: 'rgba(var(--income),0.12)' }}
          >
            <svg className="w-4 h-4 text-income" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </div>
          <p className="text-xs font-medium mb-1" style={{ color: 'rgb(var(--text-2))' }}>Ingresos</p>
          <p className="stat-number text-xl text-income">{fmt(monthlyIncome)}</p>
        </div>

        <div className="glass rounded-3xl p-4 fade-up fade-up-3 relative overflow-hidden">
          <div
            className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(var(--expense),0.10) 0%, transparent 70%)' }}
          />
          <div
            className="w-9 h-9 rounded-2xl flex items-center justify-center mb-3"
            style={{ background: 'rgba(var(--expense),0.12)' }}
          >
            <svg className="w-4 h-4 text-expense" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
          <p className="text-xs font-medium mb-1" style={{ color: 'rgb(var(--text-2))' }}>Gastos</p>
          <p className="stat-number text-xl text-expense">{fmt(monthlyExpenses)}</p>
        </div>
      </div>

      {/* Budget card */}
      {monthlyBudget && budgetPct !== null && budgetRemaining !== null && (
        <div className="glass rounded-3xl p-5 fade-up fade-up-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: 'rgb(var(--text-2))' }}>
                Presupuesto del mes
              </p>
              <p className="text-sm font-semibold mt-0.5" style={{ color: 'rgb(var(--text))' }}>
                {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(monthlyBudget)} total
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-medium" style={{ color: 'rgb(var(--text-2))' }}>
                {budgetRemaining >= 0 ? 'Disponible' : 'Excedido'}
              </p>
              <p className="text-xl font-bold stat-number" style={{ color: budgetColor }}>
                {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(Math.abs(budgetRemaining))}
              </p>
            </div>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(var(--glass-border))' }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${budgetPct}%`, background: budgetColor }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[10px]" style={{ color: 'rgb(var(--text-2))' }}>
              Gastado: {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(monthlyExpenses)} ({budgetPct.toFixed(0)}%)
            </span>
            <span className="text-[10px]" style={{ color: budgetColor }}>
              {budgetRemaining >= 0 ? `Quedan ${budgetPct.toFixed(0) === '100' ? '0%' : (100 - budgetPct).toFixed(0) + '%'}` : 'Presupuesto excedido'}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
