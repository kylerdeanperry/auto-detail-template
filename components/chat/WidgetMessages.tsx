"use client"

import { useEffect, useRef } from "react"
import type { UIMessage } from "ai"
import { AssistantBubble } from "./bubbles/AssistantBubble"
import { UserBubble } from "./bubbles/UserBubble"
import { ToolUIBubble } from "./bubbles/ToolUIBubble"
import { TypingDots } from "./TypingDots"
import type { ToolUIState } from "@/lib/chat/types"

function toolOutputToWidget(toolName: string, output: any): ToolUIState | null {
  if (toolName === "generate_quote" && output) {
    return {
      type: "quote_card",
      state: {
        priceLow: output.priceLow,
        priceHigh: output.priceHigh,
        breakdown: output.aiBreakdown ?? "",
      },
    }
  }
  if (toolName === "capture_address" && output) {
    return {
      type: "satellite_snapshot",
      state: {
        imageUrl: output.satelliteImageUrl ?? "",
        sqft: output.sqft,
        stories: output.stories,
        siding: output.sidingMaterial,
      },
    }
  }
  if (toolName === "book_walkthrough" && output) {
    return {
      type: "booking_widget",
      state: { provider: output.provider ?? "native" },
    }
  }
  if (toolName === "request_photo" && output) {
    return {
      type: "photo_dropzone",
      state: { uploaded: false, estimateId: output.estimateId },
    }
  }
  return null
}

export function WidgetMessages({
  messages,
  status,
}: {
  messages: UIMessage[]
  status: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: "smooth" })
  }, [messages, status])

  return (
    <div
      ref={ref}
      className="flex-1 overflow-y-auto px-4 py-4 text-[14px] leading-[1.55]"
    >
      {messages.map((m) => {
        const parts = (m as any).parts as Array<any> | undefined
        const texts = parts
          ? parts.filter((p) => p.type === "text").map((p) => p.text as string)
          : typeof (m as any).content === "string"
          ? [(m as any).content as string]
          : []
        const toolResults: Array<{ name: string; output: any }> = parts
          ? parts
              .filter((p) => typeof p.type === "string" && p.type.startsWith("tool-"))
              .filter((p) => p.state === "output-available" && p.output)
              .map((p) => ({ name: p.type.replace(/^tool-/, ""), output: p.output }))
          : []

        return (
          <div key={m.id}>
            {m.role === "user" &&
              texts.map((t, i) => <UserBubble key={`${m.id}-u${i}`}>{t}</UserBubble>)}
            {m.role === "assistant" &&
              texts.map((t, i) => <AssistantBubble key={`${m.id}-a${i}`}>{t}</AssistantBubble>)}
            {m.role === "assistant" &&
              toolResults.map((tr, i) => {
                const widget = toolOutputToWidget(tr.name, tr.output)
                if (!widget) return null
                return (
                  <ToolUIBubble
                    key={`${m.id}-w${i}`}
                    widget={widget}
                    onSubmit={(_txt) => {
                      /* Plan 3 will dispatch a synthetic user message */
                    }}
                  />
                )
              })}
          </div>
        )
      })}

      {(status === "submitted" || status === "streaming") && (
        <AssistantBubble>
          <TypingDots />
        </AssistantBubble>
      )}
    </div>
  )
}
