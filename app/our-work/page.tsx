import type { Metadata } from "next"
import OurWorkClient from "@/components/our-work/OurWorkClient"

const OUR_WORK_DESCRIPTION =
  "Dr. Interested has impacted 160,000+ youth and reached 3.7M+ people across 106 countries through healthcare education programs, mentorship, research competitions, and a 1,400+ member community. See our impact, events, and initiatives."

export const metadata: Metadata = {
  title: "Our Work",
  description: OUR_WORK_DESCRIPTION,
  keywords: [
    "Dr. Interested impact",
    "160000 youth impacted",
    "3.7 million reached",
    "youth healthcare programs",
    "medical education initiatives",
    "healthcare mentorship",
    "research competitions",
    "Resilient Minds Project",
    "Cards for Nurses",
    "pre-med community",
    "healthcare advocacy",
    "youth leadership",
    "medical research",
    "healthcare events",
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
