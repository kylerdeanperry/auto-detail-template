export interface Faq {
  question: string
  answer: string
}

const STOPWORDS = new Set([
  "a","an","the","is","are","do","does","did","you","your","we","our","i","me","my","us",
  "to","of","in","on","at","for","with","about","and","or","but","if","can","could","should",
  "how","what","when","where","why","who","it's","its","s","",
])

function stem(t: string): string {
  if (t.length > 3 && t.endsWith("s")) return t.slice(0, -1)
  return t
}

function tokens(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s']/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 0 && !STOPWORDS.has(t))
    .map(stem)
}

export function matchFaq(question: string, faqs: Faq[]): Faq | null {
  if (faqs.length === 0) return null
  const qt = new Set(tokens(question))
  if (qt.size === 0) return null

  let best: { faq: Faq; score: number } | null = null
  for (const faq of faqs) {
    const ft = new Set(tokens(faq.question))
    if (ft.size === 0) continue
    let overlap = 0
    for (const t of qt) if (ft.has(t)) overlap++
    const score = overlap / Math.min(qt.size, ft.size)
    if (score >= 0.5 && (!best || score > best.score)) {
      best = { faq, score }
    }
  }
  return best?.faq ?? null
}
