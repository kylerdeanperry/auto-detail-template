import { StickyNav } from "@/components/layout/StickyNav"
import { SplitHero } from "@/components/hero/SplitHero"
import { ContactForm } from "@/components/contact/ContactForm"
import { TrustBand } from "@/components/layout/TrustBand"
import { Footer } from "@/components/layout/Footer"

export default function ContactPage() {
  return (
    <>
      <StickyNav />
      <SplitHero
        variant="page"
        override={{
          badge: "Start a Project",
          headline: "A written ballpark, within a day.",
          image: "/images/generated/communication-detail.jpg",
          imageAlt: "Jobsite notebook on the hood of a white cargo van",
        }}
      />
      <ContactForm />
      <TrustBand />
      <Footer />
    </>
  )
}
