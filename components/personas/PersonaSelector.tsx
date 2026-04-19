import Link from "next/link"
import { config, expand } from "@/lib/config"

export function PersonaSelector() {
  return (
    <section className="border-b border-[#eee]">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 md:grid-cols-3">
        {config.visual.personas.map((p, i) => (
          <Link
            key={i}
            href={p.href}
            className={`group flex items-end justify-between px-8 py-10 ${
              i < 2 ? "md:border-r md:border-[#eee]" : ""
            }`}
          >
            <div>
              <div className="text-kicker uppercase text-[#666] mb-2">
                {expand(p.kicker)}
              </div>
              <div className="text-2xl font-black tracking-tight leading-tight">
                {expand(p.label)}
              </div>
            </div>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent font-black transition group-hover:translate-x-1">
              →
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
