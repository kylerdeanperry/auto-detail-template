import { StickyNav } from "@/components/layout/StickyNav"
import { SplitHero } from "@/components/hero/SplitHero"
import { ContactForm } from "@/components/contact/ContactForm"
import { Footer } from "@/components/layout/Footer"

export default function ContactPage() {
  return (
    <>
      <StickyNav />
      <SplitHero variant="page" />
      <ContactForm />
      <Footer />
    </>
  )
}
