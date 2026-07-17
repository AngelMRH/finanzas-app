'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Category, Transaction } from '@/lib/types'

interface TransactionFormProps {
  categories: Category[]
  transaction?: Transaction
  onSuccess: (transaction: Transaction) => void
  onCancel: () => void
}

export function TransactionForm({ categories, transaction, onSuccess, onCancel }: TransactionFormProps) {
  const [amount, setAmount] = useState(transaction ? String(transaction.amount) : '')
  const [description, setDescription] = useState(transaction?.description ?? '')
  const [date, setDate] = useState(
    transaction
      ? new Date(transaction.date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]
  )
  const [categoryId, setCategoryId] = useState(transaction?.categoryId ?? '')
  const [justification, setJustification] = useState(transaction?.justification ?? '')
  const [formError, setFormError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const selectedCategory = categories.find(c => c.id === categoryId)
  const showJustification = selectedCategory && !selectedCategory.isEssential
  const incomeCategories = categories.filter(c => c.type === 'income')
  const expenseCategories = categories.filter(c => c.type === 'expense')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)
    setLoading(true)

    if (!amount || Number(amount) <= 0) { setFormError('El monto debe ser mayor a 0'); setLoading(false); return }
    if (!categoryId) { setFormError('Selecciona una categoría'); setLoading(false); return }
    if (showJustification && justification.trim().length < 10) {
      setFormError('La justificación debe tener al menos 10 caracteres')
      setLoading(false); return
    }

    const url = transaction ? `/api/transactions/${transaction.id}` : '/api/transactions'
    const method = transaction ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: Number(amount), description, date, categoryId, justification: showJustification ? justification : undefined }),
    })

    const data = await res.json()
    if (!res.ok) { setFormError(data.error || 'Error al guardar la transacción'); setLoading(false); return }
    onSuccess(data)
  }

  const labelStyle = { color: 'rgb(var(--text-2))' } as const

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && (
        <div className="p-3 rounded-xl text-sm font-medium" style={{background:'rgba(var(--danger),0.1)',color:'rgb(var(--danger))'}}>
          {formError}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium" style={labelStyle}>Monto (MXN)</Label>
          <Input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="0.00"
            min="0.01"
            step="0.01"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium" style={labelStyle}>Fecha</Label>
          <Input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-medium" style={labelStyle}>Descripción</Label>
        <Input
          type="text"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Ej: Almuerzo en restaurante"
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-medium" style={labelStyle}>Categoría</Label>
        <Select value={categoryId} onValueChange={val => setCategoryId(val as string)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona una categoría" />
          </SelectTrigger>
          <SelectContent>
            {incomeCategories.length > 0 && (
              <>
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                  Ingresos
                </div>
                {incomeCategories.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </>
            )}
            {expenseCategories.length > 0 && (
              <>
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest mt-1" style={{color:'rgb(var(--expense))'}}>
                  Gastos
                </div>
                {expenseCategories.map(c => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                    {!c.isEssential && <span className="ml-1.5 text-[10px] opacity-60">(reflexión)</span>}
                  </SelectItem>
                ))}
              </>
            )}
          </SelectContent>
        </Select>
      </div>

      {showJustification && (
        <div className="space-y-1.5 p-3 rounded-xl border" style={{background:'rgba(234,179,8,0.08)',borderColor:'rgba(234,179,8,0.25)'}}>
          <Label className="flex items-center gap-2 text-xs font-semibold text-yellow-500">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Modo Reflexión — ¿Por qué necesitas esto?
          </Label>
          <textarea
            value={justification}
            onChange={e => setJustification(e.target.value)}
            placeholder="Explica por qué esta compra es necesaria (mín. 10 caracteres)..."
            minLength={10}
            required
            rows={3}
            className="w-full px-3 py-2 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
            style={{
              background: 'rgba(var(--glass-bg))',
              border: '1px solid rgba(var(--glass-border))',
              color: 'rgb(var(--text))',
            }}
          />
          <p className="text-[11px]" style={{color:'rgb(var(--text-2))'}}>
            {justification.length}/10 caracteres mínimo
          </p>
        </div>
      )}

      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:bg-[rgba(var(--glass-border))]"
          style={{borderColor:'rgba(var(--glass-border))',color:'rgb(var(--text-2))'}}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-all active:scale-[0.97] disabled:opacity-60"
        >
          {loading ? 'Guardando...' : transaction ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  )
}
