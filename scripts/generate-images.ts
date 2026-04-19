/**
 * Generate Elite Painting site imagery via KIE.ai (Nano Banana 2, 2K).
 *
 *   KIE_API_KEY=... npx tsx scripts/generate-images.ts
 *
 * Resumable: if the output file already exists on disk, the job is skipped.
 * Use --force to regenerate everything.
 */

import { mkdir, writeFile, access } from "node:fs/promises"
import { resolve, dirname } from "node:path"
import { constants } from "node:fs"

const API = "https://api.kie.ai/api/v1/jobs/createTask"
const TASK = "https://api.kie.ai/api/v1/jobs/recordInfo"
const OUT_DIR = resolve(__dirname, "..", "public", "images", "generated")
const POLL_INTERVAL_MS = 5000
const POLL_MAX_ATTEMPTS = 90 // up to ~7.5 min per image

type Job = {
  file: string
  aspect: "16:9" | "3:2" | "1:1" | "9:16" | "4:3"
  prompt: string
}

const STYLE =
  "Shot on a Hasselblad X2D, natural window light, muted warm neutrals, editorial magazine composition, shallow depth of field, rich texture on walls and wood, soft film grain, no text, no watermark, hyper-realistic, high-end residential interior design photography."

const BRAND_COLORS =
  "Brand palette: warm off-white #FAF8F5 plaster walls, deep slate #101920 inky trim, warm bronze #9B6B3C accents, deep sage #4A5A4A foliage, stone #E2DACA. No rainbow palettes, no garish accents, no cartoon illustration."

const JOBS: Job[] = [
  {
    file: "hero-craftsman-interior.jpg",
    aspect: "16:9",
    prompt:
      "Editorial architectural photograph of a freshly painted craftsman-home living room at 7am. Raking morning light through mullioned windows falls across a plaster wall in soft bone white, wide-plank walnut floor, a single low walnut bench, a trailing fig tree in a matte-bronze planter, minimal ceramics on a built-in. A ladder leans against the side wall suggesting the paint job has just wrapped. No people, no text. " +
      STYLE +
      " " +
      BRAND_COLORS,
  },
  {
    file: "prep-detail-sanding.jpg",
    aspect: "3:2",
    prompt:
      "Extreme close-up, macro detail of a gloved painter's hand sanding a piece of old window trim with a fine sanding block. Dust motes drift in a shaft of afternoon light. Paint flecks from a century of repaints visible in the wood grain. Brass hardware nearby, a pencil tucked behind the painter's ear out of frame. No faces, no text. " +
      STYLE +
      " " +
      BRAND_COLORS,
  },
  {
    file: "protection-dropcloths.jpg",
    aspect: "3:2",
    prompt:
      "Overhead editorial photograph of a living room prepared for painting: thick canvas drop cloths draped neatly over wide-plank walnut floors, furniture wrapped and masked with painter's paper, a row of painter's tape rolls lined up on a sawhorse, a coiled extension cord, small labelled cardboard boxes of light switch plates. The space feels orderly, careful, almost monastic. No people, no text. " +
      STYLE +
      " " +
      BRAND_COLORS,
  },
  {
    file: "communication-detail.jpg",
    aspect: "3:2",
    prompt:
      "Close-up, golden-hour photograph of a painter's leather-bound jobsite notebook open on the hood of a white cargo van. A pencil-written day-end update in neat handwriting is visible (text illegible, suggestive only). A warm-bronze mechanical pencil rests on the page. Out of focus in the background: the side of a Craftsman home in Seattle, blurred cedar trees. No faces, no readable text. " +
      STYLE +
      " " +
      BRAND_COLORS,
  },
  {
    file: "portfolio-hero-cabinet.jpg",
    aspect: "3:2",
    prompt:
      "Macro editorial photograph of a freshly refinished kitchen cabinet door corner. A perfect factory-smooth sprayed finish in creamy bone white, unlacquered brass cup pulls catching afternoon light, a sliver of the soapstone counter below, the suggestion of a marble backsplash out of focus. Shallow depth of field. The surface looks glassy, durable, expensive. No text. " +
      STYLE +
      " " +
      BRAND_COLORS,
  },
  {
    file: "portfolio-01-cabinet-detail.jpg",
    aspect: "3:2",
    prompt:
      "Kitchen interior, inset shaker cabinetry refinished in a soft bone white, unlacquered brass pulls, walnut butcher-block island, a small vase of branches, morning light through a single casement window. Editorial, calm, high-end Pacific Northwest Craftsman aesthetic. No people, no text. " +
      STYLE +
      " " +
      BRAND_COLORS,
  },
  {
    file: "portfolio-02-exterior-craftsman.jpg",
    aspect: "3:2",
    prompt:
      "Front-on editorial architectural photograph of a classic Pacific Northwest Craftsman bungalow repainted in a deep cedar-moss green with warm bone-white trim and black sashes. Covered front porch with a cedar bench, slate walkway, cedar hedges, overcast cool sky. The paint is crisp and just-finished. No people, no text. " +
      STYLE +
      " " +
      BRAND_COLORS,
  },
  {
    file: "portfolio-03-interior-bone.jpg",
    aspect: "3:2",
    prompt:
      "A sun-flooded north-Seattle dining room, bone-white walls with an inky near-black trim around the baseboard and picture rail. A round walnut pedestal table, four bentwood chairs, a linen-shaded brass pendant. Wide-plank oak floors. Perfect cut lines where wall meets trim. Editorial architectural photography. No people, no text. " +
      STYLE +
      " " +
      BRAND_COLORS,
  },
  {
    file: "portfolio-04-trim-detail.jpg",
    aspect: "3:2",
    prompt:
      "Tight macro detail of a perfect paint cut line: deep inky slate trim meeting bone-white wall, no tape residue, razor straight. A small leaf shadow from a nearby plant falls across the surface. Shot slightly from below to honor the trim profile. Editorial, restrained, architectural. No text. " +
      STYLE +
      " " +
      BRAND_COLORS,
  },
  {
    file: "portfolio-05-deck-stain.jpg",
    aspect: "3:2",
    prompt:
      "Freshly stained cedar deck with a deep warm-bronze semi-transparent stain. Low sun, long shadows from a cedar railing. A single Adirondack chair, a terracotta pot with an olive tree, the edge of a green garden beyond. No people, no text. " +
      STYLE +
      " " +
      BRAND_COLORS,
  },
  {
    file: "portfolio-06-commercial-bistro.jpg",
    aspect: "3:2",
    prompt:
      "Interior of a small Phinney Ridge bistro after a repaint: warm bone-white walls with a deep sage green wainscot below a warm-bronze chair rail. Marble two-tops, bentwood bistro chairs, a small menu on a slate board out of focus. Evening light from window reveals. Editorial, inviting, modestly upscale. No people, no text. " +
      STYLE +
      " " +
      BRAND_COLORS,
  },
  {
    file: "estimator-phone-mock.jpg",
    aspect: "9:16",
    prompt:
      "Product rendering: a photoreal iPhone-style smartphone floating on a warm bone-white paper background. The screen shows a minimalist quote interface with a large serif headline 'Your paint estimate', a bronze accent progress bar, and typographic price range. The phone has a polished titanium frame. A few scattered paint chip swatches (bone, sage, slate, bronze) rest on the paper beside it. Editorial product-still aesthetic. No brand logos, readable text limited to the stylized headline. " +
      STYLE +
      " " +
      BRAND_COLORS,
  },
]

