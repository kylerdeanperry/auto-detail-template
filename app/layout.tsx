import type { Metadata, Viewport } from "next"
import { Fraunces, Instrument_Sans, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { config, expand } from "@/lib/config"
import type { CSSProperties } from "react"
import { ChatWidget } from "@/components/chat/Widget"
import { QuoteFormProvider } from "@/components/quote/QuoteFormProvider"
import { QuoteSlideOver } from "@/components/quote/QuoteSlideOver"
import type { IndustryTheme } from "@/types/visual-config"
import "./globals.css"

/**
 * Map the industry-config theme block to the CSS custom properties declared
 * in globals.css. Returns undefined if no theme is present — the defaults
 * (Craftsman Studio / painting) take over.
 */
function themeVarsFor(theme?: IndustryTheme): CSSProperties | undefined {
  if (!theme) return undefined
  return {
    "--paper": theme.paper,
    "--paper-warm": theme.paperWarm,
    "--ink": theme.ink,
    "--ink-soft": theme.inkSoft,
    "--bronze": theme.accent,
    "--bronze-deep": theme.accentDeep,
    "--sage": theme.secondary,
    "--stone": theme.stone,
    "--muted": theme.muted,
  } as CSSProperties
}

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  axes: ["opsz", "SOFT"],
  display: "swap",
})

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap",
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
    <html
      lang="en"
      className={`${fraunces.variable} ${instrumentSans.variable} ${jetbrainsMono.variable}`}
      style={themeVarsFor(config.visual.theme)}
    >
      <body className="bg-paper font-body antialiased text-ink">
        <QuoteFormProvider>
          {children}
          <ChatWidget />
          <QuoteSlideOver />
        </QuoteFormProvider>
        <Analytics />
      </body>
    </html>
  )
}
