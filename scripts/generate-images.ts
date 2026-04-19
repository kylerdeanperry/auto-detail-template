/**
 * Generate elite-service-template industry imagery via KIE.ai
 * (Nano Banana 2, 2K). Resumable: existing files are skipped.
 *
 *   INDUSTRY_SLUG=painting npx tsx scripts/generate-images.ts
 *   INDUSTRY_SLUG=hvac     npx tsx scripts/generate-images.ts
 *   INDUSTRY_SLUG=roofing  npx tsx scripts/generate-images.ts --force
 *
 * Output is written to public/images/generated/. File names are
 * industry-prefixed (except painting, which predates the prefix
 * convention) so the directory is flat and git-friendly.
 */

import { mkdir, writeFile, access } from "node:fs/promises"
import { resolve, dirname } from "node:path"
import { constants } from "node:fs"

const API = "https://api.kie.ai/api/v1/jobs/createTask"
const TASK = "https://api.kie.ai/api/v1/jobs/recordInfo"
const OUT_DIR = resolve(__dirname, "..", "public", "images", "generated")
const POLL_INTERVAL_MS = 5000
const POLL_MAX_ATTEMPTS = 90

type Job = {
  file: string
  aspect: "16:9" | "3:2" | "1:1" | "9:16" | "4:3"
  prompt: string
}

// ── Shared style guardrails ────────────────────────────────────
const STYLE_BASE =
  "Shot on a Hasselblad X2D, natural window light, editorial magazine composition, shallow depth of field, rich texture, soft film grain, no text, no watermark, hyper-realistic, architectural/interior design photography."

// ── Painting (Craftsman Studio palette) ────────────────────────
const PAINTING_PALETTE =
  "Brand palette: warm off-white #FAF8F5 plaster walls, deep slate #101920 inky trim, warm bronze #9B6B3C accents, deep sage #4A5A4A foliage, stone #E2DACA. No rainbow palettes, no garish accents, no cartoon illustration."

