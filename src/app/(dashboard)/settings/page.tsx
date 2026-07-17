'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SettingsPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setEmail(data.user.email ?? '')
      setLoading(false)
    })
  }, [])

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white">Configuración</h1>

      <Card className="bg-slate-800 border-slate-700 max-w-md">
        <CardHeader>
          <CardTitle className="text-white text-base">Cuenta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <div className="h-5 bg-slate-700 rounded animate-pulse w-48" />
          ) : (
            <>
              <div>
                <p className="text-xs text-slate-400 mb-1">Email</p>
                <p className="text-white text-sm">{email}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Plan</p>
                <p className="text-white text-sm">Personal (gratuito)</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700 max-w-md">
        <CardHeader>
          <CardTitle className="text-white text-base">Políticas de RLS (Supabase)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-400 text-sm mb-3">
            Ejecuta este SQL en el Editor SQL de Supabase para activar la seguridad por filas:
          </p>
          <pre className="bg-slate-900 rounded-lg p-3 text-xs text-emerald-300 overflow-x-auto whitespace-pre-wrap">
{`-- Habilitar RLS
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Transaction" ENABLE ROW LEVEL SECURITY;

-- User
CREATE POLICY "own_user_select" ON "User"
  FOR SELECT USING (auth.uid()::text = id);
CREATE POLICY "own_user_insert" ON "User"
  FOR INSERT WITH CHECK (auth.uid()::text = id);
CREATE POLICY "own_user_update" ON "User"
  FOR UPDATE USING (auth.uid()::text = id);

-- Category
CREATE POLICY "own_category_select" ON "Category"
  FOR SELECT USING (auth.uid()::text = "userId");
CREATE POLICY "own_category_insert" ON "Category"
  FOR INSERT WITH CHECK (auth.uid()::text = "userId");
CREATE POLICY "own_category_update" ON "Category"
  FOR UPDATE USING (auth.uid()::text = "userId");
CREATE POLICY "own_category_delete" ON "Category"
  FOR DELETE USING (auth.uid()::text = "userId");

-- Transaction
CREATE POLICY "own_transaction_select" ON "Transaction"
  FOR SELECT USING (auth.uid()::text = "userId");
CREATE POLICY "own_transaction_insert" ON "Transaction"
  FOR INSERT WITH CHECK (auth.uid()::text = "userId");
CREATE POLICY "own_transaction_update" ON "Transaction"
  FOR UPDATE USING (auth.uid()::text = "userId");
CREATE POLICY "own_transaction_delete" ON "Transaction"
  FOR DELETE USING (auth.uid()::text = "userId");`}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}
