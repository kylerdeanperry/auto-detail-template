"use client"

import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { WidgetHeader } from "./WidgetHeader"
import { WidgetMessages } from "./WidgetMessages"
import { WidgetComposer } from "./WidgetComposer"
import { ProactiveBubble } from "./ProactiveBubble"
import { chatbotEnabled, persona } from "@/lib/chat/config"
import { useChat } from "@ai-sdk/react"

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [bubbleDismissed, setBubbleDismissed] = useState(false)
  const [input, setInput] = useState("")

  const chat = useChat()

  useEffect(() => {
    if (open) setBubbleDismissed(true)
  }, [open])

  const busy = chat.status === "streaming" || chat.status === "submitted"

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || busy) return
    chat.sendMessage({ text })
    setInput("")
  }

  if (!chatbotEnabled) return null

  return (
    <>
      <AnimatePresence>
        {!open && !bubbleDismissed && (
          <ProactiveBubble
            key="proactive"
            text={persona.proactiveBubbleText}
            delayMs={persona.proactiveBubbleDelayMs}
            onDismiss={() => setBubbleDismissed(true)}
            onClick={() => setOpen(true)}
          />
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : `Chat with ${persona.name}`}
        className="group fixed bottom-6 right-6 h-14 w-14 rounded-full overflow-hidden ring-1 ring-bronze/40 shadow-[0_20px_40px_-10px_rgba(16,25,32,0.5)] z-50 transition-transform hover:scale-[1.05]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={persona.avatarUrl}
          alt={persona.name}
          className="h-full w-full object-cover"
        />
        <span
          aria-hidden
          className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-paper animate-pulse"
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-24 right-6 z-50 flex h-[640px] w-[400px] max-w-[calc(100vw-32px)] max-h-[calc(100vh-120px)] flex-col rounded-xl border border-stone bg-paper shadow-[0_40px_80px_-20px_rgba(16,25,32,0.35)] overflow-hidden"
          >
            <WidgetHeader onClose={() => setOpen(false)} />
            <WidgetMessages messages={chat.messages} status={chat.status} />
            <WidgetComposer
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onSubmit={handleSubmit}
              disabled={busy}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