const PAINTING_JOBS: Job[] = [
  {
    file: "hero-craftsman-interior.jpg",
    aspect: "16:9",
    prompt:
      "Editorial architectural photograph of a freshly painted craftsman-home living room at 7am. Raking morning light through mullioned windows falls across a plaster wall in soft bone white, wide-plank walnut floor, a single low walnut bench, a trailing fig tree in a matte-bronze planter, minimal ceramics on a built-in. A ladder leans against the side wall suggesting the paint job has just wrapped. No people, no text. " +
      STYLE_BASE +
      " " +
      PAINTING_PALETTE,
  },
  {
    file: "prep-detail-sanding.jpg",
    aspect: "3:2",
    prompt:
      "Extreme close-up, macro detail of a gloved painter's hand sanding a piece of old window trim with a fine sanding block. Dust motes drift in a shaft of afternoon light. Paint flecks from a century of repaints visible in the wood grain. Brass hardware nearby, a pencil tucked behind the painter's ear out of frame. No faces, no text. " +
      STYLE_BASE +
      " " +
      PAINTING_PALETTE,
  },
  {
    file: "protection-dropcloths.jpg",
    aspect: "3:2",
    prompt:
      "Overhead editorial photograph of a living room prepared for painting: thick canvas drop cloths draped neatly over wide-plank walnut floors, furniture wrapped and masked with painter's paper, a row of painter's tape rolls lined up on a sawhorse, a coiled extension cord, small labelled cardboard boxes of light switch plates. The space feels orderly, careful, almost monastic. No people, no text. " +
      STYLE_BASE +
      " " +
      PAINTING_PALETTE,
  },
  {
    file: "communication-detail.jpg",
    aspect: "3:2",
    prompt:
      "Close-up, golden-hour photograph of a painter's leather-bound jobsite notebook open on the hood of a white cargo van. A pencil-written day-end update in neat handwriting is visible (text illegible, suggestive only). A warm-bronze mechanical pencil rests on the page. Out of focus in the background: the side of a Craftsman home in Seattle, blurred cedar trees. No faces, no readable text. " +
      STYLE_BASE +
      " " +
      PAINTING_PALETTE,
  },
  {
    file: "portfolio-hero-cabinet.jpg",
    aspect: "3:2",
    prompt:
      "Macro editorial photograph of a freshly refinished kitchen cabinet door corner. A perfect factory-smooth sprayed finish in creamy bone white, unlacquered brass cup pulls catching afternoon light, a sliver of the soapstone counter below, the suggestion of a marble backsplash out of focus. Shallow depth of field. The surface looks glassy, durable, expensive. No text. " +
      STYLE_BASE +
      " " +
      PAINTING_PALETTE,
  },
  {
    file: "portfolio-01-cabinet-detail.jpg",
    aspect: "3:2",
    prompt:
      "Kitchen interior, inset shaker cabinetry refinished in a soft bone white, unlacquered brass pulls, walnut butcher-block island, a small vase of branches, morning light through a single casement window. Editorial, calm, high-end Pacific Northwest Craftsman aesthetic. No people, no text. " +
      STYLE_BASE +
      " " +
      PAINTING_PALETTE,
  },
  {
    file: "portfolio-02-exterior-craftsman.jpg",
    aspect: "3:2",
    prompt:
      "Front-on editorial architectural photograph of a classic Pacific Northwest Craftsman bungalow repainted in a deep cedar-moss green with warm bone-white trim and black sashes. Covered front porch with a cedar bench, slate walkway, cedar hedges, overcast cool sky. The paint is crisp and just-finished. No people, no text. " +
      STYLE_BASE +
      " " +
      PAINTING_PALETTE,
  },
  {
    file: "portfolio-03-interior-bone.jpg",
    aspect: "3:2",
    prompt:
      "A sun-flooded north-Seattle dining room, bone-white walls with an inky near-black trim around the baseboard and picture rail. A round walnut pedestal table, four bentwood chairs, a linen-shaded brass pendant. Wide-plank oak floors. Perfect cut lines where wall meets trim. Editorial architectural photography. No people, no text. " +
      STYLE_BASE +
      " " +
      PAINTING_PALETTE,
  },
  {
    file: "portfolio-04-trim-detail.jpg",
    aspect: "3:2",
    prompt:
      "Tight macro detail of a perfect paint cut line: deep inky slate trim meeting bone-white wall, no tape residue, razor straight. A small leaf shadow from a nearby plant falls across the surface. Shot slightly from below to honor the trim profile. Editorial, restrained, architectural. No text. " +
      STYLE_BASE +
      " " +
      PAINTING_PALETTE,
  },
  {
    file: "portfolio-05-deck-stain.jpg",
    aspect: "3:2",
    prompt:
      "Freshly stained cedar deck with a deep warm-bronze semi-transparent stain. Low sun, long shadows from a cedar railing. A single Adirondack chair, a terracotta pot with an olive tree, the edge of a green garden beyond. No people, no text. " +
      STYLE_BASE +
      " " +
      PAINTING_PALETTE,
  },
  {
    file: "portfolio-06-commercial-bistro.jpg",
    aspect: "3:2",
    prompt:
      "Interior of a small Phinney Ridge bistro after a repaint: warm bone-white walls with a deep sage green wainscot below a warm-bronze chair rail. Marble two-tops, bentwood bistro chairs, a small menu on a slate board out of focus. Evening light from window reveals. Editorial, inviting, modestly upscale. No people, no text. " +
      STYLE_BASE +
      " " +
      PAINTING_PALETTE,
  },
  {
    file: "estimator-phone-mock.jpg",
    aspect: "9:16",
    prompt:
      "Product rendering: a photoreal iPhone-style smartphone floating on a warm bone-white paper background. The screen shows a minimalist quote interface with a large serif headline 'Your paint estimate', a bronze accent progress bar, and typographic price range. The phone has a polished titanium frame. A few scattered paint chip swatches (bone, sage, slate, bronze) rest on the paper beside it. Editorial product-still aesthetic. No brand logos, readable text limited to the stylized headline. " +
      STYLE_BASE +
      " " +
      PAINTING_PALETTE,
  },
]

