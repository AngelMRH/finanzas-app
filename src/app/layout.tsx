import type { Metadata } from 'next'
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import './globals.css'

const bricolage = Bricolage_Grotesque({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
})

const jakarta = Plus_Jakarta_Sans({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'FinanzasApp',
  description: 'Tu gestor de finanzas personales',
  viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${bricolage.variable} ${jakarta.variable} font-body antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
