import { readFile, writeFile, mkdir } from "node:fs/promises"
import { resolve, dirname } from "node:path"
import { z } from "zod"

const ROOT = resolve(__dirname, "..")

const clientConfigSchema = z.object({
  business: z.object({
    name: z.string(),
    tagline: z.string(),
    phone: z.string(),
    email: z.string(),
    serviceArea: z.string(),
    about: z.string(),
    founded: z.string(),
    jobsCompleted: z.string(),
  }),
  branding: z.object({
    primaryColor: z.string(),
    accentColor: z.string(),
    backgroundColor: z.string(),
    logo: z.string(),
    font: z.string(),
  }),
  services: z.array(
    z.object({
      name: z.string(),
      price: z.string(),
      duration: z.string(),
      description: z.string(),
    }),
  ),
  testimonials: z.array(
    z.object({
      name: z.string(),
      location: z.string(),
      text: z.string(),
      rating: z.number(),
    }),
  ),
  process: z.array(
    z.object({
      step: z.string(),
      title: z.string(),
      description: z.string(),
    }),
  ),
  chatbot: z.object({
    enabled: z.boolean(),
    greeting: z.string(),
    accentColor: z.string(),
    closingGoal: z.string(),
    tone: z.string(),
    quoteStyle: z.string(),
    handoffMethod: z.string(),
    handoffContact: z.string(),
    qualifyingQuestions: z.array(z.string()),
    customInstructions: z.string(),
  }),
  meta: z.object({
    industry: z.string(),
    clientId: z.string(),
  }),
})

const visualConfigSchema = z.object({
  industrySlug: z.enum(["hvac", "roofing", "painting"]),
  displayName: z.string(),
  theme: z
    .object({
      paper: z.string(),
      paperWarm: z.string(),
      ink: z.string(),
      inkSoft: z.string(),
      accent: z.string(),
      accentDeep: z.string(),
      secondary: z.string(),
      stone: z.string(),
      muted: z.string(),
    })
    .optional(),
  trustStrip: z.array(z.string()).optional(),
  trustBand: z
    .array(z.object({ label: z.string(), sub: z.string() }))
    .optional(),
  hero: z.object({
    image: z.string(),
    imageAlt: z.string(),
    badge: z.string(),
    headline: z.string(),
    cta: z.object({ label: z.string(), href: z.string() }),
  }),
  intro: z.object({ label: z.string(), body: z.string() }),
  personas: z.tuple([
    z.object({ label: z.string(), kicker: z.string(), href: z.string() }),
    z.object({ label: z.string(), kicker: z.string(), href: z.string() }),
    z.object({ label: z.string(), kicker: z.string(), href: z.string() }),
  ]),
  configuratorTeaser: z.object({
    enabled: z.boolean(),
    headline: z.string(),
    body: z.string(),
    phoneMockImage: z.string(),
  }),
  zPatternRows: z.array(
    z.object({
      label: z.string(),
      headline: z.string(),
      body: z.string(),
      image: z.string(),
      cta: z.object({ label: z.string(), href: z.string() }).optional(),
    }),
  ),
  portfolio: z.array(z.object({ image: z.string(), caption: z.string().optional() })),
  footerCta: z.object({
    headline: z.string(),
    subhead: z.string(),
    cta: z.object({ label: z.string(), href: z.string() }),
  }),
})

async function fetchAgencyOsConfig(slug: string) {
  const url = process.env.AGENCY_OS_URL
  const secret = process.env.INDUSTRY_CONFIG_BUILD_SECRET
  if (!url || !secret) {
    throw new Error("AGENCY_OS_URL and INDUSTRY_CONFIG_BUILD_SECRET required")
  }
  const res = await fetch(`${url}/api/industries/${slug}/config`, {
    headers: { "X-Build-Secret": secret },
  })
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`)
  const { config } = await res.json()
  return clientConfigSchema.parse(config)
}

async function loadFallback(slug: string) {
  const path = resolve(ROOT, `config/fallback/${slug}.json`)
  const raw = await readFile(path, "utf8")
  return clientConfigSchema.parse(JSON.parse(raw))
}

async function loadVisual(slug: string) {
  const path = resolve(ROOT, `config/visual-config/${slug}.json`)
  const raw = await readFile(path, "utf8")
  return visualConfigSchema.parse(JSON.parse(raw))
}

async function loadClient() {
  const path = resolve(ROOT, "config/client-config.json")
  try {
    const raw = await readFile(path, "utf8")
    return clientConfigSchema.parse(JSON.parse(raw))
  } catch {
    return null
  }
}

async function main() {
  const slug = process.env.INDUSTRY_SLUG
  if (!slug) {
    console.error("INDUSTRY_SLUG env var required")
    process.exit(1)
  }

  let business
  try {
    console.log(`Fetching agency-os config for ${slug}...`)
    business = await fetchAgencyOsConfig(slug)
    console.log("✓ Fetched live")
  } catch (err) {
    console.warn(`Fetch failed (${err instanceof Error ? err.message : err}), using fallback`)
    business = await loadFallback(slug)
    console.log("✓ Loaded fallback")
  }

  const visual = await loadVisual(slug)
  const client = await loadClient()

  // Merge: business → visual → client. Visual wins on presentation overlap; client wins on everything.
  let merged: any = { ...business, visual }
  if (client) {
    merged = {
      ...merged,
      business: { ...merged.business, ...client.business },
      branding: { ...merged.branding, ...client.branding },
      services: client.services ?? merged.services,
      chatbot: { ...merged.chatbot, ...client.chatbot },
      meta: { ...merged.meta, ...client.meta },
    }
  }
  merged._mode = client ? "client" : "demo"
  merged._generatedAt = new Date().toISOString()

  const outPath = resolve(ROOT, "config/industry-config.json")
  await mkdir(dirname(outPath), { recursive: true })
  await writeFile(outPath, JSON.stringify(merged, null, 2), "utf8")
  console.log(`✓ Wrote ${outPath} (mode=${merged._mode})`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
