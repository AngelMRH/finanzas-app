'use client'

import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { useState } from 'react'
import { Transaction } from '@/lib/types'

interface TransactionsTableProps {
  transactions: Transaction[]
  onEdit: (transaction: Transaction) => void
  onDelete: (id: string) => void
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount)
}

export function TransactionsTable({ transactions, onEdit, onDelete }: TransactionsTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function confirmDelete() {
    if (!deleteId) return
    setDeleting(true)
    const res = await fetch(`/api/transactions/${deleteId}`, { method: 'DELETE' })
    if (res.ok) {
      onDelete(deleteId)
    }
    setDeleting(false)
    setDeleteId(null)
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        <svg
          className="w-12 h-12 mx-auto mb-3 opacity-40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <p>Sin transacciones. ¡Agrega la primera!</p>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="overflow-x-auto rounded-lg border border-slate-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-800 border-b border-slate-700">
              <th className="text-left px-4 py-3 text-slate-400 font-medium">Fecha</th>
              <th className="text-left px-4 py-3 text-slate-400 font-medium">Descripción</th>
              <th className="text-left px-4 py-3 text-slate-400 font-medium">Categoría</th>
              <th className="text-right px-4 py-3 text-slate-400 font-medium">Monto</th>
              <th className="text-center px-4 py-3 text-slate-400 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, i) => (
              <tr
                key={t.id}
                className={`border-b border-slate-700/50 hover:bg-slate-800/50 transition-colors ${
                  i % 2 === 0 ? 'bg-slate-900' : 'bg-slate-900/50'
                }`}
              >
                <td className="px-4 py-3 text-slate-300 whitespace-nowrap">
                  {format(new Date(t.date), 'dd MMM yyyy', { locale: es })}
                </td>
                <td className="px-4 py-3 text-white">
                  <div className="flex items-center gap-2">
                    <span>{t.description}</span>
                    {t.justification && (
                      <Tooltip>
                        <TooltipTrigger
                          className="text-yellow-400 hover:text-yellow-300"
                          aria-label="Ver justificación"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </TooltipTrigger>
                        <TooltipContent className="bg-slate-800 border border-slate-700 text-white max-w-xs p-2">
                          <p className="text-xs font-semibold text-yellow-400 mb-1">
                            Justificación:
                          </p>
                          <p className="text-sm">{t.justification}</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge
                    variant="outline"
                    className={`border-slate-600 text-xs ${
                      t.category.type === 'income'
                        ? 'text-emerald-400 border-emerald-700'
                        : 'text-red-400 border-red-700'
                    }`}
                  >
                    {t.category.name}
                  </Badge>
                </td>
                <td
                  className={`px-4 py-3 text-right font-semibold whitespace-nowrap ${
                    t.category.type === 'income' ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {t.category.type === 'income' ? '+' : '-'}
                  {formatCurrency(t.amount)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEdit(t)}
                      className="p-1 text-slate-400 hover:text-white transition-colors"
                      aria-label="Editar"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => setDeleteId(t.id)}
                      className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                      aria-label="Eliminar"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Diálogo de confirmación de eliminación */}
      {/* base-ui Dialog: onOpenChange recibe (open, eventDetails) */}
      <Dialog open={!!deleteId} onOpenChange={(open) => { if (!open) setDeleteId(null) }}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>¿Eliminar transacción?</DialogTitle>
          </DialogHeader>
          <p className="text-slate-400 text-sm">Esta acción no se puede deshacer.</p>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmDelete}
              disabled={deleting}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {deleting ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}
