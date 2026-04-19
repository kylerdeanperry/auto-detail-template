import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { config, expand } from "@/lib/config"
import { AiFab } from "@/components/fab/AiFab"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: expand(`${config.visual.displayName} — ${config.business.tagline}`),
  description: expand(config.visual.intro.body),
}

export const viewport: Viewport = {
  themeColor: config.branding.primaryColor,
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        {children}
        <AiFab />
        <Analytics />
      </body>
    </html>
  )
}
