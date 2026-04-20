"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function ProactiveBubble({
  text,
  delayMs,
  onDismiss,
  onClick,
}: {
  text: string
  delayMs: number
  onDismiss: () => void
  onClick: () => void
}) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delayMs)
    return () => clearTimeout(t)
  }, [delayMs])

  if (!visible) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="fixed bottom-[90px] right-6 z-40 max-w-[300px] rounded-xl bg-paper border border-stone px-4 py-3 shadow-[0_12px_32px_-10px_rgba(16,25,32,0.3)] cursor-pointer"
      onClick={onClick}
      role="button"
      aria-label="Open chat"
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onDismiss()
        }}
        aria-label="Dismiss"
        className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-ink text-paper text-[12px] leading-6 text-center shadow-sm"
      >
        ×
      </button>
      <p className="text-[13px] text-ink leading-[1.45]">{text}</p>
    </motion.div>
  )
}
