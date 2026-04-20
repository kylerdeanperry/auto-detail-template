import { NextResponse } from "next/server"
import { z } from "zod"

const bodySchema = z.object({
  name: z.string(),
  phone: z.string(),
  email: z.string().optional(),
  description: z.string(),
  jobType: z.string().default("other"),
})

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }
  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 })
  }

  // Plan 2 stub — logs to the Vercel function log so we can see leads during
  // manual QA. Plan 3 replaces this route entirely with a forward to
  // `${AGENCY_API_BASE}/api/chat/lead`, authenticated with the session token.
  console.log("[chat/lead-stub]", JSON.stringify(parsed.data))

  const leadId = `lead_${Math.random().toString(36).slice(2, 10)}`
  return NextResponse.json({ leadId })
}
