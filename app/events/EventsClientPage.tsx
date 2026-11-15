"use client"

import Image from "@/components/site/img"
import Link from "next/link"
import { AlertCircle, ArrowRight, CalendarDays, Clock, ExternalLink, MapPin } from "lucide-react"
import { PhotoStrip } from "@/components/site/photo-strip"
import { Reveal } from "@/components/site/reveal"
import { SectionHeading } from "@/components/site/section-heading"
import { RECAPS } from "@/data/recaps"
import { YEAR_2026 } from "@/lib/impact-stats"
import { HIGHLIGHT_REEL } from "@/lib/media"

function RegisterButton({ event }: { event: any }) {
  const base = "inline-flex w-full items-center justify-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold"
  if (event.status === "open" && event.link)
    return (
      <Link href={event.link} target="_blank" rel="noopener noreferrer" className={`${base} bg-ink text-white hover:bg-ink-deep`}>
        {event.ongoing ? "Book a time on Discord" : "Register"}
        <ExternalLink className="h-3.5 w-3.5" />
      </Link>
    )
  const label = event.status === "full" ? "Registration full" : event.status === "closed" ? "Registration closed" : "Details coming soon"
  return (
    <span className={`${base} bg-ink/10 text-ink/85`}>
      <AlertCircle className="h-3.5 w-3.5" />
      {label}
    </span>
  )
}

export default function EventsClientPage({ upcomingEvents, pastEvents }: { upcomingEvents: any[]; pastEvents: any[] }) {
  // Recaps that already appear as a database past event are linked from that card instead.
  const linked = new Set(pastEvents.map((e) => e.recapHref).filter(Boolean))
  const recaps = [...RECAPS].sort((a, b) => b.isoDate.localeCompare(a.isoDate))

  return (
    <div>
      <section className="overflow-hidden bg-gradient-to-b from-cream to-white pt-8 md:pt-12">
        <div className="container">
          <h1 className="text-3xl font-semibold text-ink md:text-5xl">Events</h1>
          <p className="mt-3 max-w-2xl text-base text-ink/85 md:text-lg">
            Low barrier events across our three pillars: healthcare career education, access to policy spaces, and community
            spaces. We ran {YEAR_2026.events} of them in 2026 alone.
          </p>
        </div>
        <div className="mt-6">
          <PhotoStrip photos={HIGHLIGHT_REEL} height="h-32 sm:h-40" duration={90} />
        </div>
      </section>

      {/* Upcoming */}
      <section className="py-10 md:py-12">
        <div className="container">
          <SectionHeading eyebrow="Upcoming" title="What's next" />
          {upcomingEvents.length === 0 ? (
            <p className="rounded-2xl bg-cream/70 p-5 text-sm text-ink/85">
              Nothing announced right now. New events land in our newsletter and Discord first.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.map((event, i) => (
                <Reveal key={event.id ?? i} delay={(i % 3) * 0.05} as="article" className="flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-ink/10">
                  <div className="relative aspect-[16/9] bg-cream">
                    <Image src={event.image || "/brand/icon.png"} alt={event.title} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="font-semibold leading-snug text-ink">
                      {event.title}
                      {event.ongoing && (
                        <span className="ml-2 inline-flex translate-y-[-1px] items-center gap-1 rounded-full bg-teal-deep/10 px-2 py-0.5 align-middle text-[11px] font-medium text-teal-deep">
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-deep" aria-hidden="true" />
                          Active
                        </span>
                      )}
                    </h3>
                    <ul className="mt-2 space-y-1 text-xs text-ink/85">
                      <li className="flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5 text-teal-deep" />
                        {event.date}
                      </li>
                      {event.time && (
                        <li className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-teal-deep" />
                          {event.time}
                        </li>
                      )}
                      <li className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-teal-deep" />
                        {event.location}
                      </li>
                    </ul>
                    <p className="mt-2 line-clamp-3 flex-1 text-xs text-ink/85">{event.description}</p>
                    <div className="mt-4">
                      <RegisterButton event={event} />
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Recaps */}
      <section className="bg-cream/60 py-10 md:py-12">
        <div className="container">
          <SectionHeading eyebrow="Recaps" title="See how they went">
            Photos, clips, and the numbers behind our biggest events.
          </SectionHeading>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Link href="/medx-2026" className="group relative col-span-2 row-span-2 overflow-hidden rounded-2xl">
              <Image src="/media/medexplore/room-3.webp" alt="MedExplore 2026" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 p-4 text-white md:p-6">
                <p className="text-xs text-white/80">August 16, 2026</p>
                <p className="font-display text-xl font-semibold md:text-2xl">The 2026 MedExplore Conference</p>
                <p className="mt-1 hidden max-w-md text-sm text-white/80 sm:block">100+ youth, 23 speakers, letters from the Premier of Ontario.</p>
              </div>
            </Link>
            {recaps.map((r, i) => (
              <Reveal key={r.slug} delay={(i % 4) * 0.04}>
                <Link href={`/events/${r.slug}`} className="group block overflow-hidden rounded-2xl bg-white ring-1 ring-ink/5">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image src={r.cover.src} alt={r.cover.alt} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-3">
                    <p className="text-[11px] text-ink/85">{r.date}</p>
                    <p className="text-sm font-semibold leading-snug text-ink">{r.short}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Everything else we've run */}
      {pastEvents.length > 0 && (
        <section className="py-10 md:py-12">
          <div className="container">
            <SectionHeading eyebrow="Archive" title="Past events and initiatives" />
            <ul className="divide-y divide-ink/10 rounded-2xl ring-1 ring-ink/10">
              {pastEvents.map((event, i) => {
                const href = event.recapHref || event.link
                const internal = href?.startsWith("/")
                return (
                  <li key={event.id ?? i} className="flex items-center gap-4 p-3 md:p-4">
                    <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-cream md:h-16 md:w-24">
                      <Image src={event.image || "/brand/icon.png"} alt="" fill sizes="96px" className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink md:text-base">{event.title}</p>
                      <p className="text-xs text-ink/85">{event.date}</p>
                    </div>
                    {href && (
                      <Link
                        href={href}
                        target={internal ? undefined : "_blank"}
                        rel={internal ? undefined : "noopener noreferrer"}
                        className="inline-flex shrink-0 items-center gap-1 rounded-full border border-ink/20 px-3 py-1.5 text-xs font-semibold text-ink hover:bg-cream"
                      >
                        {linked.has(href) || internal ? "Recap" : "Details"}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        </section>
      )}

      <section className="py-8">
        <div className="container">
          <div className="flex flex-col items-start justify-between gap-4 rounded-2xl bg-ink p-6 text-white md:flex-row md:items-center">
            <div>
              <h2 className="text-xl font-semibold md:text-2xl">Hear about the next one first</h2>
              <p className="mt-1 text-sm text-white/80">New events land on Discord and in our newsletter before anywhere else.</p>
            </div>
            <a
              href="https://discord.gg/pzbGRgsGXY"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-teal px-5 py-2.5 text-sm font-semibold text-ink-deep hover:bg-white"
            >
              Join our Discord
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <p className="media-consent-note px-4 py-4 text-center text-xs text-ink/85">
        Attendees under 18 need a parent or guardian&apos;s consent for photos and video at our events. See our{" "}
        <Link href="/media-consent" className="underline hover:text-ink">
          Media Consent and Release
        </Link>
        .
      </p>
    </div>
  )
}
