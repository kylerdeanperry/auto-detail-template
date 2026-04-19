import { config, expand } from "@/lib/config"

export function Testimonials() {
  const quotes = config.testimonials
  if (!quotes?.length) return null

  return (
    <section className="relative border-t border-stone bg-paper">
      <div className="mx-auto max-w-[1440px] px-6 py-24 md:px-10 md:py-32">
        <div className="grid grid-cols-12 gap-6 mb-12 md:mb-20">
          <div className="col-span-12 md:col-span-3">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-bronze">
              § — Field Notes
            </div>
          </div>
          <div className="col-span-12 md:col-span-9">
            <h2
              className="font-display text-ink text-display max-w-[720px]"
              style={{ fontVariationSettings: '"opsz" 96', fontWeight: 400 }}
            >
              Written by the families whose homes we finished.
            </h2>
          </div>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
          {quotes.slice(0, 4).map((q, i) => (
            <li
              key={i}
              className="relative border-l-2 border-bronze pl-6 md:pl-8"
            >
              <div className="font-display text-bronze text-[64px] leading-none -mt-2 mb-2 select-none" aria-hidden>
                &ldquo;
              </div>
              <p
                className="font-display text-ink text-[22px] md:text-[26px] leading-[1.3] tracking-[-0.015em] max-w-[560px]"
                style={{ fontVariationSettings: '"opsz" 48', fontWeight: 400 }}
              >
                {expand(q.text)}
              </p>
              <footer className="mt-6 flex items-center gap-4">
                <div
                  className="h-10 w-10 rounded-full bg-stone grid place-items-center font-mono text-[11px] text-ink"
                  aria-hidden
                >
                  {q.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <div className="font-body text-[14px] font-medium text-ink">{q.name}</div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mt-0.5">
                    {q.location}
                  </div>
                </div>
                <div className="ml-auto font-mono text-[11px] tracking-[0.18em] text-bronze">
                  {"★".repeat(q.rating)}
                </div>
              </footer>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
