import { NextResponse } from "next/server"
import { z } from "zod"
import { config } from "@/lib/config"

const payloadSchema = z.object({
  business_name: z.string().min(1),
  contact_name: z.string().optional(),
  contact_email: z.string().email(),
  contact_phone: z.string().optional(),
  website_url: z.string().optional(),
  notes: z.string().default(""),
  call_log: z.array(z.unknown()).default([]),
  monthly_ad_spend: z.string().optional(),
})

export async function POST(req: Request) {
  const agencyUrl = process.env.AGENCY_OS_URL
  const secret = process.env.LEADS_INTAKE_SECRET
  if (!agencyUrl || !secret) {
    return NextResponse.json({ error: "Server not configured" }, { status: 500 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const parsed = payloadSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", issues: parsed.error.issues }, { status: 400 })
  }

  const res = await fetch(`${agencyUrl}/api/leads/intake`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Intake-Secret": secret,
    },
    body: JSON.stringify({
      ...parsed.data,
      industry: config.meta.industry,
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    console.error("prospect-inquiry forward failed", res.status, text)
    return NextResponse.json({ error: "Intake failed" }, { status: 502 })
  }

  const { id } = await res.json()
  return NextResponse.json({ id })
}
