"use client"

import { useState } from "react"

export function PhotoDropzoneStub({ onUploaded }: { onUploaded: () => void }) {
  const [preview, setPreview] = useState<string | null>(null)

  return (
    <div className="my-2 rounded-xl bg-paper-warm border border-dashed border-stone p-4 text-center">
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="Uploaded" className="mx-auto max-h-40 rounded-md" />
      ) : (
        <>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-bronze">
            Photo of siding
          </div>
          <p className="mt-1 text-[13px] text-ink-soft">Drop or tap — any angle works.</p>
        </>
      )}
      <label className="mt-2 inline-block rounded-md bg-ink text-paper font-mono text-[11px] uppercase tracking-[0.18em] px-3 py-1.5 cursor-pointer hover:bg-bronze transition-colors">
        Choose photo
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (!file) return
            const url = URL.createObjectURL(file)
            setPreview(url)
            onUploaded()
          }}
        />
      </label>
    </div>
  )
}
