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

const DAYS_OF_WEEK = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

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
  const month = currentDate.getMonth() // 0-indexed

  const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`
  const monthLabel = currentDate.toLocaleString('es-MX', { month: 'long', year: 'numeric' })

  const fetchData = useCallback(async () => {
    setLoading(true)
    setSelectedDay(null)
    const res = await fetch(`/api/calendar?month=${monthKey}`)
    if (res.ok) setData(await res.json())
    setLoading(false)
  }, [monthKey])

  useEffect(() => { fetchData() }, [fetchData])

  // Build calendar grid
  const firstDay = new Date(year, month, 1).getDay() // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // Trailing days from previous month to fill first row
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  // Fill to complete last row
  while (cells.length % 7 !== 0) cells.push(null)

  const today = new Date()
  const isToday = (d: number) =>
    d === today.getDate() && month === today.getMonth() && year === today.getFullYear()

  const dayKey = (d: number) => `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`

  function prevMonth() {
    setCurrentDate(new Date(year, month - 1, 1))
  }
  function nextMonth() {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const selectedData = selectedDay ? data[selectedDay] : null
  const totalIncome  = Object.values(data).reduce((s, d) => s + d.income, 0)
  const totalExpense = Object.values(data).reduce((s, d) => s + d.expense, 0)

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 fade-up">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl capitalize" style={{color:'rgb(var(--text))'}}>
            Calendario
          </h1>
          <p className="text-sm mt-0.5 capitalize" style={{color:'rgb(var(--text-2))'}}>{monthLabel}</p>
        </div>
        {/* Month nav */}
        <div className="flex items-center gap-1">
          <button
            onClick={prevMonth}
            className="w-9 h-9 rounded-xl glass flex items-center justify-center transition-all hover:bg-[rgba(var(--glass-border))] active:scale-95"
            style={{color:'rgb(var(--text-2))'}}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 h-9 rounded-xl glass text-xs font-semibold transition-all hover:bg-[rgba(var(--glass-border))]"
            style={{color:'rgb(var(--text-2))'}}
          >
            Hoy
          </button>
          <button
            onClick={nextMonth}
            className="w-9 h-9 rounded-xl glass flex items-center justify-center transition-all hover:bg-[rgba(var(--glass-border))] active:scale-95"
            style={{color:'rgb(var(--text-2))'}}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Month summary */}
      {!loading && (
        <div className="grid grid-cols-3 gap-3 mb-4 fade-up fade-up-1">
          <div className="glass rounded-2xl p-4">
            <p className="text-xs font-medium mb-1" style={{color:'rgb(var(--text-2))'}}>Ingresos</p>
            <p className="stat-number text-lg text-income">{fmt(totalIncome)}</p>
          </div>
          <div className="glass rounded-2xl p-4">
            <p className="text-xs font-medium mb-1" style={{color:'rgb(var(--text-2))'}}>Gastos</p>
            <p className="stat-number text-lg text-expense">{fmt(totalExpense)}</p>
          </div>
          <div className="glass rounded-2xl p-4">
            <p className="text-xs font-medium mb-1" style={{color:'rgb(var(--text-2))'}}>Balance</p>
            <p className={`stat-number text-lg ${totalIncome - totalExpense >= 0 ? 'text-income' : 'text-expense'}`}>
              {fmt(totalIncome - totalExpense)}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Calendar grid */}
        <div className="flex-1 glass rounded-2xl p-4 fade-up fade-up-2">
          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS_OF_WEEK.map(d => (
              <div key={d} className="text-center text-[11px] font-bold uppercase tracking-wider py-2" style={{color:'rgb(var(--text-2))'}}>
                {d}
              </div>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-7 gap-1">
              {Array(35).fill(0).map((_, i) => (
                <div key={i} className="skeleton h-16 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1">
              {cells.map((day, idx) => {
                if (!day) {
                  return <div key={`empty-${idx}`} className="h-16 rounded-xl opacity-0" />
                }

                const dk = dayKey(day)
                const dd = data[dk]
                const hasActivity = !!dd
                const isSelected = selectedDay === dk
                const isT = isToday(day)

                return (
                  <button
                    key={dk}
                    onClick={() => setSelectedDay(isSelected ? null : dk)}
                    className={`relative h-16 rounded-xl p-1.5 text-left transition-all flex flex-col justify-between group
                      ${isSelected
                        ? 'ring-2 ring-emerald-400 bg-emerald-500/10'
                        : 'hover:bg-[rgba(var(--glass-border))]'}
                    `}
                  >
                    {/* Day number */}
                    <span className={`text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full
                      ${isT ? 'bg-emerald-500 text-white' : ''}
                    `} style={{color: isT ? undefined : 'rgb(var(--text))'}}>
                      {day}
                    </span>

                    {/* Activity indicators */}
                    {hasActivity && (
                      <div className="flex flex-col gap-0.5 min-w-0">
                        {dd.income > 0 && (
                          <div className="text-[9px] font-bold leading-none truncate text-income">
                            +{fmt(dd.income).replace('$', '')}
                          </div>
                        )}
                        {dd.expense > 0 && (
                          <div className="text-[9px] font-bold leading-none truncate text-expense">
                            -{fmt(dd.expense).replace('$', '')}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Dot indicator bottom */}
                    {hasActivity && (
                      <div className="absolute bottom-1.5 right-1.5 flex gap-0.5">
                        {dd.income > 0 && <div className="w-1.5 h-1.5 rounded-full bg-income opacity-80" />}
                        {dd.expense > 0 && <div className="w-1.5 h-1.5 rounded-full bg-expense opacity-80" />}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          )}

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[rgba(var(--glass-border))]">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-income" />
              <span className="text-xs" style={{color:'rgb(var(--text-2))'}}>Ingreso</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-expense" />
              <span className="text-xs" style={{color:'rgb(var(--text-2))'}}>Gasto</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                <span className="text-[9px] text-white font-bold">1</span>
              </div>
              <span className="text-xs" style={{color:'rgb(var(--text-2))'}}>Hoy</span>
            </div>
          </div>
        </div>

        {/* Day detail panel */}
        <div className="lg:w-72">
          {selectedDay && selectedData ? (
            <div className="glass rounded-2xl p-4 fade-up">
              {/* Header del día */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-display font-bold text-lg" style={{color:'rgb(var(--text))'}}>
                    {new Date(selectedDay + 'T12:00:00').toLocaleDateString('es-MX', {
                      weekday: 'long', day: 'numeric', month: 'long',
                    })}
                  </p>
                  <p className="text-xs mt-0.5" style={{color:'rgb(var(--text-2))'}}>
                    {selectedData.transactions.length} movimiento{selectedData.transactions.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedDay(null)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[rgba(var(--glass-border))] transition-colors"
                  style={{color:'rgb(var(--text-2))'}}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Resumen del día */}
              {(selectedData.income > 0 || selectedData.expense > 0) && (
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {selectedData.income > 0 && (
                    <div className="rounded-xl p-3" style={{background:'rgba(var(--income),0.1)'}}>
                      <p className="text-[10px] font-medium mb-0.5" style={{color:'rgb(var(--income))'}}>Ingresos</p>
                      <p className="stat-number text-sm text-income">{fmt(selectedData.income)}</p>
                    </div>
                  )}
                  {selectedData.expense > 0 && (
                    <div className="rounded-xl p-3" style={{background:'rgba(var(--expense),0.1)'}}>
                      <p className="text-[10px] font-medium mb-0.5" style={{color:'rgb(var(--expense))'}}>Gastos</p>
                      <p className="stat-number text-sm text-expense">{fmt(selectedData.expense)}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Lista de transacciones */}
              <div className="space-y-2">
                {selectedData.transactions.map((t) => {
                  const isIncome = t.category.type === 'income'
                  return (
                    <div key={t.id} className="flex items-center gap-3 p-2.5 rounded-xl"
                      style={{background:'rgba(var(--glass-border))'}}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{background: isIncome ? 'rgba(var(--income),0.15)' : 'rgba(var(--expense),0.15)'}}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                          style={{color: isIncome ? 'rgb(var(--income))' : 'rgb(var(--expense))'}}>
                          <path strokeLinecap="round" strokeLinejoin="round"
                            d={isIncome ? 'M5 10l7-7m0 0l7 7m-7-7v18' : 'M19 14l-7 7m0 0l-7-7m7 7V3'} />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate" style={{color:'rgb(var(--text))'}}>{t.description}</p>
                        <p className="text-[10px]" style={{color:'rgb(var(--text-2))'}}>{t.category.name}</p>
                      </div>
                      <p className="text-xs font-semibold stat-number shrink-0"
                        style={{color: isIncome ? 'rgb(var(--income))' : 'rgb(var(--expense))'}}>
                        {isIncome ? '+' : '-'}{fmtFull(t.amount)}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="glass rounded-2xl p-6 flex flex-col items-center justify-center min-h-[200px] text-center">
              <div className="w-12 h-12 rounded-2xl mb-3 flex items-center justify-center"
                style={{background:'rgba(var(--glass-border))'}}>
                <svg className="w-6 h-6 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  style={{color:'rgb(var(--text-2))'}}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                </svg>
              </div>
              <p className="text-sm font-medium" style={{color:'rgb(var(--text-2))'}}>Selecciona un día</p>
              <p className="text-xs mt-1 opacity-60" style={{color:'rgb(var(--text-2))'}}>
                Toca cualquier día para ver sus movimientos
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
