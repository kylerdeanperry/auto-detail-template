import Image from "next/image"
import Link from "next/link"
import { expand } from "@/lib/config"
import type { ZPatternRow as Row } from "@/types/visual-config"

export function ZPatternRow({
  row,
  alternating,
  sectionNumber,
}: {
  row: Row
  alternating: 0 | 1
  sectionNumber?: number
}) {
  const section = typeof sectionNumber === "number" ? sectionNumber : 0

  const textSide = (
    <div className="relative flex flex-col justify-center bg-paper px-8 py-16 md:px-14 md:py-24">
      <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-bronze mb-4">
        § {String(section + 3).padStart(2, "0")} — {expand(row.label)}
      </div>
      <h2
        className="font-display text-display text-ink max-w-[560px]"
        style={{ fontVariationSettings: '"opsz" 96', fontWeight: 450 }}
      >
        {expand(row.headline)}
      </h2>
      <p className="mt-6 max-w-[520px] text-[16px] md:text-[17px] leading-[1.55] text-ink-soft">
        {expand(row.body)}
      </p>
      {row.cta ? (
        <Link
          href={row.cta.href}
          className="group mt-10 inline-flex w-fit items-center gap-3 border-b border-ink pb-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ink transition-colors hover:border-bronze hover:text-bronze"
        >
          {row.cta.label}
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
        </Link>
      ) : null}
    </div>
  )

  const imageSide = (
    <div className="relative min-h-[420px] md:min-h-[560px] bg-paper-warm">
      <Image
        src={row.image}
        alt={expand(row.headline)}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      {/* Corner annotation */}
      <div className="absolute bottom-5 left-5 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/80 bg-ink/40 backdrop-blur-md px-3 py-1.5 rounded-full">
        Plate {String(section + 1).padStart(2, "0")}
      </div>
    </div>
  )

  return (
    <section className="relative border-t border-stone">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {alternating === 0 ? (
          <>
            {textSide}
            {imageSide}
          </>
        ) : (
          <>
            {imageSide}
            {textSide}
          </>
        )}
      </div>
    </section>
  )
}
