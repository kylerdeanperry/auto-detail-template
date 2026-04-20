export type ChatRole = "user" | "assistant" | "tool_ui" | "system"

export type ChatOutcome = "booked" | "lead_captured" | "abandoned" | "faq_only"

export type ToolUIState =
  | { type: "address_autocomplete"; state: { selected?: { placeId: string; formatted: string } } }
  | { type: "satellite_snapshot"; state: { imageUrl: string; sqft?: number; stories?: number; siding?: string } }
  | { type: "photo_dropzone"; state: { uploaded: boolean; photoUrl?: string } }
  | { type: "quote_card"; state: { priceLow: number; priceHigh: number; breakdown: string } }
  | { type: "booking_widget"; state: { provider: "native" | "calendly"; url?: string } }
  | { type: "lead_form"; state: { submitted: boolean } }

export interface ChatMessage {
  id: string
  role: ChatRole
  content: string | null
  widget: ToolUIState | null
  createdAt: string
}
