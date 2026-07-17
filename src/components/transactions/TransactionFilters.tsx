'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
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
    <div className="flex flex-wrap items-center gap-3">
      {/* base-ui Select: onValueChange recibe (value, eventDetails) */}
      <Select
        value={selectedMonth}
        onValueChange={(val) => onMonthChange(val as string)}
      >
        <SelectTrigger className="w-48 bg-slate-800 border-slate-700 text-white">
          <SelectValue placeholder="Filtrar por mes" />
        </SelectTrigger>
        <SelectContent className="bg-slate-800 border-slate-700">
          <SelectItem value="all" className="text-white">
            Todos los meses
          </SelectItem>
          {monthOptions.map(opt => (
            <SelectItem key={opt.value} value={opt.value} className="text-white">
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedCategory}
        onValueChange={(val) => onCategoryChange(val as string)}
      >
        <SelectTrigger className="w-48 bg-slate-800 border-slate-700 text-white">
          <SelectValue placeholder="Categoría" />
        </SelectTrigger>
        <SelectContent className="bg-slate-800 border-slate-700">
          <SelectItem value="all" className="text-white">
            Todas las categorías
          </SelectItem>
          {categories.map(c => (
            <SelectItem key={c.id} value={c.id} className="text-white">
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        onClick={onExportCSV}
        disabled={transactionCount === 0}
        className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
      >
        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        Exportar CSV ({transactionCount})
      </Button>
    </div>
  )
}
