import Image from "next/image"
import { config } from "@/lib/config"

/**
 * Portfolio rendered as a color-library spread. Each entry gets a
 * large editorial tile, a catalog number, and a caption set in
 * monospace below — like a page from a paint sample book.
 */
export function PortfolioGrid() {
  const items = config.visual.portfolio

  return (
    <section className="relative border-t border-stone bg-paper">
      <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-10 md:py-28">
        <div className="grid grid-cols-12 gap-6 mb-14 md:mb-20">
          <div className="col-span-12 md:col-span-3">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-bronze">
              § — The Library
            </div>
          </div>
          <div className="col-span-12 md:col-span-9">
            <h2
              className="font-display text-ink text-display max-w-[780px]"
              style={{ fontVariationSettings: '"opsz" 96', fontWeight: 400 }}
            >
              Recent finishes, photographed the day we packed up.
            </h2>
            <p className="mt-6 max-w-[540px] text-[16px] leading-[1.55] text-ink-soft">
              Interior, exterior, cabinetry, and trim across Bainbridge
              Island and the north Seattle neighborhoods. Browse by discipline
              or by neighborhood.
            </p>
          </div>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-6 gap-x-6 gap-y-14">
          {items.map((p, i) => {
            // Editorial irregular grid: large, medium, medium, large, medium, medium
            const span = i % 6 === 0 || i % 6 === 3 ? "md:col-span-4" : "md:col-span-2"
            return (
              <li key={i} className={`group ${span}`}>
                <figure className="relative overflow-hidden rounded-sm bg-paper-warm">
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src={p.image}
                      alt={p.caption ?? "Portfolio project"}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
                      className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.03]"
                    />
                    {/* Faint grain on hover */}
                    <div className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/10" aria-hidden />
                  </div>
                  <figcaption className="mt-4 flex items-start justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.2em]">
                    <span className="text-bronze">
                      Plate {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-right text-muted max-w-[280px] leading-[1.5]">
                      {p.caption}
                    </span>
                  </figcaption>
                </figure>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
