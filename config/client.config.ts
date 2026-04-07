export const clientConfig = {
  business: {
    name: "Mike's Auto Detail",
    tagline: "Premium Mobile Detailing — We Come To You",
    phone: "206-555-0192",
    email: "mike@mikesautodetail.com",
    serviceArea: "Seattle & Eastside",
    about: "Seattle's most trusted mobile detailing service since 2017. We bring professional results to your driveway, office, or anywhere in between.",
    founded: "2017",
    jobsCompleted: "500+",
  },
  branding: {
    primaryColor: "#0f0f0f",
    accentColor: "#C8102E",
    backgroundColor: "#F8F8F6",
    logo: "/logo.png",
    font: "Inter",
  },
  services: [
    {
      name: "Basic Wash",
      price: "$75",
      duration: "1 hr",
      description:
        "Hand wash, windows, tire shine, interior vacuum and wipe down.",
    },
    {
      name: "Full Detail",
      price: "$199",
      duration: "3 hrs",
      description:
        "Complete interior and exterior detail, clay bar, wax, odor removal.",
    },
    {
      name: "Ceramic Coating",
      price: "$599",
      duration: "1 day",
      description:
        "Long-lasting hydrophobic paint protection. Mirror finish, 2-year warranty.",
    },
    {
      name: "Paint Correction",
      price: "$349",
      duration: "4 hrs",
      description:
        "Remove swirl marks, light scratches, and oxidation. Restore original gloss.",
    },
  ],
  testimonials: [
    {
      name: "Sarah M.",
      location: "Bellevue",
      text: "Mike did an incredible job on my SUV. Looks better than when I bought it. Showed up on time and finished early.",
      rating: 5,
    },
    {
      name: "James T.",
      location: "Seattle",
      text: "Came to my office parking lot — super convenient. Will be booking monthly from now on.",
      rating: 5,
    },
    {
      name: "Linda K.",
      location: "Kirkland",
      text: "Best detail I have ever had. The ceramic coating is worth every penny. Highly recommend.",
      rating: 5,
    },
  ],
  process: [
    {
      step: "1",
      title: "Book Online",
      description: "Choose your service and pick a time that works for you.",
    },
    {
      step: "2",
      title: "We Come To You",
      description:
        "Our detailer arrives at your home, office, or anywhere you choose.",
    },
    {
      step: "3",
      title: "Drive Away Clean",
      description:
        "Showroom-quality results guaranteed. No trips to a shop needed.",
    },
  ],
  chatbot: {
    enabled: true,
    greeting:
      "Hi! I am Mike's booking assistant. Want to schedule a detail or get a quick quote?",
    accentColor: "#C8102E",
    closingGoal: "instant_quote" as const,
    tone: "friendly_casual" as const,
    quoteStyle: "range_from_services" as const,
    handoffMethod: "email" as const,
    handoffContact: "",
    qualifyingQuestions: [
      "What type of vehicle do you have?",
      "Any specific concerns (scratches, stains, pet hair)?",
    ],
    customInstructions: "",
  },
  meta: {
    industry: "detailing",
    clientId: "generic-detailing",
  },
};

export type ClientConfig = typeof clientConfig;
