import Image from "next/image"
import Link from "next/link"
import { expand } from "@/lib/config"
import type { ZPatternRow as Row } from "@/types/visual-config"

export function ZPatternRow({ row, alternating }: { row: Row; alternating: 0 | 1 }) {
  const textSide = (
    <div className="flex flex-col justify-center px-8 py-12 md:py-20">
      <div className="text-kicker uppercase mb-3">{expand(row.label)}</div>
      <h2 className="text-section md:text-display max-w-[480px] mb-4">
        {expand(row.headline)}
      </h2>
      <p className="max-w-[440px] text-sm md:text-base text-[#222]">
        {expand(row.body)}
      </p>
      {row.cta ? (
        <Link
          href={row.cta.href}
          className="mt-6 inline-flex w-fit rounded-full border border-slate px-5 py-2 text-sm font-semibold hover:bg-slate hover:text-white transition"
        >
          {row.cta.label}
        </Link>
      ) : null}
    </div>
  )
  const imageSide = (
    <div className="relative min-h-[320px] md:min-h-[460px]">
      <Image
        src={row.image}
        alt={expand(row.headline)}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  )

  return (
    <section className="grid grid-cols-1 md:grid-cols-2">
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
    </section>
  )
}
