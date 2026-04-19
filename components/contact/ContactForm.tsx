"use client"
import { useState } from "react"
import { config, expand, mode } from "@/lib/config"

type FieldProps = {
  label: string
  name: string
  type?: string
  required?: boolean
  rows?: number
  placeholder?: string
}

function Field({ label, name, type = "text", required, rows, placeholder }: FieldProps) {
  const baseClass =
    "w-full border-0 border-b border-stone bg-transparent pb-3 pt-1 text-[17px] text-ink placeholder:text-muted/60 outline-none transition-colors focus:border-bronze"
  return (
    <label className="group relative block">
      <span className="block font-mono text-[10px] uppercase tracking-[0.22em] text-muted mb-2">
        {label}
        {required ? <span className="text-bronze"> *</span> : null}
      </span>
      {rows ? (
        <textarea
          name={name}
          rows={rows}
          required={required}
          placeholder={placeholder}
          className={`${baseClass} resize-none min-h-[120px]`}
        />
      ) : (
        <input
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

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "ok" | "err">("idle")
  const endpoint = mode === "demo" ? "/api/prospect-inquiry" : "/api/book"

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("submitting")
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())
    const payload = {
      business_name: data.business_name,
      contact_name: data.contact_name,
      contact_email: data.contact_email,
      contact_phone: data.contact_phone,
      notes: data.notes,
      call_log: [],
    }
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(await res.text())
      setStatus("ok")
      form.reset()
    } catch (err) {
      console.error(err)
      setStatus("err")
    }
  }

  const phone = config.business.phone
  const telHref = phone ? `tel:${phone.replace(/[^0-9+]/g, "")}` : undefined

  return (
    <section className="relative border-t border-stone bg-paper">
      <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-10 md:py-28">
        <div className="grid grid-cols-12 gap-10 md:gap-14">
          {/* Sidebar */}
          <aside className="col-span-12 md:col-span-4">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-bronze mb-6">
              § — Start a Project
            </div>
            <h2
              className="font-display text-section text-ink"
              style={{ fontVariationSettings: '"opsz" 72', fontWeight: 400 }}
            >
              Tell us about what you&rsquo;re painting.
            </h2>
            <p className="mt-5 max-w-[360px] text-[15px] leading-[1.6] text-ink-soft">
              A short form below. We reply within one business day with a walkthrough
              time and the rough price range based on what you share.
            </p>

            <div className="mt-10 space-y-5 border-t border-stone pt-8">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted mb-1">
                  Phone
                </div>
                {telHref ? (
                  <a href={telHref} className="font-display text-[20px] tracking-[-0.015em] text-ink hover:text-bronze transition">
                    {phone}
                  </a>
                ) : null}
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted mb-1">
                  Email
                </div>
                <a
                  href={`mailto:${config.business.email}`}
                  className="font-display text-[20px] tracking-[-0.015em] text-ink hover:text-bronze transition"
                >
                  {config.business.email}
                </a>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted mb-1">
                  Service Area
                </div>
                <div className="text-[15px] leading-[1.55] text-ink-soft">
                  {expand(config.business.serviceArea)}
                </div>
              </div>
            </div>
          </aside>

          {/* Form */}
          <div className="col-span-12 md:col-span-8">
            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <Field label="Your Name" name="contact_name" required />
              <Field label="Project Address or Neighborhood" name="business_name" placeholder="Bainbridge, Ballard, Queen Anne…" required />
              <Field label="Email" name="contact_email" type="email" required />
              <Field label="Phone" name="contact_phone" type="tel" />
              <div className="md:col-span-2">
                <Field
                  label="About the Project"
                  name="notes"
                  rows={5}
                  placeholder="Interior or exterior? Rough square footage or room count? Timeline? Color thoughts? Anything weird about the surfaces?"
                />
              </div>
              <div className="md:col-span-2 flex flex-wrap items-center gap-6 pt-4">
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="group inline-flex items-center gap-3 rounded-full bg-ink px-7 py-4 font-body text-[14px] font-medium tracking-[0.02em] text-paper transition-all duration-300 hover:bg-bronze disabled:opacity-50"
                >
                  {status === "submitting" ? "Sending…" : "Send Project Details"}
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </button>
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
                  No spam · reply in one business day
                </div>
                {status === "ok" ? (
                  <p className="w-full font-mono text-[11px] uppercase tracking-[0.2em] text-sage">
                    ✓ Thanks — we&rsquo;ll be in touch shortly.
                  </p>
                ) : null}
                {status === "err" ? (
                  <p className="w-full font-mono text-[11px] uppercase tracking-[0.2em] text-destructive">
                    Something went wrong. Please try again or call us.
                  </p>
                ) : null}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
