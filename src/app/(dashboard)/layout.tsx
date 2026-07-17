import { Sidebar } from '@/components/layout/Sidebar'

export const dynamic = 'force-dynamic'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="aurora flex min-h-dvh">
      <Sidebar />
      <main className="flex-1 min-w-0 pb-24 md:pb-0 pt-14 md:pt-0 overflow-x-hidden">
        {children}
      </main>
    </div>
  )
}
