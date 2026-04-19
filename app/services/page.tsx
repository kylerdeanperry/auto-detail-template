import { StickyNav } from "@/components/layout/StickyNav"
import { SplitHero } from "@/components/hero/SplitHero"
import { ServiceGrid } from "@/components/services/ServiceGrid"
import { Footer } from "@/components/layout/Footer"

export default function ServicesPage() {
  return (
    <>
      <StickyNav />
      <SplitHero variant="page" />
      <ServiceGrid />
      <Footer />
    </>
  )
}
