'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Category, Transaction } from '@/lib/types'

interface TransactionFormProps {
  categories: Category[]
  categoriesLoading?: boolean
  transaction?: Transaction
  onSuccess: (transaction: Transaction) => void
  onCancel: () => void
}

// ---------------------------------------------------------------------------
// Category icon map — heroicons-style inline SVGs
// ---------------------------------------------------------------------------
function CategoryIcon({ name, className }: { name: string; className?: string }) {
  const cls = className ?? 'w-4 h-4 shrink-0'

  switch (name) {
    case 'Salario':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h1.5m-1.5 0h-1.5m-1.5 0H9m-1.5 0H6" />
        </svg>
      )
    case 'Inversiones':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.307a11.95 11.95 0 0 1 5.814-5.519l2.74-1.22m0 0-5.94-2.28m5.94 2.28-2.28 5.941" />
        </svg>
      )
    case 'Regalos':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
        </svg>
      )
    case 'Vivienda':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      )
    case 'Servicios':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
        </svg>
      )
    case 'Supermercado':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
        </svg>
      )
    case 'Transporte':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
        </svg>
      )
    case 'Restaurantes':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75-1.5.75a3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0L3 16.5m15-3.379a48.474 48.474 0 0 1-6-.371m6 .371-.571 1.148c-.11.22-.327.358-.57.358H6.141c-.244 0-.46-.138-.571-.358L5 13.121m10 3.379a48.477 48.477 0 0 1-10 0" />
        </svg>
      )
    case 'Ocio':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
        </svg>
      )
    case 'Compras':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
        </svg>
      )
    case 'Suscripciones':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
      )
    default:
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <circle cx="12" cy="12" r="9" />
        </svg>
      )
  }
}

// ---------------------------------------------------------------------------
// Checkmark shown on the selected chip
// ---------------------------------------------------------------------------
function Checkmark() {
  return (
    <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-4 h-4 rounded-full bg-current">
      <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
    </span>
  )
}

// ---------------------------------------------------------------------------
// Single category chip
// ---------------------------------------------------------------------------
function CategoryChip({
  category,
  selected,
  onClick,
}: {
  category: Category
  selected: boolean
  onClick: () => void
}) {
  const isIncome = category.type === 'income'
  const isNonEssential = !category.isEssential

  let chipClass =
    'relative flex items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-sm font-medium cursor-pointer transition-all select-none'

  if (!selected) {
    chipClass +=
      ' border-[rgba(var(--glass-border))] text-[rgb(var(--text-2))] hover:border-[rgba(var(--glass-border))] hover:text-[rgb(var(--text))]'
  } else if (isIncome) {
    chipClass += ' border-emerald-400 bg-emerald-500/15 text-emerald-400'
  } else if (isNonEssential) {
    chipClass += ' border-yellow-400 bg-yellow-500/12 text-yellow-400'
  } else {
    chipClass += ' border-orange-400 bg-orange-500/12 text-orange-400'
  }

  return (
    <button type="button" onClick={onClick} className={chipClass}>
      {selected && <Checkmark />}
      <CategoryIcon name={category.name} />
      <span className="leading-tight">{category.name}</span>
      {isNonEssential && !isIncome && (
        <span
          title="Categoría de reflexión"
          className="ml-auto shrink-0 text-[10px] opacity-70"
          aria-label="reflexión"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
        </span>
      )}
    </button>
  )
}

// ---------------------------------------------------------------------------
// Main form
// ---------------------------------------------------------------------------
export function TransactionForm({ categories, categoriesLoading, transaction, onSuccess, onCancel }: TransactionFormProps) {
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

      {/* Category chips */}
      <div className="space-y-2.5">
        <Label className="text-xs font-medium" style={labelStyle}>
          Categoría — elige una para definir si es ingreso o gasto
        </Label>

        {categoriesLoading ? (
          <div className="flex flex-wrap gap-2 py-1">
            {[80, 96, 72, 88, 80, 104].map((w, i) => (
              <div key={i} className="skeleton h-10 rounded-xl" style={{ width: w }} />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div
            className="rounded-2xl p-4 text-sm text-center space-y-1"
            style={{ background: 'rgba(var(--danger-dim))', color: 'rgb(var(--danger))' }}
          >
            <p className="font-semibold">No se cargaron las categorías</p>
            <p className="text-xs opacity-80">Cierra el formulario, recarga la página e intenta de nuevo.</p>
          </div>
        ) : (
          <>
            {incomeCategories.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                  ↑ Ingresos
                </p>
                <div className="flex flex-wrap gap-2">
                  {incomeCategories.map(c => (
                    <CategoryChip
                      key={c.id}
                      category={c}
                      selected={categoryId === c.id}
                      onClick={() => setCategoryId(c.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {expenseCategories.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{color:'rgb(var(--expense))'}}>
                  ↓ Gastos
                </p>
                <div className="flex flex-wrap gap-2">
                  {expenseCategories.map(c => (
                    <CategoryChip
                      key={c.id}
                      category={c}
                      selected={categoryId === c.id}
                      onClick={() => setCategoryId(c.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
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