// ── HVAC (Engineered Climate palette) ──────────────────────────
const HVAC_PALETTE =
  "Brand palette: cool slate white #F4F6F8 walls and backdrops, deep blue-black #0F1822 equipment accents and ink, steel blue #2B5BA0 highlights, safety-orange #D94F2F glimpsed sparingly (a hazard tag, a safety stripe), cool stone #D9DEE4 for floors and counters. No rainbow palettes, no garish accents, no cartoon illustration."

const HVAC_JOBS: Job[] = [
  {
    file: "hvac-hero-thermostat-winter.jpg",
    aspect: "16:9",
    prompt:
      "Editorial interior photograph of a modern Pacific Northwest living room at 6:30am on a cold winter morning. The focal point is a wall-mounted smart thermostat (round, minimal, metal bezel) glowing a soft warm number in a room otherwise lit by blue pre-dawn light through tall windows. A wool throw draped over a linen sofa, a single ceramic mug on a walnut side table, a hint of cedar out the window. Temperature-calm, precise, expensive. No people, no readable text on the thermostat. " +
      STYLE_BASE +
      " " +
      HVAC_PALETTE,
  },
  {
    file: "hvac-heatpump-exterior.jpg",
    aspect: "3:2",
    prompt:
      "Editorial architectural photograph of a modern cold-climate heat pump outdoor unit installed clean against the side of a Pacific Northwest craftsman home. Stainless-steel louvered cabinet, refrigerant lines neatly secured in a conduit, level concrete pad with a thin layer of frost, cedar shingle siding behind, a few fallen bigleaf-maple leaves. Overcast gray sky, cool morning light. The install looks surgical. No people, no text. " +
      STYLE_BASE +
      " " +
      HVAC_PALETTE,
  },
  {
    file: "hvac-furnace-detail.jpg",
    aspect: "3:2",
    prompt:
      "Close-up architectural photograph of a pristine basement mechanical room: a high-efficiency gas furnace with a brushed-steel cabinet, copper refrigerant lines in neat bends, a PVC condensate line, an insulated supply plenum rising to the ductwork above. Everything labeled with small brass tags. Concrete floor with a drain, overhead LED shop light, a small wall-mounted bracket holding two manuals in a clear folder. No people, no text. " +
      STYLE_BASE +
      " " +
      HVAC_PALETTE,
  },
  {
    file: "hvac-tech-install.jpg",
    aspect: "3:2",
    prompt:
      "Editorial photograph of a NATE-certified HVAC technician in a clean navy-blue uniform mid-install. Blue shoe covers on his boots, a canvas drop cloth beneath him, toolbox open with tools neatly arranged, a gauge set connected to a copper line, his gloved hand turning a brass flare nut. The setting is a modern laundry/utility room with cool slate tile. Focus on hands and equipment, face out of frame. Careful, expensive, surgical feel. No readable text. " +
      STYLE_BASE +
      " " +
      HVAC_PALETTE,
  },
  {
    file: "hvac-emergency-response.jpg",
    aspect: "3:2",
    prompt:
      "Editorial photograph of a dark-navy HVAC service van parked in the driveway of a Pacific Northwest home at 5:30am in winter. A faint dusting of snow on cedar hedges, headlights of the van casting warm light on the pavement, the side door slid open revealing organized shelving of parts bins. A technician's silhouette walking toward the front door holding a service bag. Atmosphere: reliable, calm urgency, professional. No readable text on the van. " +
      STYLE_BASE +
      " " +
      HVAC_PALETTE,
  },
  {
    file: "hvac-mechanical-room.jpg",
    aspect: "3:2",
    prompt:
      "Architectural editorial photograph of a clean basement mechanical room after a full HVAC retrofit: high-efficiency heat pump air handler, new plenum with bright silver taped seams, PVC condensate line neatly routed, labeled electrical disconnects, a fresh pleated filter visible behind a clear filter rack door. Soft overhead LED, polished concrete floor, a single Pelican case of manuals on a shelf. Orderly, engineered, expensive. No people, no readable text. " +
      STYLE_BASE +
      " " +
      HVAC_PALETTE,
  },
  {
    file: "hvac-portfolio-01-heatpump-craftsman.jpg",
    aspect: "3:2",
    prompt:
      "Exterior photograph of a restored Bainbridge Island craftsman bungalow with a newly installed Mitsubishi hyper-heat cold-climate heat pump unit on a small concrete pad tucked between cedar hedges and the side porch. Cedar shingle siding painted a deep moss green, warm bone-white trim, a single Japanese maple in front. Overcast PNW light. Engineered, restrained, residential. No readable text. " +
      STYLE_BASE +
      " " +
      HVAC_PALETTE,
  },
  {
    file: "hvac-portfolio-02-commercial-rooftop.jpg",
    aspect: "3:2",
    prompt:
      "Rooftop photograph of a small neighborhood Seattle café's rooftop package unit HVAC, freshly installed. Brushed stainless steel cabinet, new ductwork penetrations flashed and sealed, a single technician's toolbox set aside. Low sun in the background silhouetting distant downtown Seattle buildings, moody blue sky. No people visible. Commercial, engineered, high-end. No readable text. " +
      STYLE_BASE +
      " " +
      HVAC_PALETTE,
  },
  {
    file: "hvac-portfolio-03-mechanical-room.jpg",
    aspect: "3:2",
    prompt:
      "Architectural photograph of a retrofit basement mechanical room in a Queen Anne Seattle home. Newly installed heat pump air handler, labeled electrical panel, PVC condensate routing, a fresh HEPA filter housing. Polished concrete floor, white-painted plaster walls, a single wire shelving unit holding neatly folded shop rags and a bucket of common parts. Soft overhead LED. Orderly, high-end residential mechanical. No people, no readable text. " +
      STYLE_BASE +
      " " +
      HVAC_PALETTE,
  },
  {
    file: "hvac-portfolio-04-minisplit-interior.jpg",
    aspect: "3:2",
    prompt:
      "Editorial photograph of a minimalist Fremont ADU living room with a wall-mounted ductless mini-split head unit installed high on the wall above a low walnut credenza. Clean white walls, a linen sofa, a single framed architectural drawing, matte-black floor lamp. Late afternoon light through sheer curtains. The mini-split is unobtrusive, integrated, almost architectural. No people, no readable text. " +
      STYLE_BASE +
      " " +
      HVAC_PALETTE,
  },
  {
    file: "hvac-portfolio-05-ductwork.jpg",
    aspect: "3:2",
    prompt:
      "Close-up photograph of newly installed rigid galvanized steel ductwork in a Pacific Northwest home's attic, joints sealed with silver mastic, insulation wrapped where required, labeled with small metallic tags (text illegible). Shaft of late-afternoon light raking across the work. Orderly, engineered, precise. No people, no readable text. " +
      STYLE_BASE +
      " " +
      HVAC_PALETTE,
  },
  {
    file: "hvac-portfolio-06-smart-thermostat.jpg",
    aspect: "3:2",
    prompt:
      "Tight macro photograph of a wall-mounted Ecobee-style smart thermostat on a softly plastered wall. The display is a muted blue, showing an indoor temperature (digits blurred). Warm fingertip hovering about to adjust, out of focus. Morning light from a left-side window casts a soft shadow of the device. Minimalist, architectural, premium. No readable text beyond the stylized number. " +
      STYLE_BASE +
      " " +
      HVAC_PALETTE,
  },
  {
    file: "hvac-estimator-phone-mock.jpg",
    aspect: "9:16",
    prompt:
      "Product rendering: a photoreal iPhone-style smartphone floating on a cool slate-white paper background. The screen shows a minimalist HVAC quote interface with a large serif headline 'Your system estimate', a steel-blue accent progress bar, and a typographic price range beneath. The phone has a polished titanium frame. A few scattered brushed-steel equipment chips and a small copper refrigerant cap rest on the paper beside it. Editorial product-still aesthetic. No brand logos, readable text limited to the stylized headline. " +
      STYLE_BASE +
      " " +
      HVAC_PALETTE,
  },
]

