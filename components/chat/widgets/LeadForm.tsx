"use client"

import { useState } from "react"

export function LeadForm({ onSubmit }: { onSubmit: (name: string) => void }) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <div className="my-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-[13px] text-emerald-900">
        Thanks — we'll be in touch shortly.
      </div>
    )
  }

  return (
    <form
      className="my-2 rounded-xl bg-paper-warm border border-stone px-4 py-3 space-y-2"
      onSubmit={(e) => {
        e.preventDefault()
        if (!name.trim() || !phone.trim()) return
        setSubmitted(true)
        onSubmit(name.trim())
      }}
    >
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-bronze">
        Quick contact
      </div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Full name"
        className="w-full rounded-md border border-stone bg-paper px-3 py-2 text-[13px] outline-none focus:border-bronze"
        required
      />
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone"
        className="w-full rounded-md border border-stone bg-paper px-3 py-2 text-[13px] outline-none focus:border-bronze"
        required
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email (optional)"
        type="email"
        className="w-full rounded-md border border-stone bg-paper px-3 py-2 text-[13px] outline-none focus:border-bronze"
      />
      <button
        type="submit"
        className="w-full rounded-md bg-ink text-paper font-mono text-[11px] uppercase tracking-[0.18em] py-2 transition-colors hover:bg-bronze"
      >
        Send
      </button>
    </form>
  )
}
