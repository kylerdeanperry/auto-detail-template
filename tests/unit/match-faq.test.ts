import { describe, expect, it } from "vitest"
import { matchFaq } from "@/lib/chat/match-faq"

const faqs = [
  { question: "Do you do interior painting?", answer: "Yes — interior walls, trim, ceilings, and cabinets." },
  { question: "What areas do you serve?", answer: "Bainbridge Island and North Seattle." },
  { question: "How long does an exterior job take?", answer: "Most single-story homes take 2–4 days." },
]

describe("matchFaq", () => {
  it("returns null on empty question list", () => {
    expect(matchFaq("anything", [])).toBeNull()
  })

  it("hits on exact substring keyword", () => {
    const r = matchFaq("do you do interior?", faqs)
    expect(r).not.toBeNull()
    expect(r!.answer).toContain("interior walls")
  })

  it("hits on keyword overlap", () => {
    const r = matchFaq("what's your service area", faqs)
    expect(r).not.toBeNull()
    expect(r!.answer).toContain("Bainbridge")
  })

  it("returns null when no meaningful overlap", () => {
    expect(matchFaq("what colors do you sell", faqs)).toBeNull()
  })

  it("case-insensitive", () => {
    const r = matchFaq("INTERIOR PAINTING", faqs)
    expect(r).not.toBeNull()
  })
})
