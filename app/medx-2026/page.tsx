import type { Metadata } from "next"
import MedXConferenceClient from "./MedXConferenceClient"

export const metadata: Metadata = {
  title: "MedExplore 2026 Recap (MedX 2026) | Dr. Interested",
  description:
    "See how MedExplore 2026 (MedX 2026) went at the University of Toronto Mississauga, Davis Building on Sunday, August 16, 2026. Over 100 students, 23 speakers, guests, and panelists, and 17 volunteers came together for a full day exploring careers in healthcare. Photos, agenda recap, letters of support, and certificates of recognition.",
  keywords: [
    "MedExplore 2026",
    "MedX Conference 2026",
    "MedX",
    "Dr. Interested MedExplore",
    "UTM healthcare conference recap",
    "University of Toronto Mississauga healthcare conference",
    "youth healthcare conference recap",
    "premed conference Ontario",
    "high school medical conference",
    "healthcare career exploration",
    "Mississauga healthcare event",
  ],
  openGraph: {
    title: "MedExplore 2026 Recap (MedX 2026) | Dr. Interested",
    description:
      "Over 100 students, 23 speakers, guests, and panelists, and 17 volunteers came together at UTM on August 16, 2026 for a full day exploring careers in healthcare. See the recap.",
    url: "https://www.drinterested.org/medx-2026",
    siteName: "Dr. Interested",
    type: "website",
    images: [
      {
        url: "/medx.png",
        width: 1200,
        height: 630,
        alt: "MedExplore 2026 (MedX 2026) Recap",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MedExplore 2026 Recap (MedX 2026) | Dr. Interested",
    description: "See how MedExplore 2026 (MedX 2026) went at UTM on August 16, 2026.",
    images: ["/medx.png"],
  },
  alternates: {
    canonical: "https://www.drinterested.org/medx-2026",
  },
}

export default function MedX2026Page() {
  return <MedXConferenceClient />
}
