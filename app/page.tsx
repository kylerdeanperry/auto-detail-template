import { StickyNav } from "@/components/layout/StickyNav"
import { SplitHero } from "@/components/hero/SplitHero"
import { IntroBand } from "@/components/hero/IntroBand"
import { PersonaSelector } from "@/components/personas/PersonaSelector"
import { ProcessBand } from "@/components/services/ProcessBand"
import { ConfiguratorTeaser } from "@/components/configurator/ConfiguratorTeaser"
import { ZPatternRow } from "@/components/services/ZPatternRow"
import { TrustBand } from "@/components/layout/TrustBand"
import { Testimonials } from "@/components/layout/Testimonials"
import { Footer } from "@/components/layout/Footer"
import { config } from "@/lib/config"

export default function HomePage() {
  return (
    <>
      <StickyNav />
      <SplitHero variant="home" />
      <IntroBand />
      <PersonaSelector />
      <ProcessBand />
      <ConfiguratorTeaser />
      {config.visual.zPatternRows.map((row, i) => (
        <ZPatternRow
          key={i}
          row={row}
          alternating={(i % 2) as 0 | 1}
          sectionNumber={i}
        />
      ))}
      <TrustBand />
      <Testimonials />
      <Footer />
    </>
  )
}
