"use client"

import { motion } from "framer-motion"

export function TypingDots() {
  return (
    <div
      role="status"
      aria-label="Sarah is typing"
      className="flex items-center gap-1 px-2 py-1"
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="block h-1.5 w-1.5 rounded-full bg-ink/50"
          animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 0.9,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}
