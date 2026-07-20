interface StatsCardsProps {
  balance: number
  monthlyIncome: number
  monthlyExpenses: number
}

function fmt(n: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n)
}

function SavingsRing({ rate, isPositive }: { rate: number; isPositive: boolean }) {
  const r = 28
  const circ = 2 * Math.PI * r
  const clamped = Math.min(100, Math.max(0, Math.abs(rate)))
  const offset = circ - (clamped / 100) * circ
  const color = isPositive ? 'rgb(var(--income))' : 'rgb(var(--expense))'

  return (
    <div className="relative flex items-center justify-center" style={{ width: 80, height: 80 }}>
      <svg width="80" height="80" style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
        <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(var(--glass-border))" strokeWidth="5" />
        <circle
          cx="40" cy="40" r={r} fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={`${circ} ${circ}`}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.9s cubic-bezier(0.34,1.56,0.64,1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-[15px] font-bold leading-none" style={{ color }}>{clamped}%</p>
        <p className="text-[9px] font-semibold mt-0.5 uppercase tracking-wide" style={{ color: 'rgb(var(--text-2))' }}>
          ahorro
        </p>
      </div>
    </div>
  )
}

export function StatsCards({ balance, monthlyIncome, monthlyExpenses }: StatsCardsProps) {
  const isPositive = balance >= 0
  const savingsRate = monthlyIncome > 0
    ? Math.max(0, Math.min(100, Math.round((balance / monthlyIncome) * 100)))
    : 0

  return (
    <div className="space-y-3">

      {/* ── Hero balance card ── */}
      <div className="glass rounded-3xl p-6 fade-up fade-up-1 relative overflow-hidden">
        {/* Background orb */}
        <div
          className="absolute -top-16 -right-16 w-60 h-60 rounded-full pointer-events-none"
          style={{
            background: isPositive
              ? 'radial-gradient(circle, rgba(var(--income),0.10) 0%, transparent 65%)'
              : 'radial-gradient(circle, rgba(var(--expense),0.10) 0%, transparent 65%)',
          }}
        />
        <div
          className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full pointer-events-none"
          style={{
            background: isPositive
              ? 'radial-gradient(circle, rgba(var(--income),0.05) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(var(--expense),0.05) 0%, transparent 70%)',
          }}
        />

        <div className="relative">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-5"
            style={{ color: 'rgb(var(--text-2))' }}>
            Balance del mes
          </p>

          {/* Balance + ring side by side */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className={`stat-number text-[3.2rem] leading-none mb-2 ${isPositive ? 'text-income' : 'text-expense'}`}>
                {fmt(balance)}
              </p>
              {/* Status chip */}
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                style={{
                  background: isPositive ? 'rgba(var(--income),0.12)' : 'rgba(var(--expense),0.12)',
                  color: isPositive ? 'rgb(var(--income))' : 'rgb(var(--expense))',
                }}
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d={isPositive ? 'M5 10l7-7m0 0l7 7m-7-7v18' : 'M19 14l-7 7m0 0l-7-7m7 7V3'} />
                </svg>
                {isPositive ? 'Superávit' : 'Déficit'}
              </div>
            </div>

            {/* Circular savings ring */}
            {monthlyIncome > 0 && (
              <SavingsRing rate={savingsRate} isPositive={isPositive} />
            )}
          </div>
        </div>
      </div>

      {/* ── Income + Expense cards ── */}
      <div className="grid grid-cols-2 gap-3">
        {/* Income */}
        <div className="glass rounded-3xl p-4 fade-up fade-up-2 relative overflow-hidden card-lift">
          <div
            className="absolute -bottom-8 -right-8 w-28 h-28 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(var(--income),0.10) 0%, transparent 70%)' }}
          />
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center mb-3"
            style={{ background: 'rgba(var(--income),0.12)' }}
          >
            <svg className="w-5 h-5 text-income" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'rgb(var(--text-2))' }}>
            Ingresos
          </p>
          <p className="stat-number text-[1.35rem] text-income">{fmt(monthlyIncome)}</p>
        </div>

        {/* Expense */}
        <div className="glass rounded-3xl p-4 fade-up fade-up-3 relative overflow-hidden card-lift">
          <div
            className="absolute -bottom-8 -right-8 w-28 h-28 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(var(--expense),0.10) 0%, transparent 70%)' }}
          />
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center mb-3"
            style={{ background: 'rgba(var(--expense),0.12)' }}
          >
            <svg className="w-5 h-5 text-expense" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'rgb(var(--text-2))' }}>
            Gastos
          </p>
          <p className="stat-number text-[1.35rem] text-expense">{fmt(monthlyExpenses)}</p>
        </div>
      </div>
    </div>
  )
}
