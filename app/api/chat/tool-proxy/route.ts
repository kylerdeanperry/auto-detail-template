import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export const runtime = "nodejs"

const ALLOWED = new Set([
  "estimate/geocode",
  "estimate/analyze",
  "estimate/quote",
  "estimate/book",
])

export async function POST(req: Request) {
  const url = new URL(req.url)
  const endpoint = url.searchParams.get("endpoint") ?? ""
  if (!ALLOWED.has(endpoint)) {
    return NextResponse.json({ error: "Unknown endpoint" }, { status: 400 })
  }

  const agency = process.env.AGENCY_API_BASE
  if (!agency) return NextResponse.json({ error: "Agency not configured" }, { status: 500 })

  const cookieStore = await cookies()
  const sessionToken = cookieStore.get("chat_session")?.value
  if (!sessionToken) {
    return NextResponse.json({ error: "No chat session — open the widget first" }, { status: 401 })
  }

  const contentType = req.headers.get("content-type") ?? "application/json"
  const body = contentType.startsWith("multipart/form-data")
    ? await req.formData()
    : await req.text()

  const upstream = await fetch(`${agency}/api/${endpoint}`, {
    method: "POST",
    headers: {
      ...(contentType.startsWith("multipart/form-data") ? {} : { "content-type": contentType }),
      "x-forwarded-ip-hash": req.headers.get("x-forwarded-for") ?? "",
    },
    body: body as BodyInit,
  })

  const upstreamText = await upstream.text()
  return new NextResponse(upstreamText, {
    status: upstream.status,
    headers: { "content-type": upstream.headers.get("content-type") ?? "application/json" },
  })
}
