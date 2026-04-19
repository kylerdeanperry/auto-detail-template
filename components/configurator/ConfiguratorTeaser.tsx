import Image from "next/image"
import Link from "next/link"
import { config, expand } from "@/lib/config"

export function ConfiguratorTeaser() {
  const t = config.visual.configuratorTeaser
  if (!t.enabled) return null

  return (
    <section
      className="grid grid-cols-1 md:grid-cols-2"
      style={{
        background: "linear-gradient(135deg, #F4C7A6 0%, #E8B088 50%, #D9A17A 100%)",
      }}
    >
      <div className="flex flex-col justify-center px-8 py-12 md:py-20">
        <h2 className="text-section md:text-display max-w-[420px] mb-4 text-slate">
          {expand(t.headline)}
        </h2>
        <p className="max-w-[420px] text-sm md:text-base text-slate/80 mb-6">
          {expand(t.body)}
        </p>
        <Link
          href={config.visual.hero.cta.href}
          className="inline-flex w-fit rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate hover:bg-slate hover:text-white transition"
        >
          Explore
        </Link>
      </div>
      <div className="relative min-h-[420px] flex items-center justify-center">
        <div className="relative w-[240px] h-[480px]">
          <Image
            src={t.phoneMockImage}
            alt="Configurator mockup"
            fill
            className="object-contain"
            sizes="240px"
          />
        </div>
      </div>
    </section>
  )
}
