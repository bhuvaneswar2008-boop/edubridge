import type { Metadata, Viewport } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import LiquidBackgroundOrbs from '@/components/LiquidBackgroundOrbs'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#030712',
}

export const metadata: Metadata = {
  title: 'EduBridge | Learn. Practice. Grow.',
  description: 'A modern e-learning platform for Physics, Chemistry, Mathematics and Biology aligned with CBSE Class 5–10 fundamentals.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'EduBridge',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen text-slate-100 selection:bg-blue-500/30 selection:text-white relative">
        <div className="app-fixed-background" aria-hidden="true" />
        <LiquidBackgroundOrbs />
        <Navbar />
        <main className="relative z-10 pt-16 sm:pt-20 pb-28 md:pb-12 min-h-screen px-3.5 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {children}
        </main>
      </body>
    </html>
  )
}
