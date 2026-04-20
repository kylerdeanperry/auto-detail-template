import { describe, expect, it } from "vitest"
import { buildSystemPrompt } from "@/lib/chat/build-system-prompt"
import type { ClientConfig } from "@/types/config"

const basePainting: ClientConfig["chatbot"] = {
  enabled: true,
  greeting: "",
  accentColor: "#9B6B3C",
  closingGoal: "instant_quote",
  tone: "warm-professional",
  quoteStyle: "range_from_services",
  handoffMethod: "email",
  handoffContact: "",
  qualifyingQuestions: [],
  customInstructions: "Emphasize the 5-year warranty.",
  persona: {
    name: "Sarah",
    title: "Office Manager",
    avatarUrl: "/personas/sarah-01.jpg",
    proactiveBubbleText: "Hi!",
    proactiveBubbleDelayMs: 3000,
  },
  faqs: [
    { question: "Do you do interior?", answer: "Yes — interior work too." },
  ],
}

const painting: ClientConfig = {
  business: {
    name: "Elite Painting",
    tagline: "",
    phone: "206-555-0100",
    email: "hi@example.com",
    serviceArea: "Bainbridge Island and North Seattle",
    about: "Family-owned painting company.",
    founded: "2012",
    jobsCompleted: "400+",
  },
  branding: {} as any,
  services: [
    { name: "Exterior repaint", price: "$4,000 – $8,000", duration: "2–5 days", description: "Full prep + paint." },
    { name: "Interior repaint", price: "$2,500 – $6,000", duration: "2–4 days", description: "Walls + trim." },
  ],
  testimonials: [],
  process: [],
  chatbot: basePainting,
  meta: { industry: "painting", clientId: "c1" },
}

describe("buildSystemPrompt", () => {
  it("opens with ROLE block naming persona, business, industry, serviceArea", () => {
    const s = buildSystemPrompt(painting)
    expect(s).toMatch(/You are Sarah/)
    expect(s).toMatch(/Office Manager/)
    expect(s).toMatch(/Elite Painting/)
    expect(s).toMatch(/painting/i)
    expect(s).toMatch(/Bainbridge Island/)
  })

  it("includes IDENTITY RULES block forbidding AI disclosure", () => {
    const s = buildSystemPrompt(painting)
    expect(s).toMatch(/Never say ['"]?I am an AI/i)
    expect(s).toMatch(/ChatGPT|Claude|bot/i)
  })

  it("injects services as KNOWLEDGE with price + duration", () => {
    const s = buildSystemPrompt(painting)
    expect(s).toContain("Exterior repaint")
    expect(s).toContain("$4,000 – $8,000")
  })

  it("injects FAQs as KNOWLEDGE", () => {
    const s = buildSystemPrompt(painting)
    expect(s).toContain("Do you do interior?")
    expect(s).toContain("Yes — interior work too.")
  })

  it("instant_quote goal references exterior estimator flow", () => {
    const s = buildSystemPrompt(painting)
    expect(s).toMatch(/virtual estimator|exterior estimator|start_exterior_estimate/i)
  })

  it("TOOL USAGE block names routing tools", () => {
    const s = buildSystemPrompt(painting)
    expect(s).toMatch(/start_exterior_estimate/)
    expect(s).toMatch(/capture_lead/)
    expect(s).toMatch(/answer_faq/)
  })

  it("customInstructions appended last so it overrides", () => {
    const s = buildSystemPrompt(painting)
    const cutoff = s.lastIndexOf("Emphasize the 5-year warranty.")
    expect(cutoff).toBeGreaterThan(s.indexOf("Never say"))
  })

  it("book_consultation closing goal changes GOAL block", () => {
    const config2 = {
      ...painting,
      chatbot: { ...basePainting, closingGoal: "book_consultation" as const },
    }
    const s = buildSystemPrompt(config2)
    expect(s).toMatch(/consultation/i)
    expect(s).not.toMatch(/virtual estimator|exterior estimator/)
  })

  it("tone block switches language", () => {
    const casual = buildSystemPrompt({
      ...painting,
      chatbot: { ...basePainting, tone: "friendly_casual" },
    })
    const urgent = buildSystemPrompt({
      ...painting,
      chatbot: { ...basePainting, tone: "urgent_expert" },
    })
    expect(casual).not.toEqual(urgent)
  })
})
