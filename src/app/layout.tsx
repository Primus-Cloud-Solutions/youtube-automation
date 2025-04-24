import type { Metadata } from 'next'
import { Inter, Roboto_Mono } from 'next/font/google'
import './globals.css'

// Using Inter as a replacement for Geist
const inter = Inter({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap'
})

// Using Roboto Mono as a replacement for Geist Mono
const robotoMono = Roboto_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'YouTube Automation Platform',
  description: 'Advanced YouTube content automation with AI-powered scheduling and trending topic detection'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${robotoMono.variable} antialiased`}>
        {/* Stars animation container */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <div 
              key={i}
              className="star"
              style={{
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 3 + 2}s`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>
        {children}
      </body>
    </html>
  )
}
