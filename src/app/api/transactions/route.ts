import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month')
    const categoryId = searchParams.get('categoryId')

    let query = supabase
      .from('Transaction')
      .select('*, category:Category(*)')
      .eq('userId', user.id)
      .order('date', { ascending: false })

    if (month) {
      const [year, monthNum] = month.split('-').map(Number)
      const start = new Date(year, monthNum - 1, 1).toISOString()
      const end = new Date(year, monthNum, 0, 23, 59, 59).toISOString()
      query = query.gte('date', start).lte('date', end)
    }

    if (categoryId) {
      query = query.eq('categoryId', categoryId)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(
      (data ?? []).map((t: any) => ({
        id: t.id,
        amount: t.amount,
        description: t.description,
        date: t.date,
        justification: t.justification,
        categoryId: t.categoryId,
        category: {
          id: t.category?.id ?? '',
          name: t.category?.name ?? '',
          type: t.category?.type ?? 'expense',
          isEssential: t.category?.isEssential ?? true,
        },
      }))
    )
  } catch (error) {
    console.error('Error obteniendo transacciones:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { amount, description, date, categoryId, justification } = body

    if (!amount || !description || !categoryId) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }

    if (Number(amount) <= 0) {
      return NextResponse.json({ error: 'El monto debe ser mayor a 0' }, { status: 400 })
    }

    // Verificar que la categoría pertenece al usuario
    const { data: category, error: catError } = await supabase
      .from('Category')
      .select('*')
      .eq('id', categoryId)
      .eq('userId', user.id)
      .single()

    if (catError || !category) {
      return NextResponse.json({ error: 'Categoría no válida' }, { status: 400 })
    }

    if (!category.isEssential && (!justification || justification.trim().length < 10)) {
      return NextResponse.json(
        { error: 'Las compras no esenciales requieren una justificación de al menos 10 caracteres' },
        { status: 400 }
      )
    }

    const { data: transaction, error: insertError } = await supabase
      .from('Transaction')
      .insert({
        id: crypto.randomUUID(),
        amount: Number(amount),
        description: description.trim(),
        date: date ? new Date(date).toISOString() : new Date().toISOString(),
        justification: !category.isEssential ? justification?.trim() : null,
        userId: user.id,
        categoryId,
        updatedAt: new Date().toISOString(),
      })
      .select('*, category:Category(*)')
      .single()

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({
      id: transaction.id,
      amount: transaction.amount,
      description: transaction.description,
      date: transaction.date,
      justification: transaction.justification,
      categoryId: transaction.categoryId,
      category: {
        id: (transaction as any).category?.id ?? '',
        name: (transaction as any).category?.name ?? '',
        type: (transaction as any).category?.type ?? 'expense',
        isEssential: (transaction as any).category?.isEssential ?? true,
      },
    }, { status: 201 })
  } catch (error) {
    console.error('Error creando transacción:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
