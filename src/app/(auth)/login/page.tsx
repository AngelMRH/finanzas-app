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
    <div className="aurora min-h-dvh flex items-center justify-center p-6 relative overflow-hidden">
      <div className="w-full max-w-sm relative fade-up">

        {/* Icon + Brand */}
        <div className="flex flex-col items-center mb-10">
          <div
            className="w-28 h-28 rounded-[2.5rem] flex items-center justify-center mb-7"
            style={{
              background: 'linear-gradient(145deg, rgba(48,209,88,1) 0%, rgba(10,132,255,0.85) 100%)',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.15) inset, 0 8px 40px rgba(48,209,88,0.4), 0 0 80px rgba(10,132,255,0.2)',
            }}
          >
            <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h1
            className="text-5xl font-bold"
            style={{ color: 'rgb(var(--text))', letterSpacing: '-0.035em', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}
          >
            Finanzas
          </h1>
          <p className="text-lg mt-2 font-medium" style={{ color: 'rgb(var(--text-2))' }}>
            Tu dinero, bajo control
          </p>
        </div>

        {/* Card */}
        <div className="glass-heavy rounded-3xl p-7 space-y-6">

          {/* Google button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3.5 px-5 py-4 rounded-2xl font-semibold text-sm transition-all duration-150 active:scale-[0.97]"
            style={{
              background: 'rgba(255,255,255,0.95)',
              color: '#111',
              boxShadow: '0 2px 24px rgba(0,0,0,0.18), inset 0 0.5px 0 rgba(255,255,255,1)',
            }}
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuar con Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: 'rgba(var(--glass-border))' }} />
            <span className="text-xs font-medium" style={{ color: 'rgb(var(--text-2))' }}>Características</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(var(--glass-border))' }} />
          </div>

          {/* Feature list */}
          <div className="space-y-3">
            {[
              { icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
              ), text: 'Control de ingresos y gastos', color: 'var(--income)' },
              { icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              ), text: 'Calendario financiero mensual', color: 'var(--apple-blue)' },
              { icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              ), text: 'Datos protegidos con Supabase', color: 'var(--text-2)' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `rgba(${f.color}, 0.12)`, color: `rgb(${f.color})` }}
                >
                  {f.icon}
                </div>
                <p className="text-sm" style={{ color: 'rgb(var(--text))' }}>{f.text}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: 'rgb(var(--text-2))' }}>
          Solo para uso personal · v1.0
        </p>
      </div>
    </div>
  )
}
