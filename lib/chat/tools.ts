import { tool, type ToolSet } from "ai"
import { z } from "zod"
import { matchFaq } from "./match-faq"
import type { ClientConfig } from "@/types/config"

/**
 * Plan 2: 4 estimator tools are stubbed with mock data. They'll be rewired to
 * the real agency-os `/api/estimate/*` endpoints in Plan 3.
 *
 * Mock data is deliberately plausible so the UI widgets look real during Plan 2
 * manual QA and the system prompt's routing can be validated end-to-end.
 */
export function buildChatTools(
  config: ClientConfig,
  originUrl: string
): ToolSet {
  return {
    start_exterior_estimate: tool({
      description:
        "Initialize an exterior-painting estimate session. Call this as soon as the visitor signals interest in exterior painting. Returns an estimateId to thread through the later tools.",
      inputSchema: z.object({}),
      execute: async () => {
        const estimateId = `est_${Math.random().toString(36).slice(2, 10)}`
        return { estimateId }
      },
    }),

    capture_address: tool({
      description:
        "Submit the visitor's address after they select it from autocomplete. Returns home metadata (sqft, stories, siding material) for the satellite snapshot widget.",
      inputSchema: z.object({
        estimateId: z.string(),
        placeId: z.string().optional(),
        lat: z.number().optional(),
        lng: z.number().optional(),
        formattedAddress: z.string(),
      }),
      execute: async (_input) => {
        return {
          sqft: 2400,
          stories: 2,
          lotSizeSqft: 7200,
          satelliteImageUrl:
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop",
          needsManualInput: false,
          fallbackApplied: false,
        }
      },
    }),

    analyze_photo: tool({
      description:
        "Analyze an uploaded photo of the home's siding. Returns siding material, paint-failure observations, and a condition score 1–5.",
      inputSchema: z.object({
        estimateId: z.string(),
        photoUrl: z.string(),
      }),
      execute: async (input) => {
        return {
          sidingMaterial: "Wood lap",
          paintFailures: ["Peeling on south-facing wall", "Minor cracking on trim"],
          conditionScore: 3,
          photoUrl: input.photoUrl,
        }
      },
    }),

    generate_quote: tool({
      description:
        "Generate a price-range quote from the estimate data collected so far. Trigger QuoteCard widget.",
      inputSchema: z.object({
        estimateId: z.string(),
        paintTier: z.enum(["standard", "premium"]).optional(),
      }),
      execute: async () => {
        return {
          priceLow: 4200,
          priceHigh: 4800,
          prepLevel: "medium",
          aiBreakdown:
            "Based on ~2,400 sqft, 2 stories, wood lap siding with some peeling on the west-facing side.",
          includes: ["Full prep", "Two-coat application", "5-year warranty"],
        }
      },
    }),

    book_walkthrough: tool({
      description:
        "Book the on-site walkthrough after the visitor accepts the quote. Triggers BookingWidget.",
      inputSchema: z.object({
        estimateId: z.string(),
        name: z.string(),
        email: z.string(),
        phone: z.string(),
      }),
      execute: async () => {
        return {
          bookingId: `bk_${Math.random().toString(36).slice(2, 10)}`,
          provider: "native" as const,
          confirmationMessage:
            "Walkthrough scheduled. You'll get a confirmation email shortly.",
        }
      },
    }),

    capture_lead: tool({
      description:
        "Capture a non-exterior or ambiguous lead when the instant estimator doesn't apply (interior, cabinets, decks, FAQ fallthrough, qualified handoff). Always include a short description of the work.",
      inputSchema: z.object({
        name: z.string(),
        phone: z.string(),
        email: z.string().optional(),
        description: z.string(),
        jobType: z
          .enum(["interior", "cabinets", "deck", "repair", "consultation", "service", "qualified_lead", "other"])
          .default("other"),
      }),
      execute: async (input) => {
        const res = await fetch(`${originUrl}/api/chat/lead-stub`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        })
        if (!res.ok) {
          return { ok: false, error: `lead-stub ${res.status}` }
        }
        const data = await res.json()
        return { ok: true, leadId: data.leadId as string }
      },
    }),

    answer_faq: tool({
      description:
        "Try to answer a visitor question from the painter's seeded FAQ list. Returns {matched, answer?}. If matched:false, fall through to capture_lead.",
      inputSchema: z.object({
        question: z.string(),
      }),
      execute: async (input) => {
        const hit = matchFaq(input.question, config.chatbot.faqs)
        if (!hit) return { matched: false as const }
        return { matched: true as const, question: hit.question, answer: hit.answer }
      },
    }),

    end_conversation: tool({
      description:
        "Signal the conversation has naturally ended. Call after a booking is confirmed, a lead is captured, or the visitor has clearly disengaged.",
      inputSchema: z.object({
        outcome: z.enum(["booked", "lead_captured", "abandoned", "faq_only"]),
      }),
      execute: async (input) => {
        return { ok: true, outcome: input.outcome }
      },
    }),
  }
}
