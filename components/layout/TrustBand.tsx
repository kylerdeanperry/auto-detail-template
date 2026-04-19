import { config, expand } from "@/lib/config"

/**
 * Minimalist trust band — certifications displayed as a typographic
 * row, not a wall of badges. Legitimacy without the clutter.
 */
export function TrustBand() {
  const items = [
    { label: "Licensed · Bonded · Insured", sub: "Washington State" },
    { label: "EPA Lead Safe", sub: "Renovation, Repair & Paint" },
    { label: "Google Verified", sub: "5.0 — verified reviews" },
    { label: "BBB Accredited", sub: "A+ Rating" },
  ]

  return (
    <section className="relative border-y border-stone bg-paper-warm paper-grain">
      <div className="mx-auto max-w-[1440px] px-6 py-14 md:px-10 md:py-16">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-bronze">
            § — Trust &amp; Legitimacy
          </div>
          <div className="hidden md:block font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            {expand(config.business.serviceArea)}
          </div>
        </div>
        <ul className="grid grid-cols-2 md:grid-cols-4 divide-x divide-stone">
          {items.map((it, i) => (
            <li
              key={i}
              className={`px-4 md:px-6 py-4 ${i < 2 ? "border-b md:border-b-0 border-stone pb-6 md:pb-4" : ""}`}
            >
              <div className="font-display text-[18px] md:text-[20px] leading-[1.15] tracking-[-0.015em] text-ink">
                {it.label}
              </div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                {it.sub}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
