"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

interface Props {
  onSelect: (v: {
    placeId: string
    lat: number
    lng: number
    formattedAddress: string
  }) => void
}

interface Suggestion {
  mapbox_id: string
  name: string
  place_formatted: string
  full_address?: string
}

export function AddressAutocomplete({ onSelect }: Props) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN_PUBLIC

  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [active, setActive] = useState(0)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const sessionToken = useMemo(() => crypto.randomUUID(), [])

  useEffect(() => {
    if (!token) return
    if (debounceRef.current) clearTimeout(debounceRef.current)
    const q = query.trim()
    if (q.length < 3) {
      setSuggestions([])
      setOpen(false)
      return
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const url = new URL("https://api.mapbox.com/search/searchbox/v1/suggest")
        url.searchParams.set("q", q)
        url.searchParams.set("access_token", token)
        url.searchParams.set("session_token", sessionToken)
        url.searchParams.set("types", "address")
        url.searchParams.set("country", "US")
        url.searchParams.set("language", "en")
        url.searchParams.set("limit", "5")
        const res = await fetch(url.toString())
        const json = await res.json()
        setSuggestions(json?.suggestions ?? [])
        setOpen(true)
        setActive(0)
      } catch {
        setSuggestions([])
      } finally {
        setLoading(false)
      }
    }, 250)
  }, [query, token, sessionToken])

  const pick = useCallback(
    async (s: Suggestion) => {
      if (!token) return
      try {
        const url = new URL(`https://api.mapbox.com/search/searchbox/v1/retrieve/${s.mapbox_id}`)
        url.searchParams.set("access_token", token)
        url.searchParams.set("session_token", sessionToken)
        const res = await fetch(url.toString())
        const json = await res.json()
        const feature = json?.features?.[0]
        const [lng, lat] = feature?.geometry?.coordinates ?? []
        const formatted = feature?.properties?.full_address ?? s.full_address ?? s.place_formatted
        if (typeof lat !== "number" || typeof lng !== "number") return
        onSelect({ placeId: s.mapbox_id, lat, lng, formattedAddress: formatted })
        setOpen(false)
        setQuery(formatted)
      } catch {
        // swallow
      }
    },
    [onSelect, token, sessionToken]
  )

  if (!token) {
    return (
      <div className="my-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-[13px] text-red-900">
        Mapbox token missing. Set `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN_PUBLIC`.
      </div>
    )
  }

  return (
    <div className="my-2 rounded-xl bg-paper-warm border border-stone p-3 relative">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (!open) return
          if (e.key === "ArrowDown") {
            e.preventDefault()
            setActive((a) => Math.min(a + 1, suggestions.length - 1))
          } else if (e.key === "ArrowUp") {
            e.preventDefault()
            setActive((a) => Math.max(a - 1, 0))
          } else if (e.key === "Enter") {
            e.preventDefault()
            const pick0 = suggestions[active]
            if (pick0) pick(pick0)
          } else if (e.key === "Escape") {
            setOpen(false)
          }
        }}
        placeholder="Start typing your address…"
        className="w-full rounded-md border border-stone bg-paper px-3 py-2 text-[13px] outline-none focus:border-bronze"
      />
      {loading && <p className="mt-1 text-[11px] text-muted font-mono">searching…</p>}
      {open && suggestions.length > 0 && (
        <ul className="mt-2 rounded-md border border-stone bg-paper overflow-hidden max-h-56 overflow-y-auto">
          {suggestions.map((s, i) => (
            <li
              key={s.mapbox_id}
              onMouseDown={(e) => {
                e.preventDefault()
                pick(s)
              }}
              className={`px-3 py-2 text-[13px] cursor-pointer ${
                i === active ? "bg-paper-warm text-ink" : "text-ink"
              }`}
            >
              <div className="font-medium">{s.name}</div>
              <div className="text-[11px] text-muted">{s.place_formatted}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
