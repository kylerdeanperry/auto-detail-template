import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { Services } from "@/components/sections/Services";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { About } from "@/components/sections/About";
import { Testimonials } from "@/components/sections/Testimonials";
import { BookingCTA } from "@/components/sections/BookingCTA";
import { Footer } from "@/components/sections/Footer";
import { ChatbotWidget } from "@/components/ChatbotWidget";
import { clientConfig } from "@/config/client.config";

function LocalBusinessJsonLd() {
  const c = clientConfig;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: c.business.name,
    description: c.business.about,
    telephone: c.business.phone,
    email: c.business.email,
    areaServed: c.business.serviceArea,
    foundingDate: c.business.founded,
    priceRange: "$$",
    makesOffer: c.services.map((s) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: s.name,
        description: s.description,
      },
      price: s.price.replace("$", ""),
      priceCurrency: "USD",
    })),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      reviewCount: String(c.testimonials.length),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function Home() {
  return (
    <main>
      <LocalBusinessJsonLd />
      <Navbar />
      <Hero />
      <TrustBar />
      <Services />
      <HowItWorks />
      <About />
      <Testimonials />
      <BookingCTA />
      <Footer />
      <ChatbotWidget />
    </main>
  );
}
