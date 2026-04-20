"use client"

import { useEffect, useState } from "react"

export interface ChatSession {
  conversationId: string
}

export function useChatSession(enabled: boolean): ChatSession | null {
  const [session, setSession] = useState<ChatSession | null>(null)

  useEffect(() => {
    if (!enabled || session) return
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch("/api/chat/session", { method: "POST" })
        if (!res.ok) return
        const data = (await res.json()) as { conversationId: string }
        if (!cancelled) setSession({ conversationId: data.conversationId })
      } catch (err) {
        console.error("[chat] session bootstrap failed", err)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [enabled, session])

  return session
}
