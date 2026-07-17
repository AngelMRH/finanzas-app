'use client'

import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  async function handleGoogleLogin() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  return (
    <div className="aurora min-h-dvh flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8 fade-up">
        {/* Logo */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500 accent-glow flex items-center justify-center mx-auto">
            <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 className="font-display font-bold text-3xl" style={{color:'rgb(var(--text))'}}>
              FinanzasApp
            </h1>
            <p className="text-sm mt-1" style={{color:'rgb(var(--text-2))'}}>
              Tu dinero, bajo control
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-6 space-y-4">
          <p className="text-center text-sm font-medium" style={{color:'rgb(var(--text-2))'}}>
            Accede con tu cuenta de Google
          </p>
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-white text-slate-800 font-semibold rounded-xl hover:bg-slate-50 active:scale-[0.98] transition-all duration-150 shadow-sm"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuar con Google
          </button>
        </div>

        <p className="text-center text-xs" style={{color:'rgb(var(--text-2))'}}>
          Solo para uso personal · Datos protegidos con Supabase
        </p>
      </div>
    </div>
  )
}
