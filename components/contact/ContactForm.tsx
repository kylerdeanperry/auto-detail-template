"use client"
import { useState } from "react"
import { config, mode } from "@/lib/config"

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

  return (
    <section className="px-8 py-16">
      <div className="mx-auto max-w-[600px]">
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <input name="business_name" placeholder="Business name" required className="border-2 border-slate px-4 py-3 text-base" />
          <input name="contact_name" placeholder="Your name" className="border-2 border-slate px-4 py-3 text-base" />
          <input name="contact_email" type="email" placeholder="Email" required className="border-2 border-slate px-4 py-3 text-base" />
          <input name="contact_phone" placeholder="Phone" className="border-2 border-slate px-4 py-3 text-base" />
          <textarea name="notes" rows={4} placeholder="Tell us about your project" className="border-2 border-slate px-4 py-3 text-base" />
          <button
            type="submit"
            disabled={status === "submitting"}
            className="self-start rounded-full bg-slate px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {status === "submitting" ? "Sending..." : "Send"}
          </button>
          {status === "ok" ? <p className="text-sm text-green-700">Thanks — we'll be in touch.</p> : null}
          {status === "err" ? <p className="text-sm text-red-700">Something went wrong. Please try again.</p> : null}
        </form>
      </div>
    </section>
  )
}
