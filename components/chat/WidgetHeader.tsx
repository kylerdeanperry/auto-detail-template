"use client"

import { config } from "@/lib/config"
import { persona } from "@/lib/chat/config"

export function WidgetHeader({ onClose }: { onClose: () => void }) {
  return (
    <header className="flex items-center gap-3 border-b border-stone px-4 py-3">
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={persona.avatarUrl}
          alt={persona.name}
          className="h-10 w-10 rounded-full object-cover bg-stone"
        />
        <span
          aria-hidden
          className="absolute -bottom-0.5 -right-0.5 block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-paper animate-pulse"
        />
      </div>
      <div className="flex flex-col leading-tight">
        <span className="font-display text-[15px] text-ink" style={{ fontVariationSettings: '"opsz" 36', fontWeight: 500 }}>
          {persona.name}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-bronze">
          {persona.title}
        </span>
        {config.business.name && (
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
            Built for {config.business.name}
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close chat"
        className="ml-auto font-mono text-[11px] text-muted hover:text-ink transition"
      >
        Close ×
      </button>
    </header>
  )
}
