"use client"
import { useState } from "react"
import { ChatPanel } from "./ChatPanel"

export function AiFab() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="fixed bottom-5 right-5 w-14 h-14 rounded-full bg-accent border-2 border-slate flex items-center justify-center text-2xl shadow-lg z-50 transition hover:scale-105"
      >
        {open ? "×" : "💬"}
      </button>
      {open ? <ChatPanel onClose={() => setOpen(false)} /> : null}
    </>
  )
}
