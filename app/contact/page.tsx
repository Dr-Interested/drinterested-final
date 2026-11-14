import type { Metadata } from "next"
import ContactClientPage from "./contact-client-page"

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact Dr. Interested about programs, partnerships, media inquiries, or joining our team, and find every official profile in our Profiles Hub.",
  keywords: [
    "contact Dr. Interested",
    "Dr. Interested media inquiries",
    "Dr. Interested press contact",
    "Dr. Interested profiles",
    "youth wellness organization contact",
    "partner with Dr. Interested",
  ],
  openGraph: {
    title: "Contact Us | Dr. Interested",
    description:
      "Contact Dr. Interested about programs, partnerships, media inquiries, or joining our team.",
    url: "https://www.drinterested.org/contact",
    siteName: "Dr. Interested",
    type: "website",
    images: [
      {
        url: "/websitebanner.jpg",
        width: 1920,
        height: 1080,
        alt: "Contact Dr. Interested",
      },
    ],
  },
  alternates: {
    canonical: "https://www.drinterested.org/contact",
  },
}

export default function ContactPage() {
  return <ContactClientPage />
}
