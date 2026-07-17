'use client'

import { useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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

    const res = await fetch(`/api/transactions?${params.toString()}`)
    if (res.ok) {
      const data = await res.json()
      setTransactions(data)
    }
    setLoading(false)
  }, [selectedMonth, selectedCategory])

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  function handleSuccess(transaction: Transaction) {
    if (editingTransaction) {
      setTransactions(prev => prev.map(t => (t.id === transaction.id ? transaction : t)))
    } else {
      setTransactions(prev => [transaction, ...prev])
    }
    setShowForm(false)
    setEditingTransaction(undefined)
  }

  function handleEdit(transaction: Transaction) {
    setEditingTransaction(transaction)
    setShowForm(true)
  }

  function handleDelete(id: string) {
    setTransactions(prev => prev.filter(t => t.id !== id))
  }

  function handleCloseForm() {
    setShowForm(false)
    setEditingTransaction(undefined)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Transacciones</h1>
          <p className="text-slate-400 text-sm mt-1">
            {transactions.length} transacciones encontradas
          </p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Nueva transacción
        </Button>
      </div>

      <TransactionFilters
        categories={categories}
        selectedMonth={selectedMonth}
        selectedCategory={selectedCategory}
        onMonthChange={setSelectedMonth}
        onCategoryChange={setSelectedCategory}
        onExportCSV={() =>
          exportToCSV(transactions, selectedMonth !== 'all' ? selectedMonth : undefined)
        }
        transactionCount={transactions.length}
      />

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-14 bg-slate-800 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <TransactionsTable
          transactions={transactions}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* base-ui Dialog: onOpenChange(open, eventDetails) — extraemos solo open */}
      <Dialog open={showForm} onOpenChange={(open) => { if (!open) handleCloseForm() }}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingTransaction ? 'Editar transacción' : 'Nueva transacción'}
            </DialogTitle>
          </DialogHeader>
          <TransactionForm
            categories={categories}
            transaction={editingTransaction}
            onSuccess={handleSuccess}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
