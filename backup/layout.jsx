'use client';

import { Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/auth-context';
import { PaymentProvider } from '@/lib/payment-context';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <PaymentProvider>
            {children}
          </PaymentProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
