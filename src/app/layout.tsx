import type { Metadata } from 'next'
import { Inter, Roboto_Mono } from 'next/font/google'
import './globals.css'

// Using Inter as a replacement for Geist
const inter = Inter({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

// Using Roboto Mono as a replacement for Geist Mono
const robotoMono = Roboto_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'YouTube Automation System',
  description: 'Advanced YouTube content automation with AI-powered scheduling and trending topic detection'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${robotoMono.variable} antialiased space-bg planet-bg`}>{children}</body>
    </html>
  )
}
