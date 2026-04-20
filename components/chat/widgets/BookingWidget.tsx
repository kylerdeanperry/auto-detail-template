"use client"

import { useMemo, useState } from "react"

function nextWeekdaySlots(count = 6): { iso: string; label: string }[] {
  const out: { iso: string; label: string }[] = []
  const base = new Date()
  let day = 1
  while (out.length < count) {
    const d = new Date(base.getTime() + day * 86400_000)
    const dow = d.getDay()
    if (dow === 0 || dow === 6) {
      day++
      continue
    }
    for (const hour of [10, 14]) {
      if (out.length >= count) break
      const slot = new Date(d)
      slot.setHours(hour, 0, 0, 0)
      out.push({
        iso: slot.toISOString(),
        label: slot.toLocaleString(undefined, {
          weekday: "short", month: "short", day: "numeric", hour: "numeric",
        }),
      })
    }
    day++
  }
  return out
}

export function BookingWidget({
  state,
  onBooked,
}: {
  state: { provider: "native" | "calendly"; url?: string }
  onBooked: (slotIso: string) => void
}) {
  const slots = useMemo(() => nextWeekdaySlots(6), [])
  const [booked, setBooked] = useState(false)

  if (state.provider === "calendly") {
    return (
      <div className="my-2 rounded-xl bg-paper-warm border border-stone px-4 py-3 space-y-2">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-bronze">
          Book via Calendly
        </div>
        {state.url ? (
          <a
            href={state.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-md bg-ink text-paper font-mono text-[11px] uppercase tracking-[0.18em] px-3 py-2"
          >
            Open Calendly →
          </a>
        ) : (
          <p className="text-[13px] text-ink-soft">Call the office to book a walkthrough.</p>
        )}
      </div>
    )
  }

  if (booked) {
    return (
      <div className="my-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-[13px] text-emerald-900">
        Booked. Confirmation email coming.
      </div>
    )
  }

  return (
    <div className="my-2 rounded-xl bg-paper-warm border border-stone p-3">
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-bronze mb-2">
        Pick a walkthrough time
      </div>
      <div className="grid grid-cols-2 gap-2">
        {slots.map((s) => (
          <button
            key={s.iso}
            type="button"
            onClick={() => {
              setBooked(true)
              onBooked(s.iso)
            }}
            className="rounded-md border border-stone bg-paper px-3 py-2 text-[13px] text-ink hover:border-bronze hover:bg-paper-warm transition-colors"
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  )
}
