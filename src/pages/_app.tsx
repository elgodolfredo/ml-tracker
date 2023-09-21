import { AuthContext, FirebaseProvider } from '@/contexts/AuthContext'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { useContext } from 'react'
import { ChakraProvider, Spinner } from '@chakra-ui/react'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ML-Tracker',
}

function App({ children }: { children: React.ReactNode}) {
  const {waitingForAuth} = useContext(AuthContext);
  return (
    <div className={inter.className}>
      <Navbar />
      <div>
        <main>
            {waitingForAuth ? <Spinner/> : children}
        </main>
      </div>
    </div>
  )
}

function RootLayout({children}: { children: React.ReactNode}) {
  return (
    <ChakraProvider>
      <FirebaseProvider>
        <App>
          {children}
        </App>
      </FirebaseProvider>
    </ChakraProvider>
  )
}

export default function MyApp({ Component, pageProps }: { Component: any, pageProps: any}) {
  return (
    <RootLayout>
      <Component {...pageProps} />
    </RootLayout>
  )
}
