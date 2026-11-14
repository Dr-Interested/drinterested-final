import type { Metadata } from "next"
import PrivacyPolicyClientPage from "@/components/privacy-policy/client"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read Dr. Interested's Privacy Policy to understand how we collect, use, and protect your personal information.",
  keywords: ["privacy policy", "data protection", "personal information", "privacy", "GDPR", "data collection"],
  openGraph: {
    title: "Privacy Policy | Dr. Interested",
    description:
      "Read Dr. Interested's Privacy Policy to understand how we collect, use, and protect your personal information.",
    url: "https://www.drinterested.org/privacy-policy",
    siteName: "Dr. Interested",
    type: "website",
    images: [
      {
        url: "/og-2026.jpg",
        width: 1200,
        height: 630,
        alt: "Dr. Interested Privacy Policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Dr. Interested",
    description:
      "Read Dr. Interested's Privacy Policy to understand how we collect, use, and protect your personal information.",
    images: {
      url: "/og-2026.jpg",
      alt: "Dr. Interested Privacy Policy",
    },
  },
  alternates: {
    canonical: "https://www.drinterested.org/privacy-policy",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClientPage />
}
