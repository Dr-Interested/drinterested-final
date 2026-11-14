import type { Metadata } from "next"
import OurWorkClient from "@/components/our-work/OurWorkClient"
import { ALL_TIME } from "@/lib/impact-stats"

const OUR_WORK_DESCRIPTION = `${ALL_TIME.youthImpacted} youth impacted in ${ALL_TIME.countries} countries through wellness career education, access to policy spaces, and community spaces. See our 2026 programs.`

export const metadata: Metadata = {
  title: "Our Work",
  description: OUR_WORK_DESCRIPTION,
  keywords: [
    "Dr. Interested impact",
    "Dr. Interested 2026",
    "389000 youth impacted",
    "youth wellness programs",
    "wellness career education",
    "youth in policy",
    "youth community spaces",
    "Research Proposal Competition",
    "Office Hours Initiative",
    "MedExplore 2026",
    "Explore 3 Case Competition",
    "Code Blue Planet",
    "Simmon Chang Chess Club",
    "youth mentorship",
  ],
  openGraph: {
    title: "Our Work | Dr. Interested",
    description: OUR_WORK_DESCRIPTION,
    url: "https://www.drinterested.org/our-work",
    siteName: "Dr. Interested",
    images: [
      {
        url: "/websitebanner.jpg",
        width: 1920,
        height: 1080,
        alt: "Dr. Interested Team",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Work | Dr. Interested",
    description: OUR_WORK_DESCRIPTION,
    images: ["https://www.drinterested.org/og-image.png"],
  },
  alternates: {
    canonical: "https://www.drinterested.org/our-work",
  },
}

export default function OurWorkPage() {
  return <OurWorkClient />
}
