import { StickyNav } from "@/components/layout/StickyNav"
import { SplitHero } from "@/components/hero/SplitHero"
import { ServiceGrid } from "@/components/services/ServiceGrid"
import { ProcessBand } from "@/components/services/ProcessBand"
import { TrustBand } from "@/components/layout/TrustBand"
import { Footer } from "@/components/layout/Footer"

export default function ServicesPage() {
  return (
    <>
      <StickyNav />
      <SplitHero
        variant="page"
        override={{
          badge: "The Catalogue",
          headline: "Every surface, every season.",
          image: "/images/generated/portfolio-hero-cabinet.jpg",
          imageAlt: "Macro detail of a freshly sprayed cabinet finish",
        }}
      />
      <ServiceGrid />
      <ProcessBand />
      <TrustBand />
      <Footer />
    </>
  )
}
