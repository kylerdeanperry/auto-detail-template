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

export interface IndustryVisualConfig {
  industrySlug: "hvac" | "roofing" | "painting"
  displayName: string
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
