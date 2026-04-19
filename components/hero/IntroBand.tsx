import { config, expand } from "@/lib/config"

export function IntroBand() {
  const intro = config.visual.intro
  return (
    <section className="relative bg-paper-warm paper-grain">
      <div className="mx-auto max-w-[1440px] px-6 py-24 md:px-10 md:py-32">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-3">
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-bronze">
              § 01 — {expand(intro.label)}
            </div>
          </div>
          <div className="col-span-12 md:col-span-9">
            <p
              className="font-display text-ink leading-[1.15] text-section max-w-[920px]"
              style={{ fontVariationSettings: '"opsz" 72', fontWeight: 400 }}
            >
              {expand(intro.body)}
            </p>
            <div className="hairline mt-10" aria-hidden />
            <div className="mt-6 grid max-w-[760px] grid-cols-3 gap-6 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
              <div>
                <div className="text-ink font-display text-[28px] leading-none tracking-[-0.02em]">
                  5<span className="text-bronze">yr</span>
                </div>
                <div className="mt-2">Labor warranty</div>
              </div>
              <div>
                <div className="text-ink font-display text-[28px] leading-none tracking-[-0.02em]">
                  {config.business.jobsCompleted || "500+"}
                </div>
                <div className="mt-2">Projects completed</div>
              </div>
              <div>
                <div className="text-ink font-display text-[28px] leading-none tracking-[-0.02em]">
                  48h
                </div>
                <div className="mt-2">On-site walkthrough</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
