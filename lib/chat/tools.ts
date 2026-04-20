import { tool, type ToolSet } from "ai"
import { z } from "zod"
import { matchFaq } from "./match-faq"
import type { ClientConfig } from "@/types/config"

export function buildChatTools(
  config: ClientConfig,
  originUrl: string
): ToolSet {
  const slug = (config.meta as { industry: string; clientSlug?: string }).clientSlug ?? config.meta.industry

  return {
    start_exterior_estimate: tool({
      description:
        "Initialize an exterior-painting estimate session. Call when the visitor signals interest in exterior painting.",
      inputSchema: z.object({}),
      execute: async () => {
        // Placeholder — the real estimate row is created by capture_address (geocode).
        return { estimateId: "pending" }
      },
    }),

    capture_address: tool({
      description:
        "Submit the visitor's address after they select from the autocomplete widget. Creates the estimate row and returns home metadata.",
      inputSchema: z.object({
        estimateId: z.string(),
        placeId: z.string(),
        lat: z.number(),
        lng: z.number(),
        formattedAddress: z.string(),
      }),
      execute: async (input) => {
        const res = await fetch(`${originUrl}/api/chat/tool-proxy?endpoint=estimate/geocode`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            slug,
            placeId: input.placeId,
            lat: input.lat,
            lng: input.lng,
            formattedAddress: input.formattedAddress,
          }),
        })
        if (!res.ok) return { error: `geocode ${res.status}` }
        const { data } = (await res.json()) as { data: any }
        return {
          estimateId: data.estimateId,
          sqft: data.sqft,
          stories: data.stories,
          lotSizeSqft: data.lotSizeSqft,
          satelliteImageUrl: data.satelliteImageUrl,
          needsManualInput: data.needsManualInput,
          fallbackApplied: data.fallbackApplied,
        }
      },
    }),

    request_photo: tool({
      description:
        "Ask the visitor for a photo of their home's siding. Renders the photo dropzone widget. Call after capture_address returns.",
      inputSchema: z.object({ estimateId: z.string() }),
      execute: async (input) => ({ shown: true, estimateId: input.estimateId }),
    }),

    generate_quote: tool({
      description:
        "Generate a price-range quote. estimateId must be a real id from capture_address. sqft and stories come from the satellite snapshot.",
      inputSchema: z.object({
        estimateId: z.string(),
        sqft: z.number().int().positive(),
        stories: z.number().int().min(1).max(4),
        paintTier: z.enum(["standard", "premium"]).optional(),
      }),
      execute: async (input) => {
        const res = await fetch(`${originUrl}/api/chat/tool-proxy?endpoint=estimate/quote`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            estimateId: input.estimateId,
            sqft: input.sqft,
            stories: input.stories,
            paintTier: input.paintTier ?? "standard",
          }),
        })
        if (!res.ok) return { error: `quote ${res.status}` }
        const { data } = (await res.json()) as { data: any }
        return {
          priceLow: data.priceLow,
          priceHigh: data.priceHigh,
          prepLevel: data.prepLevel,
          aiBreakdown: data.aiBreakdown,
          includes: data.includes,
        }
      },
    }),

    book_walkthrough: tool({
      description:
        "Book the walkthrough. Requires slotIso from the booking widget.",
      inputSchema: z.object({
        estimateId: z.string(),
        name: z.string(),
        email: z.string(),
        phone: z.string(),
        slotIso: z.string(),
        notes: z.string().optional(),
      }),
      execute: async (input) => {
        const res = await fetch(`${originUrl}/api/chat/tool-proxy?endpoint=estimate/book`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(input),
        })
        if (!res.ok) return { error: `book ${res.status}` }
        const { data } = (await res.json()) as { data: any }
        return {
          jobId: data.jobId,
          provider: "native" as const,
          confirmationMessage: "Walkthrough booked. A confirmation email is on its way.",
        }
      },
    }),

    capture_lead: tool({
      description:
        "Capture a non-exterior or ambiguous lead when the instant estimator doesn't apply. Always include a short description of the work.",
      inputSchema: z.object({
        name: z.string(),
        phone: z.string(),
        email: z.string().optional(),
        description: z.string(),
        jobType: z
          .enum(["interior","cabinets","deck","repair","consultation","service","qualified_lead","other"])
          .default("other"),
      }),
      execute: async (input) => {
        const res = await fetch(`${originUrl}/api/chat/lead`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        })
        if (!res.ok) return { ok: false, error: `lead ${res.status}` }
        const data = await res.json()
        return { ok: true, leadId: (data.leadId as string) ?? null, contactId: (data.contactId as string) ?? null }
      },
    }),

    answer_faq: tool({
      description:
        "Try to answer a visitor question from the painter's seeded FAQ list. Returns {matched, answer?}. If matched:false, fall through to capture_lead.",
      inputSchema: z.object({ question: z.string() }),
      execute: async (input) => {
        const hit = matchFaq(input.question, config.chatbot.faqs)
        if (!hit) return { matched: false as const }
        return { matched: true as const, question: hit.question, answer: hit.answer }
      },
    }),

    end_conversation: tool({
      description:
        "Signal the conversation has naturally ended.",
      inputSchema: z.object({
        outcome: z.enum(["booked", "lead_captured", "abandoned", "faq_only"]),
      }),
      execute: async (input) => ({ ok: true, outcome: input.outcome }),
    }),
  }
}
