'use client'

import { useCallback, useEffect, useState } from 'react'

interface CreditCard {
  id: string
  name: string
  bank: string
  creditLimit: number
  balance: number
  apr: number
  closingDay: number
  dueDay: number
  color: string
}

const CARD_COLORS = [
  { label: 'Azul',    value: '#0A84FF' },
  { label: 'Morado',  value: '#BF5AF2' },
  { label: 'Rosa',    value: '#FF375F' },
  { label: 'Naranja', value: '#FF9F0A' },
  { label: 'Verde',   value: '#30D158' },
  { label: 'Cyan',    value: '#5AC8FA' },
]

function fmt(n: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n)
}

function calcPayoff(balance: number, apr: number, payment: number) {
  if (balance <= 0) return { months: 0, totalInterest: 0, totalPaid: 0 }
  const monthlyRate = apr / 100 / 12
  if (monthlyRate === 0) {
    const months = payment > 0 ? balance / payment : Infinity
    return { months, totalInterest: 0, totalPaid: balance }
  }
  const minPayment = balance * monthlyRate
  if (payment <= minPayment) return { months: Infinity, totalInterest: Infinity, totalPaid: Infinity }
  const months = Math.log(payment / (payment - balance * monthlyRate)) / Math.log(1 + monthlyRate)
  const totalPaid = months * payment
  const totalInterest = totalPaid - balance
  return { months, totalInterest, totalPaid }
}

