import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  return Response.json({
    role: "assistant",
    content:
      "Thanks for reaching out! Let me help you book a detail. What service are you interested in?",
  });
}
