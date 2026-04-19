import Image from "next/image"
import Link from "next/link"
import { config, expand } from "@/lib/config"

export function ConfiguratorTeaser() {
  const t = config.visual.configuratorTeaser
  if (!t.enabled) return null
  const cta = config.visual.hero.cta

  return (
    <section className="relative overflow-hidden bg-ink text-paper">
      {/* Warm bronze wash */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(circle at 20% 30%, rgba(155,107,60,0.35), transparent 55%), radial-gradient(circle at 85% 80%, rgba(74,90,74,0.35), transparent 55%)",
        }}
        aria-hidden
      />
      <div className="absolute inset-0 paper-grain opacity-30" aria-hidden />

      <div className="relative mx-auto grid max-w-[1440px] grid-cols-12 gap-6 px-6 py-24 md:px-10 md:py-32">
        <div className="col-span-12 md:col-span-7 flex flex-col justify-center">
          <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-bronze mb-5">
            § 02 — Virtual Estimator
          </div>
          <h2
            className="font-display text-display text-paper max-w-[640px]"
            style={{ fontVariationSettings: '"opsz" 96', fontWeight: 400 }}
          >
            {expand(t.headline)}
          </h2>
          <p className="mt-6 max-w-[520px] text-[17px] leading-[1.55] text-paper/75">
            {expand(t.body)}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href={cta.href}
              className="group inline-flex items-center gap-3 rounded-full bg-bronze px-7 py-4 font-body text-[14px] font-medium tracking-[0.02em] text-paper transition-all duration-300 hover:bg-paper hover:text-ink"
            >
              {cta.label}
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/55">
              No signup · No obligation
            </div>
          </div>
        </div>

        <div className="col-span-12 md:col-span-5 flex items-center justify-center">
          <div className="relative">
            {/* Decorative swatches ring */}
            <div className="absolute -inset-6 grid grid-cols-4 gap-2 opacity-40" aria-hidden>
              {["#9B6B3C", "#4A5A4A", "#EEE7D8", "#101920"].map((c, i) => (
                <div
                  key={i}
                  className="h-3 w-3 rounded-full"
                  style={{
                    background: c,
                    gridColumn: [1, 4, 1, 4][i],
                    gridRow: [1, 1, 2, 2][i],
                  }}
                />
              ))}
            </div>
            <div className="relative aspect-[9/19] w-[220px] md:w-[260px] overflow-hidden rounded-[36px] border border-paper/15 bg-paper/5 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]">
              <Image
                src={t.phoneMockImage}
                alt="Virtual estimator mockup"
                fill
                className="object-cover"
                sizes="260px"
              />
              {/* iOS-like notch */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 h-5 w-24 rounded-full bg-ink/80" aria-hidden />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
