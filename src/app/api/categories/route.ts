import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { seedDefaultCategories } from '@/lib/seed-categories'

export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { data, error, count } = await supabase
      .from('Category')
      .select('*', { count: 'exact' })
      .eq('userId', user.id)
      .order('type', { ascending: true })
      .order('name', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (count === 0) {
      await seedDefaultCategories(user.id, supabase)

      const { data: seeded, error: seedError } = await supabase
        .from('Category')
        .select('*')
        .eq('userId', user.id)
        .order('type', { ascending: true })
        .order('name', { ascending: true })

      if (seedError) {
        return NextResponse.json({ error: seedError.message }, { status: 500 })
      }

      return NextResponse.json(seeded)
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error obteniendo categorías:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
