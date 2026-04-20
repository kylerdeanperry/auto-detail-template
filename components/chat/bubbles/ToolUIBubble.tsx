"use client"

import type { ToolUIState } from "@/lib/chat/types"
import { LeadForm } from "../widgets/LeadForm"
import { QuoteCardStub } from "../widgets/QuoteCardStub"
import { AddressAutocomplete } from "../widgets/AddressAutocomplete"
import { SatelliteSnapshotStub } from "../widgets/SatelliteSnapshotStub"
import { PhotoDropzoneStub } from "../widgets/PhotoDropzoneStub"
import { BookingWidgetStub } from "../widgets/BookingWidgetStub"

export function ToolUIBubble({
  widget,
  onSubmit,
}: {
  widget: ToolUIState
  onSubmit: (userText: string) => void
}) {
  switch (widget.type) {
    case "lead_form":
      return <LeadForm onSubmit={(name) => onSubmit(`My name is ${name}.`)} />
    case "quote_card":
      return <QuoteCardStub state={widget.state} />
    case "address_autocomplete":
      return (
        <AddressAutocomplete
          onSelect={(sel) =>
            onSubmit(
              `My address is ${sel.formattedAddress}. (placeId=${sel.placeId}, lat=${sel.lat}, lng=${sel.lng})`
            )
          }
        />
      )
    case "satellite_snapshot":
      return <SatelliteSnapshotStub state={widget.state} />
    case "photo_dropzone":
      return <PhotoDropzoneStub onUploaded={() => onSubmit("I've uploaded a photo.")} />
    case "booking_widget":
      return <BookingWidgetStub state={widget.state} onBooked={() => onSubmit("I've booked a walkthrough.")} />
  }
}
