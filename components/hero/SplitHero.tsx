import Image from "next/image"
import { config, expand } from "@/lib/config"

export function SplitHero({ variant = "home" }: { variant?: "home" | "page" }) {
  const h = config.visual.hero
  const totalHeight = variant === "home" ? "min(100vh, 900px)" : "min(70vh, 560px)"
  const imagePct = variant === "home" ? "78%" : "70%"
  const bannerPct = variant === "home" ? "22%" : "30%"

  return (
    <section className="relative flex flex-col" style={{ height: totalHeight }}>
      <div className="relative" style={{ height: imagePct }}>
        <Image
          src={h.image}
          alt={h.imageAlt}
          fill
          priority={variant === "home"}
          className="object-cover"
          sizes="100vw"
        />
        {/* Scrim for nav legibility */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/40 to-transparent" />
      </div>
      <div
        className="flex flex-col justify-center bg-accent px-8"
        style={{ height: bannerPct }}
      >
        <div className="mx-auto w-full max-w-[1400px]">
          <div className="text-kicker uppercase text-slate">{expand(h.badge)}</div>
          <h1
            className={
              variant === "home"
                ? "text-hero-mobile md:text-hero text-slate"
                : "text-display text-slate"
            }
          >
            {expand(h.headline)}
          </h1>
        </div>
      </div>
    </section>
  )
}
