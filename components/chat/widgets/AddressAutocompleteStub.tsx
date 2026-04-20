"use client"

import { useState } from "react"

export function AddressAutocompleteStub({ onSubmit }: { onSubmit: (addr: string) => void }) {
  const [addr, setAddr] = useState("")
  return (
    <form
      className="my-2 rounded-xl bg-paper-warm border border-stone p-3"
      onSubmit={(e) => {
        e.preventDefault()
        if (!addr.trim()) return
        onSubmit(addr.trim())
      }}
    >
      <input
        value={addr}
        onChange={(e) => setAddr(e.target.value)}
        placeholder="123 Main St, Seattle WA"
        className="w-full rounded-md border border-stone bg-paper px-3 py-2 text-[13px] outline-none focus:border-bronze"
      />
      <p className="mt-1 text-[10px] text-muted font-mono uppercase tracking-wider">
        Mapbox autocomplete — wired in Plan 3
      </p>
    </form>
  )
}
