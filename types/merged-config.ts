import type { ClientConfig } from "./config"
import type { IndustryVisualConfig } from "./visual-config"

export interface MergedIndustryConfig extends ClientConfig {
  _mode: "demo" | "client"
  _generatedAt: string
  visual: IndustryVisualConfig
}
