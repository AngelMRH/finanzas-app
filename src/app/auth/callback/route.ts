import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { seedDefaultCategories } from '@/lib/seed-categories'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Crear perfil y categorías por defecto si es la primera vez
      const admin = createAdminClient()
      await admin
        .from('User')
        .upsert(
          {
            id: data.user.id,
            email: data.user.email!,
            name: data.user.user_metadata?.full_name ?? null,
          },
          { onConflict: 'id' }
        )
      const { count } = await admin
        .from('Category')
        .select('*', { count: 'exact', head: true })
        .eq('userId', data.user.id)

      if (count === 0) {
        await seedDefaultCategories(data.user.id, admin)
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
