'use client'

import { useEffect, useState, useCallback } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { TransactionForm } from '@/components/transactions/TransactionForm'
import { TransactionsTable } from '@/components/transactions/TransactionsTable'
import { TransactionFilters } from '@/components/transactions/TransactionFilters'
import { exportToCSV } from '@/lib/export-csv'
import { Category, Transaction } from '@/lib/types'

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
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
      .then(d => setCategories(Array.isArray(d) ? d : []))
      .catch(() => setCategories([]))
  }, [])

  useEffect(() => { fetchTransactions() }, [fetchTransactions])

  function handleSuccess(t: Transaction) {
    if (editingTransaction) setTransactions(p => p.map(x => x.id === t.id ? t : x))
    else setTransactions(p => [t, ...p])
    setShowForm(false)
    setEditingTransaction(undefined)
  }

  function handleCloseForm() { setShowForm(false); setEditingTransaction(undefined) }

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

      {/* Dialog */}
      <Dialog open={showForm} onOpenChange={open => { if (!open) handleCloseForm() }}>
        <DialogContent className="glass border-[rgba(var(--glass-border))] max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display font-semibold" style={{color:'rgb(var(--text))'}}>
              {editingTransaction ? 'Editar' : 'Nueva transacción'}
            </DialogTitle>
          </DialogHeader>
          <TransactionForm categories={categories} transaction={editingTransaction} onSuccess={handleSuccess} onCancel={handleCloseForm} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
