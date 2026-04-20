"use client"

import { motion } from "framer-motion"

export function AssistantBubble({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="mb-3 flex justify-start"
    >
      <div className="max-w-[85%] rounded-[16px] bg-paper-warm border border-stone px-3.5 py-2.5 text-[14px] leading-[1.5] text-ink">
        {children}
      </div>
    </motion.div>
  )
}
