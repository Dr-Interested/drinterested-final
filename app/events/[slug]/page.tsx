import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight, CalendarDays, ExternalLink, MapPin, Users } from "lucide-react"
import SeoSchema from "@/components/seo-schema"
import { BgVideo } from "@/components/site/bg-video"
import { Reveal } from "@/components/site/reveal"
import { RECAPS, recapBySlug } from "@/data/recaps"
import { generateBreadcrumbSchema, generateSeoMetadata } from "@/lib/seo-utils"

export const dynamicParams = false

export function generateStaticParams() {
  return RECAPS.map((r) => ({ slug: r.slug }))
}

const BASE = "https://www.drinterested.org"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const r = recapBySlug(slug)
  if (!r) return {}
  const description = r.summary.length > 158 ? `${r.summary.slice(0, 155).replace(/\s+\S*$/, "")}...` : r.summary
  return generateSeoMetadata({
    title: `${r.short} Recap`,
    description,
    url: `${BASE}/events/${r.slug}`,
    image: r.cover.src,
    keywords: ["Dr. Interested", r.short, `${r.short} recap`, ...r.pillars, r.location],
  })
}

export default async function RecapPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const r = recapBySlug(slug)
  if (!r) notFound()
  const others = RECAPS.filter((x) => x.slug !== r.slug).slice(0, 4)
  const online = /online/i.test(r.location)

  return (
    <article>
      <SeoSchema
        id="recap-schema"
        schema={{
          "@context": "https://schema.org",
          "@type": "Event",
          name: r.title,
          description: r.summary,
          startDate: r.isoDate,
          eventStatus: "https://schema.org/EventScheduled",
          eventAttendanceMode: online
            ? "https://schema.org/OnlineEventAttendanceMode"
            : "https://schema.org/OfflineEventAttendanceMode",
          location: online
            ? { "@type": "VirtualLocation", url: `${BASE}/events/${r.slug}` }
            : { "@type": "Place", name: r.location, address: r.location },
          image: [`${BASE}${r.cover.src}`],
          organizer: { "@type": "Organization", name: "Dr. Interested", url: BASE },
        }}
      />
      <SeoSchema
        id="recap-breadcrumb"
        schema={generateBreadcrumbSchema([
          { name: "Home", url: BASE },
          { name: "Events", url: `${BASE}/events` },
          { name: r.short, url: `${BASE}/events/${r.slug}` },
        ])}
      />

      {/* Header: text beside the best photo, on the brand cream. */}
      <header className="bg-gradient-to-b from-cream to-white">
        <div className="container grid items-center gap-8 py-8 md:grid-cols-[1.1fr_1fr] md:py-12">
          <div>
            <Link href="/events" className="mb-4 inline-flex items-center gap-1 text-sm text-ink/60 hover:text-ink">
              <ArrowLeft className="h-4 w-4" />
              All events
            </Link>
            <div className="mb-3 flex flex-wrap gap-1.5">
              <span className="rounded-full bg-ink px-2.5 py-0.5 text-[11px] font-semibold text-white">Recap</span>
              {r.pillars.map((p) => (
                <span key={p} className="rounded-full bg-teal/15 px-2.5 py-0.5 text-[11px] font-semibold text-teal-deep">
                  {p}
                </span>
              ))}
            </div>
            <h1 className="text-3xl font-semibold leading-tight text-ink md:text-[2.6rem]">{r.title}</h1>
            <p className="mt-3 text-base leading-relaxed text-ink/75 md:text-lg">{r.summary}</p>
            <ul className="mt-5 space-y-1.5 text-sm text-ink/75">
              <li className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-teal-deep" />
                {r.date}
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-teal-deep" />
                {r.location}
              </li>
              {r.partner && (
                <li className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-teal-deep" />
                  {r.partner}
                </li>
              )}
            </ul>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-xl ring-1 ring-black/5">
            <Image src={r.cover.src} alt={r.cover.alt} fill priority sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
          </div>
        </div>
      </header>

      {/* Numbers from the impact report. */}
      <section className="container">
        <dl className="grid grid-cols-2 gap-3 rounded-2xl bg-ink p-5 text-white sm:grid-cols-4 md:p-6">
          {r.stats.map(([n, l]) => (
            <div key={l}>
              <dt className="sr-only">{l}</dt>
              <dd className="font-display text-2xl font-semibold md:text-3xl">{n}</dd>
              <dd className="text-xs text-white/70">{l}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Story, with the clip alongside when we have one. */}
      <section className="py-10 md:py-14">
        <div className={`container grid gap-8 ${r.video ? "md:grid-cols-[1.4fr_1fr]" : "max-w-3xl"}`}>
          <Reveal className="space-y-4 text-[15px] leading-relaxed text-ink/85 md:text-base">
            <h2 className="text-2xl font-semibold text-ink">What happened</h2>
            {r.body.map((para) => (
              <p key={para.slice(0, 24)}>{para}</p>
            ))}
            {r.sessions && (
              <div className="pt-2">
                <h3 className="mb-2 text-base font-semibold text-ink">Sessions</h3>
                <ul className="grid gap-1.5 sm:grid-cols-2">
                  {r.sessions.map((s) => (
                    <li key={s} className="rounded-lg bg-cream px-3 py-2 text-sm">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {r.links && (
              <div className="flex flex-wrap gap-3 pt-2">
                {r.links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-deep hover:text-ink"
                  >
                    {l.label}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ))}
              </div>
            )}
          </Reveal>
          {r.video && (
            <Reveal delay={0.06}>
              <figure
                className={`relative overflow-hidden rounded-2xl shadow-lg ${r.video.portrait ? "mx-auto aspect-[9/16] max-h-[520px] md:mx-0" : "aspect-video"}`}
              >
                <BgVideo src={r.video.src} poster={r.video.poster} label={r.video.label} />
                <figcaption className="absolute bottom-2 left-2 right-2 rounded-lg bg-white/90 px-2.5 py-1 text-xs text-ink">
                  {r.video.label}
                </figcaption>
              </figure>
            </Reveal>
          )}
        </div>
      </section>

      {/* Gallery */}
      {r.gallery.length > 1 && (
        <section className="bg-cream/60 py-10 md:py-14">
          <div className="container">
            <h2 className="mb-5 text-2xl font-semibold text-ink">Photos</h2>
            <div className="columns-2 gap-3 md:columns-3 [&>*]:mb-3">
              {r.gallery.map((ph, i) => (
                <Reveal key={ph.src} delay={(i % 3) * 0.05} as="figure" className="break-inside-avoid overflow-hidden rounded-xl bg-white">
                  <Image src={ph.src} alt={ph.alt} width={900} height={675} sizes="(max-width: 768px) 50vw, 33vw" className="h-auto w-full" />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {r.quote && (
        <section className="py-10 md:py-14">
          <Reveal as="figure" className="container max-w-3xl text-center">
            <blockquote className="font-display text-xl font-medium leading-snug text-ink md:text-2xl">
              &ldquo;{r.quote.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-3 text-sm text-ink/60">{r.quote.who}</figcaption>
          </Reveal>
        </section>
      )}

      {/* More recaps */}
      <section className="border-t border-ink/10 py-10">
        <div className="container">
          <div className="mb-5 flex items-end justify-between gap-4">
            <h2 className="text-xl font-semibold text-ink">More recaps</h2>
            <Link href="/events" className="inline-flex items-center gap-1 text-sm font-semibold text-teal-deep hover:text-ink">
              All events
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {others.map((o) => (
              <Link key={o.slug} href={`/events/${o.slug}`} className="group overflow-hidden rounded-xl bg-cream/60 ring-1 ring-ink/5">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image src={o.cover.src} alt={o.cover.alt} fill sizes="25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-3">
                  <p className="text-[11px] text-ink/60">{o.date}</p>
                  <p className="text-sm font-semibold leading-snug text-ink">{o.short}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </article>
  )
}