/* ── Simulator per card ── */
function PayoffSimulator({ card }: { card: CreditCard }) {
  const minMonth = Math.ceil(card.balance * (card.apr / 100 / 12) * 1.1) || Math.ceil(card.balance * 0.03)
  const maxMonth = Math.min(card.balance, card.creditLimit > 0 ? card.creditLimit : card.balance)
  const [payment, setPayment] = useState(() => Math.min(Math.ceil(card.balance * 0.1), maxMonth))

  if (card.balance <= 0) {
    return (
      <div className="flex items-center gap-2 py-3 px-4 rounded-2xl"
        style={{ background: 'rgba(var(--income),0.10)' }}>
        <svg className="w-4 h-4 text-income shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <p className="text-sm font-semibold text-income">¡Sin saldo pendiente! Tarjeta al corriente.</p>
      </div>
    )
  }

  const { months, totalInterest, totalPaid } = calcPayoff(card.balance, card.apr, payment)
  const canPayOff = months !== Infinity
  const monthsCeil = Math.ceil(months)
  const years = Math.floor(monthsCeil / 12)
  const remainMonths = monthsCeil % 12

  const paymentSafe = Math.max(minMonth + 1, payment)

  return (
    <div className="space-y-4">
      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgb(var(--text-2))' }}>
        Simulador de pago
      </p>

      {/* Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs" style={{ color: 'rgb(var(--text-2))' }}>Pago mensual</span>
          <span className="text-base font-bold stat-number" style={{ color: 'rgb(var(--apple-blue))' }}>
            {fmt(payment)}
          </span>
        </div>
        <input
          type="range"
          min={Math.ceil(minMonth + 1)}
          max={Math.ceil(maxMonth)}
          step={100}
          value={payment}
          onChange={e => setPayment(Number(e.target.value))}
          className="w-full h-1.5 rounded-full outline-none appearance-none cursor-pointer"
          style={{ accentColor: card.color }}
        />
        <div className="flex justify-between mt-1">
          <span className="text-[10px]" style={{ color: 'rgb(var(--text-2))' }}>Mínimo {fmt(minMonth + 1)}</span>
          <span className="text-[10px]" style={{ color: 'rgb(var(--text-2))' }}>Total {fmt(maxMonth)}</span>
        </div>
      </div>

      {!canPayOff ? (
        <div className="p-3 rounded-2xl text-sm font-medium"
          style={{ background: 'rgba(var(--expense),0.10)', color: 'rgb(var(--expense))' }}>
          ⚠ El pago no cubre los intereses. Sube el monto.
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {[
            {
              label: 'Tiempo',
              value: years > 0
                ? `${years}a ${remainMonths}m`
                : `${monthsCeil} meses`,
              color: monthsCeil <= 12 ? 'rgb(var(--income))' : monthsCeil <= 36 ? 'rgb(var(--apple-blue))' : 'rgb(var(--expense))',
            },
            {
              label: 'Intereses',
              value: fmt(totalInterest),
              color: 'rgb(var(--expense))',
            },
            {
              label: 'Total pagado',
              value: fmt(totalPaid),
              color: 'rgb(var(--text))',
            },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-3 text-center"
              style={{ background: 'rgba(var(--glass-border))' }}>
              <p className="text-[10px] mb-1.5 font-medium" style={{ color: 'rgb(var(--text-2))' }}>{s.label}</p>
              <p className="text-sm font-bold leading-tight" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {canPayOff && (
        <p className="text-[11px] text-center" style={{ color: 'rgb(var(--text-2))' }}>
          Pagando {fmt(payment)}/mes, liquidas el {new Date(Date.now() + monthsCeil * 30.44 * 24 * 60 * 60 * 1000).toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })}
        </p>
      )}
    </div>
  )
}

/* ── Card Form ── */
function CardForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: CreditCard
  onSave: (card: CreditCard) => void
  onCancel: () => void
}) {
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    bank: initial?.bank ?? '',
    creditLimit: initial?.creditLimit?.toString() ?? '',
    balance: initial?.balance?.toString() ?? '',
    apr: initial?.apr?.toString() ?? '',
    closingDay: initial?.closingDay?.toString() ?? '1',
    dueDay: initial?.dueDay?.toString() ?? '15',
    color: initial?.color ?? '#0A84FF',
  })
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.creditLimit) { setErr('Nombre y límite son requeridos'); return }
    setSaving(true)
    setErr('')
    try {
      const method = initial ? 'PUT' : 'POST'
      const url = initial ? `/api/cards/${initial.id}` : '/api/cards'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          bank: form.bank,
          creditLimit: Number(form.creditLimit),
          balance: Number(form.balance) || 0,
          apr: Number(form.apr) || 0,
          closingDay: Number(form.closingDay) || 1,
          dueDay: Number(form.dueDay) || 15,
          color: form.color,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setErr(data.error || 'Error al guardar'); return }
      onSave(data)
    } catch {
      setErr('Error de conexión')
    } finally {
      setSaving(false)
    }
  }

  const field = (label: string, key: keyof typeof form, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgb(var(--text-2))' }}>{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all"
        style={{
          background: 'rgba(var(--glass-border))',
          color: 'rgb(var(--text))',
          border: '1px solid transparent',
        }}
        onFocus={e => (e.target.style.borderColor = 'rgba(var(--apple-blue),0.5)')}
        onBlur={e => (e.target.style.borderColor = 'transparent')}
      />
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {field('Nombre de la tarjeta', 'name', 'text', 'BBVA Azul')}
        {field('Banco', 'bank', 'text', 'BBVA')}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {field('Límite de crédito ($)', 'creditLimit', 'number', '50000')}
        {field('Saldo actual ($)', 'balance', 'number', '12000')}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {field('Tasa anual % (CAT)', 'apr', 'number', '36')}
        {field('Día de corte', 'closingDay', 'number', '15')}
        {field('Día de pago', 'dueDay', 'number', '5')}
      </div>

      {/* Color picker */}
      <div>
        <label className="block text-xs font-semibold mb-2" style={{ color: 'rgb(var(--text-2))' }}>Color</label>
        <div className="flex gap-2 flex-wrap">
          {CARD_COLORS.map(c => (
            <button
              key={c.value}
              type="button"
              onClick={() => setForm(p => ({ ...p, color: c.value }))}
              className="w-8 h-8 rounded-full transition-all"
              style={{
                background: c.value,
                boxShadow: form.color === c.value ? `0 0 0 3px rgb(var(--bg)), 0 0 0 5px ${c.value}` : 'none',
                transform: form.color === c.value ? 'scale(1.15)' : 'scale(1)',
              }}
              title={c.label}
            />
          ))}
        </div>
      </div>

      {err && <p className="text-sm text-expense">{err}</p>}

      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={{ background: 'rgba(var(--glass-border))', color: 'rgb(var(--text-2))' }}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-[0.97] disabled:opacity-60"
          style={{ background: 'rgb(var(--apple-blue))' }}
        >
          {saving ? 'Guardando...' : initial ? 'Guardar cambios' : 'Agregar tarjeta'}
        </button>
      </div>
    </form>
  )
}

