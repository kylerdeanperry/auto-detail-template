"use client"
import { useEffect, useRef, useState } from "react"
import { mode } from "@/lib/config"

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
    } catch (err) {
      setMessages([...next, { role: "assistant", content: "Sorry, something broke. Please try again." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-24 right-5 w-[360px] max-w-[calc(100vw-32px)] h-[520px] bg-white border-2 border-slate shadow-xl z-50 flex flex-col">
      <div className="flex items-center justify-between bg-slate text-white px-4 py-3">
        <div className="text-sm font-black uppercase">
          {mode === "demo" ? "Talk to Elite Service" : "Chat"}
        </div>
        <button onClick={onClose} aria-label="Close" className="text-white text-xl leading-none">×</button>
      </div>
      <div ref={scrollRef} className="flex-grow overflow-y-auto px-4 py-3 text-sm">
        {messages.length === 0 ? (
          <div className="text-[#666] text-xs">Ask us anything.</div>
        ) : null}
        {messages.map((m, i) => (
          <div key={i} className={`mb-3 ${m.role === "user" ? "text-right" : ""}`}>
            <div className={`inline-block px-3 py-2 rounded ${m.role === "user" ? "bg-slate text-white" : "bg-[#f4f4f4]"}`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading ? <div className="text-xs text-[#666]">…</div> : null}
      </div>
      <div className="border-t border-[#eee] p-2 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type your message"
          className="flex-grow border border-[#ddd] px-3 py-2 text-sm"
        />
        <button onClick={send} disabled={loading} className="bg-slate text-white px-4 text-sm font-semibold">
          Send
        </button>
      </div>
    </div>
  )
}
