import type { Metadata } from "next"

// page.tsx here is a client component ("use client") and can't export metadata, so this
// server layout carries the title/description and the self-canonical for this route.
export const metadata: Metadata = {
  title: "Culture & Psychology Conference",
  description:
    "Highlights from the Culture & Psychology Conference, where researchers, youth leaders, and mental health professionals explored the influence of culture on psychology, identity, and wellbeing.",
  alternates: {
    canonical: "https://www.drinterested.org/events/psychology-conference",
  },
  openGraph: {
    title: "Culture & Psychology Conference | Dr. Interested",
    description:
      "Highlights from the Culture & Psychology Conference on culture, psychology, identity, and wellbeing.",
    url: "https://www.drinterested.org/events/psychology-conference",
    siteName: "Dr. Interested",
    type: "website",
  },
}

export default function PsychologyConferenceLayout({ children }: { children: React.ReactNode }) {
  return children
}
