'use client'

import { useEffect, useState, useCallback } from 'react'

interface DayTransaction {
  id: string
  amount: number
  description: string
  date: string
  category: { name: string; type: string; isEssential: boolean }
}

interface DayData {
  income: number
  expense: number
  transactions: DayTransaction[]
}

type CalendarData = Record<string, DayData>

const DOW = ['D', 'L', 'M', 'M', 'J', 'V', 'S']

function fmt(n: number) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency', currency: 'MXN', maximumFractionDigits: 0,
  }).format(n)
}

function fmtFull(n: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n)
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(() => new Date())
  const [data, setData] = useState<CalendarData>({})
  const [loading, setLoading] = useState(true)
  const [selectedDay, setSelectedDay] = useState<string | null>(null)

  const year  = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`
  const monthLabel = currentDate.toLocaleString('es-MX', { month: 'long' })

  const fetchData = useCallback(async () => {
    setLoading(true)
    setSelectedDay(null)
    const res = await fetch(`/api/calendar?month=${monthKey}`)
    if (res.ok) setData(await res.json())
    setLoading(false)
  }, [monthKey])

  useEffect(() => { fetchData() }, [fetchData])

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  const today = new Date()
  const isToday = (d: number) =>
    d === today.getDate() && month === today.getMonth() && year === today.getFullYear()

  const dayKey = (d: number) =>
    `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`

  const totalIncome  = Object.values(data).reduce((s, d) => s + d.income, 0)
  const totalExpense = Object.values(data).reduce((s, d) => s + d.expense, 0)
  const balance = totalIncome - totalExpense

  const selectedData = selectedDay ? data[selectedDay] : null

  return (
    <div className="pb-28 md:pb-6">
      {/* ── Header ── */}
      <div className="px-4 pt-6 pb-4 flex items-end justify-between fade-up">
        <div>
          <h1
            className="text-4xl font-bold capitalize tracking-tight"
            style={{ color: 'rgb(var(--text))', letterSpacing: '-0.02em' }}
          >
            {monthLabel}
          </h1>
          <p className="text-xl font-semibold mt-0.5" style={{ color: 'rgb(var(--text-2))' }}>
            {year}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90"
            style={{ background: 'rgba(var(--glass-border))', color: 'rgb(var(--text))' }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3.5 h-9 rounded-full text-xs font-bold transition-all active:scale-95"
            style={{ background: 'rgba(var(--apple-blue),0.14)', color: 'rgb(var(--apple-blue))' }}
          >
            Hoy
          </button>
          <button
            onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90"
            style={{ background: 'rgba(var(--glass-border))', color: 'rgb(var(--text))' }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Summary pills ── */}
      {!loading && (
        <div className="px-4 mb-5 grid grid-cols-3 gap-3 fade-up fade-up-1">
          <div className="glass rounded-2xl p-3.5">
            <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'rgb(var(--income))' }}>
              Ingresos
            </p>
            <p className="stat-number text-base text-income">{fmt(totalIncome)}</p>
          </div>
          <div className="glass rounded-2xl p-3.5">
            <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'rgb(var(--expense))' }}>
              Gastos
            </p>
            <p className="stat-number text-base text-expense">{fmt(totalExpense)}</p>
          </div>
          <div className="glass rounded-2xl p-3.5">
            <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'rgb(var(--text-2))' }}>
              Balance
            </p>
            <p className={`stat-number text-base ${balance >= 0 ? 'text-income' : 'text-expense'}`}>
              {fmt(balance)}
            </p>
          </div>
        </div>
      )}

      {/* ── Main layout ── */}
      <div className="px-4 flex flex-col lg:flex-row gap-4">
        {/* Calendar card */}
        <div className="flex-1 glass rounded-3xl overflow-hidden fade-up fade-up-2">
          {/* Day-of-week headers */}
          <div className="grid grid-cols-7 px-3 pt-4 pb-2">
            {DOW.map((d, i) => (
              <div key={i} className="flex justify-center">
                <span
                  className="text-xs font-semibold w-8 text-center"
                  style={{
                    color: i === 0 || i === 6
                      ? 'rgb(var(--expense))'
                      : 'rgb(var(--text-2))',
                  }}
                >
                  {d}
                </span>
              </div>
            ))}
          </div>

          {/* Separator */}
          <div
            className="mx-4 mb-1"
            style={{ height: 1, background: 'rgba(var(--glass-border))' }}
          />

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-7 gap-0 p-3">
              {Array(35).fill(0).map((_, i) => (
                <div key={i} className="flex flex-col items-center py-2 gap-1.5">
                  <div className="skeleton w-8 h-8 rounded-full" />
                  <div className="skeleton w-3 h-1.5 rounded-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-7 p-2 pb-4">
              {cells.map((day, idx) => {
                if (!day) return <div key={`e-${idx}`} className="h-14" />

                const dk = dayKey(day)
                const dd = data[dk]
                const isT = isToday(day)
                const isSel = selectedDay === dk
                const hasIncome  = dd?.income > 0
                const hasExpense = dd?.expense > 0
                const isWeekend  = idx % 7 === 0 || idx % 7 === 6

                return (
                  <button
                    key={dk}
                    onClick={() => setSelectedDay(isSel ? null : dk)}
                    className="flex flex-col items-center py-1.5 gap-1 rounded-2xl transition-all active:scale-90"
                    style={isSel && !isT ? { background: 'rgba(var(--apple-blue),0.10)' } : undefined}
                  >
                    <span
                      className="w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold transition-all"
                      style={{
                        background: isT ? 'rgb(var(--apple-blue))' : undefined,
                        color: isT
                          ? '#fff'
                          : isSel
                          ? 'rgb(var(--apple-blue))'
                          : isWeekend
                          ? 'rgb(var(--expense))'
                          : 'rgb(var(--text))',
                        fontWeight: isT ? 700 : isSel ? 600 : 500,
                      }}
                    >
                      {day}
                    </span>

                    {/* Dots */}
                    <div className="flex items-center justify-center gap-0.5 h-1.5">
                      {hasIncome  && <div className="w-1.5 h-1.5 rounded-full bg-income" />}
                      {hasExpense && <div className="w-1.5 h-1.5 rounded-full bg-expense" />}
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* ── Day detail panel ── */}
        <div className="lg:w-80">
          {selectedDay && selectedData ? (
            <div className="glass rounded-3xl p-4 fade-up">
              {/* Day header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-bold text-base capitalize leading-tight" style={{ color: 'rgb(var(--text))' }}>
                    {new Date(selectedDay + 'T12:00:00').toLocaleDateString('es-MX', {
                      weekday: 'long', day: 'numeric', month: 'long',
                    })}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgb(var(--text-2))' }}>
                    {selectedData.transactions.length} movimiento{selectedData.transactions.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedDay(null)}
                  className="w-7 h-7 rounded-full flex items-center justify-center transition-all shrink-0"
                  style={{ background: 'rgba(var(--glass-border))', color: 'rgb(var(--text-2))' }}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Day summary */}
              {(selectedData.income > 0 || selectedData.expense > 0) && (
                <div className="flex gap-2 mb-4">
                  {selectedData.income > 0 && (
                    <div className="flex-1 rounded-2xl p-3" style={{ background: 'rgba(var(--income),0.10)' }}>
                      <p className="text-[10px] font-bold uppercase tracking-wider mb-1 text-income">Ingreso</p>
                      <p className="stat-number text-sm text-income">{fmt(selectedData.income)}</p>
                    </div>
                  )}
                  {selectedData.expense > 0 && (
                    <div className="flex-1 rounded-2xl p-3" style={{ background: 'rgba(var(--expense),0.10)' }}>
                      <p className="text-[10px] font-bold uppercase tracking-wider mb-1 text-expense">Gasto</p>
                      <p className="stat-number text-sm text-expense">{fmt(selectedData.expense)}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Transactions list */}
              <div className="space-y-1.5">
                {selectedData.transactions.map(t => {
                  const isIncome = t.category.type === 'income'
                  return (
                    <div
                      key={t.id}
                      className="flex items-center gap-3 p-3 rounded-2xl"
                      style={{ background: 'rgba(var(--glass-border))' }}
                    >
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: isIncome ? 'rgba(var(--income),0.15)' : 'rgba(var(--expense),0.15)' }}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                          style={{ color: isIncome ? 'rgb(var(--income))' : 'rgb(var(--expense))' }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round"
                            d={isIncome ? 'M5 10l7-7m0 0l7 7m-7-7v18' : 'M19 14l-7 7m0 0l-7-7m7 7V3'} />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: 'rgb(var(--text))' }}>
                          {t.description}
                        </p>
                        <p className="text-xs" style={{ color: 'rgb(var(--text-2))' }}>{t.category.name}</p>
                      </div>
                      <p
                        className="text-sm font-bold shrink-0"
                        style={{ color: isIncome ? 'rgb(var(--income))' : 'rgb(var(--expense))' }}
                      >
                        {isIncome ? '+' : '-'}{fmtFull(t.amount)}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : selectedDay && !selectedData ? (
            <div className="glass rounded-3xl p-6 text-center fade-up">
              <p className="text-sm font-medium" style={{ color: 'rgb(var(--text-2))' }}>
                Sin movimientos este día
              </p>
            </div>
          ) : (
            <div className="hidden lg:flex glass rounded-3xl p-8 flex-col items-center justify-center text-center">
              <div
                className="w-14 h-14 rounded-3xl mb-4 flex items-center justify-center"
                style={{ background: 'rgba(var(--apple-blue),0.12)' }}
              >
                <svg
                  className="w-7 h-7"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  strokeWidth={1.5} style={{ color: 'rgb(var(--apple-blue))' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                </svg>
              </div>
              <p className="font-semibold text-sm" style={{ color: 'rgb(var(--text))' }}>Selecciona un día</p>
              <p className="text-xs mt-1" style={{ color: 'rgb(var(--text-2))' }}>
                Toca cualquier día para ver sus movimientos
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
