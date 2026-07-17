import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month') // formato YYYY-MM
    if (!month) return NextResponse.json({ error: 'Falta el parámetro month' }, { status: 400 })

    const [year, mon] = month.split('-').map(Number)
    const start = new Date(year, mon - 1, 1).toISOString().split('T')[0]
    const end   = new Date(year, mon, 0).toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('Transaction')
      .select('id, amount, description, date, category:Category(name, type, isEssential)')
      .eq('userId', user.id)
      .gte('date', start)
      .lte('date', end)
      .order('date', { ascending: true })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Agrupar por día
    const byDay: Record<string, { income: number; expense: number; transactions: unknown[] }> = {}
    for (const t of data ?? []) {
      const day = t.date.slice(0, 10)
      if (!byDay[day]) byDay[day] = { income: 0, expense: 0, transactions: [] }
      const cat = t.category as unknown as { type: string }
      const type = cat?.type
      if (type === 'income') byDay[day].income += t.amount
      else byDay[day].expense += t.amount
      byDay[day].transactions.push(t)
    }

    return NextResponse.json(byDay)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
