import { config, expand } from "@/lib/config"

export function IntroBand() {
  const intro = config.visual.intro
  return (
    <section className="bg-accent border-t border-slate px-8 py-12">
      <div className="mx-auto max-w-[1400px]">
        <div className="text-kicker uppercase mb-4">{expand(intro.label)}</div>
        <p className="text-xl md:text-2xl font-bold tracking-tight max-w-[760px] leading-snug">
          {expand(intro.body)}
        </p>
      </div>
    </section>
  )
}