/* ── Visual card chip ── */
function CardChip({ card, onEdit, onDelete }: { card: CreditCard; onEdit: () => void; onDelete: () => void }) {
  const [showSim, setShowSim] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const util = card.creditLimit > 0 ? Math.min(100, (card.balance / card.creditLimit) * 100) : 0
  const utilColor = util < 30 ? 'rgb(var(--income))' : util < 70 ? 'rgb(var(--apple-blue))' : 'rgb(var(--expense))'
  const daysUntilDue = (() => {
    const now = new Date()
    const due = new Date(now.getFullYear(), now.getMonth(), card.dueDay)
    if (due < now) due.setMonth(due.getMonth() + 1)
    return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  })()

  async function handleDelete() {
    setDeleting(true)
    await fetch(`/api/cards/${card.id}`, { method: 'DELETE' })
    onDelete()
  }

  return (
    <div className="glass rounded-3xl overflow-hidden">
      {/* Visual card */}
      <div className="relative p-5 pb-4" style={{ background: `linear-gradient(135deg, ${card.color}ee 0%, ${card.color}88 100%)` }}>
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full pointer-events-none"
          style={{ background: 'rgba(255,255,255,0.12)' }} />
        <div className="absolute bottom-0 -left-4 w-28 h-28 rounded-full pointer-events-none"
          style={{ background: 'rgba(255,255,255,0.06)' }} />

        <div className="relative flex items-start justify-between mb-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">{card.bank || 'Banco'}</p>
            <p className="text-lg font-bold text-white mt-0.5" style={{ letterSpacing: '-0.02em' }}>{card.name}</p>
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={onEdit}
              className="w-7 h-7 rounded-xl flex items-center justify-center transition-all"
              style={{ background: 'rgba(255,255,255,0.18)' }}
            >
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="w-7 h-7 rounded-xl flex items-center justify-center transition-all"
              style={{ background: 'rgba(255,255,255,0.18)' }}
            >
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <div className="relative flex items-end justify-between">
          <div>
            <p className="text-[10px] text-white/60 mb-0.5">Saldo usado</p>
            <p className="text-2xl font-bold text-white stat-number">{fmt(card.balance)}</p>
            <p className="text-xs text-white/60 mt-0.5">de {fmt(card.creditLimit)} límite</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-white/60 mb-0.5">Pago en</p>
            <p className="text-xl font-bold text-white">{daysUntilDue}d</p>
            <p className="text-xs text-white/60 mt-0.5">día {card.dueDay}</p>
          </div>
        </div>

        {/* Utilization bar */}
        <div className="relative mt-4 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }}>
          <div className="absolute left-0 top-0 h-full rounded-full transition-all duration-700"
            style={{ width: `${util}%`, background: 'rgba(255,255,255,0.9)' }} />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 divide-x px-4 py-3"
        style={{ borderTop: '1px solid rgba(var(--glass-border))', borderColor: 'rgba(var(--glass-border))' }}>
        <div className="pr-4 text-center">
          <p className="text-[10px] font-medium mb-0.5" style={{ color: 'rgb(var(--text-2))' }}>Utilización</p>
          <p className="text-sm font-bold" style={{ color: utilColor }}>{util.toFixed(0)}%</p>
        </div>
        <div className="px-4 text-center">
          <p className="text-[10px] font-medium mb-0.5" style={{ color: 'rgb(var(--text-2))' }}>CAT/APR</p>
          <p className="text-sm font-bold" style={{ color: 'rgb(var(--text))' }}>{card.apr}%</p>
        </div>
        <div className="pl-4 text-center">
          <p className="text-[10px] font-medium mb-0.5" style={{ color: 'rgb(var(--text-2))' }}>Corte día</p>
          <p className="text-sm font-bold" style={{ color: 'rgb(var(--text))' }}>{card.closingDay}</p>
        </div>
      </div>

      {/* Simulator toggle */}
      <div className="px-4 pb-4">
        <button
          onClick={() => setShowSim(p => !p)}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl text-xs font-bold transition-all"
          style={{
            background: showSim ? `${card.color}18` : 'rgba(var(--glass-border))',
            color: showSim ? card.color : 'rgb(var(--text-2))',
          }}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          {showSim ? 'Ocultar simulador' : 'Simular pago'}
        </button>

        {showSim && (
          <div className="mt-3">
            <PayoffSimulator card={card} />
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Main page ── */
export default function CardsPage() {
  const [cards, setCards] = useState<CreditCard[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCard, setEditingCard] = useState<CreditCard | undefined>()

  const fetchCards = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/cards')
    if (res.ok) setCards(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { fetchCards() }, [fetchCards])

  function handleSave(card: CreditCard) {
    if (editingCard) {
      setCards(p => p.map(c => c.id === card.id ? card : c))
    } else {
      setCards(p => [...p, card])
    }
    setShowForm(false)
    setEditingCard(undefined)
  }

  function handleEdit(card: CreditCard) {
    setEditingCard(card)
    setShowForm(true)
  }

  function handleDelete(id: string) {
    setCards(p => p.filter(c => c.id !== id))
  }

  function handleCloseForm() {
    setShowForm(false)
    setEditingCard(undefined)
  }

  const totalBalance = cards.reduce((s, c) => s + c.balance, 0)
  const totalLimit = cards.reduce((s, c) => s + c.creditLimit, 0)
  const totalUtil = totalLimit > 0 ? (totalBalance / totalLimit) * 100 : 0
  const utilColor = totalUtil < 30 ? 'rgb(var(--income))' : totalUtil < 70 ? 'rgb(var(--apple-blue))' : 'rgb(var(--expense))'

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto md:max-w-3xl">

      {/* Header */}
      <div className="flex items-center justify-between mb-6 fade-up">
        <div>
          <h1 className="font-bold text-2xl md:text-3xl" style={{ color: 'rgb(var(--text))', letterSpacing: '-0.02em' }}>
            Tarjetas de crédito
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'rgb(var(--text-2))' }}>
            {cards.length} tarjeta{cards.length !== 1 ? 's' : ''} registrada{cards.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all active:scale-[0.97]"
          style={{ background: 'rgb(var(--apple-blue))' }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">Agregar</span>
        </button>
      </div>

      {/* Summary bar */}
      {cards.length > 0 && !loading && (
        <div className="glass rounded-2xl p-4 mb-4 fade-up fade-up-1">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'rgb(var(--text-2))' }}>Total adeudado</p>
              <p className="stat-number text-lg text-expense">{fmt(totalBalance)}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'rgb(var(--text-2))' }}>Crédito total</p>
              <p className="stat-number text-lg" style={{ color: 'rgb(var(--text))' }}>{fmt(totalLimit)}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'rgb(var(--text-2))' }}>Utilización</p>
              <p className="stat-number text-lg" style={{ color: utilColor }}>{totalUtil.toFixed(0)}%</p>
            </div>
          </div>
          {/* Global utilization bar */}
          <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(var(--glass-border))' }}>
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, totalUtil)}%`, background: utilColor }} />
          </div>
        </div>
      )}

      {/* Cards list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => <div key={i} className="skeleton rounded-3xl h-64" />)}
        </div>
      ) : cards.length === 0 ? (
        <div className="glass rounded-3xl flex flex-col items-center justify-center py-16 px-6 text-center fade-up fade-up-1">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: 'rgba(var(--apple-blue),0.10)' }}>
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="rgb(var(--apple-blue))" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <p className="font-semibold text-sm mb-1" style={{ color: 'rgb(var(--text))' }}>Sin tarjetas registradas</p>
          <p className="text-xs mb-4" style={{ color: 'rgb(var(--text-2))' }}>Agrega tus tarjetas para simular pagos y organizar tus deudas</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all active:scale-[0.97]"
            style={{ background: 'rgb(var(--apple-blue))' }}
          >
            Agregar primera tarjeta
          </button>
        </div>
      ) : (
        <div className="space-y-4 fade-up fade-up-2">
          {cards.map(card => (
            <CardChip
              key={card.id}
              card={card}
              onEdit={() => handleEdit(card)}
              onDelete={() => handleDelete(card.id)}
            />
          ))}
        </div>
      )}

      {/* Método avalancha tip */}
      {cards.length >= 2 && (
        <div className="mt-4 glass rounded-2xl p-4 fade-up fade-up-3">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(var(--income),0.12)' }}>
              <svg className="w-4 h-4 text-income" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold mb-0.5" style={{ color: 'rgb(var(--text))' }}>
                Método Avalancha
              </p>
              <p className="text-xs leading-relaxed" style={{ color: 'rgb(var(--text-2))' }}>
                Paga el mínimo en todas tus tarjetas y enfoca el dinero extra en la de mayor tasa ({
                  [...cards].sort((a, b) => b.apr - a.apr)[0]?.name
                } · {[...cards].sort((a, b) => b.apr - a.apr)[0]?.apr}% CAT). Ahorras más en intereses a largo plazo.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal form */}
      {showForm && (
        <div
          className="fixed inset-0 z-50"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
          onClick={handleCloseForm}
        >
          <div className="absolute inset-0 flex items-center justify-center p-4" style={{ pointerEvents: 'none' }}>
            <div
              className="glass border border-[rgba(var(--glass-border))] rounded-3xl p-5 w-full max-w-lg max-h-[90dvh] overflow-y-auto"
              style={{ pointerEvents: 'auto' }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-base" style={{ color: 'rgb(var(--text))' }}>
                  {editingCard ? 'Editar tarjeta' : 'Nueva tarjeta'}
                </h2>
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(var(--glass-border))', color: 'rgb(var(--text-2))' }}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <CardForm initial={editingCard} onSave={handleSave} onCancel={handleCloseForm} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
