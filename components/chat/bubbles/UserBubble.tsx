"use client"

import { motion } from "framer-motion"

export function UserBubble({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="mb-3 flex justify-end"
    >
      <div className="max-w-[85%] rounded-[16px] bg-ink text-paper px-3.5 py-2.5 text-[14px] leading-[1.5]">
        {children}
      </div>
    </motion.div>
  )
}
