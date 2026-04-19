export interface Persona {
  label: string
  kicker: string
  href: string
}

export interface ZPatternRow {
  label: string
  headline: string
  body: string
  image: string
  cta?: { label: string; href: string }
}

/**
 * Optional per-industry theme. When present, the values below are injected
 * as CSS custom properties on the <html> element in app/layout.tsx, letting
 * each industry override the Craftsman Studio defaults in globals.css
 * without forking components. Omit this block to use the built-in palette.
 */
export interface IndustryTheme {
  paper: string
  paperWarm: string
  ink: string
  inkSoft: string
  accent: string
  accentDeep: string
  secondary: string
  stone: string
  muted: string
}

export interface TrustItem {
  label: string
  sub: string
}

export interface IndustryVisualConfig {
  industrySlug: "hvac" | "roofing" | "painting"
  displayName: string
  theme?: IndustryTheme
  /** Compact trust strip at the bottom of the hero (3–4 items, label only). */
  trustStrip?: string[]
  /** Full trust band section (4 items with label + sub-label). */
  trustBand?: TrustItem[]
  hero: {
    image: string
    imageAlt: string
    badge: string
    headline: string
    cta: { label: string; href: string }
  }
  intro: {
    label: string
    body: string
  }
  personas: [Persona, Persona, Persona]
  configuratorTeaser: {
    enabled: boolean
    headline: string
    body: string
    phoneMockImage: string
  }
  zPatternRows: ZPatternRow[]
  portfolio: Array<{ image: string; caption?: string }>
  footerCta: {
    headline: string
    subhead: string
    cta: { label: string; href: string }
  }
}
