import type { SupabaseClient } from '@supabase/supabase-js'

const DEFAULTS = [
  { name: 'Salario',      type: 'income',  isEssential: true  },
  { name: 'Inversiones',  type: 'income',  isEssential: true  },
  { name: 'Regalos',      type: 'income',  isEssential: false },
  { name: 'Vivienda',     type: 'expense', isEssential: true  },
  { name: 'Servicios',    type: 'expense', isEssential: true  },
  { name: 'Supermercado', type: 'expense', isEssential: true  },
  { name: 'Transporte',   type: 'expense', isEssential: true  },
  { name: 'Restaurantes', type: 'expense', isEssential: false },
  { name: 'Ocio',         type: 'expense', isEssential: false },
  { name: 'Compras',      type: 'expense', isEssential: false },
  { name: 'Suscripciones',type: 'expense', isEssential: false },
]

export async function seedDefaultCategories(userId: string, supabase: SupabaseClient) {
  await supabase.from('Category').insert(
    DEFAULTS.map(c => ({ id: crypto.randomUUID(), ...c, userId }))
  )
}
