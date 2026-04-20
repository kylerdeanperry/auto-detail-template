"use client"

import type { UIMessage } from "ai"

export function WidgetMessages({
  messages: _messages,
  status: _status,
}: {
  messages: UIMessage[]
  status: string
}) {
  return <div className="flex-1 overflow-y-auto" />
}
