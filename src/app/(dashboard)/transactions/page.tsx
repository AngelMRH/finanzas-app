'use client'

import { useEffect, useState, useCallback } from 'react'
import { TransactionForm } from '@/components/transactions/TransactionForm'
import { TransactionsTable } from '@/components/transactions/TransactionsTable'
import { TransactionFilters } from '@/components/transactions/TransactionFilters'
import { exportToCSV } from '@/lib/export-csv'
import { Category, Transaction } from '@/lib/types'

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>()
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })
  const [selectedCategory, setSelectedCategory] = useState('all')

  const fetchTransactions = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (selectedMonth !== 'all') params.set('month', selectedMonth)
    if (selectedCategory !== 'all') params.set('categoryId', selectedCategory)
    const res = await fetch(`/api/transactions?${params}`)
    if (res.ok) {
      const data = await res.json()
      setTransactions(Array.isArray(data) ? data : [])
    }
    setLoading(false)
  }, [selectedMonth, selectedCategory])

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(d => { setCategories(Array.isArray(d) ? d : []); setCategoriesLoading(false) })
      .catch(() => { setCategories([]); setCategoriesLoading(false) })
  }, [])

  useEffect(() => { fetchTransactions() }, [fetchTransactions])

  function handleSuccess(t: Transaction) {
    if (editingTransaction) setTransactions(p => p.map(x => x.id === t.id ? t : x))
    else setTransactions(p => [t, ...p])
    setShowForm(false)
    setEditingTransaction(undefined)
  }

  function handleCloseForm() { setShowForm(false); setEditingTransaction(undefined) }

  useEffect(() => {
    if (!showForm) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleCloseForm() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [showForm])

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto md:max-w-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 fade-up">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl" style={{color:'rgb(var(--text))'}}>
            Transacciones
          </h1>
          <p className="text-sm mt-0.5" style={{color:'rgb(var(--text-2))'}}>
            {transactions.length} movimiento{transactions.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:scale-[0.97] text-white text-sm font-semibold rounded-xl transition-all accent-glow"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">Nueva</span>
        </button>
      </div>

      {/* Filters */}
      <div className="glass rounded-2xl p-4 mb-4 fade-up fade-up-1">
        <TransactionFilters
          categories={categories}
          selectedMonth={selectedMonth}
          selectedCategory={selectedCategory}
          onMonthChange={setSelectedMonth}
          onCategoryChange={setSelectedCategory}
          onExportCSV={() => exportToCSV(transactions, selectedMonth !== 'all' ? selectedMonth : undefined)}
          transactionCount={transactions.length}
        />
      </div>

      {/* Table */}
      <div className="fade-up fade-up-2">
        {loading ? (
          <div className="space-y-2">
            {[1,2,3,4].map(i => <div key={i} className="skeleton h-16 rounded-xl" />)}
          </div>
        ) : (
          <TransactionsTable transactions={transactions} onEdit={t => { setEditingTransaction(t); setShowForm(true) }} onDelete={id => setTransactions(p => p.filter(t => t.id !== id))} />
        )}
      </div>

      {/* Modal */}
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
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-base" style={{ color: 'rgb(var(--text))' }}>
                  {editingTransaction ? 'Editar transacción' : 'Nueva transacción'}
                </h2>
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="w-7 h-7 rounded-full flex items-center justify-center transition-all"
                  style={{ background: 'rgba(var(--glass-border))', color: 'rgb(var(--text-2))' }}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <TransactionForm categories={categories} categoriesLoading={categoriesLoading} transaction={editingTransaction} onSuccess={handleSuccess} onCancel={handleCloseForm} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
