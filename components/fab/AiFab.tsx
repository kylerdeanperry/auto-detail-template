"use client"
import { useState } from "react"
import { ChatPanel } from "./ChatPanel"

export function AiFab() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Open chat with Elite Painting"}
        className="group fixed bottom-6 right-6 h-14 w-14 rounded-full bg-ink text-paper shadow-[0_20px_40px_-10px_rgba(16,25,32,0.5)] z-50 transition-all duration-500 hover:bg-bronze hover:scale-[1.04]"
      >
        <span className="absolute inset-0 rounded-full ring-1 ring-bronze/40" aria-hidden />
        <span className="relative grid h-full w-full place-items-center font-mono text-[11px] uppercase tracking-[0.18em]">
          {open ? "×" : "Ask"}
        </span>
      </button>
      {open ? <ChatPanel onClose={() => setOpen(false)} /> : null}
    </>
  )
}
