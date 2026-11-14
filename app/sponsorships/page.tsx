import type React from "react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Mail, Sparkles, Users, Megaphone, Award, Heart, Info, Building2, Share2, UserPlus, Receipt } from "lucide-react"
import { ALL_TIME, IMPACT_REPORT_2026, LEGAL_STATUS, YEAR_2026 } from "@/lib/impact-stats"

const DESCRIPTION = `Sponsor, partner with, or donate to Dr. Interested, a youth led wellness organization that has impacted ${ALL_TIME.youthImpacted} youth. US donors can receive tax receipts.`

export const metadata: Metadata = {
  title: "Sponsorships & Donations",
  description: DESCRIPTION,
  keywords: [
    "sponsor Dr. Interested",
    "partner with Dr. Interested",
    "donate to youth wellness",
    "Future Interested",
    "fiscally sponsored 501(c)(3)",
    "Hack Club fiscal sponsorship",
    "youth programs sponsorship",
    "corporate partnerships",
  ],
  openGraph: {
    title: "Sponsorships & Donations | Dr. Interested",
    description: DESCRIPTION,
    url: "https://www.drinterested.org/sponsorships",
    siteName: "Dr. Interested",
    type: "website",
    images: [{ url: "/websitebanner.jpg", width: 1920, height: 1080, alt: "Dr. Interested Sponsorships" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sponsorships & Donations | Dr. Interested",
    description: DESCRIPTION,
    images: { url: "/websitebanner.jpg", alt: "Dr. Interested Sponsorships" },
  },
  alternates: { canonical: "https://www.drinterested.org/sponsorships" },
  robots: { index: true, follow: true },
}

const SUPPORTERS: { name: string; role: string; logo?: string }[] = [
  { name: "Canada Service Corps", role: "Funder, MedExplore 2026", logo: "/medx/canada-service-corps-logo.png" },
  { name: "TakingITGlobal", role: "Sponsor, MedExplore 2026", logo: "/taking-it-global-logo.png" },
  { name: "Sprout Fellowship", role: "Sponsor, MedExplore 2026", logo: "/sprout-fellowship-logo.png" },
  { name: "GLOCAL Foundation of Canada", role: "Partner for volunteers, policy access and grants", logo: "/glocal.webp" },
  { name: "Student Innovation Lab", role: "Partner for volunteer programming and wellness" },
  { name: "UNESCO Learning Planet Festival", role: "Program partner" },
  { name: "Curiosity Films", role: "Program partner" },
  { name: "Hope In Every Hand and Youth Law Advocacy", role: "Explore 3 founding partners" },
]

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white rounded-2xl border-2 border-[#4ecdc4]/20 p-6 md:p-10 shadow-sm ${className}`}>{children}</div>
}

function LevelHeading({ level, icon: Icon, title }: { level: number; icon: typeof Mail; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="bg-[#405862] text-white text-xs font-bold px-3 py-1 rounded-full">Level {level}</span>
      <Icon className="h-5 w-5 text-[#4ecdc4]" />
      <h3 className="text-xl md:text-2xl font-bold text-[#405862]">{title}</h3>
    </div>
  )
}

export default function SponsorshipsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#f5f1eb]/30">
      {/* Hero */}
      <section className="hero-section bg-[#f5f1eb] dark:bg-[#0b0b0b] py-10 md:py-16">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-[#4ecdc4]/10 text-[#405862] px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            How You Can Support Us
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#405862] mb-6 text-balance">
            Sponsorships & Donations
          </h1>
          <p className="text-lg text-[#405862]/80 max-w-2xl mx-auto text-pretty">
            Help keep wellness career education, policy access, and community spaces free for every young person. Our
            community has impacted {ALL_TIME.youthImpacted} youth across {ALL_TIME.countries} countries and territories,
            with {ALL_TIME.impressions} impressions across our platforms.
          </p>
        </div>
      </section>

      {/* Four levels */}
      <section className="py-12 md:py-16 bg-[#f7f6f2] dark:bg-[#0b0b0b]">
        <div className="container max-w-5xl mx-auto px-4 space-y-6">
          <p className="text-center text-[#405862]/80">Every level matters.</p>

          <Card>
            <LevelHeading level={1} icon={Share2} title="Follow us and share what you learn" />
            <p className="text-[#405862]/80 mb-4">
              The easiest way to support us is to stay connected. Follow our accounts, subscribe to our newsletter, and
              share what you learn with youth in your community.
            </p>
            <div className="flex flex-wrap gap-2 text-sm">
              {[
                ["Instagram", "https://www.instagram.com/dr.interested/"],
                ["Discord", "https://discord.gg/pzbGRgsGXY"],
                ["LinkedIn", "https://www.linkedin.com/company/dr-interested"],
                ["Newsletter", "https://news.drinterested.org/posts"],
              ].map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-[#f5f1eb] text-[#405862] font-medium hover:bg-[#4ecdc4]/20"
                >
                  {label}
                </a>
              ))}
            </div>
          </Card>

          <Card>
            <LevelHeading level={2} icon={UserPlus} title="Join our team" />
            <p className="text-[#405862]/80 mb-4">
              Join us as an executive, volunteer, ambassador, or podcast member. Contribute to UN reports, earn verified
              hours, and work with an international team of {YEAR_2026.executives} executives in{" "}
              {YEAR_2026.teamCountries} countries.
            </p>
            <Link
              href="/members/apply"
              className="inline-flex items-center gap-2 bg-[#405862] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[#334852]"
            >
              Apply to join
            </Link>
          </Card>

          <Card>
            <LevelHeading level={3} icon={Heart} title="Donate as an individual or family" />
            <p className="text-[#405862]/80 mb-4 leading-relaxed">
              Donations fund our programs, events, and the tools that keep our programs free. Send an e-transfer to{" "}
              <a href="mailto:finance@drinterested.org" className="font-semibold text-[#405862] underline underline-offset-2">
                finance@drinterested.org
              </a>{" "}
              and add a note naming the program or project you want to support. We honour program specific requests
              where possible.
            </p>
            <div className="bg-[#fff7e6] border border-[#f0c36d] rounded-lg p-4 text-sm text-[#405862]">
              <p className="font-semibold mb-1 flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                Want a tax receipt? Email us before you donate.
              </p>
              <p className="text-[#405862]/80">
                Tax receipts cannot be issued for e-transfers. If you want a receipt, do not send money first: email{" "}
                finance@drinterested.org in advance, tell us whether you are in Canada or the United States, and we will
                set up your receipt before you donate.
              </p>
            </div>
          </Card>

          <Card>
            <LevelHeading level={4} icon={Building2} title="Bring your company, employer, or community organization" />
            <p className="text-[#405862]/80 mb-6 leading-relaxed">
              Ask your employer, your company, or a local organization to sponsor or partner with us. Sponsors can give
              money or in kind support (anything they sell or provide). In return, sponsors receive marketing and logo
              placement on our materials, and recognition grows with the level of sponsorship. Tax receipts for sponsors
              follow the same rules as donations.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {[
                {
                  icon: Users,
                  title: "Social media visibility",
                  text: `Your logo across our platforms: ${YEAR_2026.followers} followers and ${YEAR_2026.impressions} impressions in 2026.`,
                },
                {
                  icon: Megaphone,
                  title: "Speaking opportunities",
                  text: "Dedicated speaking time when you sponsor a specific event, connecting directly with our community.",
                },
                {
                  icon: Award,
                  title: "Event recognition",
                  text: "Acknowledgement before events and on presentation slides, seen by an engaged youth audience.",
                },
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-xl bg-[#f5f1eb] p-4">
                  <Icon className="h-5 w-5 text-[#4ecdc4] mb-2" />
                  <h4 className="font-semibold text-[#405862] mb-1">{title}</h4>
                  <p className="text-sm text-[#405862]/75">{text}</p>
                </div>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-[#405862]/15 p-4">
                <p className="text-sm font-semibold text-[#405862] mb-1">Partner with us</p>
                <p className="text-sm text-[#405862]/75 mb-2">Email our Director of Events, Lalit Sai.</p>
                <a href="mailto:lalits@drinterested.org" className="inline-flex items-center gap-2 text-sm font-semibold text-[#405862] underline">
                  <Mail className="h-4 w-4" />
                  lalits@drinterested.org
                </a>
              </div>
              <div className="rounded-xl border border-[#405862]/15 p-4">
                <p className="text-sm font-semibold text-[#405862] mb-1">Sponsor us</p>
                <p className="text-sm text-[#405862]/75 mb-2">Our finance team will share current packages and details.</p>
                <a href="mailto:finance@drinterested.org" className="inline-flex items-center gap-2 text-sm font-semibold text-[#405862] underline">
                  <Mail className="h-4 w-4" />
                  finance@drinterested.org
                </a>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Supporters */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-[#405862] mb-3">Our Partners & Supporters</h2>
            <p className="text-[#405862]/70">Thank you to the organizations behind our 2026 programs.</p>
          </div>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SUPPORTERS.map((s) => (
              <li key={s.name} className="rounded-xl border border-[#405862]/10 p-4 flex flex-col items-center text-center gap-2">
                <div className="relative h-14 w-full">
                  {s.logo ? (
                    <Image src={s.logo} alt={`${s.name} logo`} fill sizes="200px" className="object-contain" />
                  ) : (
                    <div className="h-full flex items-center justify-center text-[#405862]/40">
                      <Heart className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <p className="font-semibold text-sm text-[#405862]">{s.name}</p>
                <p className="text-xs text-[#405862]/60">{s.role}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Legal status */}
      <section id="legal-status" className="py-12 md:py-16 bg-[#f5f1eb]/50 scroll-mt-20">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="bg-white rounded-2xl border-2 border-[#405862]/30 p-6 md:p-10 shadow-sm">
            <div className="flex gap-4">
              <Info className="h-6 w-6 text-[#405862] flex-shrink-0 mt-1" />
              <div className="space-y-5 text-sm text-[#405862]/85 leading-relaxed">
                <div>
                  <h2 className="text-xl font-bold text-[#405862] mb-2">Legal Status, Transparency & Compliance</h2>
                  <p>{LEGAL_STATUS.short}</p>
                  <p className="mt-2">
                    <a href={LEGAL_STATUS.unProfile} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                      View our UN civil society profile
                    </a>
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="rounded-xl bg-[#f5f1eb] p-4">
                    <h3 className="font-semibold text-[#405862] mb-1">United States</h3>
                    <p>
                      Through Future Interested, our US fiscally sponsored arm, supporters in the United States can
                      receive tax deductible donation receipts. {LEGAL_STATUS.fiscalSponsor}
                    </p>
                  </div>
                  <div className="rounded-xl bg-[#f5f1eb] p-4">
                    <h3 className="font-semibold text-[#405862] mb-1">Canada</h3>
                    <p>{LEGAL_STATUS.canada}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-[#405862] mb-1">Funding and conflicts</h3>
                  <p>
                    We have received funding from for profit entities. We keep full independence and declare no
                    conflicts of interest. Some team members are affiliated with institutions or funders, and we work to
                    avoid conflicts and stay transparent. All funds are used for our educational mission and programs. Our
                    full finances are in the{" "}
                    <Link href="/impact-report" className="underline underline-offset-2">
                      {IMPACT_REPORT_2026.shortTitle}
                    </Link>
                    .
                  </p>
                </div>
                <p className="text-xs text-[#405862]/60">
                  By donating, you agree to our{" "}
                  <Link href="/privacy-policy" className="underline">
                    Privacy Policy
                  </Link>{" "}
                  and{" "}
                  <Link href="/terms" className="underline">
                    Terms & Conditions
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
          <p className="mt-10 text-center text-lg text-[#405862] font-medium text-pretty">
            Thank you for helping youth explore wellness careers and change policy.
          </p>
        </div>
      </section>
    </div>
  )
}
