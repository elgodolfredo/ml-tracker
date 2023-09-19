import { FirebaseProvider } from '@/contexts/AuthContext'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ML-Tracker',
}

function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <FirebaseProvider>
      <div className={inter.className}>
        <nav className="header">
          <Link className="header-logo" href="/">Product Tracker</Link>
        </nav>
        <div>
          <main>
              {children}
          </main>
        </div>
      </div>
    </FirebaseProvider>
  )
}


export default function MyApp({ Component, pageProps }: { Component: any, pageProps: any}) {
  return (
    <RootLayout>
      <Component {...pageProps} />
    </RootLayout>
  )
}