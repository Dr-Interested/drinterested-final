import type { Metadata } from "next"
import MembersClient from "./MembersClient"

export const metadata: Metadata = {
  title: "Our Team",
  description:
    "Meet the talented team behind Dr. Interested - dedicated executives and advisors inspiring the next generation of healthcare professionals across 50+ countries.",
  keywords: [
    "Dr. Interested team",
    "healthcare education leaders",
    "medical student advisors",
    "youth healthcare mentors",
    "student organization executives",
  ],
  openGraph: {
    title: "Our Team | Dr. Interested",
    description:
      "Meet the talented team behind Dr. Interested - dedicated executives and advisors inspiring the next generation of healthcare professionals.",
    url: "https://www.drinterested.org/members",
    siteName: "Dr. Interested",
    type: "website",
    images: [
      {
        url: "https://www.drinterested.org/adil.png",
        width: 800,
        height: 800,
        alt: "Adil Mukhi - Executive Director, Dr. Interested",
      },
      {
        url: "https://www.drinterested.org/websitebanner.jpg",
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

export default function MembersPage() {
  return <MembersClient />
}
