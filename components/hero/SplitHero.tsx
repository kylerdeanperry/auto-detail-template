import Image from "next/image"
import { config, expand } from "@/lib/config"

export function SplitHero({ variant = "home" }: { variant?: "home" | "page" }) {
  const h = config.visual.hero
  const imageHeight = variant === "home" ? "60%" : "50%"
  const bannerHeight = variant === "home" ? "40%" : "50%"
  const totalHeight = variant === "home" ? "min(75vh, 640px)" : "min(50vh, 420px)"

  return (
    <section
      className="relative flex flex-col"
      style={{ height: totalHeight }}
    >
      <div className="relative flex-grow" style={{ height: imageHeight }}>
        <Image
          src={h.image}
          alt={h.imageAlt}
          fill
          priority={variant === "home"}
          className="object-cover"
          sizes="100vw"
        />
      </div>
      <div
        className="flex flex-col justify-center bg-accent px-8"
        style={{ height: bannerHeight }}
      >
        <div className="text-kicker uppercase">{expand(h.badge)}</div>
        <h1 className={variant === "home" ? "text-hero-mobile md:text-hero" : "text-display"}>
          {expand(h.headline)}
        </h1>
      </div>
    </section>
  )
}
