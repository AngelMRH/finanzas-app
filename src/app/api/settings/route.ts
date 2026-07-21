import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(_request: NextRequest) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { data } = await supabase
    .from('User')
    .select('monthlyBudget')
    .eq('id', user.id)
    .single()

  return NextResponse.json({ monthlyBudget: data?.monthlyBudget ?? null })
}

export async function PUT(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { monthlyBudget } = await request.json()

  const { error: updateError } = await supabase
    .from('User')
    .update({ monthlyBudget: monthlyBudget ? Number(monthlyBudget) : null })
    .eq('id', user.id)

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
