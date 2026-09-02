import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Thank You for Subscribing | Dr. Interested",
  description:
    "Thank you for confirming your subscription to the Dr. Interested newsletter. You're now part of our community of healthcare enthusiasts!",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "https://www.drinterested.org/thank-you",
  },
  openGraph: {
    title: "Thank You for Subscribing | Dr. Interested",
    description: "Thank you for confirming your subscription to the Dr. Interested newsletter.",
    url: "https://www.drinterested.org/thank-you",
    type: "website",
    images: [
      {
        url: "/websitebanner.jpg",
        width: 1920,
        height: 1080,
        alt: "Dr. Interested - Thank You",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Thank You for Subscribing | Dr. Interested",
    description: "Thank you for confirming your subscription to the Dr. Interested newsletter.",
    images: {
      url: "/websitebanner.jpg",
      alt: "Dr. Interested - Thank You",
    },
  },
}

export default function ThankYouPage() {
  return (
    <div className="hero-section container flex flex-col items-center justify-center min-h-[70vh] py-16 text-center">
      {/* Meta Pixel: CompleteRegistration event for newsletter subscription */}
      <script
        dangerouslySetInnerHTML={{
          __html: `if(typeof fbq !== 'undefined'){ fbq('track', 'CompleteRegistration'); }`,
        }}
      />
      <div className="max-w-md mx-auto">
        <div className="mb-6 flex justify-center">
          <div className="relative h-24 w-24">
            <Image src="/logo.png" alt="Dr. Interested Logo" fill sizes="96px" className="object-contain rounded-lg" priority />
          </div>
        </div>

        <div className="bg-[#f5f1eb] p-8 rounded-lg shadow-md">
          <div className="inline-flex items-center justify-center p-2 bg-[#4ecdc4]/20 rounded-full mb-6">
            <CheckCircle className="h-8 w-8 text-[#4ecdc4]" />
          </div>

          <h1 className="text-3xl font-bold text-[#405862] mb-4">Thank You for Subscribing!</h1>

          <p className="text-[#405862] mb-6">
            Your subscription to the Dr. Interested newsletter has been confirmed. We're excited to share the latest
            healthcare opportunities, events, and resources with you!
          </p>

          <div className="space-y-4">
            <Button asChild className="bg-[#405862] hover:bg-[#334852] w-full">
              <Link href="/events">
                Explore Upcoming Events
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="w-full border-[#405862] text-[#405862] hover:bg-[#405862] hover:text-white bg-transparent"
            >
              <Link href="/publications">Read Our Latest Articles</Link>
            </Button>

            <Button asChild variant="ghost" className="w-full text-[#405862] hover:bg-[#f5f1eb]">
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        </div>

        <div className="mt-6 text-sm text-[#405862]/70">
          <p>
            Follow us on{" "}
            <Link
              href="https://www.instagram.com/dr.interested/"
              className="text-[#4ecdc4] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </Link>{" "}
            and{" "}
            <Link
              href="https://www.linkedin.com/company/dr-interested"
              className="text-[#4ecdc4] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </Link>{" "}
            for more updates.
          </p>
        </div>
      </div>
    </div>
  )
}
