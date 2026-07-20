'use client'

import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

const MOCK_TRANSACTIONS = [
  { desc: 'Salario mensual',  cat: 'Ingresos',       amount: '+$20,000', type: 'income'  },
  { desc: 'Supermercado',     cat: 'Alimentación',   amount: '-$2,340',  type: 'expense' },
  { desc: 'Gasolina',         cat: 'Transporte',     amount: '-$850',    type: 'expense' },
  { desc: 'Netflix',          cat: 'Suscripciones',  amount: '-$199',    type: 'expense' },
]

const FEATURES = [
  { emoji: '📊', title: 'Visión completa', desc: 'Balance, ingresos y gastos en tiempo real' },
  { emoji: '📅', title: 'Calendario financiero', desc: 'Cada peso, por día y por mes' },
  { emoji: '🔒', title: 'Datos seguros', desc: 'Cifrado de nivel bancario con Supabase' },
]

export default function LoginPage() {
  const [loading, setLoading] = useState(false)

  async function handleGoogleLogin() {
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  return (
    <div className="min-h-dvh flex">

      {/* ── LEFT: Preview panel (desktop only) ── */}
      <div
        className="hidden lg:flex flex-col flex-1 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #060608 0%, #0c0f14 60%, #060608 100%)' }}
      >
        {/* Aurora blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -left-16 w-[600px] h-[600px] rounded-full float-anim"
            style={{ background: 'radial-gradient(circle, rgba(48,209,88,0.10) 0%, transparent 60%)' }} />
          <div className="absolute -bottom-32 -right-16 w-[500px] h-[500px] rounded-full float-anim-3"
            style={{ background: 'radial-gradient(circle, rgba(10,132,255,0.09) 0%, transparent 60%)' }} />
          <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] rounded-full float-anim-2"
            style={{ background: 'radial-gradient(circle, rgba(255,149,0,0.05) 0%, transparent 60%)' }} />
        </div>

        <div className="relative flex flex-col items-center justify-center flex-1 p-12 gap-8">
          {/* Headline */}
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.25em] mb-3"
              style={{ color: 'rgba(48,209,88,0.7)' }}>
              Finanzas personales
            </p>
            <h2 className="text-[2.6rem] font-bold text-white leading-[1.12]"
              style={{ letterSpacing: '-0.035em' }}>
              Toma el control de<br />tu futuro financiero
            </h2>
            <p className="mt-3 text-base" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Todo lo que necesitas, en un solo lugar
            </p>
          </div>

          {/* Mock balance card */}
          <div className="w-full max-w-[340px] float-anim">
            <div className="rounded-[28px] p-6 mb-3 relative overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.055)',
                border: '1px solid rgba(255,255,255,0.09)',
                boxShadow: '0 24px 64px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.10)',
                backdropFilter: 'blur(20px)',
              }}>
              <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(48,209,88,0.13) 0%, transparent 70%)' }} />

              <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-5"
                style={{ color: 'rgba(255,255,255,0.38)' }}>
                Balance del mes
              </p>

              <div className="flex items-end justify-between mb-5">
                <div>
                  <p className="text-[3rem] font-bold text-white leading-none"
                    style={{ letterSpacing: '-0.04em' }}>
                    $12,450
                  </p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(48,209,88,0.2)' }}>
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="rgb(48,209,88)" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                    </div>
                    <p className="text-xs font-semibold" style={{ color: 'rgb(48,209,88)' }}>
                      +18% vs mes anterior
                    </p>
                  </div>
                </div>

                {/* Mini ring */}
                <svg width="64" height="64" style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
                  <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
                  <circle cx="32" cy="32" r="26" fill="none"
                    stroke="rgb(48,209,88)" strokeWidth="4" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 26}`}
                    strokeDashoffset={`${2 * Math.PI * 26 * (1 - 0.62)}`} />
                </svg>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="rounded-2xl p-3" style={{ background: 'rgba(48,209,88,0.09)' }}>
                  <p className="text-[10px] mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Ingresos</p>
                  <p className="text-lg font-bold" style={{ color: 'rgb(48,209,88)', letterSpacing: '-0.02em' }}>$20,000</p>
                </div>
                <div className="rounded-2xl p-3" style={{ background: 'rgba(255,69,58,0.09)' }}>
                  <p className="text-[10px] mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Gastos</p>
                  <p className="text-lg font-bold" style={{ color: 'rgb(255,69,58)', letterSpacing: '-0.02em' }}>$7,550</p>
                </div>
              </div>
            </div>

            {/* Mock transaction list */}
            <div className="rounded-[24px] overflow-hidden float-anim-3"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}>
              <p className="px-4 pt-3.5 pb-2 text-[10px] font-bold uppercase tracking-[0.18em]"
                style={{ color: 'rgba(255,255,255,0.3)' }}>
                Últimos movimientos
              </p>
              <div>
                {MOCK_TRANSACTIONS.map((t, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-2.5"
                    style={{ borderTop: i > 0 ? '1px solid rgba(255,255,255,0.05)' : undefined }}>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: t.type === 'income' ? 'rgba(48,209,88,0.13)' : 'rgba(255,69,58,0.11)' }}>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke={t.type === 'income' ? 'rgb(48,209,88)' : 'rgb(255,69,58)'} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                        <path d={t.type === 'income' ? 'M5 10l7-7m0 0l7 7m-7-7v18' : 'M19 14l-7 7m0 0l-7-7m7 7V3'} />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{t.desc}</p>
                      <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{t.cat}</p>
                    </div>
                    <p className="text-xs font-bold shrink-0"
                      style={{ color: t.type === 'income' ? 'rgb(48,209,88)' : 'rgb(255,69,58)' }}>
                      {t.amount}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom trust note */}
          <p className="text-[11px] text-center" style={{ color: 'rgba(255,255,255,0.22)' }}>
            Datos de demostración · Tu información real está protegida
          </p>
        </div>
      </div>

      {/* ── RIGHT: Login panel ── */}
      <div
        className="flex flex-col items-center justify-center w-full lg:w-[460px] lg:shrink-0 relative overflow-hidden"
        style={{ background: 'rgb(var(--bg))' }}
      >
        {/* Aurora (mobile only) */}
        <div className="absolute inset-0 lg:hidden pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-20 w-[400px] h-[400px] rounded-full float-anim"
            style={{ background: 'radial-gradient(circle, rgba(var(--income),0.07) 0%, transparent 60%)' }} />
          <div className="absolute -bottom-40 -left-20 w-[350px] h-[350px] rounded-full float-anim-3"
            style={{ background: 'radial-gradient(circle, rgba(var(--apple-blue),0.06) 0%, transparent 60%)' }} />
        </div>

        <div className="relative w-full max-w-sm px-7 py-12 fade-up">

          {/* Brand */}
          <div className="flex flex-col items-center mb-10">
            <div
              className="w-[76px] h-[76px] rounded-[1.6rem] flex items-center justify-center mb-6 glow-pulse"
              style={{
                background: 'linear-gradient(145deg, rgb(48,209,88) 0%, rgb(10,132,255) 100%)',
              }}
            >
              <svg className="w-9 h-9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <h1 className="text-[2.6rem] font-bold mb-2"
              style={{ color: 'rgb(var(--text))', letterSpacing: '-0.04em' }}>
              Finanzas
            </h1>
            <p className="text-[15px] text-center font-medium"
              style={{ color: 'rgb(var(--text-2))' }}>
              Tu dinero, bajo control total
            </p>
          </div>

          {/* Google button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-5 py-[15px] rounded-2xl font-semibold text-[15px] transition-all duration-200 active:scale-[0.97] mb-7 relative overflow-hidden group"
            style={{
              background: 'rgba(255,255,255,0.96)',
              color: '#111',
              boxShadow: '0 2px 16px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)',
            }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{ background: 'linear-gradient(135deg, rgba(66,133,244,0.04) 0%, rgba(52,168,83,0.04) 100%)' }} />
            {loading ? (
              <div className="w-5 h-5 rounded-full border-2 border-gray-300 border-t-gray-600 animate-spin" />
            ) : (
              <svg className="w-5 h-5 shrink-0 relative" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            <span className="relative">{loading ? 'Conectando...' : 'Continuar con Google'}</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-5">
            <div className="flex-1 h-px" style={{ background: 'rgba(var(--glass-border))' }} />
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em]"
              style={{ color: 'rgb(var(--text-2))' }}>
              Por qué Finanzas
            </span>
            <div className="flex-1 h-px" style={{ background: 'rgba(var(--glass-border))' }} />
          </div>

          {/* Features */}
          <div className="space-y-2.5">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-3.5 p-4 rounded-2xl card-lift"
                style={{ background: 'rgba(var(--glass-border))' }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{ background: 'rgba(var(--glass-bg))' }}>
                  {f.emoji}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'rgb(var(--text))' }}>{f.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgb(var(--text-2))' }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-[11px] mt-8" style={{ color: 'rgb(var(--text-2))' }}>
            Solo para uso personal · Tus datos nunca se venden
          </p>
        </div>
      </div>
    </div>
  )
}
