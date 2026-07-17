import { createAdminClient } from '@/lib/supabase/admin'

export async function seedDefaultCategories(userId: string) {
  const supabase = createAdminClient()

  const { count } = await supabase
    .from('Category')
    .select('*', { count: 'exact', head: true })
    .eq('userId', userId)

  if (count && count > 0) return

  const defaults = [
    { name: 'Salario', type: 'income', isEssential: true },
    { name: 'Inversiones', type: 'income', isEssential: true },
    { name: 'Regalos', type: 'income', isEssential: false },
    { name: 'Vivienda', type: 'expense', isEssential: true },
    { name: 'Servicios', type: 'expense', isEssential: true },
    { name: 'Supermercado', type: 'expense', isEssential: true },
    { name: 'Transporte', type: 'expense', isEssential: true },
    { name: 'Restaurantes', type: 'expense', isEssential: false },
    { name: 'Ocio', type: 'expense', isEssential: false },
    { name: 'Compras', type: 'expense', isEssential: false },
    { name: 'Suscripciones', type: 'expense', isEssential: false },
  ]

  await supabase.from('Category').insert(
    defaults.map(c => ({ ...c, userId }))
  )
}
