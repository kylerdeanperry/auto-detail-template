import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export const runtime = "nodejs"

export async function POST(req: Request) {
  const agency = process.env.AGENCY_API_BASE
  if (!agency) return NextResponse.json({ error: "Agency not configured" }, { status: 500 })

  const cookieStore = await cookies()
  const sessionToken = cookieStore.get("chat_session")?.value
  if (!sessionToken) {
    return NextResponse.json({ error: "No chat session" }, { status: 401 })
  }

  const body = await req.text()
  const res = await fetch(`${agency}/api/chat/messages`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${sessionToken}`,
    },
    body,
  })
  return new NextResponse(await res.text(), {
    status: res.status,
    headers: { "content-type": res.headers.get("content-type") ?? "application/json" },
  })
}
