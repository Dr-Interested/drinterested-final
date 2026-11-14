import type { Metadata } from "next"
import LinksPageClient from "@/components/links/links-client"

export const metadata: Metadata = {
  title: "Links",
  description:
    "Find all Dr. Interested links in one place. Follow us on Instagram, LinkedIn, YouTube, Spotify, Discord and more. Connect with our global youth community.",
  keywords: [
    "Dr. Interested links",
    "social media",
    "Discord",
    "Instagram",
    "LinkedIn",
    "YouTube",
    "Spotify",
    "youth wellness community",
  ],
  openGraph: {
    title: "Links | Dr. Interested",
    description:
      "Find all Dr. Interested links in one place. Follow us on Instagram, LinkedIn, YouTube, Spotify, Discord and more.",
    url: "https://www.drinterested.org/links",
    type: "website",
    images: [
      {
        url: "/websitebanner.jpg",
        width: 1920,
        height: 1080,
        alt: "Dr. Interested - All Links",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Links | Dr. Interested",
    description:
      "Find all Dr. Interested links in one place. Follow us on Instagram, LinkedIn, YouTube, Spotify, Discord and more.",
    images: {
      url: "/websitebanner.jpg",
      alt: "Dr. Interested - All Links",
    },
  },
  alternates: {
    canonical: "https://www.drinterested.org/links",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function LinksPage() {
  return <LinksPageClient />
}
