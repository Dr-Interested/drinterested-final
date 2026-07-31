import type { Metadata } from "next"
import MedXConferenceClient from "./MedXConferenceClient"

export const metadata: Metadata = {
  title: "MedX Conference 2026 | Dr. Interested",
  description:
    "Join MedX Conference 2026 at University of Toronto Mississauga (UTM) on Sunday, August 16, 2026 (9:30 AM - 4:30 PM). A premier youth-focused healthcare career exploration conference for high school and post-secondary students. Hear from professionals, attend interactive workshops, and network. General admission passes and full passes with catered food available.",
  keywords: [
    "MedX Conference 2026",
    "MedX",
    "Dr. Interested MedX",
    "UTM MedX Conference",
    "University of Toronto Mississauga healthcare conference",
    "youth healthcare conference",
    "premed conference Ontario",
    "high school medical conference",
    "healthcare career exploration",
    "Mississauga healthcare event",
    "medical workshops for high schoolers",
    "healthcare professional panel",
    "youth medical networking",
  ],
  openGraph: {
    title: "MedX Conference 2026 | Dr. Interested",
    description:
      "Join MedX Conference 2026 at University of Toronto Mississauga on Sunday, August 16, 2026. Explore healthcare careers, attend hands-on workshops, connect with professionals, and empower your future in medicine.",
    url: "https://www.drinterested.org/medx-2026",
    siteName: "Dr. Interested",
    type: "website",
    images: [
      {
        url: "/medx.png",
        width: 1200,
        height: 630,
        alt: "MedX Conference 2026 - Explore. Learn. Lead.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MedX Conference 2026 | Dr. Interested",
    description:
      "Join MedX Conference 2026 at UTM on August 16, 2026. Discover your spark in healthcare!",
    images: ["/medx.png"],
  },
  alternates: {
    canonical: "https://www.drinterested.org/medx-2026",
  },
}

export default function MedX2026Page() {
  return <MedXConferenceClient />
}
