import type { Metadata } from "next"
import MedXConferenceClient from "./MedXConferenceClient"

export const metadata: Metadata = {
  title: "MedX Conference 2026 | Dr. Interested",
  description:
    "Join MedX Conference 2026 at University of Toronto Mississauga on August 16, 2026 (10 AM - 4 PM). Explore healthcare careers, hear from top professionals, and build your future. Register now!",
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
  ],
  openGraph: {
    title: "MedX Conference 2026 | Dr. Interested",
    description:
      "Join MedX Conference 2026 at University of Toronto Mississauga on August 16, 2026. Explore healthcare careers, connect with professionals, and empower your future.",
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
