import { describe, expect, it } from "vitest"
import { buildChatTools } from "@/lib/chat/tools"
import type { ClientConfig } from "@/types/config"

const fakeConfig: ClientConfig = {
  business: { name: "Test", tagline: "", phone: "", email: "", serviceArea: "Area", about: "", founded: "", jobsCompleted: "" },
  branding: {} as any,
  services: [],
  testimonials: [],
  process: [],
  chatbot: {
    enabled: true,
    greeting: "",
    accentColor: "",
    closingGoal: "instant_quote",
    tone: "warm-professional",
    quoteStyle: "range_from_services",
    handoffMethod: "email",
    handoffContact: "",
    qualifyingQuestions: [],
    customInstructions: "",
    persona: { name: "X", title: "Y", avatarUrl: "", proactiveBubbleText: "", proactiveBubbleDelayMs: 3000 },
    faqs: [{ question: "do you paint houses", answer: "Yes." }],
  },
  meta: { industry: "painting", clientId: "c1" },
}

describe("buildChatTools", () => {
  it("exposes all 8 tool names", () => {
    const tools = buildChatTools(fakeConfig, "http://localhost:3000")
    expect(Object.keys(tools).sort()).toEqual([
      "analyze_photo",
      "answer_faq",
      "book_walkthrough",
      "capture_address",
      "capture_lead",
      "end_conversation",
      "generate_quote",
      "start_exterior_estimate",
    ])
  })

  it("answer_faq hits a seeded FAQ and returns matched:true", async () => {
    const tools = buildChatTools(fakeConfig, "http://localhost:3000")
    const result = await tools.answer_faq.execute!(
      { question: "do you paint" },
      { toolCallId: "t1", messages: [] } as any
    )
    expect(result.matched).toBe(true)
    expect(result.answer).toBe("Yes.")
  })

  it("answer_faq misses on unrelated query", async () => {
    const tools = buildChatTools(fakeConfig, "http://localhost:3000")
    const result = await tools.answer_faq.execute!(
      { question: "what is the weather in tokyo" },
      { toolCallId: "t1", messages: [] } as any
    )
    expect(result.matched).toBe(false)
  })

  it("start_exterior_estimate returns a deterministic-looking id", async () => {
    const tools = buildChatTools(fakeConfig, "http://localhost:3000")
    const result = await tools.start_exterior_estimate.execute!(
      {},
      { toolCallId: "t1", messages: [] } as any
    )
    expect(result.estimateId).toMatch(/^est_[a-z0-9]+$/)
  })

  it("generate_quote stub returns a fixed price range", async () => {
    const tools = buildChatTools(fakeConfig, "http://localhost:3000")
    const result = await tools.generate_quote.execute!(
      { estimateId: "est_test", paintTier: "standard" },
      { toolCallId: "t1", messages: [] } as any
    )
    expect(result.priceLow).toBeGreaterThan(0)
    expect(result.priceHigh).toBeGreaterThan(result.priceLow)
  })
})
