"use client"

import { useState } from "react"

export function BookingWidgetStub({
  state,
  onBooked,
}: {
  state: { provider: "native" | "calendly"; url?: string }
  onBooked: () => void
}) {
  const [booked, setBooked] = useState(false)
  const slots = ["Tue 10am", "Wed 2pm", "Thu 11am", "Fri 9am"]

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
        Pick a walkthrough time ({state.provider} — stub)
      </div>
      <div className="grid grid-cols-2 gap-2">
        {slots.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              setBooked(true)
              onBooked()
            }}
            className="rounded-md border border-stone bg-paper px-3 py-2 text-[13px] text-ink hover:border-bronze hover:bg-paper-warm transition-colors"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}
