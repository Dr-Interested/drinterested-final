"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowRight, FileText } from "lucide-react"
import DiscordIcon from "@/components/icons/discord-icon"
import { HeroReel } from "@/components/site/hero-reel"
import { ALL_TIME, IMPACT_REPORT_2026 } from "@/lib/impact-stats"
import { HERO_REEL, PHOTOS } from "@/lib/media"

export default function HeroSection({ isLoaded }: { isLoaded: boolean }) {
  const reduce = useReducedMotion()
  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: isLoaded ? { opacity: 1, y: 0 } : undefined,
          transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay },
        }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-cream via-cream/60 to-white">
      <div className="container grid items-center gap-8 py-8 md:grid-cols-[1.05fr_1fr] md:gap-12 md:py-14">
        <div>
          {/* First impression: the full stacked logo, icon over the wordmark. */}
          <motion.div {...rise(0)}>
            <Image
              src="/brand/logo-stacked.png"
              alt="Dr. Interested"
              width={180}
              height={146} loading="eager"
              className="logo-adapt mb-5 h-auto w-[112px] md:w-[132px]"
            />
          </motion.div>
          <motion.h1 {...rise(0.05)} className="text-[2.1rem] leading-[1.08] font-semibold text-ink sm:text-5xl lg:text-[3.4rem]">
            Helping every young person find their <span className="scribble">spark</span> in healthcare.
          </motion.h1>
          <motion.p {...rise(0.12)} className="mt-4 max-w-xl text-base leading-relaxed text-ink/85 sm:text-lg">
            We&apos;re a youth led global organization. We help young people explore healthcare careers, from
            medicine and research to public health, law and policy, get a voice in the rooms where health decisions
            are made, and find a community that feels like theirs.
          </motion.p>
          <motion.div {...rise(0.18)} className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/members/join"
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-ink-deep"
            >
              Join the team
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="https://discord.gg/pzbGRgsGXY"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-ink/20 bg-white px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-ink/40"
            >
              <DiscordIcon className="h-4 w-4" />
              Join our Discord
            </a>
            <Link
              href="/impact-report"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/85 underline decoration-teal decoration-2 underline-offset-4 hover:text-ink"
            >
              <FileText className="h-4 w-4" />
              {IMPACT_REPORT_2026.shortTitle}
            </Link>
          </motion.div>
          <motion.dl {...rise(0.24)} className="mt-7 grid max-w-md grid-cols-3 gap-4 border-t border-ink/10 pt-5">
            {[
              [ALL_TIME.youthImpacted, "youth impacted"],
              [ALL_TIME.countries, "countries and territories"],
              [ALL_TIME.executives, "youth executives"],
            ].map(([n, l]) => (
              <div key={l}>
                <dt className="sr-only">{l}</dt>
                <dd className="font-display text-xl font-semibold text-ink sm:text-2xl">{n}</dd>
                <dd className="text-xs leading-snug text-ink/85">{l}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* Moving photography: a real clip from Explore 3, with a photo tucked in front. */}
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.97 }}
          animate={isLoaded ? { opacity: 1, scale: 1 } : undefined}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-xl pb-10 md:pb-0"
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] shadow-xl ring-1 ring-black/5">
            <HeroReel clips={HERO_REEL} />
          </div>
          <div className="absolute -bottom-2 -left-3 w-[44%] rotate-[-3deg] overflow-hidden rounded-2xl border-4 border-white shadow-lg sm:-left-6 md:-bottom-8">
            <div className="relative aspect-[4/3]">
              <Image src={PHOTOS.medexplore[0].src} alt={PHOTOS.medexplore[0].alt} fill sizes="240px" className="object-cover" loading="eager" />
            </div>
          </div>
          <div className="absolute -right-2 bottom-4 rounded-2xl bg-white px-4 py-3 shadow-lg ring-1 ring-black/5 sm:-right-4 md:-bottom-4">
            <p className="font-display text-lg font-semibold leading-none text-ink">{ALL_TIME.volunteerHours}</p>
            <p className="mt-1 text-[11px] text-ink/85">volunteer hours given</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
