import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface Transaction {
  id: string
  amount: number
  description: string
  date: string
  category: { name: string; type: string }
}

function fmt(n: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n)
}

export function RecentTransactions({ transactions }: { transactions: Transaction[] }) {
  if (transactions.length === 0) {
    return (
      <div className="glass rounded-2xl p-6 fade-up fade-up-4">
        <p className="text-sm font-semibold mb-4" style={{color:'rgb(var(--text))'}}>Recientes</p>
        <div className="flex flex-col items-center justify-center py-8 gap-2">
          <div className="w-10 h-10 rounded-xl glass flex items-center justify-center mb-1">
            <svg className="w-5 h-5" style={{color:'rgb(var(--text-2))'}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-sm" style={{color:'rgb(var(--text-2))'}}>Sin movimientos aún</p>
        </div>
      </div>
    )
  }

  return (
    <div className="glass rounded-2xl p-6 fade-up fade-up-4">
      <p className="text-sm font-semibold mb-4" style={{color:'rgb(var(--text))'}}>Recientes</p>
      <div className="space-y-1">
        {transactions.map((t, i) => (
          <div key={t.id} className="flex items-center gap-3 py-2.5 border-b border-[rgba(var(--glass-border))] last:border-0">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              t.category.type === 'income' ? 'bg-income-dim' : 'bg-expense-dim'
            }`}>
              <svg className={`w-4 h-4 ${t.category.type === 'income' ? 'text-income' : 'text-expense'}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d={t.category.type === 'income' ? 'M5 10l7-7m0 0l7 7m-7-7v18' : 'M19 14l-7 7m0 0l-7-7m7 7V3'} />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{color:'rgb(var(--text))'}}>{t.description}</p>
              <p className="text-xs truncate" style={{color:'rgb(var(--text-2))'}}>{t.category.name}</p>
            </div>
            <div className="text-right shrink-0">
              <p className={`text-sm font-semibold stat-number ${t.category.type === 'income' ? 'text-income' : 'text-expense'}`}>
                {t.category.type === 'income' ? '+' : '-'}{fmt(t.amount)}
              </p>
              <p className="text-xs" style={{color:'rgb(var(--text-2))'}}>
                {format(new Date(t.date), 'dd MMM', { locale: es })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
