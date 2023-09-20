import { AuthContext, FirebaseProvider } from '@/contexts/AuthContext'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { useContext } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ML-Tracker',
}

function App({ children }: { children: React.ReactNode}) {
  const {user} = useContext(AuthContext);
  return (
    <div className={inter.className}>
        <nav className="header">
          <Link className="header-logo" href="/">Product Tracker</Link>
        </nav>
        <div>
          <main>
              {user ? children: 'Loading...'}
          </main>
        </div>
      </div>
  )
}

function RootLayout({children}: { children: React.ReactNode}) {
  return (
    <FirebaseProvider>
      <App>
        {children}
      </App>
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