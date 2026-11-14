import type { Metadata } from "next"
import MembersClient from "../MembersClient"
import { YEAR_2026 } from "@/lib/impact-stats"

export const metadata: Metadata = {
  title: "Our Team",
  description: `Meet the ${YEAR_2026.executives} youth executives in ${YEAR_2026.teamCountries} countries and the advisors behind Dr. Interested, a youth led global wellness organization.`,
  keywords: [
    "Dr. Interested team",
    "youth wellness leaders",
    "medical student advisors",
    "youth mentors",
    "student organization executives",
  ],
  openGraph: {
    title: "Our Team | Dr. Interested",
    description:
      "Meet the youth executives and advisors behind Dr. Interested, a youth led global wellness organization.",
    url: "https://www.drinterested.org/members",
    siteName: "Dr. Interested",
    type: "website",
    images: [
      {
        url: "/websitebanner.jpg",
        width: 1920,
        height: 1080,
        alt: "Dr. Interested Team",
      },
    ],
  },
  alternates: {
    canonical: "https://www.drinterested.org/members",
  },
}

export default function TabPage() {
  return <MembersClient />
}
