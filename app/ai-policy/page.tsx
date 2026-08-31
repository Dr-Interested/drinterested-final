import type { Metadata } from "next"
import AiPolicyClientPage from "@/components/ai-policy/client"

export const metadata: Metadata = {
  title: "AI Policy",
  description: "How Dr. Interested uses artificial intelligence tools in producing content and running our operations.",
  keywords: ["AI policy", "artificial intelligence disclosure", "AI-assisted content"],
  openGraph: {
    title: "AI Policy | Dr. Interested",
    description: "How Dr. Interested uses artificial intelligence tools in producing content and running our operations.",
    url: "https://www.drinterested.org/ai-policy",
    siteName: "Dr. Interested",
    type: "website",
    images: [{ url: "/websitebanner.jpg", width: 1920, height: 1080, alt: "Dr. Interested AI Policy" }],
  },
  alternates: {
    canonical: "https://www.drinterested.org/ai-policy",
  },
  robots: { index: true, follow: true },
}

export default function AiPolicyPage() {
  return <AiPolicyClientPage />
}
