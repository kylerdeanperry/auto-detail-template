import Link from "next/link"
import { config, expand } from "@/lib/config"

export function StickyNav() {
  const cta = config.visual.hero.cta
  return (
    <header className="sticky top-0 z-40 border-b border-[#eee] bg-white">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-8 py-5">
        <Link href="/" className="text-lg font-black tracking-tight uppercase">
          {expand(config.business.name || config.visual.displayName)}
        </Link>
        <Link
          href={cta.href}
          className="rounded-full bg-slate px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          {cta.label}
        </Link>
      </div>
    </header>
  )
}
