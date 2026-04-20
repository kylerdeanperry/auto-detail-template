"use client"

import { useState } from "react"

export interface AnalysisPayload {
  photoUrl: string
  sidingMaterial: string
  paintFailures: Array<{ type: string; severity: string }>
  conditionScore: number
  confidence: string
}

export function PhotoDropzone({
  estimateId,
  onUploaded,
}: {
  estimateId: string
  onUploaded: (analysis: AnalysisPayload) => void
}) {
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handle(file: File) {
    setError(null)
    if (file.size > 8 * 1024 * 1024) {
      setError("Max 8 MB")
      return
    }
    setPreview(URL.createObjectURL(file))
    setUploading(true)

    const fd = new FormData()
    fd.append("estimateId", estimateId)
    fd.append("photo", file)

    try {
      const res = await fetch("/api/chat/tool-proxy?endpoint=estimate/analyze", {
        method: "POST",
        body: fd,
      })
      if (!res.ok) {
        setError(`Upload failed (${res.status})`)
        return
      }
      const { data } = (await res.json()) as { data: AnalysisPayload }
      onUploaded(data)
    } catch {
      setError("Network error")
    } finally {
      setUploading(false)
    }
  }

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
      {uploading && <p className="mt-2 text-[11px] text-muted font-mono">uploading…</p>}
      {error && <p className="mt-2 text-[11px] text-red-600">{error}</p>}
      <label className="mt-2 inline-block rounded-md bg-ink text-paper font-mono text-[11px] uppercase tracking-[0.18em] px-3 py-1.5 cursor-pointer hover:bg-bronze transition-colors">
        Choose photo
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handle(file)
          }}
        />
      </label>
    </div>
  )
}
