import type { Metadata } from "next"
import { Mail, Sparkles, Users, Megaphone, Award, Heart, Info } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Sponsorships & Donations",
  description:
    "Partner with Dr. Interested to support youth healthcare education. Join our sponsors or donate to help inspire the next generation of healthcare professionals.",
  keywords: [
    "sponsorships",
    "partner with Dr. Interested",
    "donations",
    "support healthcare education",
    "youth healthcare programs",
    "corporate partnerships",
    "charitable giving",
  ],
  openGraph: {
    title: "Sponsorships & Donations | Dr. Interested",
    description:
      "Partner with Dr. Interested to support youth healthcare education. Join our sponsors or donate to help inspire the next generation of healthcare professionals.",
    url: "https://www.drinterested.org/sponsorships",
    siteName: "Dr. Interested",
    type: "website",
    images: [
      {
        url: "/websitebanner.jpg",
        width: 1920,
        height: 1080,
        alt: "Dr. Interested Sponsorships",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sponsorships & Donations | Dr. Interested",
    description:
      "Partner with Dr. Interested to support youth healthcare education. Join our sponsors or donate to help inspire the next generation of healthcare professionals.",
    images: {
      url: "/websitebanner.jpg",
      alt: "Dr. Interested Sponsorships",
    },
  },
  alternates: {
    canonical: "https://www.drinterested.org/sponsorships",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function SponsorshipsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#f5f1eb]/30">
      {/* Hero Section */}
      <section className="hero-section bg-[#f5f1eb] dark:bg-[#0b0b0b] py-10 md:py-16">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-[#4ecdc4]/10 text-[#405862] px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            Partner With Us
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#405862] mb-6 text-balance">
            Sponsorships & Donations
          </h1>
          <p className="text-lg text-[#405862]/80 max-w-2xl mx-auto text-pretty">
            Support youth healthcare education and leadership while gaining visibility across a global community that has
            impacted 160,000+ youth and reached 3.7M+ people across 106 countries. Join our sponsors or donate to help
            inspire the next generation of healthcare professionals.
          </p>
        </div>
      </section>

      {/* Current Sponsors Section */}
      <section className="py-12 md:py-16 bg-[#f7f6f2] dark:bg-[#0b0b0b]">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#405862] dark:text-white mb-4">Our Sponsors</h2>
            <p className="text-[#405862]/70 dark:text-white/70">Organizations supporting youth healthcare leadership</p>
          </div>

          <div className="bg-white rounded-2xl border-2 border-[#4ecdc4]/20 p-12 md:p-16 text-center shadow-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#4ecdc4]/10 rounded-full mb-4">
              <Award className="h-8 w-8 text-[#4ecdc4]" />
            </div>
            <h3 className="text-2xl font-semibold text-[#405862] mb-2">Coming Soon</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              We're building partnerships with organizations that share our vision for youth healthcare education.
            </p>
          </div>
        </div>
      </section>

      {/* Sponsor Us Section */}
      <section className="py-12 md:py-16 bg-[#f7f6f2] dark:bg-[#0b0b0b]">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#405862] dark:text-white mb-4">Sponsor Us</h2>
            <p className="text-lg text-[#405862]/80 dark:text-white/80 max-w-2xl mx-auto text-pretty">
              Partner with Dr. Interested to make a meaningful impact on the next generation of healthcare leaders
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-xl border border-[#4ecdc4]/20 p-6 text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[#4ecdc4]/10 rounded-full mb-4">
                <Users className="h-6 w-6 text-[#4ecdc4]" />
              </div>
              <h3 className="text-lg font-semibold text-[#405862] mb-2">Social Media Visibility</h3>
              <p className="text-sm text-muted-foreground">
                Your logo featured across our Instagram, LinkedIn, and other platforms — 3.7M+ content impressions and 160,000+ youth impacted globally
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#4ecdc4]/20 p-6 text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[#4ecdc4]/10 rounded-full mb-4">
                <Megaphone className="h-6 w-6 text-[#4ecdc4]" />
              </div>
              <h3 className="text-lg font-semibold text-[#405862] mb-2">Speaking Opportunities</h3>
              <p className="text-sm text-muted-foreground">
                Get dedicated speaking time if you're sponsoring a specific event, connecting directly with our
                community
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#4ecdc4]/20 p-6 text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[#4ecdc4]/10 rounded-full mb-4">
                <Award className="h-6 w-6 text-[#4ecdc4]" />
              </div>
              <h3 className="text-lg font-semibold text-[#405862] mb-2">Event Recognition</h3>
              <p className="text-sm text-muted-foreground">
                Acknowledgment before events and on presentation slides, ensuring your brand is seen by our engaged
                audience
              </p>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="bg-gradient-to-br from-[#405862] to-[#334852] rounded-2xl p-8 md:p-12 text-center text-white shadow-xl">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Interested in Sponsoring?</h3>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto text-pretty">
              Reach out to our finance team to discuss sponsorship opportunities and how we can create a partnership
              that aligns with your organization's goals.
            </p>
            <Link
              href="mailto:finance@drinterested.org"
              className="inline-flex items-center gap-2 bg-[#4ecdc4] text-[#405862] hover:bg-[#4ecdc4]/90 px-6 py-3 rounded-lg font-semibold transition-all hover:shadow-lg hover:scale-105"
            >
              <Mail className="h-5 w-5" />
              finance@drinterested.org
            </Link>
          </div>
        </div>
      </section>

      {/* Support Us Through Donations Section */}
      <section className="py-12 md:py-16 bg-[#f5f1eb]/50">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#4ecdc4]/10 text-[#405862] px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Heart className="h-4 w-4" />
              Support Our Mission
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#405862] mb-4">Support Us Through Donations</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Every contribution helps us continue our educational mission to inspire the next generation of healthcare
              professionals.
            </p>
          </div>

          {/* Donation Information */}
          <div className="bg-white rounded-2xl border-2 border-[#4ecdc4]/20 p-8 md:p-12 mb-8 shadow-sm">
            <h3 className="text-2xl font-bold text-[#405862] mb-6">Why Your Donation Matters</h3>
            <p className="text-[#405862]/80 mb-6 leading-relaxed">
              Dr. Interested is a student-run, unregistered organization dedicated to providing accessible healthcare
              education to youth worldwide. Your donations directly support:
            </p>
            <ul className="grid md:grid-cols-2 gap-4 mb-8">
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#4ecdc4]/20 flex items-center justify-center mt-0.5">
                  <div className="h-2 w-2 rounded-full bg-[#4ecdc4]"></div>
                </div>
                <span className="text-[#405862]/80">Youth healthcare education and mentorship programs</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#4ecdc4]/20 flex items-center justify-center mt-0.5">
                  <div className="h-2 w-2 rounded-full bg-[#4ecdc4]"></div>
                </div>
                <span className="text-[#405862]/80">Events, workshops, and outreach initiatives</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#4ecdc4]/20 flex items-center justify-center mt-0.5">
                  <div className="h-2 w-2 rounded-full bg-[#4ecdc4]"></div>
                </div>
                <span className="text-[#405862]/80">Recurring and one-time educational programs</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#4ecdc4]/20 flex items-center justify-center mt-0.5">
                  <div className="h-2 w-2 rounded-full bg-[#4ecdc4]"></div>
                </div>
                <span className="text-[#405862]/80">Core platform and operational costs</span>
              </li>
            </ul>
          </div>

          {/* Donation Method */}
          <div className="bg-white rounded-2xl border-2 border-[#4ecdc4]/20 p-8 md:p-12 mb-8 shadow-sm">
            <h3 className="text-2xl font-bold text-[#405862] mb-6 flex items-center gap-2">
              <Mail className="h-6 w-6 text-[#4ecdc4]" />
              How to Donate
            </h3>
            <p className="text-[#405862]/80 mb-6 leading-relaxed">
              We accept donations via E-Transfer to support our mission:
            </p>
            <div className="bg-[#f5f1eb] rounded-lg p-6 mb-6 border border-[#4ecdc4]/20">
              <p className="text-sm text-[#405862]/70 mb-2">E-Transfer Email Address</p>
              <p className="text-2xl font-bold text-[#405862] mb-4">finance@drinterested.org</p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-[#405862]">Donation Instructions:</h4>
              <ul className="space-y-3 text-[#405862]/80">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 font-bold text-[#4ecdc4]">1.</span>
                  <span>
                    Send an E-Transfer to <span className="font-medium text-[#405862]">finance@drinterested.org</span>
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 font-bold text-[#4ecdc4]">2.</span>
                  <span>Include your name and the word "Donation" in the message field</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 font-bold text-[#4ecdc4]">3.</span>
                  <span>
                    Optional: If you'd like your donation directed toward a specific program or event, include the
                    program name in the e-transfer description
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-[#4ecdc4]/5 rounded-lg p-4 mt-6 border border-[#4ecdc4]/20">
              <p className="text-sm text-[#405862]/80">
                <span className="font-medium text-[#405862]">Program Direction:</span> We honor program-specific
                donation requests where possible and subject to organizational needs. If you'd like your donation
                directed toward a specific program or event, please include the program name in the e-transfer
                description.
              </p>
            </div>
          </div>

          {/* Transparency Notice */}
          <div className="bg-white rounded-2xl border-2 border-[#405862]/30 p-8 md:p-12 mb-8 shadow-sm">
            <div className="flex gap-4">
              <Info className="h-6 w-6 text-[#405862] flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-[#405862] mb-4">Transparency & Compliance</h3>
                <div className="space-y-3 text-[#405862]/80 text-sm">
                  <p>
                    <span className="font-medium text-[#405862]">Dr. Interested is not a registered charity.</span>{" "}
                    Donations are not eligible for charitable tax receipts as we are not registered with Canada's CRA or
                    any similar tax authority.
                  </p>
                  <p>
                    All funds received are used exclusively to support Dr. Interested's educational mission and programs
                    dedicated to youth healthcare education.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Legal Links */}
          <div className="text-center text-sm text-muted-foreground">
            <p>
              By donating, you agree to our{" "}
              <Link
                href="/privacy-policy"
                className="text-[#405862] font-medium hover:text-[#4ecdc4] underline transition-colors"
              >
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link
                href="/terms"
                className="text-[#405862] font-medium hover:text-[#4ecdc4] underline transition-colors"
              >
                Terms & Conditions
              </Link>
              .
            </p>
          </div>

          {/* Closing Message */}
          <div className="mt-12 p-8 text-center bg-gradient-to-r from-[#4ecdc4]/5 to-[#405862]/5 dark:from-[#0b0b0b] dark:to-[#101415] rounded-xl">
            <p className="text-lg text-[#405862] font-medium text-pretty">
              Thank you for supporting youth pursuing careers in healthcare.
            </p>
          </div>
        </div>
      </section>

      {/* Sponsorship Package Section */}
      <section className="py-12 md:py-16 bg-[#f7f6f2] dark:bg-[#0b0b0b]">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#405862] mb-4">Sponsorship Package</h2>
            <p className="text-muted-foreground">Detailed information about our sponsorship tiers and benefits</p>
          </div>

          <div className="bg-white rounded-2xl border-2 border-[#4ecdc4]/20 p-12 md:p-16 text-center shadow-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#4ecdc4]/10 rounded-full mb-4">
              <Sparkles className="h-8 w-8 text-[#4ecdc4]" />
            </div>
            <h3 className="text-2xl font-semibold text-[#405862] mb-2">Coming Soon</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              We're preparing a comprehensive sponsorship package with detailed tiers and benefits. Check back soon!
            </p>
          </div>

          {/* Placeholder for future Canva embed */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>Sponsorship package details will be embedded here once available</p>
          </div>
        </div>
      </section>
    </div>
  )
}
