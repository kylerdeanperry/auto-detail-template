import { streamText, tool } from "ai"
import { anthropic } from "@ai-sdk/anthropic"
import { z } from "zod"
import { clientConfig } from "@/config/client.config"
import { buildSystemPrompt } from "@/lib/buildSystemPrompt"
import { createClient } from "@supabase/supabase-js"

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

const systemPrompt = buildSystemPrompt(clientConfig)

export async function POST(req: Request) {
  const { messages, sessionId, leadId } = await req.json()

  // Save user message to conversations (FR33)
  const lastMessage = messages[messages.length - 1]
  if (sessionId && lastMessage?.role === "user") {
    await getSupabase().from("conversations").insert({
      lead_id: leadId || null,
      session_id: sessionId,
      role: "user",
      content: typeof lastMessage.content === "string"
        ? lastMessage.content
        : JSON.stringify(lastMessage.content),
    })
  }

  const result = streamText({
    model: anthropic("claude-haiku-4-5-20251001"),
    system: systemPrompt,
    messages,
    maxOutputTokens: 300,
    tools: {
      submitBooking: tool({
        description:
          "Submit a booking when you have collected the customer's name, phone, service, and preferred date/time. Call this tool once you have all required details confirmed by the customer.",
        inputSchema: z.object({
          customerName: z.string().describe("Customer's full name"),
          customerPhone: z.string().describe("Customer's phone number"),
          customerEmail: z.string().optional().describe("Customer's email (optional)"),
          service: z.string().describe("Name of the service to book"),
          preferredDate: z.string().describe("Preferred date (e.g. 'next Tuesday', 'March 15')"),
          preferredTime: z.string().describe("Preferred time (e.g. '10am', 'afternoon')"),
          notes: z.string().optional().describe("Any additional notes from the customer"),
        }),
        execute: async (input) => {
          const { error } = await getSupabase().from("bookings").insert({
            lead_id: leadId || null,
            customer_name: input.customerName,
            customer_phone: input.customerPhone,
            customer_email: input.customerEmail || "",
            service: input.service,
            preferred_date: input.preferredDate,
            preferred_time: input.preferredTime,
            notes: input.notes || "",
          })

          if (error) {
            console.error("[chat] Booking insert error:", error)
            return { success: false, message: "Failed to save booking" }
          }

          return {
            success: true,
            message: `Booking confirmed for ${input.customerName}: ${input.service} on ${input.preferredDate} at ${input.preferredTime}`,
          }
        },
      }),
    },
    onFinish: async ({ text }) => {
      // Save assistant response to conversations (FR33)
      if (sessionId && text) {
        await getSupabase().from("conversations").insert({
          lead_id: leadId || null,
          session_id: sessionId,
          role: "assistant",
          content: text,
        })
      }
    },
  })

  return result.toUIMessageStreamResponse()
}
