'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setEmail(data.user.email ?? '')
        setName(data.user.user_metadata?.full_name ?? '')
      }
      setLoading(false)
    })
  }, [])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="p-4 md:p-6 max-w-lg mx-auto">
      <div className="mb-6 fade-up">
        <h1 className="font-display font-bold text-2xl md:text-3xl" style={{color:'rgb(var(--text))'}}>
          Perfil
        </h1>
        <p className="text-sm mt-0.5" style={{color:'rgb(var(--text-2))'}}>
          Información de tu cuenta
        </p>
      </div>

      {/* Cuenta */}
      <div className="glass rounded-2xl p-5 mb-4 fade-up fade-up-1">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 flex items-center justify-center shrink-0">
            <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            {loading ? (
              <>
                <div className="skeleton h-4 w-32 rounded mb-2" />
                <div className="skeleton h-3 w-48 rounded" />
              </>
            ) : (
              <>
                <p className="font-semibold text-sm" style={{color:'rgb(var(--text))'}}>{name || 'Usuario'}</p>
                <p className="text-xs mt-0.5" style={{color:'rgb(var(--text-2))'}}>{email}</p>
              </>
            )}
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-[rgba(var(--glass-border))]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium" style={{color:'rgb(var(--text-2))'}}>Plan</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 font-semibold">Personal · Gratis</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium" style={{color:'rgb(var(--text-2))'}}>Proveedor</span>
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-xs font-medium" style={{color:'rgb(var(--text))'}}>Google</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cerrar sesión */}
      <div className="glass rounded-2xl p-4 fade-up fade-up-2">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-red-500/10 text-red-400"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}
