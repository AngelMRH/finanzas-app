'use client'

import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { useState } from 'react'
import { Transaction } from '@/lib/types'

interface TransactionsTableProps {
  transactions: Transaction[]
  onEdit: (transaction: Transaction) => void
  onDelete: (id: string) => void
}

function fmt(n: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n)
}

export function TransactionsTable({ transactions, onEdit, onDelete }: TransactionsTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function confirmDelete() {
    if (!deleteId) return
    setDeleting(true)
    const res = await fetch(`/api/transactions/${deleteId}`, { method: 'DELETE' })
    if (res.ok) onDelete(deleteId)
    setDeleting(false)
    setDeleteId(null)
  }

  if (transactions.length === 0) {
    return (
      <div className="glass rounded-2xl flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="w-16 h-16 rounded-2xl mb-4 flex items-center justify-center" style={{background:'rgba(var(--glass-bg))'}}>
          <svg className="w-8 h-8 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{color:'rgb(var(--text-2))'}}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="text-sm font-medium" style={{color:'rgb(var(--text-2))'}}>Sin transacciones</p>
        <p className="text-xs mt-1 opacity-60" style={{color:'rgb(var(--text-2))'}}>Agrega tu primer movimiento</p>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="glass rounded-2xl overflow-hidden">
        {/* Header — solo visible en desktop */}
        <div className="hidden md:grid grid-cols-[1fr_2fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-[rgba(var(--glass-border))]">
          {['Fecha','Descripción','Categoría','Monto',''].map(h => (
            <span key={h} className="text-[11px] font-semibold uppercase tracking-widest" style={{color:'rgb(var(--text-2))'}}>
              {h}
            </span>
          ))}
        </div>

        <div className="divide-y divide-[rgba(var(--glass-border))]">
          {transactions.map(t => {
            const isIncome = t.category.type === 'income'
            return (
              <div
                key={t.id}
                className="flex md:grid md:grid-cols-[1fr_2fr_1fr_1fr_auto] md:gap-4 items-center px-5 py-3.5 hover:bg-[rgba(var(--glass-border))] transition-colors group"
              >
                {/* Icono + fecha (mobile: izquierda) */}
                <div className="flex items-center gap-3 min-w-0 flex-1 md:flex-none">
                  <div className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{background: isIncome ? 'rgba(var(--income),0.12)' : 'rgba(var(--expense),0.12)'}}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                      style={{color: isIncome ? 'rgb(var(--income))' : 'rgb(var(--expense))'}}>
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d={isIncome ? 'M5 10l7-7m0 0l7 7m-7-7v18' : 'M19 14l-7 7m0 0l-7-7m7 7V3'} />
                    </svg>
                  </div>
                  {/* Mobile: descripción + fecha apilados */}
                  <div className="md:hidden min-w-0">
                    <p className="text-sm font-medium truncate" style={{color:'rgb(var(--text))'}}>
                      {t.description}
                    </p>
                    <p className="text-xs mt-0.5" style={{color:'rgb(var(--text-2))'}}>
                      {t.category.name} · {format(new Date(t.date), 'd MMM', { locale: es })}
                    </p>
                  </div>
                  {/* Desktop: solo fecha */}
                  <span className="hidden md:block text-sm" style={{color:'rgb(var(--text-2))'}}>
                    {format(new Date(t.date), 'dd MMM yyyy', { locale: es })}
                  </span>
                </div>

                {/* Descripción — solo desktop */}
                <div className="hidden md:flex items-center gap-2">
                  <span className="text-sm font-medium truncate" style={{color:'rgb(var(--text))'}}>
                    {t.description}
                  </span>
                  {t.justification && (
                    <Tooltip>
                      <TooltipTrigger className="shrink-0 text-yellow-400 hover:text-yellow-300">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs p-3">
                        <p className="text-xs font-semibold text-yellow-400 mb-1">Justificación</p>
                        <p className="text-xs">{t.justification}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>

                {/* Categoría — solo desktop */}
                <div className="hidden md:block">
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{
                      background: isIncome ? 'rgba(var(--income),0.12)' : 'rgba(var(--expense),0.12)',
                      color: isIncome ? 'rgb(var(--income))' : 'rgb(var(--expense))',
                    }}>
                    {t.category.name}
                  </span>
                </div>

                {/* Monto */}
                <p className="text-sm font-semibold font-display ml-auto md:ml-0 mr-4 md:mr-0 shrink-0"
                  style={{color: isIncome ? 'rgb(var(--income))' : 'rgb(var(--expense))'}}>
                  {isIncome ? '+' : '-'}{fmt(t.amount)}
                </p>

                {/* Acciones */}
                <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(t)}
                    className="p-1.5 rounded-lg transition-colors hover:bg-[rgba(var(--glass-border))]"
                    style={{color:'rgb(var(--text-2))'}}
                    aria-label="Editar"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setDeleteId(t.id)}
                    className="p-1.5 rounded-lg transition-colors hover:bg-red-500/10 hover:text-red-400"
                    style={{color:'rgb(var(--text-2))'}}
                    aria-label="Eliminar"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <Dialog open={!!deleteId} onOpenChange={open => { if (!open) setDeleteId(null) }}>
        <DialogContent className="glass border-[rgba(var(--glass-border))] max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display font-semibold" style={{color:'rgb(var(--text))'}}>
              ¿Eliminar transacción?
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm" style={{color:'rgb(var(--text-2))'}}>Esta acción no se puede deshacer.</p>
          <DialogFooter className="gap-2 mt-2">
            <button
              onClick={() => setDeleteId(null)}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:bg-[rgba(var(--glass-border))]"
              style={{borderColor:'rgba(var(--glass-border))',color:'rgb(var(--text-2))'}}
            >
              Cancelar
            </button>
            <button
              onClick={confirmDelete}
              disabled={deleting}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-red-500 hover:bg-red-600 text-white transition-all active:scale-[0.97] disabled:opacity-60"
            >
              {deleting ? 'Eliminando...' : 'Eliminar'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}
