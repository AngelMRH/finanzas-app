import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { seedDefaultCategories } from '@/lib/seed-categories'

const ORDER = [
  { column: 'type', ascending: true },
  { column: 'name', ascending: true },
] as const

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
      // Intento 1: cliente del usuario (requiere política INSERT en RLS)
      await seedDefaultCategories(user.id, supabase)

      const { data: afterUser } = await supabase
        .from('Category')
        .select('*')
        .eq('userId', user.id)
        .order('type', { ascending: true })
        .order('name', { ascending: true })

      if (afterUser && afterUser.length > 0) {
        return NextResponse.json(afterUser)
      }

      // Intento 2: cliente admin (bypasa RLS, necesita SUPABASE_SERVICE_ROLE_KEY)
      try {
        const admin = createAdminClient()
        await seedDefaultCategories(user.id, admin)

        const { data: afterAdmin } = await supabase
          .from('Category')
          .select('*')
          .eq('userId', user.id)
          .order('type', { ascending: true })
          .order('name', { ascending: true })

        if (afterAdmin && afterAdmin.length > 0) {
          return NextResponse.json(afterAdmin)
        }
      } catch {
        // SUPABASE_SERVICE_ROLE_KEY no configurado
      }

      // Ambos fallaron — RLS bloquea INSERT y no hay service role key
      return NextResponse.json({ error: 'seed_failed' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error obteniendo categorías:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