// ── Roofing (Weatherproof Moss palette) ────────────────────────
const ROOFING_PALETTE =
  "Brand palette: warm off-white #F2F0EB paper, deep near-black #1A1D1B ink, deep moss green #2C3D38 accents, copper/rust #A8643E sparingly (emergency tarps, copper gutter details), warm stone #D8D4C9. No rainbow palettes, no garish accents, no cartoon illustration."

const ROOFING_JOBS: Job[] = [
  {
    file: "roofing-hero-aerial-craftsman.jpg",
    aspect: "16:9",
    prompt:
      "Aerial drone photograph looking down at a 45-degree angle on a freshly shingled Pacific Northwest craftsman home, architectural asphalt shingles in a warm charcoal, crisp ridge caps, clean step flashing visible where the dormer meets the main roof plane. Cedar and Douglas fir trees surround the property, slate walkway, a deep moss-green front door just visible below. Late afternoon PNW overcast light with a thin break of sun on the ridge. No people, no text, no visible logos. " +
      STYLE_BASE +
      " " +
      ROOFING_PALETTE,
  },
  {
    file: "roofing-flashing-detail.jpg",
    aspect: "3:2",
    prompt:
      "Extreme close-up, macro detail of step flashing meeting a brick chimney on a freshly shingled roof. Rubber membrane visible beneath the top flange, copper counter-flashing tucked into a mortar reglet, a bead of sealant clean at the edge. Shingles laid perfectly around the penetration. Overcast PNW light. No people, no text. " +
      STYLE_BASE +
      " " +
      ROOFING_PALETTE,
  },
  {
    file: "roofing-inspection-detail.jpg",
    aspect: "3:2",
    prompt:
      "Close-up of a roofer's gloved hand holding a small DSLR camera, photographing a section of architectural shingle where a few tabs show wind-lift. A small moisture meter and a metal chalk scribe rest on the ridge beside him. Late-afternoon PNW light rakes across the shingles, highlighting texture. No face visible, honest-inspection feel. No text. " +
      STYLE_BASE +
      " " +
      ROOFING_PALETTE,
  },
  {
    file: "roofing-storm-response.jpg",
    aspect: "3:2",
    prompt:
      "A dark moss-green service van parked in the driveway of a Pacific Northwest home in heavy rain, headlights on, side door slid open revealing neatly organized tarps and ladder. A roofer in a weatherproof jacket and hard hat walking toward the porch carrying a folded reinforced blue tarp. Cedars bending in the wind, puddles on the slate walkway. Atmosphere: reliable urgency, calm professionalism. No readable text on the van. " +
      STYLE_BASE +
      " " +
      ROOFING_PALETTE,
  },
  {
    file: "roofing-portfolio-hero-metal.jpg",
    aspect: "3:2",
    prompt:
      "Wide architectural photograph of a modern Pacific Northwest cabin with a standing-seam metal roof in a deep charcoal/moss finish, cedar siding, full-height glass on the gabled end reflecting Douglas fir trees. The metal roof's seams are razor-straight, snow guards aligned, gutter in dark bronze. Low afternoon light skimming the panels. No people, no text. " +
      STYLE_BASE +
      " " +
      ROOFING_PALETTE,
  },
  {
    file: "roofing-portfolio-01-craftsman-front.jpg",
    aspect: "3:2",
    prompt:
      "Street-level photograph of a restored Bainbridge craftsman home with a brand-new GAF Timberline HDZ architectural shingle roof in a warm charcoal. Deep moss-green front door, warm bone-white trim, cedar hedges. Overcast PNW sky. The roof is the visual centerpiece — crisp ridge cap, clean valleys, perfect line where eave meets fascia. No people, no text. " +
      STYLE_BASE +
      " " +
      ROOFING_PALETTE,
  },
  {
    file: "roofing-portfolio-02-metal-cabin.jpg",
    aspect: "3:2",
    prompt:
      "Editorial architectural photograph of a modern Bainbridge Island cabin from a slightly-below angle, showing the full expanse of a standing-seam metal roof in charcoal-black against dark green cedar trees. Copper downspouts catch the eye. Faint mist in the forest. The roof looks like engineered architecture, not a cap. No people, no text. " +
      STYLE_BASE +
      " " +
      ROOFING_PALETTE,
  },
  {
    file: "roofing-portfolio-03-cedar-composite.jpg",
    aspect: "3:2",
    prompt:
      "Queen Anne Seattle heritage home with a freshly installed composite cedar-look shake roof (DaVinci or similar). Rich warm shake tones, the composite so convincingly textured it reads as real cedar. Two dormers on the front, stone chimney, muted overcast light. The house looks like it's been cared for generationally. No people, no text. " +
      STYLE_BASE +
      " " +
      ROOFING_PALETTE,
  },
  {
    file: "roofing-portfolio-04-hip-complex.jpg",
    aspect: "3:2",
    prompt:
      "Elevated photograph (from a neighboring slope) of a complex hip-roofed Magnolia home showing multiple roof planes meeting at precise ridges and hips. Two skylights flush with the plane, ridge vents running the crown, architectural asphalt shingles in warm charcoal. Edge flashing crisp and aligned. The geometry reads as carefully engineered. No people, no text. " +
      STYLE_BASE +
      " " +
      ROOFING_PALETTE,
  },
  {
    file: "roofing-portfolio-05-commercial-tpo.jpg",
    aspect: "3:2",
    prompt:
      "Photograph of a low-slope commercial roof retrofit on a small Ballard warehouse: bright white TPO membrane, seams heat-welded neatly, flashing at the parapet tucked and capped, a pair of rooftop HVAC units visible in the distance. Morning light. Orderly, expensive, commercial. No readable text, no visible signage. " +
      STYLE_BASE +
      " " +
      ROOFING_PALETTE,
  },
  {
    file: "roofing-portfolio-06-copper-gutters.jpg",
    aspect: "3:2",
    prompt:
      "Macro close-up of seamless copper half-round gutters running along the eave of a Phinney Ridge craftsman home in early autumn. The copper has begun its first patina toward warm brown, a few fallen bigleaf maple leaves rest inside, a drip chain descends toward a small ceramic rain bowl below. Crisp hangers, level installation. No people, no text. " +
      STYLE_BASE +
      " " +
      ROOFING_PALETTE,
  },
  {
    file: "roofing-estimator-phone-mock.jpg",
    aspect: "9:16",
    prompt:
      "Product rendering: a photoreal iPhone-style smartphone floating on a warm off-white paper background. The screen shows a minimalist roofing quote interface with a large serif headline 'Your roof estimate', a deep moss-green accent progress bar, a price range, and a small icon row showing shingle vs. metal options. The phone has a polished titanium frame. A few small roofing material chips (asphalt shingle corner, copper scrap, a strip of ice-and-water) arranged beside it. Editorial product-still aesthetic. No brand logos, readable text limited to the stylized headline. " +
      STYLE_BASE +
      " " +
      ROOFING_PALETTE,
  },
]

// ── Dispatch by industry ───────────────────────────────────────
const JOBS_BY_INDUSTRY: Record<string, Job[]> = {
  painting: PAINTING_JOBS,
  hvac: HVAC_JOBS,
  roofing: ROOFING_JOBS,
}

const industry = (process.env.INDUSTRY_SLUG ?? "painting").toLowerCase()
const JOBS = JOBS_BY_INDUSTRY[industry]
if (!JOBS) {
  console.error(`Unknown INDUSTRY_SLUG=${industry}. Known: ${Object.keys(JOBS_BY_INDUSTRY).join(", ")}`)
  process.exit(1)
}

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

  console.log(`\n  Elite Service Template — image generation`)
  console.log(`  Industry: ${industry}`)
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
