import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { clientConfig } from '@/config/client.config'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: `${clientConfig.business.name} | ${clientConfig.business.tagline}`,
  description: clientConfig.business.about,
  keywords: ['auto detailing', 'mobile detailing', 'car wash', 'ceramic coating', clientConfig.business.serviceArea],
  openGraph: {
    title: clientConfig.business.name,
    description: clientConfig.business.tagline,
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: clientConfig.branding.primaryColor,
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Inject branding colors as CSS custom properties
  const brandingStyles = {
    '--color-brand-primary': clientConfig.branding.primaryColor,
    '--color-brand-accent': clientConfig.branding.accentColor,
    '--color-brand-background': clientConfig.branding.backgroundColor,
  } as React.CSSProperties

  return (
    <html lang="en" className={inter.variable} style={brandingStyles}>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
