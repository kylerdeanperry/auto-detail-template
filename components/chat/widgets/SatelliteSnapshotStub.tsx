"use client"

export function SatelliteSnapshotStub({
  state,
}: {
  state: { imageUrl: string; sqft?: number; stories?: number; siding?: string }
}) {
  return (
    <div className="my-2 rounded-xl bg-paper-warm border border-stone overflow-hidden">
      {state.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={state.imageUrl} alt="Home satellite view" className="w-full h-44 object-cover" />
      ) : (
        <div className="w-full h-44 bg-stone" />
      )}
      <div className="px-4 py-3 space-y-0.5">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-bronze">
          What I see
        </div>
        <p className="text-[13px] text-ink">
          {state.sqft ? `~${state.sqft.toLocaleString()} sqft` : "detecting…"} ·{" "}
          {state.stories ? `${state.stories} ${state.stories === 1 ? "story" : "stories"}` : "detecting…"} ·{" "}
          {state.siding ?? "detecting…"}
        </p>
      </div>
    </div>
  )
}
