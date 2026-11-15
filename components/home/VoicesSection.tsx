import Image from "@/components/site/img"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { BgVideo } from "@/components/site/bg-video"
import { PhotoStrip } from "@/components/site/photo-strip"
import { QuoteCarousel } from "@/components/site/quote-carousel"
import { Reveal } from "@/components/site/reveal"
import { SectionHeading } from "@/components/site/section-heading"
import { ALL_TIME, YEAR_2026 } from "@/lib/impact-stats"
import { HIGHLIGHT_REEL, PHOTOS, QUOTES, VIDEOS } from "@/lib/media"

export default function VoicesSection() {
  const half = Math.ceil(HIGHLIGHT_REEL.length / 2)
  return (
    <>
      {/* A year in photos: two rows drifting in opposite directions. */}
      <section className="overflow-hidden bg-white py-10 md:py-14">
        <div className="container">
          <SectionHeading eyebrow="2025 to 2026" title="A year of showing up">
            {YEAR_2026.events} events in 2026 alone, from conference halls in Mississauga and Toronto to a BBQ in Ward 3.
          </SectionHeading>
        </div>
        <div className="space-y-3">
          <PhotoStrip photos={HIGHLIGHT_REEL.slice(0, half)} duration={80} />
          <PhotoStrip photos={HIGHLIGHT_REEL.slice(half)} duration={90} reverse />
        </div>
      </section>

      {/* What members say, next to a vertical clip and a photo. */}
      <section className="bg-cream/60 py-12 md:py-16">
        <div className="container grid items-center gap-8 md:grid-cols-[1.25fr_1fr] md:gap-12">
          <Reveal>
            <SectionHeading eyebrow="In their words" title="Real opinions from real youth" className="mb-4">
              From our 2026 member and team surveys: {ALL_TIME.members} members, {YEAR_2026.executives} executives.
            </SectionHeading>
            <QuoteCarousel quotes={QUOTES} />
          </Reveal>
          <Reveal delay={0.08} className="grid grid-cols-2 gap-3">
            <div className="relative row-span-2 aspect-[9/16] overflow-hidden rounded-2xl shadow-md">
              <BgVideo {...VIDEOS.codeblue} label="Students talking at tables during Code Blue Planet" />
              <span className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-medium text-ink">
                Code Blue Planet
              </span>
            </div>
            <div className="relative aspect-square overflow-hidden rounded-2xl">
              <Image src={PHOTOS.psych[1].src} alt={PHOTOS.psych[1].alt} fill sizes="200px" className="object-cover" />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-2xl">
              <Image src={PHOTOS.explore3[2].src} alt={PHOTOS.explore3[2].alt} fill sizes="200px" className="object-cover" />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}

/** The impact report call to action, with the real cover. */
export function ReportBand() {
  return (
    <section className="py-10 md:py-14">
      <div className="container">
        <Reveal className="grid items-center gap-6 overflow-hidden rounded-3xl bg-ink p-6 text-white md:grid-cols-[auto_1fr_auto] md:gap-10 md:p-10">
          <div className="relative mx-auto w-32 rotate-[-4deg] overflow-hidden rounded-lg shadow-2xl ring-4 ring-white/10 md:w-40">
            <Image src="/impact-report-2026-cover.jpg" alt="Cover of the 2026 Annual Impact Report" width={300} height={388} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal">Just released</p>
            <h2 className="mt-1 text-2xl font-semibold leading-tight md:text-3xl">The 2026 Annual Impact Report</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/80">
              {YEAR_2026.youthImpactedExact} young people reached this year, {ALL_TIME.youthImpacted} since 2025. Every
              number, every program, and where every dollar went.
            </p>
          </div>
          <Link
            href="/impact-report"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-teal px-5 py-2.5 text-sm font-semibold text-ink-deep transition hover:bg-white"
          >
            Read the report
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
