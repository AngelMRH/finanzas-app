import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(_request: NextRequest) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { data, error: dbError } = await supabase
    .from('CreditCard')
    .select('*')
    .eq('userId', user.id)
    .order('createdAt', { ascending: true })

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await request.json()
  const { name, bank, creditLimit, balance, apr, closingDay, dueDay, color } = body

  if (!name || creditLimit == null) {
    return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
  }

  const { data, error: dbError } = await supabase
    .from('CreditCard')
    .insert({
      id: crypto.randomUUID(),
      userId: user.id,
      name: name.trim(),
      bank: (bank || '').trim(),
      creditLimit: Number(creditLimit),
      balance: Number(balance) || 0,
      apr: Number(apr) || 0,
      closingDay: Number(closingDay) || 1,
      dueDay: Number(dueDay) || 15,
      color: color || '#0A84FF',
      updatedAt: new Date().toISOString(),
    })
    .select()
    .single()

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
