import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { BiometricsProvider } from '@/hooks/use-biometrics-engine'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'SENTINEL-AI Command Center',
  description: 'Behavioral-AI security command for enterprise networks',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-white text-foreground selection:bg-blue-600/20`}>
        <BiometricsProvider>
          {children}
          <Toaster />
          <Analytics />
        </BiometricsProvider>
      </body>
    </html>
  )
}
