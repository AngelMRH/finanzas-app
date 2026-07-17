import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { amount, description, date, categoryId, justification } = body

    // Verificar ownership
    const { data: existing } = await supabase
      .from('Transaction')
      .select('id')
      .eq('id', id)
      .eq('userId', user.id)
      .single()

    if (!existing) {
      return NextResponse.json({ error: 'Transacción no encontrada' }, { status: 404 })
    }

    // Verificar categoría
    const { data: category } = await supabase
      .from('Category')
      .select('*')
      .eq('id', categoryId)
      .eq('userId', user.id)
      .single()

    if (!category) {
      return NextResponse.json({ error: 'Categoría no válida' }, { status: 400 })
    }

    if (!category.isEssential && (!justification || justification.trim().length < 10)) {
      return NextResponse.json(
        { error: 'Las compras no esenciales requieren una justificación de al menos 10 caracteres' },
        { status: 400 }
      )
    }

    const { data: transaction, error: updateError } = await supabase
      .from('Transaction')
      .update({
        amount: Number(amount),
        description: description.trim(),
        date: date ? new Date(date).toISOString() : undefined,
        justification: !category.isEssential ? justification?.trim() : null,
        categoryId,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*, category:Category(*)')
      .single()

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
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
    })
  } catch (error) {
    console.error('Error actualizando transacción:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id } = await params

    const { data: existing } = await supabase
      .from('Transaction')
      .select('id')
      .eq('id', id)
      .eq('userId', user.id)
      .single()

    if (!existing) {
      return NextResponse.json({ error: 'Transacción no encontrada' }, { status: 404 })
    }

    const { error: deleteError } = await supabase
      .from('Transaction')
      .delete()
      .eq('id', id)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error eliminando transacción:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
