import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Download, FileText, ExternalLink } from "lucide-react"
import SeoSchema from "@/components/seo-schema"
import { generateBreadcrumbSchema, generateSeoMetadata } from "@/lib/seo-utils"
import {
  ALL_TIME,
  IMPACT_REPORT_2025,
  IMPACT_REPORT_2026,
  LEGAL_STATUS,
  PILLARS,
  YEAR_2026,
} from "@/lib/impact-stats"

const PAGE_URL = "https://www.drinterested.org/impact-report"
const DESCRIPTION = `Read the Dr. Interested 2026 Annual Impact Report: ${YEAR_2026.youthImpacted} youth impacted this year and ${ALL_TIME.youthImpacted} across 2025 and 2026.`

export const metadata: Metadata = generateSeoMetadata({
  title: "2026 Annual Impact Report",
  description: DESCRIPTION,
  url: PAGE_URL,
  image: IMPACT_REPORT_2026.cover,
  keywords: [
    "Dr. Interested impact report",
    "Dr. Interested 2026 annual impact report",
    "impact report 2026",
    "youth wellness organization impact",
    "youth led nonprofit impact report",
    "Future Interested",
  ],
})

// Each figure with its 2025 / 2026 split, exactly as the report's "All Time Impact" page shows it.
const ALL_TIME_ROWS: { label: string; total: string; split: string }[] = [
  { label: "Youth impacted", total: ALL_TIME.youthImpacted, split: "2025: 160,000+ | 2026: 229,000+" },
  { label: "Unique executives", total: ALL_TIME.executives, split: "2025: 367 | 2026: 328 | both years: 281" },
  { label: "Members", total: ALL_TIME.members, split: "2025: 1,400 | 2026: 2,200" },
  { label: "Countries and territories", total: ALL_TIME.countries, split: "2025: 106 | 2026: 129" },
  { label: "Volunteers", total: ALL_TIME.volunteers, split: "2025: 900 | 2026: 600" },
  { label: "Volunteer hours", total: ALL_TIME.volunteerHours, split: "2025: 652 | 2026: 6,800" },
  { label: "Events", total: ALL_TIME.events, split: "2025: 20+ | 2026: 25" },
  { label: "Mentor hours", total: ALL_TIME.mentorHours, split: "2025: 400+ | 2026: 1,000" },
  { label: "Followers", total: "29,469", split: "2025: 12,169 | 2026: 17,300" },
  { label: "Posts", total: "1,551", split: "2025: 752 | 2026: 799" },
  { label: "Impressions", total: ALL_TIME.impressionsExact, split: "2025: 3,713,406 | 2026: 7,340,361" },
  { label: "Revenue", total: "$60,182.70 CAD", split: "2025: $5,152.69 | 2026: $55,030.01" },
]

const CONTENTS = [
  "About Us",
  "Statements and Legal Structure",
  "Our Team",
  "Team Overview",
  "Member Overview",
  "Key Initiatives",
  "Outside Features",
  "How You Can Support Us",
  "Total Reach",
  "Year Finances",
  "All Time Impact",
]

