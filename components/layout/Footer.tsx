import Link from "next/link"
import { config, expand } from "@/lib/config"

export function Footer() {
  const f = config.visual.footerCta
  return (
    <footer className="border-t border-slate">
      <section className="bg-accent px-8 py-12">
        <div className="mx-auto flex max-w-[1400px] items-center gap-8">
          <div className="h-10 w-10 rounded-full bg-slate" aria-hidden />
          <div>
            <div className="text-xl font-black tracking-tight">{expand(f.headline)}</div>
            <div className="text-xs mt-1">{expand(f.subhead)}</div>
          </div>
          <Link
            href={f.cta.href}
            className="ml-auto rounded-full bg-slate px-5 py-2 text-sm font-semibold text-white"
          >
            {f.cta.label}
          </Link>
        </div>
      </section>
      <div className="bg-accent px-8 py-8 border-t border-slate/20">
        <div className="mx-auto max-w-[1400px] grid grid-cols-2 md:grid-cols-4 gap-6 text-xs">
          <div>
            <div className="font-black uppercase mb-3">Company</div>
            <Link href="/" className="block mb-1">Home</Link>
            <Link href="/services" className="block mb-1">Services</Link>
            <Link href="/portfolio" className="block mb-1">Portfolio</Link>
            <Link href="/contact" className="block mb-1">Contact</Link>
          </div>
          <div>
            <div className="font-black uppercase mb-3">Contact</div>
            <div>{config.business.phone}</div>
            <div>{config.business.email}</div>
          </div>
          <div>
            <div className="font-black uppercase mb-3">Service Area</div>
            <div>{config.business.serviceArea}</div>
          </div>
          <div>
            <div className="font-black uppercase mb-3">{config.visual.displayName}</div>
            <div>Est. {config.business.founded || "—"}</div>
            <div>{config.business.jobsCompleted || ""}</div>
          </div>
        </div>
      </div>
    </footer>
  )
}
