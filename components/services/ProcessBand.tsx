import { config, expand } from "@/lib/config"

export function ProcessBand() {
  const steps = config.process
  if (!steps?.length) return null

  return (
    <section className="relative border-t border-stone bg-paper">
      <div className="mx-auto max-w-[1440px] px-6 py-24 md:px-10 md:py-32">
        <div className="grid grid-cols-12 gap-6 mb-14 md:mb-20">
          <div className="col-span-12 md:col-span-3">
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-bronze">
              § 02 — The Process
            </div>
          </div>
          <div className="col-span-12 md:col-span-9">
            <h2
              className="font-display text-ink text-display max-w-[780px]"
              style={{ fontVariationSettings: '"opsz" 96', fontWeight: 400 }}
            >
              How a project runs, start to finish.
            </h2>
            <p className="mt-6 max-w-[560px] text-[16px] leading-[1.55] text-ink-soft">
              A four-step rhythm — walkthrough, preparation, protection, finish. No surprises, no
              missed mornings, no vague timelines.
            </p>
          </div>
        </div>

        <ol className="relative grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          {/* Connective rule */}
          <div
            className="hidden md:block absolute top-[64px] left-[60px] right-[60px] h-px bg-stone"
            aria-hidden
          />

          {steps.map((s, i) => (
            <li key={i} className="relative flex flex-col gap-5">
              <div className="relative inline-flex h-[80px] w-[80px] items-center justify-center rounded-full bg-paper ring-1 ring-stone">
                <span
                  className="edit-numeral text-[56px] text-bronze"
                  aria-hidden
                >
                  {s.step}
                </span>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted mb-2">
                  Step {s.step}
                </div>
                <h3
                  className="font-display text-[26px] md:text-[30px] leading-[1.05] tracking-[-0.02em] text-ink"
                  style={{ fontVariationSettings: '"opsz" 48', fontWeight: 450 }}
                >
                  {expand(s.title)}
                </h3>
                <p className="mt-3 text-[15px] leading-[1.6] text-ink-soft">
                  {expand(s.description)}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
