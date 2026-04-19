import Image from "next/image"
import { config } from "@/lib/config"

export function PortfolioGrid() {
  const items = config.visual.portfolio
  return (
    <section className="columns-1 md:columns-2 lg:columns-3 gap-0">
      {items.map((p, i) => (
        <div key={i} className="break-inside-avoid relative">
          <Image
            src={p.image}
            alt={p.caption ?? "Portfolio item"}
            width={800}
            height={600}
            className="w-full h-auto"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {p.caption ? (
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2">
              {p.caption}
            </div>
          ) : null}
        </div>
      ))}
    </section>
  )
}
