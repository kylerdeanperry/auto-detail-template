import { config } from "@/lib/config"
import type { ClientConfig } from "@/types/config"

export const chatbot: ClientConfig["chatbot"] = config.chatbot

export const persona = chatbot.persona
export const faqs = chatbot.faqs
export const chatbotEnabled = chatbot.enabled
