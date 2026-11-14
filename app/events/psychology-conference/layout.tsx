import type { Metadata } from "next"

// page.tsx here is a client component ("use client") and can't export metadata, so this
// server layout carries the title/description and the self-canonical for this route.
export const metadata: Metadata = {
  title: "Culture & Psychology Conference",
  description:
    "Highlights from Dr. Interested's Culture & Psychology Conference: how culture shapes psychology, identity and wellbeing, with researchers and youth leaders.",
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
