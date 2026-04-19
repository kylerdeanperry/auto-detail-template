export interface ClientConfig {
  business: {
    name: string
    tagline: string
    phone: string
    email: string
    serviceArea: string
    about: string
    founded: string
    jobsCompleted: string
  }
  branding: {
    primaryColor: string
    accentColor: string
    backgroundColor: string
    logo: string
    font: string
  }
  services: {
    name: string
    price: string
    duration: string
    description: string
  }[]
  testimonials: {
    name: string
    location: string
    text: string
    rating: number
  }[]
  process: {
    step: string
    title: string
    description: string
  }[]
  chatbot: {
    enabled: boolean
    greeting: string
    accentColor: string
    closingGoal: "instant_quote" | "book_service" | "book_consultation" | "qualify_handoff"
    tone: "friendly_casual" | "professional" | "urgent_expert"
    quoteStyle: "range_from_services" | "exact_from_services"
    handoffMethod: "sms" | "email" | "both"
    handoffContact: string
    qualifyingQuestions: string[]
    customInstructions: string
  }
  meta: {
    industry: string
    clientId: string
  }
}
