import type { Metadata } from "next"
import MediaConsentClientPage from "@/components/media-consent/client"

export const metadata: Metadata = {
  title: "Media Consent and Release",
  description: "What you're agreeing to if you or your child are photographed or filmed at a Dr. Interested event.",
  keywords: ["media consent", "photo release form", "youth media consent"],
  openGraph: {
    title: "Media Consent and Release | Dr. Interested",
    description: "What you're agreeing to if you or your child are photographed or filmed at a Dr. Interested event.",
    url: "https://www.drinterested.org/media-consent",
    siteName: "Dr. Interested",
    type: "website",
    images: [{ url: "/websitebanner.jpg", width: 1920, height: 1080, alt: "Dr. Interested Media Consent" }],
  },
  alternates: {
    canonical: "https://www.drinterested.org/media-consent",
  },
  robots: { index: true, follow: true },
}

export default function MediaConsentPage() {
  return <MediaConsentClientPage />
}
