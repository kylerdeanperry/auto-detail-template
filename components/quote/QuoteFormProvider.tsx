"use client"
import { createContext, useContext, useState } from "react"

type QuoteFormContextValue = {
  isOpen: boolean
  open: () => void
  close: () => void
}

const QuoteFormContext = createContext<QuoteFormContextValue | null>(null)

export function QuoteFormProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <QuoteFormContext.Provider value={{ isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) }}>
      {children}
    </QuoteFormContext.Provider>
  )
}

export function useQuoteForm() {
  const ctx = useContext(QuoteFormContext)
  if (!ctx) throw new Error("useQuoteForm must be used within QuoteFormProvider")
  return ctx
}
