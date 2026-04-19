"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { config, expand } from "@/lib/config"

export function StickyNav() {
  const cta = config.visual.hero.cta
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur border-b border-[#eee]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-8 py-5">
        <Link
          href="/"
          className={`text-lg font-black tracking-tight uppercase transition-colors ${
            scrolled ? "text-slate" : "text-white drop-shadow-sm"
          }`}
        >
          {expand(config.business.name || config.visual.displayName)}
        </Link>
        <Link
          href={cta.href}
          className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
            scrolled
              ? "bg-slate text-white hover:opacity-90"
              : "bg-accent text-slate hover:opacity-90"
          }`}
        >
          {cta.label}
        </Link>
      </div>
    </header>
  )
}
