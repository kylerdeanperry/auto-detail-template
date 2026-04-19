import raw from "@/config/industry-config.json"
import type { MergedIndustryConfig } from "@/types/merged-config"

export const config = raw as unknown as MergedIndustryConfig

export const mode = config._mode
export const industrySlug = config.meta.industry
export const visual = config.visual

const TOKEN_RE = /\{([a-zA-Z]+)\}/g

const tokens: Record<string, string> = {
  industryName: config.visual.displayName,
  businessName: config.business.name || config.visual.displayName,
  phone: config.business.phone,
  email: config.business.email,
  serviceArea: config.business.serviceArea,
}

export function expand(s: string): string {
  return s.replace(TOKEN_RE, (_, key) => tokens[key] ?? `{${key}}`)
}
