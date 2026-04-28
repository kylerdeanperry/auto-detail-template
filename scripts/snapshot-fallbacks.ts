import { writeFile, mkdir } from "node:fs/promises"
import { resolve, dirname } from "node:path"

const INDUSTRIES = ["hvac", "roofing", "painting"] as const
const ROOT = resolve(__dirname, "..")

async function snapshot(slug: string) {
  const url = process.env.BRUVV_URL
  const secret = process.env.INDUSTRY_CONFIG_BUILD_SECRET
  if (!url || !secret) throw new Error("BRUVV_URL and INDUSTRY_CONFIG_BUILD_SECRET required")

  const res = await fetch(`${url}/api/industries/${slug}/config`, {
    headers: { "X-Build-Secret": secret },
  })
  if (!res.ok) throw new Error(`${slug}: fetch failed ${res.status}`)
  const { config } = await res.json()

  const outPath = resolve(ROOT, `config/fallback/${slug}.json`)
  await mkdir(dirname(outPath), { recursive: true })
  await writeFile(outPath, JSON.stringify(config, null, 2), "utf8")
  console.log(`✓ Snapshotted ${slug}`)
}

async function main() {
  for (const slug of INDUSTRIES) {
    await snapshot(slug)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
