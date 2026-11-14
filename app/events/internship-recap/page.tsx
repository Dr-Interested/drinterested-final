import type { Metadata } from "next"
import InternshipRecapClientPage from "./internship-recap-client"

export const metadata: Metadata = {
  title: "Medical-Technological Internship Recap",
  description:
    "Student projects from Dr. Interested's Medical-Technological Internship on CT, ultrasound, PET scans, robotic surgery, DNA sequencing and 3D bioprinting.",
  keywords: [
    "internship",
    "medical technology",
    "medical internship",
    "healthcare technology",
    "student research",
    "CT scans",
    "ultrasound",
    "robotic surgery",
    "DNA sequencing",
    "3D bioprinting",
    "healthcare research",
  ],
  openGraph: {
    title: "Medical-Technological Internship Recap | Dr. Interested",
    description:
      "Explore amazing projects from our Medical-Technological Internship featuring healthcare technologies like CT scans, ultrasound, robotic surgery, and more.",
    url: "https://www.drinterested.org/events/internship-recap",
    type: "website",
    images: [
      {
        url: "/websitebanner.jpg",
        width: 1920,
        height: 1080,
        alt: "Medical-Technological Internship Recap",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Medical-Technological Internship Recap | Dr. Interested",
    description:
      "Explore amazing projects from our Medical-Technological Internship featuring cutting-edge healthcare technologies.",
    images: {
      url: "/websitebanner.jpg",
      alt: "Medical-Technological Internship Recap",
    },
  },
  alternates: {
    canonical: "https://www.drinterested.org/events/internship-recap",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function InternshipRecapPage() {
  return <InternshipRecapClientPage />
}
