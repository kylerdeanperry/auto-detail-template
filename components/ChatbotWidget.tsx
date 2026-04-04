"use client"

import { useState, useRef, useEffect, useId } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport, UIMessage } from "ai"
import { clientConfig } from "@/config/client.config"

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [showPulse, setShowPulse] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const sessionId = useId()

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: {
        sessionId,
        leadId: clientConfig.meta.clientId || null,
      },
    }),
    messages: [
      {
        id: "greeting",
        role: "assistant" as const,
        parts: [{ type: "text", text: clientConfig.chatbot.greeting }],
      },
    ] as UIMessage[],
  })

  const isLoading = status === "streaming" || status === "submitted"

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    const timer = setTimeout(() => setShowPulse(false), 6000)
    return () => clearTimeout(timer)
  }, [])

  const handleSend = (text: string) => {
    if (!text.trim() || isLoading) return
    sendMessage({ text: text.trim() })
    setInput("")
  }

  if (!clientConfig.chatbot.enabled) return null

  const quickReplies = ["Get a quote", "Check availability", "Book now"]

  return (
    <>
      {/* Chat Panel */}
      <div
        style={{
          position: "fixed",
          bottom: 88,
          right: 24,
          width: 320,
          height: 440,
          zIndex: 50,
          borderRadius: 16,
          border: "0.5px solid #e0e0e0",
          background: "#fff",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          transformOrigin: "bottom right",
          transition: "transform 200ms ease, opacity 200ms ease",
          transform: isOpen ? "scale(1)" : "scale(0.9)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: clientConfig.branding.primaryColor,
            padding: "14px 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22C55E" }} />
            <div>
              <span style={{ fontSize: 13, fontWeight: 500, color: "#fff" }}>
                {clientConfig.business.name}
              </span>
              <span style={{ display: "block", fontSize: 10, color: "rgba(34,197,94,0.8)" }}>
                Online
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            style={{ background: "none", border: "none", color: "#fff", fontSize: 18, cursor: "pointer", padding: 0, lineHeight: 1 }}
          >
            &times;
          </button>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
          {messages.map((message) => {
            const text = message.parts
              .filter((p): p is { type: "text"; text: string } => p.type === "text")
              .map((p) => p.text)
              .join("")

            if (!text) return null

            return (
              <div
                key={message.id}
                style={{
                  display: "flex",
                  justifyContent: message.role === "user" ? "flex-end" : "flex-start",
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    maxWidth: "85%",
                    padding: "10px 14px",
                    fontSize: 13,
                    borderRadius: message.role === "user" ? "12px 12px 4px 12px" : "12px 12px 12px 4px",
                    background: message.role === "user" ? clientConfig.branding.accentColor : "#F3F4F6",
                    color: message.role === "user" ? "#fff" : "#333",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {text}
                </div>
              </div>
            )
          })}

          {/* Typing indicator */}
          {isLoading && (
            <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 8 }}>
              <div style={{ background: "#F3F4F6", borderRadius: "12px 12px 12px 4px", padding: "10px 14px", display: "flex", gap: 4 }}>
                <span className="typing-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "#999", animationDelay: "0ms" }} />
                <span className="typing-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "#999", animationDelay: "150ms" }} />
                <span className="typing-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "#999", animationDelay: "300ms" }} />
              </div>
            </div>
          )}

          {/* Quick replies */}
          {messages.length <= 1 && !isLoading && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
              {quickReplies.map((reply) => (
                <button
                  key={reply}
                  onClick={() => handleSend(reply)}
                  style={{
                    background: "#fff",
                    border: "0.5px solid #e0e0e0",
                    borderRadius: 99,
                    fontSize: 12,
                    padding: "6px 14px",
                    cursor: "pointer",
                    color: "#333",
                    transition: "background 150ms",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#F3F4F6")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{ borderTop: "0.5px solid #e8e8e8", padding: "12px 16px", display: "flex", gap: 8, alignItems: "center" }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSend(input)
              }
            }}
            placeholder="Type a message..."
            disabled={isLoading}
            style={{ flex: 1, border: "none", outline: "none", fontSize: 13, background: "transparent" }}
          />
          <button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isLoading}
            style={{
              width: 32, height: 32, borderRadius: "50%",
              background: clientConfig.branding.accentColor,
              border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              opacity: !input.trim() || isLoading ? 0.5 : 1,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M12.5 7L1.5 1.5L3.5 7M12.5 7L1.5 12.5L3.5 7M12.5 7H3.5" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Floating bubble */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        style={{
          position: "fixed", bottom: 24, right: 24,
          width: 52, height: 52, borderRadius: "50%",
          background: clientConfig.chatbot.accentColor,
          border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 50, boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
        }}
      >
        {showPulse && !isOpen && (
          <span
            className="chatbot-pulse"
            style={{
              position: "absolute", width: 52, height: 52, borderRadius: "50%",
              border: `2px solid ${clientConfig.chatbot.accentColor}`,
              animation: "chatbot-pulse-ring 2s ease-out 3",
            }}
          />
        )}
        {isOpen ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15 5L5 15M5 5l10 10" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      <style>{`
        @keyframes chatbot-pulse-ring {
          0% { width: 52px; height: 52px; opacity: 1; }
          100% { width: 72px; height: 72px; opacity: 0; }
        }
        @keyframes typing-bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-4px); }
        }
        .typing-dot { animation: typing-bounce 1.2s infinite; }
      `}</style>
    </>
  )
}
