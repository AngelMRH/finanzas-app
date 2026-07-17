import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface Transaction {
  id: string
  amount: number
  description: string
  date: string
  category: { name: string; type: string }
}

interface RecentTransactionsProps {
  transactions: Transaction[]
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount)
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white text-base">Transacciones Recientes</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-4">Sin transacciones recientes</p>
        ) : (
          <div className="space-y-3">
            {transactions.map(t => (
              <div
                key={t.id}
                className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{t.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                      {t.category.name}
                    </Badge>
                    <span className="text-xs text-slate-500">
                      {format(new Date(t.date), 'dd MMM', { locale: es })}
                    </span>
                  </div>
                </div>
                <span
                  className={`text-sm font-semibold ml-4 ${
                    t.category.type === 'income' ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {t.category.type === 'income' ? '+' : '-'}
                  {formatCurrency(t.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
