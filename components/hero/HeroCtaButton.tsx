"use client"
import { useQuoteForm } from "@/components/quote/QuoteFormProvider"

export function HeroCtaButton({ label }: { label: string }) {
  const { open } = useQuoteForm()
  return (
    <button
      onClick={open}
      className="group inline-flex items-center gap-3 rounded-full bg-paper px-7 py-4 font-body text-[14px] font-medium tracking-[0.02em] text-ink transition-all duration-300 hover:bg-bronze hover:text-paper"
    >
      {label}
      <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
    </button>
  )
}
