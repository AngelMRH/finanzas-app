'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Category } from '@/lib/types'

interface TransactionFiltersProps {
  categories: Category[]
  selectedMonth: string
  selectedCategory: string
  onMonthChange: (month: string) => void
  onCategoryChange: (categoryId: string) => void
  onExportCSV: () => void
  transactionCount: number
}

function getMonthOptions() {
  const options: { value: string; label: string }[] = []
  const now = new Date()
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const label = d.toLocaleString('es-MX', { month: 'long', year: 'numeric' })
    options.push({ value, label: label.charAt(0).toUpperCase() + label.slice(1) })
  }
  return options
}

export function TransactionFilters({
  categories,
  selectedMonth,
  selectedCategory,
  onMonthChange,
  onCategoryChange,
  onExportCSV,
  transactionCount,
}: TransactionFiltersProps) {
  const monthOptions = getMonthOptions()

  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3">
      <Select value={selectedMonth} onValueChange={val => onMonthChange(val as string)}>
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder="Filtrar por mes" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los meses</SelectItem>
          {monthOptions.map(opt => (
            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedCategory} onValueChange={val => onCategoryChange(val as string)}>
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder="Categoría" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas las categorías</SelectItem>
          {categories.map(c => (
            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <button
        onClick={onExportCSV}
        disabled={transactionCount === 0}
        className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium border transition-all hover:bg-[rgba(var(--glass-border))] disabled:opacity-40 disabled:cursor-not-allowed"
        style={{borderColor:'rgba(var(--glass-border))',color:'rgb(var(--text-2))'}}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        <span>CSV</span>
        {transactionCount > 0 && (
          <span className="text-xs px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-semibold">
            {transactionCount}
          </span>
        )}
      </button>
    </div>
  )
}
