"use client"
import { useState, useEffect, useRef } from "react"
import { config } from "@/lib/config"
import { useQuoteForm } from "@/components/quote/QuoteFormProvider"

type FieldProps = {
  label: string
  name: string
  type?: string
  required?: boolean
  rows?: number
  placeholder?: string
  children?: React.ReactNode
  inputRef?: React.RefObject<HTMLInputElement | null>
}

function Field({ label, name, type = "text", required, rows, placeholder, children, inputRef }: FieldProps) {
  const baseClass =
    "w-full border-0 border-b border-stone bg-transparent pb-3 pt-1 text-[17px] text-ink placeholder:text-muted/60 outline-none transition-colors focus:border-bronze"
  return (
    <label className="group relative block">
      <span className="block font-mono text-[10px] uppercase tracking-[0.22em] text-muted mb-2">
        {label}
        {required ? <span className="text-bronze"> *</span> : null}
      </span>
      {children ? (
        children
      ) : rows ? (
        <textarea
          name={name}
          rows={rows}
          required={required}
          placeholder={placeholder}
          className={`${baseClass} resize-none`}
        />
      ) : (
        <input
          ref={inputRef}
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          className={baseClass}
        />
      )}
    </label>
  )
}

export function QuoteSlideOver() {
  const { isOpen, close } = useQuoteForm()
  const [status, setStatus] = useState<"idle" | "submitting" | "ok" | "err">("idle")
  const [errorMsg, setErrorMsg] = useState<string>("")
  const firstInputRef = useRef<HTMLInputElement>(null)

  const agencyUrl = process.env.NEXT_PUBLIC_BRUVV_URL ?? ""

  // Escape key dismiss
  useEffect(() => {
    if (!isOpen) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, close])

  // Auto-focus first input when drawer opens
  useEffect(() => {
    if (isOpen) firstInputRef.current?.focus()
  }, [isOpen])

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("submitting")
    setErrorMsg("")
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())
    const payload = {
      name: data.name,
      phone: data.phone,
      service: data.service,
      message: (data.message as string) || undefined,
      industrySlug: config.meta.industry,
      clientId: config.meta.clientId,
    }
    try {
      const res = await fetch(`${agencyUrl}/api/public/quote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(await res.text())
      setStatus("ok")
    } catch (err) {
      console.error(err)
      setErrorMsg("Something went wrong. Please try again or call us.")
      setStatus("err")
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm"
        aria-hidden
        onClick={close}
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="quote-dialog-title"
        onClick={(e) => e.stopPropagation()}
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[480px] flex-col bg-paper shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone px-6 py-5">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-bronze mb-1">
              § — Quick Quote
            </div>
            <h2
              id="quote-dialog-title"
              className="font-display text-[26px] text-ink leading-tight"
              style={{ fontVariationSettings: '"opsz" 72', fontWeight: 400 }}
            >
              Get a Quote
            </h2>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close quote form"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-stone text-ink transition-colors hover:bg-stone/40"
          >
            <span aria-hidden className="font-body text-[18px] leading-none">×</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          {status === "ok" ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-sage">
                ✓ Request Received
              </div>
              <p className="font-display text-[22px] text-ink" style={{ fontVariationSettings: '"opsz" 72', fontWeight: 400 }}>
                Thanks — we&rsquo;ll be in touch within a few hours.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="flex flex-col gap-7">
              <Field label="Name" name="name" required inputRef={firstInputRef} />
              <Field label="Phone" name="phone" type="tel" required />
              <Field label="Service Needed" name="service" required>
                <select
                  name="service"
                  required
                  className="w-full appearance-none border-0 border-b border-stone bg-transparent pb-3 pt-1 text-[17px] text-ink outline-none transition-colors focus:border-bronze"
                  defaultValue=""
                >
                  <option value="" disabled>Select a service…</option>
                  {config.services.map((s) => (
                    <option key={s.name} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </Field>
              <Field
                label="Message"
                name="message"
                rows={4}
                placeholder="Anything else we should know?"
              />

              <div className="flex flex-col gap-3 pt-2">
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="group inline-flex items-center gap-3 rounded-full bg-ink px-7 py-4 font-body text-[14px] font-medium tracking-[0.02em] text-paper transition-all duration-300 hover:bg-bronze disabled:opacity-50"
                >
                  {status === "submitting" ? "Sending…" : "Request Quote"}
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                </button>
                {status === "err" ? (
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-destructive">
                    {errorMsg}
                  </p>
                ) : null}
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
                  No spam · reply within a few hours
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  )
}
