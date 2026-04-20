import { NextResponse } from "next/server"
import { config } from "@/lib/config"

export const runtime = "nodejs"

export async function POST(req: Request) {
  const slug = config.meta.industry
  const agencyBase = process.env.AGENCY_API_BASE
  const secret = process.env.INDUSTRY_CONFIG_BUILD_SECRET
  if (!agencyBase || !secret) {
    return NextResponse.json({ error: "Agency API not configured" }, { status: 500 })
  }
  if (!config.chatbot.enabled) {
    return NextResponse.json({ error: "Chat disabled" }, { status: 403 })
  }

  const fwd = req.headers.get("x-forwarded-for") ?? ""
  const visitorIp = fwd.split(",")[0]?.trim() || "unknown"

  const res = await fetch(`${agencyBase}/api/chat/conversations`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-build-secret": secret,
      "x-forwarded-ip-hash": visitorIp,
    },
    body: JSON.stringify({ slug }),
  })
  if (!res.ok) {
    const errText = await res.text().catch(() => "")
    console.error("[chat/session] agency-os error", res.status, errText)
    return NextResponse.json({ error: "Could not start session" }, { status: res.status })
  }

  const data = (await res.json()) as { sessionToken: string; conversationId: string }

  const response = NextResponse.json({ conversationId: data.conversationId })
  response.cookies.set("chat_session", data.sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60, // 1 hour
  })
  return response
}
