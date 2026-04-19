import Link from "next/link"
import { config, expand } from "@/lib/config"

/**
 * Service catalogue styled as paint-chip cards. Each service gets a
 * distinct swatch color drawn from the Craftsman Studio palette,
 * sampled in rotation so the grid reads like a sample book.
 */

const SWATCHES: { bg: string; ink: string; label: string }[] = [
  { bg: "#FAF8F5", ink: "#101920", label: "Bone White" },
  { bg: "#4A5A4A", ink: "#FAF8F5", label: "Cedar Moss" },
  { bg: "#9B6B3C", ink: "#FAF8F5", label: "Warm Bronze" },
  { bg: "#101920", ink: "#FAF8F5", label: "Deep Slate" },
  { bg: "#E2DACA", ink: "#101920", label: "Quarry Stone" },
  { bg: "#3A4149", ink: "#FAF8F5", label: "Graphite" },
]

export function ServiceGrid() {
  return (
    <section className="relative border-t border-stone bg-paper">
      <div className="mx-auto max-w-[1440px] px-6 py-24 md:px-10 md:py-32">
        <div className="grid grid-cols-12 gap-6 mb-14 md:mb-20">
          <div className="col-span-12 md:col-span-3">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-bronze">
              § — The Catalogue
            </div>
          </div>
          <div className="col-span-12 md:col-span-9">
            <h2
              className="font-display text-ink text-display max-w-[780px]"
              style={{ fontVariationSettings: '"opsz" 96', fontWeight: 400 }}
            >
              Six services, one standard of finish.
            </h2>
            <p className="mt-6 max-w-[540px] text-[16px] leading-[1.55] text-ink-soft">
              Whatever surface you hand us — interior walls, century-old trim, a
              cedar deck, a small retail space — the preparation and the finish
              are held to the same bar.
            </p>
          </div>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-stone">
          {config.services.map((s, i) => {
            const sw = SWATCHES[i % SWATCHES.length]
            return (
              <li
                key={i}
                className="chip group flex flex-col bg-paper transition-all duration-500 hover:-translate-y-1"
              >
                {/* Swatch header */}
                <div
                  className="relative flex items-end justify-between px-8 py-10"
                  style={{ background: sw.bg, color: sw.ink }}
                >
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.22em] opacity-70">
                      No. {String(i + 1).padStart(2, "0")} — {sw.label}
                    </div>
                    <div
                      className="mt-14 font-display text-[28px] md:text-[32px] leading-[1.05] tracking-[-0.02em]"
                      style={{ fontVariationSettings: '"opsz" 72', fontWeight: 450 }}
                    >
                      {s.name}
                    </div>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-current opacity-60 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-1">
                    →
                  </div>
                </div>

                {/* Copy */}
                <div className="flex flex-1 flex-col gap-5 px-8 py-8">
                  <div className="flex items-center justify-between border-b border-stone pb-4 font-mono text-[10px] uppercase tracking-[0.2em]">
                    <span className="text-ink">{s.price}</span>
                    <span className="text-muted">{s.duration}</span>
                  </div>
                  <p className="text-[14px] leading-[1.6] text-ink-soft">
                    {expand(s.description)}
                  </p>
                  <Link
                    href="/contact"
                    className="mt-auto inline-flex w-fit items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-bronze"
                  >
                    Quote this service
                    <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
