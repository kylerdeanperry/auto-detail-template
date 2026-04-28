"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { config, expand } from "@/lib/config"
import { useQuoteForm } from "@/components/quote/QuoteFormProvider"

export function StickyNav() {
  const cta = config.visual.hero.cta
  const phone = config.business.phone
  const [scrolled, setScrolled] = useState(false)
  const { open } = useQuoteForm()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const telHref = phone ? `tel:${phone.replace(/[^0-9+]/g, "")}` : undefined

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        scrolled
          ? "bg-paper/85 backdrop-blur-md border-b border-stone"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-6 py-4 md:px-10 md:py-5">
        <Link href="/" className="group flex items-baseline gap-3">
          <span
            className={`font-display text-[22px] md:text-[26px] tracking-[-0.02em] transition-colors duration-300 ${
              scrolled ? "text-ink" : "text-paper drop-shadow-[0_1px_12px_rgba(0,0,0,0.35)]"
            }`}
            style={{ fontVariationSettings: '"opsz" 72' }}
          >
            {expand(config.business.name || config.visual.displayName)}
          </span>
          <span
            className={`hidden lg:inline font-mono text-[10px] uppercase tracking-[0.18em] transition-colors duration-300 ${
              scrolled ? "text-muted" : "text-paper/70"
            }`}
          >
            Est. {config.business.founded || "—"}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {[
            { href: "/services", label: "Services" },
            { href: "/portfolio", label: "Portfolio" },
            { href: "/contact", label: "Contact" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`font-mono text-[11px] uppercase tracking-[0.18em] transition-colors duration-300 hover:opacity-70 ${
                scrolled ? "text-ink" : "text-paper"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {telHref ? (
            <Link
              href={telHref}
              className={`hidden sm:inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors duration-300 hover:opacity-70 ${
                scrolled ? "text-ink" : "text-paper"
              }`}
              aria-label={`Call ${phone}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full animate-pulse-dot ${
                  scrolled ? "bg-bronze" : "bg-paper"
                }`}
                aria-hidden
              />
              {phone}
            </Link>
          ) : null}
          <button
            onClick={open}
            className={`group relative inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[12px] font-medium tracking-[0.06em] transition-all duration-300 ${
              scrolled
                ? "bg-ink text-paper hover:bg-bronze-deep"
                : "bg-paper text-ink hover:bg-bronze hover:text-paper"
            }`}
          >
            {cta.label}
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">→</span>
          </button>
        </div>
      </div>
    </header>
  )
}