const apiKey = process.env.KIE_API_KEY
if (!apiKey) {
  console.error("Missing KIE_API_KEY. Add it to .env.local and rerun.")
  process.exit(1)
}

const force = process.argv.includes("--force")

async function fileExists(path: string) {
  try {
    await access(path, constants.F_OK)
    return true
  } catch {
    return false
  }
}

async function createTask(prompt: string, aspect: string): Promise<string> {
  const res = await fetch(API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "nano-banana-2",
      input: {
        prompt,
        aspect_ratio: aspect,
        resolution: "2K",
        output_format: "jpg",
      },
    }),
  })
  if (!res.ok) {
    throw new Error(`createTask ${res.status}: ${await res.text()}`)
  }
  const body = (await res.json()) as { code: number; msg: string; data?: { taskId?: string } }
  if (body.code !== 200 || !body.data?.taskId) {
    throw new Error(`createTask error: ${JSON.stringify(body)}`)
  }
  return body.data.taskId
}

type TaskResult = {
  code: number
  data?: {
    state?: string
    status?: string
    resultUrls?: string[]
    resultJson?: string
    result_urls?: string[]
    result?: { resultUrls?: string[] }
    failMsg?: string
  }
  msg?: string
}

async function pollTask(taskId: string): Promise<string> {
  for (let i = 0; i < POLL_MAX_ATTEMPTS; i++) {
    const res = await fetch(`${TASK}?taskId=${taskId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    })
    if (!res.ok) {
      if (res.status === 404 && i < 3) {
        await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS))
        continue
      }
      throw new Error(`pollTask ${res.status}: ${await res.text()}`)
    }
    const body = (await res.json()) as TaskResult
    const d = body.data ?? {}
    const state = (d.state ?? d.status ?? "").toLowerCase()
    const urls =
      d.resultUrls ?? d.result_urls ?? d.result?.resultUrls ?? tryParseUrls(d.resultJson)

    if (urls?.length) return urls[0]
    if (state === "fail" || state === "failed") {
      throw new Error(`task ${taskId} failed: ${d.failMsg ?? body.msg ?? "unknown"}`)
    }
    process.stdout.write(".")
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS))
  }
  throw new Error(`task ${taskId} timed out`)
}

function tryParseUrls(raw?: string): string[] | undefined {
  if (!raw) return undefined
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed?.resultUrls)) return parsed.resultUrls
    if (Array.isArray(parsed)) return parsed
  } catch {
    /* ignore */
  }
  return undefined
}

async function downloadImage(url: string, dest: string) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`download ${res.status}: ${url}`)
  const buf = Buffer.from(await res.arrayBuffer())
  await mkdir(dirname(dest), { recursive: true })
  await writeFile(dest, buf)
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true })

  console.log(`\n  Elite Painting — image generation`)
  console.log(`  Destination: ${OUT_DIR}`)
  console.log(`  Jobs: ${JOBS.length} · Model: nano-banana-2 · Resolution: 2K\n`)

  let ok = 0
  let skipped = 0
  let failed = 0

  for (const job of JOBS) {
    const dest = resolve(OUT_DIR, job.file)
    if (!force && (await fileExists(dest))) {
      console.log(`  ·  skip     ${job.file}  (exists)`)
      skipped++
      continue
    }
    process.stdout.write(`  →  create   ${job.file}  [${job.aspect}]  `)
    try {
      const taskId = await createTask(job.prompt, job.aspect)
      process.stdout.write(`task=${taskId.slice(0, 8)}…  `)
      const url = await pollTask(taskId)
      await downloadImage(url, dest)
      console.log(`  ok`)
      ok++
    } catch (err) {
      console.log(`\n  ✗  fail     ${job.file}: ${err instanceof Error ? err.message : err}`)
      failed++
    }
  }

  console.log(`\n  done · generated=${ok} · skipped=${skipped} · failed=${failed}\n`)
  process.exit(failed > 0 ? 1 : 0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