export default function ImpactReportPage() {
  return (
    <>
      <SeoSchema
        id="impact-report-page-schema"
        schema={{
          "@context": "https://schema.org",
          "@type": "Report",
          name: IMPACT_REPORT_2026.title,
          headline: IMPACT_REPORT_2026.title,
          url: PAGE_URL,
          contentUrl: IMPACT_REPORT_2026.url,
          encodingFormat: "application/pdf",
          thumbnailUrl: `https://www.drinterested.org${IMPACT_REPORT_2026.cover}`,
          image: `https://www.drinterested.org${IMPACT_REPORT_2026.cover}`,
          datePublished: IMPACT_REPORT_2026.published,
          numberOfPages: IMPACT_REPORT_2026.pages,
          inLanguage: "en",
          description: DESCRIPTION,
          author: { "@type": "Organization", name: "Dr. Interested", url: "https://www.drinterested.org" },
          publisher: { "@type": "Organization", name: "Dr. Interested", url: "https://www.drinterested.org" },
        }}
      />
      <SeoSchema
        id="impact-report-breadcrumb"
        schema={generateBreadcrumbSchema([
          { name: "Home", url: "https://www.drinterested.org" },
          { name: "2026 Annual Impact Report", url: PAGE_URL },
        ])}
      />

      {/* Hero */}
      <section className="bg-[#f5f1eb] py-10 md:py-16">
        <div className="container max-w-5xl grid md:grid-cols-[1fr_280px] gap-8 items-center">
          <div>
            <p className="inline-block bg-[#4ecdc4]/20 text-[#2d6b66] px-3 py-1 rounded-full text-sm font-medium mb-3">
              Advance copy, figures as of {IMPACT_REPORT_2026.asOf}
            </p>
            <h1 className="text-3xl md:text-5xl font-bold text-[#405862] mb-4">Dr. Interested 2026 Annual Impact Report</h1>
            <p className="text-lg text-[#405862]/80 mb-6 leading-relaxed">
              A year of youth led change and impact. This year, {YEAR_2026.executives} executives and{" "}
              {YEAR_2026.volunteers} volunteers gave {YEAR_2026.volunteerHours} hours, and {YEAR_2026.members} members
              across {YEAR_2026.memberCountries} countries and territories helped us reach{" "}
              <strong>{YEAR_2026.youthImpactedExact} young people</strong>.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={IMPACT_REPORT_2026.path}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 bg-[#405862] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#334852]"
              >
                <FileText className="w-4 h-4" />
                Read the full report (PDF)
              </a>
              <a
                href={IMPACT_REPORT_2026.path}
                download
                className="inline-flex items-center gap-2 bg-white text-[#405862] border border-[#405862]/20 px-6 py-3 rounded-lg font-semibold hover:bg-white/70"
              >
                <Download className="w-4 h-4" />
                Download ({IMPACT_REPORT_2026.pages} pages, 9 MB)
              </a>
            </div>
          </div>
          <a
            href={IMPACT_REPORT_2026.path}
            target="_blank"
            rel="noopener"
            className="block rounded-xl overflow-hidden shadow-2xl ring-1 ring-black/5 hover:scale-[1.02] transition-transform mx-auto w-full max-w-[280px]"
          >
            <Image
              src={IMPACT_REPORT_2026.cover}
              alt="Cover of the Dr. Interested 2026 Annual Impact Report"
              width={900}
              height={1165}
              sizes="280px"
              priority
            />
          </a>
        </div>
      </section>

      {/* 2026 highlights */}
      <section className="py-12 bg-white">
        <div className="container max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-[#405862] mb-6">2026 at a glance</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              [YEAR_2026.youthImpacted, "youth impacted"],
              [YEAR_2026.members, "members in " + YEAR_2026.memberCountries + " countries and territories"],
              [YEAR_2026.executives, "executives living in " + YEAR_2026.teamCountries + " countries"],
              [YEAR_2026.volunteerHours, "volunteer hours from " + YEAR_2026.volunteers + " volunteers"],
              [YEAR_2026.events, "events"],
              [YEAR_2026.mentorHours, "mentorship hours"],
              [YEAR_2026.followers, "followers across platforms"],
              ["7,340,361", "impressions"],
            ].map(([n, l]) => (
              <div key={l} className="rounded-xl bg-[#4ecdc4]/10 border border-[#4ecdc4]/20 p-4 text-center">
                <div className="text-2xl md:text-3xl font-bold text-[#405862]">{n}</div>
                <div className="text-xs text-[#405862]/70 mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All time */}
      <section className="py-12 bg-[#f5f1eb]/50">
        <div className="container max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-[#405862] mb-2">All time impact: 2025 and 2026</h2>
          <p className="text-[#405862]/70 mb-6 text-sm">The last page of the report, combining both annual reports.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ALL_TIME_ROWS.map((r) => (
              <div key={r.label} className="bg-white rounded-xl p-4 border border-[#405862]/10">
                <div className="text-2xl font-bold text-[#405862]">{r.total}</div>
                <div className="text-sm font-medium text-[#405862]/80">{r.label}</div>
                <div className="text-xs text-[#405862]/60 mt-1">{r.split}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-12 bg-white">
        <div className="container max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-[#405862] mb-6">Our three pillars</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {PILLARS.map((p) => (
              <div key={p.id} className="rounded-xl border border-[#405862]/10 p-5">
                <div className="text-xs font-semibold text-[#2d8659] mb-1">Pillar {p.number}</div>
                <h3 className="font-bold text-[#405862] mb-2">{p.name}</h3>
                <p className="text-sm text-[#405862]/80 leading-relaxed">{p.description}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-[#405862]/70">
            See how each program fits on{" "}
            <Link href="/our-work" className="underline underline-offset-2 text-[#405862]">
              Our Work
            </Link>{" "}
            and our coverage on{" "}
            <Link href="/our-work/in-the-media" className="underline underline-offset-2 text-[#405862]">
              In the Media
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Contents + legal */}
      <section className="py-12 bg-[#f5f1eb]/50">
        <div className="container max-w-5xl grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold text-[#405862] mb-4">What&apos;s inside</h2>
            <ol className="space-y-1.5 text-sm text-[#405862]/80 list-decimal list-inside">
              {CONTENTS.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ol>
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#405862] mb-4">Legal status</h2>
            <p className="text-sm text-[#405862]/80 leading-relaxed mb-3">{LEGAL_STATUS.short}</p>
            <p className="text-sm text-[#405862]/80 leading-relaxed mb-3">
              2026 revenue to date was {YEAR_2026.revenue}, with a net surplus of $1,546.34 CAD. $45,000 of that was
              travel, micro, and technology grants allocated through Dr. Interested.
            </p>
            <Link href="/sponsorships#legal-status" className="text-sm font-semibold text-[#405862] underline underline-offset-2">
              Donations, tax receipts, and sponsorship
            </Link>
          </div>
        </div>
      </section>

      {/* Previous report */}
      <section className="py-10 bg-white">
        <div className="container max-w-5xl text-center">
          <p className="text-sm text-[#405862]/70">
            Looking for last year?{" "}
            <a
              href={IMPACT_REPORT_2025.web}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 underline underline-offset-2 text-[#405862]"
            >
              {IMPACT_REPORT_2025.title}
              <ExternalLink className="w-3 h-3" />
            </a>
          </p>
        </div>
      </section>
    </>
  )
}
