import type { Metadata } from "next"
import MedXConferenceClient from "./MedXConferenceClient"
import { HERO_PHOTO, HIGHLIGHT_PHOTOS } from "./data"

const SITE_URL = "https://www.drinterested.org"

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
        url: "/medexplore-2026/medexplore-2026-og.jpg",
        width: 1200,
        height: 630,
        alt: "Students, speakers, and volunteers at the Dr. Interested MedExplore 2026 Conference (MedX 2026), University of Toronto Mississauga, August 16, 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MedExplore 2026 Recap (MedX 2026) | Dr. Interested",
    description: "See how MedExplore 2026 (MedX 2026) went at UTM on August 16, 2026.",
    images: ["/medexplore-2026/medexplore-2026-og.jpg"],
  },
  alternates: {
    canonical: "https://www.drinterested.org/medx-2026",
  },
}

const eventJsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "Dr. Interested MedExplore 2026 Conference",
  alternateName: "MedX 2026",
  description:
    "A full-day youth healthcare conference bringing together over 100 students, 23 speakers, guests, and panelists, and a team of 17 volunteers to explore careers in medicine, healthcare, research, and health policy.",
  startDate: "2026-08-16T09:30:00-04:00",
  endDate: "2026-08-16T16:30:00-04:00",
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  location: {
    "@type": "Place",
    name: "University of Toronto Mississauga — Davis Building",
    address: {
      "@type": "PostalAddress",
      streetAddress: "3359 Mississauga Rd",
      addressLocality: "Mississauga",
      addressRegion: "ON",
      postalCode: "L5L 1C6",
      addressCountry: "CA",
    },
  },
  image: [HERO_PHOTO, ...HIGHLIGHT_PHOTOS].map((p) => `${SITE_URL}${p.file}`),
  organizer: {
    "@type": "Organization",
    name: "Dr. Interested",
    url: SITE_URL,
  },
  performer: {
    "@type": "Organization",
    name: "Dr. Interested",
    url: SITE_URL,
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "CAD",
    availability: "https://schema.org/SoldOut",
    url: `${SITE_URL}/medx-2026`,
    validFrom: "2026-06-01T00:00:00-04:00",
  },
  sponsor: [
    { "@type": "Organization", name: "TakingITGlobal" },
    { "@type": "Organization", name: "Sprout Fellowship" },
  ],
  funder: {
    "@type": "Organization",
    name: "Canada Service Corps",
  },
  url: `${SITE_URL}/medx-2026`,
}

export default function MedX2026Page() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      <MedXConferenceClient />
    </>
  )
}
