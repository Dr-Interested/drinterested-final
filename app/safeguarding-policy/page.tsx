import type { Metadata } from "next"
import SafeguardingPolicyClientPage from "@/components/safeguarding-policy/client"

export const metadata: Metadata = {
  title: "Safeguarding Policy",
  description: "Dr. Interested's commitment to the safety and wellbeing of the youth we work with, and how to report a concern.",
  keywords: ["safeguarding policy", "youth protection", "child safety policy"],
  openGraph: {
    title: "Safeguarding Policy | Dr. Interested",
    description: "Dr. Interested's commitment to the safety and wellbeing of the youth we work with, and how to report a concern.",
    url: "https://www.drinterested.org/safeguarding-policy",
    siteName: "Dr. Interested",
    type: "website",
    images: [{ url: "/websitebanner.jpg", width: 1920, height: 1080, alt: "Dr. Interested Safeguarding Policy" }],
  },
  alternates: {
    canonical: "https://www.drinterested.org/safeguarding-policy",
  },
  robots: { index: true, follow: true },
}

export default function SafeguardingPolicyPage() {
  return <SafeguardingPolicyClientPage />
}
