import { StickyNav } from "@/components/layout/StickyNav"
import { SplitHero } from "@/components/hero/SplitHero"
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid"
import { Footer } from "@/components/layout/Footer"

export default function PortfolioPage() {
  return (
    <>
      <StickyNav />
      <SplitHero variant="page" />
      <PortfolioGrid />
      <Footer />
    </>
  )
}
