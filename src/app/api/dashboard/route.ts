import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString()

    // Transacciones del mes con categoría
    const { data: transactions, error: txError } = await supabase
      .from('Transaction')
      .select('*, category:Category(*)')
      .eq('userId', user.id)
      .gte('date', startOfMonth)
      .lte('date', endOfMonth)

    if (txError) {
      return NextResponse.json({ error: txError.message }, { status: 500 })
    }

    const monthlyIncome = (transactions ?? [])
      .filter((t: any) => t.category?.type === 'income')
      .reduce((sum: number, t: any) => sum + t.amount, 0)

    const monthlyExpenses = (transactions ?? [])
      .filter((t: any) => t.category?.type === 'expense')
      .reduce((sum: number, t: any) => sum + t.amount, 0)

    const balance = monthlyIncome - monthlyExpenses

    // Top 3 categorías de gasto
    const expenseByCategory = (transactions ?? [])
      .filter((t: any) => t.category?.type === 'expense')
      .reduce((acc: Record<string, number>, t: any) => {
        const key = t.category?.name ?? 'Otro'
        acc[key] = (acc[key] || 0) + t.amount
        return acc
      }, {})

    const topCategories = Object.entries(expenseByCategory)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([name, amount]) => ({ name, amount }))

    // Últimas 5 transacciones
    const { data: recentTx } = await supabase
      .from('Transaction')
      .select('*, category:Category(*)')
      .eq('userId', user.id)
      .order('date', { ascending: false })
      .limit(5)

    const { data: userRow } = await supabase
      .from('User')
      .select('monthlyBudget')
      .eq('id', user.id)
      .single()

    return NextResponse.json({
      balance,
      monthlyIncome,
      monthlyExpenses,
      monthlyBudget: userRow?.monthlyBudget ?? null,
      topCategories,
      recentTransactions: (recentTx ?? []).map((t: any) => ({
        id: t.id,
        amount: t.amount,
        description: t.description,
        date: t.date,
        category: {
          name: t.category?.name ?? '',
          type: t.category?.type ?? 'expense',
        },
      })),
    })
  } catch (error) {
    console.error('Error en dashboard:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
