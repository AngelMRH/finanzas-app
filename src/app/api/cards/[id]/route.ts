import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await params
  const { name, bank, creditLimit, balance, apr, closingDay, dueDay, color } = await request.json()

  const { data, error: dbError } = await supabase
    .from('CreditCard')
    .update({
      name: name.trim(),
      bank: (bank || '').trim(),
      creditLimit: Number(creditLimit),
      balance: Number(balance),
      apr: Number(apr),
      closingDay: Number(closingDay),
      dueDay: Number(dueDay),
      color,
      updatedAt: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('userId', user.id)
    .select()
    .single()

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await params

  const { error: dbError } = await supabase
    .from('CreditCard')
    .delete()
    .eq('id', id)
    .eq('userId', user.id)

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return new NextResponse(null, { status: 204 })
}
