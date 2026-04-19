import { StickyNav } from "@/components/layout/StickyNav"
import { SplitHero } from "@/components/hero/SplitHero"
import { IntroBand } from "@/components/hero/IntroBand"
import { PersonaSelector } from "@/components/personas/PersonaSelector"
import { ConfiguratorTeaser } from "@/components/configurator/ConfiguratorTeaser"
import { ZPatternRow } from "@/components/services/ZPatternRow"
import { Footer } from "@/components/layout/Footer"
import { config } from "@/lib/config"

export default function HomePage() {
  return (
    <>
      <StickyNav />
      <SplitHero variant="home" />
      <IntroBand />
      <PersonaSelector />
      <ConfiguratorTeaser />
      {config.visual.zPatternRows.map((row, i) => (
        <ZPatternRow key={i} row={row} alternating={(i % 2) as 0 | 1} />
      ))}
      <Footer />
    </>
  )
}
