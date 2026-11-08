import type { Metadata } from "next"
import CertificatePageClient from "./certificate-client"

export const metadata: Metadata = {
  title: "Certificate Generator",
  description:
    "Generate your personalized Dr. Interested certificate. Download PDF certificates for participation in our programs and events.",
  keywords: [
    "certificate",
    "certificate generator",
    "Dr. Interested certificate",
    "participation certificate",
    "educational certificate",
  ],
  openGraph: {
    title: "Certificate Generator | Dr. Interested",
    description:
      "Generate your personalized Dr. Interested certificate. Download PDF certificates for participation in our programs.",
    url: "https://www.drinterested.org/certificate",
    type: "website",
    images: [
      {
        url: "/websitebanner.jpg",
        width: 1920,
        height: 1080,
        alt: "Dr. Interested Certificate Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Certificate Generator | Dr. Interested",
    description:
      "Generate your personalized Dr. Interested certificate. Download PDF certificates for participation in our programs.",
    images: {
      url: "/websitebanner.jpg",
      alt: "Dr. Interested Certificate Generator",
    },
  },
  alternates: {
    canonical: "https://www.drinterested.org/certificate",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function CertificatePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-center my-6">Get your certificate here!</h1>
      <CertificatePageClient />
    </div>
  )
}
