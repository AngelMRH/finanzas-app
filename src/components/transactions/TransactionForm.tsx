'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
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

export function TransactionForm({
  categories,
  transaction,
  onSuccess,
  onCancel,
}: TransactionFormProps) {
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

    if (!amount || Number(amount) <= 0) {
      setFormError('El monto debe ser mayor a 0')
      setLoading(false)
      return
    }

    if (!categoryId) {
      setFormError('Selecciona una categoría')
      setLoading(false)
      return
    }

    if (showJustification && justification.trim().length < 10) {
      setFormError('La justificación debe tener al menos 10 caracteres')
      setLoading(false)
      return
    }

    const url = transaction ? `/api/transactions/${transaction.id}` : '/api/transactions'
    const method = transaction ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: Number(amount),
        description,
        date,
        categoryId,
        justification: showJustification ? justification : undefined,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      setFormError(data.error || 'Error al guardar la transacción')
      setLoading(false)
      return
    }

    onSuccess(data)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          {formError}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-slate-300">Monto (MXN)</Label>
          <Input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="0.00"
            min="0.01"
            step="0.01"
            required
            className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-slate-300">Fecha</Label>
          <Input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
            className="bg-slate-700 border-slate-600 text-white"
          />
        </div>
      </div>

      <div className="space-y-1">
        <Label className="text-slate-300">Descripción</Label>
        <Input
          type="text"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Ej: Almuerzo en restaurante"
          required
          className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
        />
      </div>

      <div className="space-y-1">
        <Label className="text-slate-300">Categoría</Label>
        {/* base-ui Select: value + onValueChange(value, eventDetails) */}
        <Select
          value={categoryId}
          onValueChange={(val) => setCategoryId(val as string)}
        >
          <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
            <SelectValue placeholder="Selecciona una categoría" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            {incomeCategories.length > 0 && (
              <>
                <div className="px-2 py-1 text-xs font-semibold text-emerald-400 uppercase tracking-wide">
                  Ingresos
                </div>
                {incomeCategories.map(c => (
                  <SelectItem key={c.id} value={c.id} className="text-white hover:bg-slate-700">
                    {c.name}
                  </SelectItem>
                ))}
              </>
            )}
            {expenseCategories.length > 0 && (
              <>
                <div className="px-2 py-1 text-xs font-semibold text-red-400 uppercase tracking-wide mt-1">
                  Gastos
                </div>
                {expenseCategories.map(c => (
                  <SelectItem key={c.id} value={c.id} className="text-white hover:bg-slate-700">
                    {c.name}{!c.isEssential && (
                      <span className="text-yellow-400 text-xs ml-1">(reflexión)</span>
                    )}
                  </SelectItem>
                ))}
              </>
            )}
          </SelectContent>
        </Select>
      </div>

      {showJustification && (
        <div className="space-y-1 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <Label className="text-yellow-400 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
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
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <p className="text-xs text-slate-400">{justification.length}/10 caracteres mínimo</p>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
        >
          {loading ? 'Guardando...' : transaction ? 'Actualizar' : 'Crear transacción'}
        </Button>
      </div>
    </form>
  )
}
