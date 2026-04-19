import { StickyNav } from "@/components/layout/StickyNav"
import { SplitHero } from "@/components/hero/SplitHero"
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid"
import { Testimonials } from "@/components/layout/Testimonials"
import { Footer } from "@/components/layout/Footer"

export default function PortfolioPage() {
  return (
    <>
      <StickyNav />
      <SplitHero
        variant="page"
        override={{
          badge: "The Library",
          headline: "Recent work, photographed the day we packed up.",
          image: "/images/generated/portfolio-03-interior-bone.jpg",
          imageAlt: "Bone-white dining room with inky trim",
        }}
      />
      <PortfolioGrid />
      <Testimonials />
      <Footer />
    </>
  )
}
