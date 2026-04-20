"use client"

export function QuoteCardStub({
  state,
}: {
  state: { priceLow: number; priceHigh: number; breakdown: string }
}) {
  const fmt = (n: number) => `$${n.toLocaleString()}`
  return (
    <div className="my-2 rounded-xl bg-paper-warm border border-stone p-4 space-y-3">
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-bronze">
        Ballpark estimate
      </div>
      <div
        className="font-display text-ink leading-[1]"
        style={{ fontVariationSettings: '"opsz" 48', fontWeight: 450, fontSize: 34 }}
      >
        {fmt(state.priceLow)} – {fmt(state.priceHigh)}
      </div>
      <p className="text-[13px] text-ink-soft leading-[1.5]">{state.breakdown}</p>
      <button
        type="button"
        className="w-full rounded-md bg-ink text-paper font-mono text-[11px] uppercase tracking-[0.18em] py-2.5 hover:bg-bronze transition-colors"
      >
        Lock in walkthrough →
      </button>
    </div>
  )
}
