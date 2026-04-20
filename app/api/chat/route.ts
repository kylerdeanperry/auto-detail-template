import { streamText, tool, convertToModelMessages, type ToolSet, type UIMessage } from "ai"
import { anthropic } from "@ai-sdk/anthropic"
import { z } from "zod"
import { NextResponse } from "next/server"
import { config, mode } from "@/lib/config"
import { buildSystemPrompt } from "@/lib/chat/build-system-prompt"
import { buildDemoSalesPrompt } from "@/lib/buildDemoSalesPrompt"
import { buildChatTools } from "@/lib/chat/tools"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ?? new URL(req.url).origin

  // Demo mode (prospect inquiry flow) — unchanged behavior, still uses
  // buildDemoSalesPrompt and the submitInquiry tool.
  if (mode === "demo") {
    const tools: ToolSet = {
      submitInquiry: tool({
        description:
          "Submit the contractor's contact info once you have at least business_name + contact_email.",
        inputSchema: z.object({
          business_name: z.string(),
          contact_email: z.string(),
          contact_name: z.string().optional(),
          contact_phone: z.string().optional(),
          website_url: z.string().optional(),
          notes: z.string().optional(),
          monthly_ad_spend: z.string().optional(),
        }),
        execute: async (input) => {
          const res = await fetch(`${origin}/api/prospect-inquiry`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...input,
              notes: input.notes ?? "",
              call_log: messages,
            }),
          })
          if (!res.ok) return { success: false, message: "Could not submit inquiry" }
          const { id } = await res.json()
          return { success: true, id, message: "Got it. Kyler will reach out shortly." }
        },
      }),
    }

    const modelMessages = await convertToModelMessages(messages)
    const result = streamText({
      model: anthropic("claude-sonnet-4-6"),
      system: buildDemoSalesPrompt(config),
      messages: modelMessages,
      tools,
      maxOutputTokens: 400,
    })
    return result.toUIMessageStreamResponse()
  }

  // Client mode — Sarah.
  if (!config.chatbot.enabled) {
    return NextResponse.json({ error: "Chat disabled" }, { status: 403 })
  }

  const tools = buildChatTools(config, origin)
  const modelMessages = await convertToModelMessages(messages)
  const result = streamText({
    model: anthropic("claude-sonnet-4-6"),
    system: buildSystemPrompt(config),
    messages: modelMessages,
    tools,
    maxOutputTokens: 600,
  })
  return result.toUIMessageStreamResponse()
}
