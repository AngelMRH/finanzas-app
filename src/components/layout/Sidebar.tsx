'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ThemeToggle } from './ThemeToggle'

const navItems = [
  {
    href: '/dashboard',
    label: 'Inicio',
    icon: (active: boolean) => (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    href: '/transactions',
    label: 'Gastos',
    icon: (active: boolean) => (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    href: '/calendar',
    label: 'Calendario',
    icon: (active: boolean) => (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
  },
  {
    href: '/cards',
    label: 'Tarjetas',
    icon: (active: boolean) => (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
  {
    href: '/settings',
    label: 'Perfil',
    icon: (active: boolean) => (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex flex-col w-60 min-h-screen glass border-r border-[rgba(var(--glass-border))] shrink-0">
        {/* Logo */}
        <div className="p-6 pb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
              style={{
                background: 'linear-gradient(135deg, rgba(48,209,88,1) 0%, rgba(10,132,255,0.8) 100%)',
                boxShadow: '0 4px 12px rgba(48,209,88,0.3)',
              }}
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-sm tracking-tight" style={{ color: 'rgb(var(--text))' }}>Finanzas</p>
              <p className="text-xs" style={{ color: 'rgb(var(--text-2))' }}>Personal</p>
            </div>
          </div>
        </div>

        <div className="mx-4 mb-4 h-px" style={{ background: 'rgba(var(--glass-border))' }} />

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-0.5">
          {navItems.map(item => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all duration-150 relative group"
                style={{
                  background: active ? 'rgba(48,209,88,0.12)' : undefined,
                  color: active ? 'rgb(var(--income))' : 'rgb(var(--text-2))',
                }}
              >
                {item.icon(active)}
                {item.label}
                {active && (
                  <div
                    className="ml-auto w-1.5 h-1.5 rounded-full"
                    style={{ background: 'rgb(var(--income))' }}
                  />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 space-y-0.5">
          <div className="mx-1 mb-3 h-px" style={{ background: 'rgba(var(--glass-border))' }} />
          <div className="flex items-center justify-between px-3 py-2 rounded-2xl">
            <span className="text-xs font-medium" style={{ color: 'rgb(var(--text-2))' }}>Apariencia</span>
            <ThemeToggle />
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-2xl text-sm font-medium transition-all hover:bg-red-500/10"
            style={{ color: 'rgb(var(--text-2))' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgb(255,69,58)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgb(var(--text-2))')}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Salir
          </button>
        </div>
      </aside>

      {/* ── Mobile Bottom Tab Bar ── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 pb-safe" style={{ background: 'none' }}>
        <div
          className="mx-3 mb-3 rounded-3xl glass-heavy px-2 py-1"
          style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.4), inset 0 0.5px 0 rgba(255,255,255,0.15)' }}
        >
          <div className="flex items-center justify-around">
            {navItems.map(item => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center gap-1 px-4 py-2.5 rounded-2xl transition-all relative"
                  style={{ color: active ? 'rgb(var(--income))' : 'rgb(var(--text-2))' }}
                >
                  {active && (
                    <div
                      className="absolute inset-0 rounded-2xl"
                      style={{ background: 'rgba(var(--income),0.10)' }}
                    />
                  )}
                  <div className="relative">{item.icon(active)}</div>
                  <span className="text-[10px] font-semibold relative" style={{ letterSpacing: '-0.01em' }}>
                    {item.label}
                  </span>
                </Link>
              )
            })}
            <button
              onClick={handleLogout}
              className="flex flex-col items-center gap-1 px-4 py-2.5 rounded-2xl transition-all"
              style={{ color: 'rgb(var(--text-2))' }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="text-[10px] font-semibold">Salir</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Header ── */}
      <header
        className="md:hidden fixed top-0 inset-x-0 z-40 pt-safe"
        style={{ background: 'rgba(var(--glass-bg))', backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)', borderBottom: '1px solid rgba(var(--glass-border))' }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, rgba(48,209,88,1) 0%, rgba(10,132,255,0.8) 100%)' }}
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-bold text-sm tracking-tight" style={{ color: 'rgb(var(--text))' }}>Finanzas</span>
          </div>
          <ThemeToggle />
        </div>
      </header>
    </>
  )
}
