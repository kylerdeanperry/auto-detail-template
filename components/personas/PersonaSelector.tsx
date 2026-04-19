import Link from "next/link"
import { config, expand } from "@/lib/config"

/**
 * Personas as paint-chip tiles. Each tile has a distinct swatch color
 * drawn from the brand palette. Hover lifts the label and deepens the chip.
 */

const CHIP_COLORS = [
  { bg: "#E2DACA", ink: "#101920", swatch: "#9B6B3C" }, // stone + bronze swatch
  { bg: "#4A5A4A", ink: "#FAF8F5", swatch: "#EEE7D8" }, // sage
  { bg: "#101920", ink: "#FAF8F5", swatch: "#9B6B3C" }, // ink
]

export function PersonaSelector() {
  return (
    <section className="relative border-y border-stone bg-paper">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 md:grid-cols-3">
        {config.visual.personas.map((p, i) => {
          const c = CHIP_COLORS[i % CHIP_COLORS.length]
          return (
            <Link
              key={i}
              href={p.href}
              className={`chip group relative flex flex-col justify-between overflow-hidden px-8 py-12 md:py-20 transition-all duration-500 ${
                i < 2 ? "md:border-r md:border-stone" : ""
              }`}
              style={{ background: c.bg, color: c.ink }}
            >
              <div className="flex items-start justify-between">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] opacity-70">
                  No. {String(i + 1).padStart(2, "0")}
                </div>
                <div
                  className="h-6 w-6 rounded-full transition-transform duration-500 group-hover:scale-[1.4]"
                  style={{ background: c.swatch }}
                  aria-hidden
                />
              </div>
              <div className="mt-24 md:mt-32">
                <div className="font-mono text-[11px] uppercase tracking-[0.2em] opacity-60 mb-3">
                  {expand(p.kicker)}
                </div>
                <div
                  className="font-display text-[32px] md:text-[38px] leading-[1] tracking-[-0.025em] transition-transform duration-500 group-hover:-translate-y-0.5"
                  style={{ fontVariationSettings: '"opsz" 72', fontWeight: 450 }}
                >
                  {expand(p.label)}
                </div>
                <div className="mt-6 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] opacity-70 transition-opacity group-hover:opacity-100">
                  Explore
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
