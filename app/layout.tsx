import './globals.css'
import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'SpeedLine - Train Traffic Management System',
  description: 'Real-time train traffic monitoring with AI-driven optimization for modern railway operations',
  keywords: ['train', 'railway', 'traffic management', 'AI optimization', 'real-time monitoring'],
  authors: [{ name: 'SIH 2025 Team' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%236366f1%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22M9 3L5 6.99h3V14h2V6.99h3L9 3z%22/><path d=%22M9 21l4-3.01H10V10H8v7.99H5L9 21z%22/></svg>" />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 font-sans antialiased">
        {children}
      </body>
    </html>
  )
}