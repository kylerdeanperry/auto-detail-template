"use client"
import { useEffect, useRef, useState } from "react"
import { config, mode } from "@/lib/config"

type Msg = { role: "user" | "assistant"; content: string }

export function ChatPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight)
  }, [messages])

  async function send() {
    if (!input.trim() || loading) return
    const next = [...messages, { role: "user" as const, content: input.trim() }]
    setMessages(next)
    setInput("")
    setLoading(true)
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      })
      const data = await res.json()
      setMessages([...next, { role: "assistant", content: data.content ?? "..." }])
    } catch {
      setMessages([
        ...next,
        { role: "assistant", content: "Sorry, something broke. Please try again or call us directly." },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-24 right-6 z-50 flex h-[560px] w-[380px] max-w-[calc(100vw-32px)] flex-col rounded-xl border border-stone bg-paper shadow-[0_40px_80px_-20px_rgba(16,25,32,0.35)]">
      <header className="flex items-center justify-between border-b border-stone px-5 py-4">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-bronze">
            § — Virtual Estimator
          </div>
          <div
            className="font-display text-[20px] leading-[1.1] tracking-[-0.015em] text-ink mt-0.5"
            style={{ fontVariationSettings: '"opsz" 48', fontWeight: 450 }}
          >
            {mode === "demo" ? "Ask Elite Painting" : "Chat"}
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="font-mono text-[12px] text-muted hover:text-ink transition"
        >
          Close ×
        </button>
      </header>

      <div
        ref={scrollRef}
        className="flex-grow overflow-y-auto px-5 py-4 text-[14px] leading-[1.55]"
      >
        {messages.length === 0 ? (
          <div className="max-w-[280px] text-[14px] leading-[1.55] text-ink-soft">
            <span className="text-bronze">→</span> {config.chatbot.greeting}
          </div>
        ) : null}
        {messages.map((m, i) => (
          <div key={i} className={`mb-3 ${m.role === "user" ? "text-right" : ""}`}>
            <div
              className={`inline-block max-w-[85%] rounded-md px-3.5 py-2.5 text-[14px] leading-[1.5] ${
                m.role === "user"
                  ? "bg-ink text-paper"
                  : "bg-paper-warm text-ink border border-stone"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading ? (
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-bronze animate-pulse">
            thinking…
          </div>
        ) : null}
      </div>

      <div className="border-t border-stone p-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Describe your project…"
          className="flex-grow rounded-md border border-stone bg-paper px-3 py-2.5 text-[14px] text-ink placeholder:text-muted/70 outline-none focus:border-bronze transition"
        />
        <button
          onClick={send}
          disabled={loading}
          className="rounded-md bg-ink px-4 font-mono text-[11px] uppercase tracking-[0.18em] text-paper transition-colors hover:bg-bronze disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  )
}
