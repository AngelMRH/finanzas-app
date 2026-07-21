import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { seedDefaultCategories } from '@/lib/seed-categories'

export async function POST(request: NextRequest) {
  try {
    const { userId, email, name } = await request.json()

    if (!userId || !email) {
      return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Upsert del usuario
    const { error: upsertError } = await supabase
      .from('User')
      .upsert({ id: userId, email, name: name || null }, { onConflict: 'id' })

    if (upsertError) {
      console.error('Error creando usuario:', upsertError)
      return NextResponse.json({ error: 'Error creando usuario' }, { status: 500 })
    }

    const { count } = await supabase
      .from('Category')
      .select('*', { count: 'exact', head: true })
      .eq('userId', userId)

    if (count === 0) {
      await seedDefaultCategories(userId, supabase)
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error('Error en registro:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
