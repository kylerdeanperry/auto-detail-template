import { generateText, tool, type ToolSet } from "ai"
import { anthropic } from "@ai-sdk/anthropic"
import { z } from "zod"
import { NextResponse } from "next/server"
import { config, mode } from "@/lib/config"
import { buildSystemPrompt } from "@/lib/buildSystemPrompt"
import { buildDemoSalesPrompt } from "@/lib/buildDemoSalesPrompt"
import { createClient } from "@supabase/supabase-js"

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

const systemPrompt =
  mode === "demo" ? buildDemoSalesPrompt(config) : buildSystemPrompt(config)

export async function POST(req: Request) {
  const { messages, sessionId, leadId } = await req.json()

  // Conversation logging: client mode only (legacy detailing-site pattern).
  // Demo-mode inquiries are captured via submitInquiry → agency-os leads.
  if (mode === "client" && sessionId) {
    const lastMessage = messages[messages.length - 1]
    if (lastMessage?.role === "user") {
      await getSupabase().from("conversations").insert({
        lead_id: leadId || null,
        session_id: sessionId,
        role: "user",
        content:
          typeof lastMessage.content === "string"
            ? lastMessage.content
            : JSON.stringify(lastMessage.content),
      })
    }
  }

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ?? new URL(req.url).origin

  const tools: ToolSet =
    mode === "demo"
      ? {
          submitInquiry: tool({
            description:
              "Submit the contractor's contact info once you have at least business_name + contact_email. Also pass any other details they provided.",
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
              if (!res.ok) {
                return { success: false, message: "Could not submit inquiry" }
              }
              const { id } = await res.json()
              return {
                success: true,
                id,
                message: "Got it. Kyler will reach out shortly.",
              }
            },
          }),
        }
      : {
          submitBooking: tool({
            description:
              "Submit a booking when you have collected the customer's name, phone, service, and preferred date/time. Call this tool once you have all required details confirmed by the customer.",
            inputSchema: z.object({
              customerName: z.string().describe("Customer's full name"),
              customerPhone: z.string().describe("Customer's phone number"),
              customerEmail: z
                .string()
                .optional()
                .describe("Customer's email (optional)"),
              service: z.string().describe("Name of the service to book"),
              preferredDate: z
                .string()
                .describe("Preferred date (e.g. 'next Tuesday', 'March 15')"),
              preferredTime: z
                .string()
                .describe("Preferred time (e.g. '10am', 'afternoon')"),
              notes: z
                .string()
                .optional()
                .describe("Any additional notes from the customer"),
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
        }

  const result = await generateText({
    model: anthropic("claude-haiku-4-5-20251001"),
    system: systemPrompt,
    messages,
    maxOutputTokens: 300,
    tools,
  })

  if (mode === "client" && sessionId && result.text) {
    await getSupabase().from("conversations").insert({
      lead_id: leadId || null,
      session_id: sessionId,
      role: "assistant",
      content: result.text,
    })
  }

  return NextResponse.json({ content: result.text })
}
