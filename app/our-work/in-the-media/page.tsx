import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Award, Mail, Newspaper, Radio, Mic, Megaphone, Landmark, CalendarDays } from "lucide-react"
import SeoSchema from "@/components/seo-schema"
import { generateBreadcrumbSchema, generateSeoMetadata } from "@/lib/seo-utils"
import { AFFILIATIONS, MEDIA_FEATURES, RECOGNITION, type MediaFeature } from "@/data/media-features"
import { IMPACT_REPORT_2026 } from "@/lib/impact-stats"

const PAGE_URL = "https://www.drinterested.org/our-work/in-the-media"
const DESCRIPTION =
  "Dr. Interested in the media: CBC Radio, OMNI News, Insauga, Global Indian, podcasts, awards, and recognition from elected officials across Ontario."

export const metadata: Metadata = generateSeoMetadata({
  title: "In the Media",
  description: DESCRIPTION,
  url: PAGE_URL,
  image: "/impact-report-2026-media-features.jpg",
  keywords: [
    "Dr. Interested in the media",
    "Dr. Interested CBC Radio",
    "Dr. Interested Insauga",
    "Adil Mukhi interview",
    "Dr. Interested press",
    "Dr. Interested awards",
  ],
})

const GROUPS: { kind: MediaFeature["kind"][]; title: string; icon: typeof Newspaper }[] = [
  { kind: ["Radio", "News"], title: "News and Radio", icon: Radio },
  { kind: ["Article"], title: "Articles and Interviews", icon: Newspaper },
  { kind: ["Podcast"], title: "Podcasts", icon: Mic },
  { kind: ["Feature"], title: "Features and Spotlights", icon: Megaphone },
  { kind: ["Government"], title: "Recognition From Elected Officials", icon: Landmark },
  { kind: ["Event"], title: "Community Events and Panels", icon: CalendarDays },
]

function FeatureCard({ f }: { f: MediaFeature }) {
  const inner = (
    <>
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#2d8659]">{f.outlet}</p>
        {f.url && <ArrowUpRight className="h-4 w-4 text-[#405862]/40 group-hover:text-[#405862] shrink-0" />}
      </div>
      <p className="text-sm font-medium text-[#405862] leading-snug mt-1">{f.title}</p>
      {f.date && <p className="text-xs text-[#405862]/60 mt-1">{f.date}</p>}
    </>
  )
  const cls = "group block rounded-xl border border-[#405862]/10 bg-white p-4 h-full"
  return f.url ? (
    <a href={f.url} target="_blank" rel="noopener noreferrer" className={`${cls} hover:shadow-md hover:border-[#4ecdc4]/40 transition`}>
      {inner}
    </a>
  ) : (
    <div className={cls}>{inner}</div>
  )
}

export default function InTheMediaPage() {
  return (
    <>
      <SeoSchema
        id="in-the-media-breadcrumb"
        schema={generateBreadcrumbSchema([
          { name: "Home", url: "https://www.drinterested.org" },
          { name: "Our Work", url: "https://www.drinterested.org/our-work" },
          { name: "In the Media", url: PAGE_URL },
        ])}
      />
      <SeoSchema
        id="in-the-media-schema"
        schema={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Dr. Interested in the Media",
          url: PAGE_URL,
          description: DESCRIPTION,
          hasPart: MEDIA_FEATURES.filter((f) => f.url).map((f) => ({
            "@type": f.kind === "Podcast" ? "PodcastEpisode" : "CreativeWork",
            name: f.title,
            url: f.url,
            publisher: { "@type": "Organization", name: f.outlet },
            about: { "@type": "Organization", name: "Dr. Interested" },
          })),
        }}
      />

      <section className="bg-[#f5f1eb] py-10 md:py-16">
        <div className="container max-w-5xl text-center">
          <Link href="/our-work" className="text-sm text-[#405862]/70 hover:text-[#405862]">
            Our Work
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold text-[#405862] mt-2 mb-4">In the Media</h1>
          <p className="text-lg text-[#405862]/80 max-w-2xl mx-auto">
            Coverage, interviews, podcasts, and recognition for Dr. Interested and our youth, as listed in our{" "}
            <Link href="/impact-report" className="underline underline-offset-2">
              {IMPACT_REPORT_2026.shortTitle}
            </Link>
            .
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact#media-inquiries"
              className="inline-flex items-center gap-2 bg-[#405862] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[#334852]"
            >
              <Mail className="h-4 w-4" />
              Media inquiries
            </Link>
            <Link
              href="/contact#profiles-hub"
              className="inline-flex items-center gap-2 bg-white text-[#405862] border border-[#405862]/20 px-5 py-2.5 rounded-lg font-semibold"
            >
              Profiles Hub
            </Link>
          </div>
        </div>
      </section>

      {/* Recognition */}
      <section className="py-12 bg-white">
        <div className="container max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-[#405862] mb-6 flex items-center gap-2">
            <Award className="h-6 w-6 text-[#4ecdc4]" />
            Awards and Recognition
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {RECOGNITION.map((r) => (
              <div key={r.title} className="rounded-xl bg-[#4ecdc4]/10 border border-[#4ecdc4]/20 p-5">
                {r.date && <p className="text-xs font-semibold text-[#2d8659]">{r.date}</p>}
                <h3 className="font-bold text-[#405862] mt-1 mb-1">{r.title}</h3>
                <p className="text-sm text-[#405862]/80">{r.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage */}
      <section className="py-12 bg-[#f5f1eb]/50">
        <div className="container max-w-5xl space-y-10">
          {GROUPS.map((g) => {
            const items = MEDIA_FEATURES.filter((f) => g.kind.includes(f.kind))
            if (!items.length) return null
            const Icon = g.icon
            return (
              <div key={g.title}>
                <h2 className="text-xl md:text-2xl font-bold text-[#405862] mb-4 flex items-center gap-2">
                  <Icon className="h-5 w-5 text-[#4ecdc4]" />
                  {g.title}
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((f) => (
                    <FeatureCard key={`${f.outlet}-${f.title}`} f={f} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Affiliations + report page */}
      <section className="py-12 bg-white">
        <div className="container max-w-5xl grid md:grid-cols-2 gap-8 items-start">
          <div>
            <h2 className="text-2xl font-bold text-[#405862] mb-4">Memberships and listings</h2>
            <ul className="space-y-2 text-sm text-[#405862]/85">
              {AFFILIATIONS.map((a) => (
                <li key={a} className="flex gap-2">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-[#4ecdc4] shrink-0" />
                  {a}
                </li>
              ))}
            </ul>
            <p className="text-sm text-[#405862]/70 mt-4">
              Every profile and directory listing is in our{" "}
              <Link href="/contact#profiles-hub" className="underline underline-offset-2 text-[#405862]">
                Profiles Hub
              </Link>
              .
            </p>
          </div>
          <figure>
            <a href={IMPACT_REPORT_2026.path} target="_blank" rel="noopener" className="block rounded-xl overflow-hidden shadow-lg ring-1 ring-black/5">
              <Image
                src="/impact-report-2026-media-features.jpg"
                alt="The Media Features page of the Dr. Interested 2026 Annual Impact Report"
                width={1100}
                height={1424}
                sizes="(max-width: 768px) 100vw, 480px"
              />
            </a>
            <figcaption className="text-xs text-[#405862]/60 mt-2 text-center">
              The Media Features page of our 2026 report. Every image links to the original in the PDF.
            </figcaption>
          </figure>
        </div>
      </section>
    </>
  )
}
