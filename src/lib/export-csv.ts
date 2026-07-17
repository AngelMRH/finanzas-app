import Papa from 'papaparse'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Transaction } from '@/lib/types'

export function exportToCSV(transactions: Transaction[], month?: string) {
  const rows = transactions.map(t => ({
    Fecha: format(new Date(t.date), 'dd/MM/yyyy', { locale: es }),
    Descripción: t.description,
    Categoría: t.category.name,
    Tipo: t.category.type === 'income' ? 'Ingreso' : 'Gasto',
    'Monto (MXN)': t.amount.toFixed(2),
    Justificación: t.justification ?? '',
  }))

  const csv = Papa.unparse(rows, { delimiter: ',', header: true })
  const bom = '﻿'
  const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `finanzas${month ? `-${month}` : ''}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
