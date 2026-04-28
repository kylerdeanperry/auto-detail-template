import Image from "next/image"
import Link from "next/link"
import { config, expand } from "@/lib/config"
import { HeroCtaButton } from "@/components/hero/HeroCtaButton"

/**
 * Editorial Hero — asymmetric, magazine-spread inspired.
 * Full-bleed photography, serif display type that breaks the grid,
 * kicker + headline + subhead + CTA + live phone strip at the bottom.
 *
 * variant="home" renders the full experience.
 * variant="page" renders a compressed version for sub-pages.
 */
type HeroOverride = Partial<{
  image: string
  imageAlt: string
  badge: string
  headline: string
  kicker: string
}>

export function SplitHero({
  variant = "home",
  override,
}: {
  variant?: "home" | "page"
  override?: HeroOverride
}) {
  const base = config.visual.hero
  const h = {
    image: override?.image ?? base.image,
    imageAlt: override?.imageAlt ?? base.imageAlt,
    badge: override?.badge ?? base.badge,
    headline: override?.headline ?? base.headline,
    cta: base.cta,
  }
  const isHome = variant === "home"
  const phone = config.business.phone
  const telHref = phone ? `tel:${phone.replace(/[^0-9+]/g, "")}` : undefined

  return (
    <section
      className={`relative overflow-hidden bg-ink ${
        isHome ? "min-h-[100svh]" : "min-h-[68svh]"
      }`}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={h.image}
          alt={h.imageAlt}
          fill
          priority={isHome}
          className="object-cover brush-reveal"
          sizes="100vw"
        />
        {/* Layered scrims for premium depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/10 to-ink/80" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/55 via-transparent to-transparent md:from-ink/45" aria-hidden />
      </div>

      {/* Top right corner ornament — rule + numeral */}
      <div className="absolute right-8 top-28 md:right-14 md:top-32 z-10 hidden sm:flex items-start gap-4">
        <div className="pt-1">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/60">
            No. 01
          </div>
          <div className="mt-1 h-px w-16 bg-paper/30" />
          <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/60">
            Craftsman Studio
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        className={`relative z-10 mx-auto flex max-w-[1440px] flex-col justify-end gap-10 px-6 pb-14 pt-32 md:px-10 md:pt-36 ${
          isHome ? "min-h-[100svh]" : "min-h-[68svh]"
        }`}
      >
        <div className="max-w-[980px]">
          <div className="reveal-up [animation-delay:100ms]">
            <span className="inline-flex items-center gap-2 font-mono text-[10px] md:text-[11px] uppercase tracking-[0.24em] text-bronze">
              <span className="h-1.5 w-1.5 rounded-full bg-bronze animate-pulse-dot" aria-hidden />
              {expand(h.badge)}
            </span>
          </div>

          <h1
            className={`reveal-up [animation-delay:250ms] mt-6 font-display text-paper ${
              isHome ? "text-hero" : "text-display"
            }`}
            style={{ fontVariationSettings: '"opsz" 144' }}
          >
            {expand(h.headline).split(",").map((part, i, arr) => (
              <span key={i} className="block">
                {part.trim()}
                {i < arr.length - 1 ? "," : ""}
              </span>
            ))}
          </h1>

          {isHome ? (
            <p className="reveal-up [animation-delay:450ms] mt-8 max-w-[560px] font-body text-[17px] md:text-[19px] leading-[1.55] text-paper/80">
              {expand(config.visual.intro.body)}
            </p>
          ) : null}
        </div>

        {isHome ? (
          <div className="reveal-up [animation-delay:650ms] flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-wrap items-center gap-4">
              <HeroCtaButton label={h.cta.label} />
              {telHref ? (
                <Link
                  href={telHref}
                  className="group inline-flex items-center gap-3 rounded-full border border-paper/30 px-6 py-4 font-mono text-[11px] uppercase tracking-[0.2em] text-paper transition-all duration-300 hover:border-paper hover:bg-paper/5"
                >
                  {phone}
                </Link>
              ) : null}
            </div>

            {/* Trust strip — minimalist certifications, per-industry from visual-config */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.2em] text-paper/55">
              {(config.visual.trustStrip ?? ["Licensed · Bonded · Insured"]).map(
                (item, i, arr) => (
                  <span key={i} className="flex items-center gap-x-5">
                    <span>{item}</span>
                    {i < arr.length - 1 ? (
                      <span className="h-3 w-px bg-paper/25" aria-hidden />
                    ) : null}
                  </span>
                ),
              )}
            </div>
          </div>
        ) : null}
      </div>

      {/* Bottom rule */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-paper/15" aria-hidden />
    </section>
  )
}
