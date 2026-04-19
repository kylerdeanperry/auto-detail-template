import Link from "next/link"
import { config, expand } from "@/lib/config"

export function Footer() {
  const f = config.visual.footerCta
  const phone = config.business.phone
  const telHref = phone ? `tel:${phone.replace(/[^0-9+]/g, "")}` : undefined

  return (
    <footer className="relative bg-ink text-paper">
      {/* Big CTA band */}
      <section className="relative overflow-hidden border-b border-paper/10">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(circle at 75% 40%, rgba(155,107,60,0.4), transparent 55%)",
          }}
          aria-hidden
        />
        <div className="absolute inset-0 paper-grain opacity-25" aria-hidden />
        <div className="relative mx-auto max-w-[1440px] px-6 py-24 md:px-10 md:py-32">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-8">
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-bronze">
                § — Start Here
              </div>
              <h2
                className="mt-6 font-display text-hero leading-[0.95] tracking-[-0.035em] text-paper max-w-[900px]"
                style={{ fontVariationSettings: '"opsz" 144', fontWeight: 400 }}
              >
                {expand(f.headline)}
              </h2>
              <p className="mt-6 max-w-[540px] text-[17px] leading-[1.55] text-paper/75">
                {expand(f.subhead)}
              </p>
            </div>
            <div className="col-span-12 md:col-span-4 flex flex-col gap-4 md:items-end justify-end">
              <Link
                href={f.cta.href}
                className="group inline-flex items-center gap-3 rounded-full bg-paper px-7 py-4 font-body text-[14px] font-medium tracking-[0.02em] text-ink transition-all duration-300 hover:bg-bronze hover:text-paper"
              >
                {f.cta.label}
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
              {telHref ? (
                <Link
                  href={telHref}
                  className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-paper/70 hover:text-paper transition"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-bronze animate-pulse-dot" aria-hidden />
                  {phone}
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* Meta footer */}
      <section className="mx-auto max-w-[1440px] px-6 py-10 md:px-10 md:py-14">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2">
            <div
              className="font-display text-[28px] tracking-[-0.02em] text-paper"
              style={{ fontVariationSettings: '"opsz" 72', fontWeight: 500 }}
            >
              {expand(config.business.name || config.visual.displayName)}
            </div>
            <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-paper/50">
              Est. {config.business.founded || "—"} · {config.business.jobsCompleted || "500+"} projects completed
            </div>
            <p className="mt-5 max-w-[360px] text-[14px] leading-[1.55] text-paper/60">
              {expand(config.business.about)}
            </p>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-bronze mb-4">
              Sitemap
            </div>
            <ul className="space-y-2 text-[14px] text-paper/75">
              <li><Link href="/" className="hover:text-paper transition">Home</Link></li>
              <li><Link href="/services" className="hover:text-paper transition">Services</Link></li>
              <li><Link href="/portfolio" className="hover:text-paper transition">Portfolio</Link></li>
              <li><Link href="/contact" className="hover:text-paper transition">Contact</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-bronze mb-4">
              Contact
            </div>
            <ul className="space-y-2 text-[14px] text-paper/75">
              <li>{config.business.phone}</li>
              <li>
                <a
                  href={`mailto:${config.business.email}`}
                  className="hover:text-paper transition"
                >
                  {config.business.email}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-bronze mb-4">
              Service Area
            </div>
            <p className="text-[14px] leading-[1.55] text-paper/75">
              {expand(config.business.serviceArea)}
            </p>
          </div>
        </div>
        <div className="hairline mt-12 opacity-30" aria-hidden />
        <div className="mt-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-paper/40">
          <div>© {new Date().getFullYear()} {expand(config.visual.displayName)}. All rights reserved.</div>
          <div>Craftsman Studio · Licensed · Bonded · Insured</div>
        </div>
      </section>
    </footer>
  )
}
