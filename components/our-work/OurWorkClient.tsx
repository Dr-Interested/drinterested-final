"use client"

import { motion } from "framer-motion"
import Image from "@/components/site/img"
import Link from "next/link"
import {
  Users,
  Heart,
  Award,
  BookOpen,
  Sparkles,
  Globe,
  GraduationCap,
  Landmark,
  Home as HomeIcon,
  Newspaper,
  ArrowRight,
  Clock,
  CalendarDays,
  Eye,
} from "lucide-react"
import { ALL_TIME, HEALTHCARE_DEFINITION, IMPACT_REPORT_2026, PILLARS, YEAR_2026 } from "@/lib/impact-stats"
import { HIGHLIGHT_REEL, PHOTOS, QUOTES, VIDEOS } from "@/lib/media"
import { PhotoStrip } from "@/components/site/photo-strip"
import { QuoteCarousel } from "@/components/site/quote-carousel"
import { BgVideo } from "@/components/site/bg-video"

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
}

const inView = { initial: "hidden", whileInView: "visible", viewport: { once: true, margin: "-100px" } } as const

const PILLAR_ICONS = { career: GraduationCap, policy: Landmark, community: HomeIcon } as const

const HEADLINE_STATS = [
  { icon: Users, value: ALL_TIME.youthImpacted, label: "Youth Impacted" },
  { icon: Globe, value: ALL_TIME.countries, label: "Countries and Territories" },
  { icon: Heart, value: ALL_TIME.members, label: "Members" },
  { icon: Award, value: ALL_TIME.executives, label: "Unique Executives" },
]

const SECONDARY_STATS = [
  { icon: Clock, value: ALL_TIME.volunteerHours, label: "Volunteer Hours" },
  { icon: BookOpen, value: ALL_TIME.mentorHours, label: "Mentor Hours" },
  { icon: CalendarDays, value: ALL_TIME.events, label: "Events" },
  { icon: Eye, value: ALL_TIME.impressions, label: "Impressions" },
]

type Pillar = (typeof PILLARS)[number]["id"]

const FLAGSHIPS: {
  title: string
  when: string
  pillars: Pillar[]
  body: string
  stats: [string, string][]
  image?: string
  href?: string
}[] = [
  {
    title: "Research Proposal Competition",
    when: "October to November 2026 (also ran in 2025)",
    pillars: ["career", "policy"],
    body: "Youth from around the world pitch original research ideas, regardless of prior experience. Guided by 10 medical student advisors, participants build skills in research design, scientific communication, and collaborative problem solving. The top 5 submissions receive mentorship, full publication and monetary support, including DOI registration.",
    stats: [
      ["400", "submissions"],
      ["30+", "countries"],
      ["600", "youth engaged"],
      ["90K", "impressions"],
    ],
    image: "/media/programs/rpc-info-meeting.webp",
    href: "/events/research-proposal-competition-2026",
  },
  {
    title: "Office Hours Initiative",
    when: "May 2025 to December 2026",
    pillars: ["career", "community"],
    body: "Recurring open sessions, plus one on one and group meetings, where youth get mentorship, guidance, and community support in a welcoming, low barrier space as they explore education, careers, and personal growth beyond the classroom.",
    stats: [
      [YEAR_2026.mentors, "mentors"],
      ["2,200+", "youth with direct access"],
      [YEAR_2026.mentorHours, "mentorship hours in 2026"],
      ["60K", "program impressions"],
    ],
    image: "/media/programs/office-hours.webp",
  },
  {
    title: "The Dr. Interested Blog and Webinars",
    when: "January to December 2026",
    pillars: ["career", "policy"],
    body: "A youth educating youth initiative sharing articles on health, leadership, careers, and skill building, with practical advice and stories that help young people explore their interests and learn from peers. Our op eds and policy writing have been featured by partners.",
    stats: [
      ["55", "articles"],
      ["18", "unique topics"],
      ["130K", "youth impacted"],
      ["190K", "reached"],
    ],
  },
  {
    title: "The Dr. Interested Podcast",
    when: "January to December 2026",
    pillars: ["career", "community"],
    body: "Conversations with youth leaders, changemakers, and professionals about health, leadership, and the future, designed to inspire and connect the next generation.",
    stats: [
      ["39", "episodes"],
      ["40+", "volunteers"],
      ["98K", "youth impacted"],
      ["140K", "reached"],
    ],
  },
]

const PARTNER_PROGRAMS: {
  date: string
  title: string
  partner: string
  body: string
  stats: string
  image: string
  /** Logos are letterboxed instead of cropped. */
  logo?: boolean
  href?: string
}[] = [
  {
    date: "January 27, 2026",
    title: "From Classroom to Career: Expanding Pathways in a Changing World",
    partner: "Part of the Learning Planet Festival, with UNESCO",
    body: "An online policy session on how education systems can help young people move into work: flexibility, early exposure, and interdisciplinary skills.",
    stats: "90 youth impacted, 12K reached, with educators participating",
    image: "/unesco-webinar.png",
    href: "/events/classroom-to-career-2026",
  },
  {
    date: "April 17, 2026",
    title: "The Race to Fight Cancer: Documentary Watch Party and Surgeon Scientist Q&A",
    partner: "With Curiosity Films",
    body: "A watch party of a CBC documentary on lung cancer diagnostics, followed by a live Q&A with the Yasufuku Lab team at UHN.",
    stats: "68 youth impacted, 7K reached, 3 guest speakers",
    image: "/media/programs/race-to-fight-cancer.webp",
    href: "/events/race-to-fight-cancer-2026",
  },
  {
    date: "May 11, 2026",
    title: "Scaling Accessible Healthcare Education",
    partner: "Hosted during Canadian Innovation Week",
    body: "A virtual social session with our founder's story, a student innovation showcase, and a mini workshop that turns an idea into action.",
    stats: "105 youth impacted, 9K reached",
    image: "/media/programs/ciw-2026.webp",
    href: "/events/canadian-innovation-week-2026",
  },
  {
    date: "June 7, 2026",
    title: "Code Blue Planet: Indigenous Wisdom and Climate Medicine",
    partner: "Part of Toronto Climate Week",
    body: "An in person day at Humber Polytechnic Downtown where high school and university students joined Indigenous Elders, Knowledge Holders, and health experts to explore climate resilient healthcare, traditional healing, and career paths.",
    stats: "200 youth impacted, 70K reached",
    image: "/media/codeblue/volunteers.webp",
    href: "/events/code-blue-planet-2026",
  },
  {
    date: "August 16, 2026",
    title: "The 2026 MedExplore Conference",
    partner: "Funded by Canada Service Corps, sponsored by TakingITGlobal and the Sprout Fellowship",
    body: "Our full day healthcare careers conference at the University of Toronto Mississauga, with opening remarks from elected officials, career talks, panels, and workshops. Supported by 23 letters and certificates, including from the Premier of Ontario, the Mayor of Mississauga, MPPs, councillors, and an MP. Featured in Insauga.",
    stats: "100+ youth impacted, 300K reached, 23 speakers and panelists, 17 volunteers",
    image: "/media/medexplore/certificates-group.webp",
    href: "/medx-2026",
  },
  {
    date: "October 25, 2026",
    title: "The 2026 Explore 3 Case Competition",
    partner: "Founding partners: Dr. Interested, Hope In Every Hand, and Youth Law Advocacy",
    body: "High school teams tackle real world problems across medicine, law, and finance, then present to judges at Humber Polytechnic Downtown in Toronto, competing for a cash prize and certificates.",
    stats: "40 youth impacted, 183K reached",
    image: "/media/explore3/2026-panel.webp",
    href: "/events/explore-3-2026",
  },
]

function PillarTags({ ids }: { ids: Pillar[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {ids.map((id) => {
        const p = PILLARS.find((x) => x.id === id)!
        return (
          <span key={id} className="bg-[#4ecdc4]/15 text-[#2d6b66] px-2.5 py-1 rounded-full text-[11px] font-semibold">
            {p.short}
          </span>
        )
      })}
    </div>
  )
}

export default function OurWorkPage() {
  return (
    <div>
      {/* Hero */}
      <section className="hero-section bg-gradient-to-b from-cream to-white pt-8 pb-4 md:pt-12 relative overflow-hidden">
        <div className="container relative z-10 max-w-5xl mx-auto">
          <motion.div className="text-center" initial="hidden" animate="visible" variants={fadeIn}>
            <Link
              href="/impact-report"
              className="inline-flex items-center gap-2 bg-[#4ecdc4]/20 text-[#2d6b66] px-4 py-2 rounded-full text-sm font-medium mb-4 hover:bg-[#4ecdc4]/30 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>Read our {IMPACT_REPORT_2026.shortTitle}</span>
            </Link>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#405862] mb-4">
              Youth Led Change in Healthcare, Policy, and Community
            </h1>
            <p className="text-[#405862]/90 text-lg mb-6 leading-relaxed max-w-3xl mx-auto">
              Everything we run fits at least one of our three pillars: healthcare career education, access to policy
              spaces, and community spaces. The best programs fit all three.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="#impact"
                className="bg-[#4ecdc4] text-[#2b3f47] px-6 py-2.5 rounded-lg font-semibold hover:bg-[#4ecdc4]/90 transition-colors"
              >
                View Our Impact
              </a>
              <Link
                href="/our-work/in-the-media"
                className="bg-[#405862] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#334852] transition-colors"
              >
                In the Media
              </Link>
              <Link
                href="/publications"
                className="bg-white text-[#405862] border border-[#405862]/20 px-6 py-2.5 rounded-lg font-semibold hover:bg-white/70 transition-colors"
              >
                Read and Listen
              </Link>
            </div>
          </motion.div>
        </div>
        <div className="mt-8">
          <PhotoStrip photos={HIGHLIGHT_REEL} height="h-36 sm:h-44" duration={95} />
        </div>
      </section>

      {/* Impact numbers */}
      <section id="impact" className="py-10 md:py-14 bg-white scroll-mt-20">
        <div className="container max-w-5xl mx-auto">
          <motion.div className="text-center mb-10" {...inView} variants={fadeIn}>
            <h2 className="text-3xl md:text-4xl font-bold text-[#405862] mb-3">Our Impact by the Numbers</h2>
            <p className="text-[#405862]/85 max-w-2xl mx-auto">
              2025 and 2026 combined. In 2026 alone, {YEAR_2026.executives} executives and {YEAR_2026.volunteers}{" "}
              volunteers gave {YEAR_2026.volunteerHours} hours and we reached {YEAR_2026.youthImpacted} young people.
            </p>
          </motion.div>

          <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4" {...inView} variants={staggerContainer}>
            {HEADLINE_STATS.map(({ icon: Icon, value, label }) => (
              <motion.div key={label} variants={scaleIn}>
                <div className="bg-gradient-to-br from-[#4ecdc4]/10 to-[#4ecdc4]/5 p-5 rounded-xl text-center border border-[#4ecdc4]/20 h-full">
                  <Icon className="w-7 h-7 text-teal-deep mx-auto mb-2" />
                  <div className="text-3xl font-bold text-[#405862] mb-1">{value}</div>
                  <div className="text-[#405862]/85 text-xs font-medium">{label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4" {...inView} variants={staggerContainer}>
            {SECONDARY_STATS.map(({ icon: Icon, value, label }) => (
              <motion.div key={label} variants={fadeIn}>
                <div className="bg-[#f5f1eb] p-4 rounded-xl text-center h-full">
                  <Icon className="w-5 h-5 text-teal-deep mx-auto mb-1" />
                  <div className="text-2xl font-bold text-[#405862] mb-1">{value}</div>
                  <div className="text-[#405862]/85 text-xs">{label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          <p className="text-center text-xs text-[#405862]/85 mt-4">
            Source:{" "}
            <Link href="/impact-report" className="underline underline-offset-2 hover:text-[#405862]">
              {IMPACT_REPORT_2026.title}
            </Link>
            , figures as of {IMPACT_REPORT_2026.asOf}.
          </p>
        </div>
      </section>

      {/* Three pillars */}
      <section id="pillars" className="py-10 md:py-14 bg-[#f5f1eb]/50 scroll-mt-20">
        <div className="container max-w-5xl mx-auto">
          <motion.div className="text-center mb-10" {...inView} variants={fadeIn}>
            <h2 className="text-3xl md:text-4xl font-bold text-[#405862] mb-3">Our Three Pillars</h2>
            <p className="text-[#405862]/85 max-w-2xl mx-auto">
              {HEALTHCARE_DEFINITION} Guided by the UN Convention on the Rights of the Child (Articles 6 and 12) and SDGs 3, 4, and 10.
            </p>
          </motion.div>
          <motion.div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:overflow-visible md:px-0 md:pb-0 md:grid md:grid-cols-3 md:gap-5" {...inView} variants={staggerContainer}>
            {PILLARS.map((p) => {
              const Icon = PILLAR_ICONS[p.id]
              return (
                <motion.div key={p.id} variants={fadeIn} className="w-[84%] shrink-0 snap-start md:w-auto bg-white rounded-xl p-6 shadow-sm border border-[#405862]/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-[#4ecdc4]/15 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#2d6b66]" />
                    </div>
                    <span className="text-xs font-semibold text-[#405862]/85">Pillar {p.number}</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#405862] mb-2">{p.name}</h3>
                  <p className="text-sm text-[#405862]/90 leading-relaxed">{p.description}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Flagship initiatives */}
      <section className="py-10 md:py-14 bg-white">
        <div className="container max-w-5xl mx-auto">
          <motion.div className="text-center mb-10" {...inView} variants={fadeIn}>
            <h2 className="text-3xl md:text-4xl font-bold text-[#405862] mb-3">Our Flagship Initiatives</h2>
            <p className="text-[#405862]/85 max-w-2xl mx-auto">Programs that run all year and reach youth everywhere.</p>
          </motion.div>

          <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:overflow-visible md:px-0 md:pb-0 md:grid md:grid-cols-2 md:gap-6">
            {FLAGSHIPS.map((f) => (
              <motion.article
                key={f.title}
                {...inView}
                variants={fadeIn}
                className="w-[86%] shrink-0 snap-start md:w-auto bg-[#f5f1eb]/60 rounded-xl overflow-hidden border border-[#405862]/10 flex flex-col"
              >
                {f.image && (
                  <div className="relative h-48">
                    <Image src={f.image} alt={f.title} fill sizes="(max-width: 768px) 100vw, 480px" className="object-cover" />
                  </div>
                )}
                <div className="p-5 flex flex-col gap-3 flex-1">
                  <PillarTags ids={f.pillars} />
                  <div>
                    <h3 className="text-xl font-bold text-[#405862]">
                      {f.href ? (
                        <Link href={f.href} className="hover:text-teal-deep">
                          {f.title}
                        </Link>
                      ) : (
                        f.title
                      )}
                    </h3>
                    <p className="text-xs text-[#405862]/85 mt-0.5">{f.when}</p>
                  </div>
                  <p className="text-sm text-[#405862]/90 leading-relaxed flex-1 line-clamp-4">{f.body}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {f.stats.map(([n, l]) => (
                      <div key={l} className="bg-white rounded-lg p-2 text-center">
                        <div className="text-lg font-bold text-teal-deep">{n}</div>
                        <div className="text-[11px] text-[#405862]/85 leading-tight">{l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Programs with partners */}
      <section className="py-10 md:py-14 bg-[#f5f1eb]/50">
        <div className="container max-w-5xl mx-auto">
          <motion.div className="text-center mb-10" {...inView} variants={fadeIn}>
            <h2 className="text-3xl md:text-4xl font-bold text-[#405862] mb-3">Programs With Partners in 2026</h2>
            <p className="text-[#405862]/85 max-w-2xl mx-auto">
              A few of the {YEAR_2026.events} events we ran this year, plus the community events we showed up for, like
              the MYAC Fair and the Ward 3 BBQ.
            </p>
          </motion.div>
          <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:overflow-visible md:px-0 md:pb-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-5">
            {PARTNER_PROGRAMS.map((e) => {
              const card = (
                <>
                  <div className="relative h-40 bg-[#f5f1eb]">
                    <Image
                      src={e.image}
                      alt={e.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 320px"
                      className={e.logo ? "object-contain p-6" : "object-cover"}
                    />
                  </div>
                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <p className="text-xs font-semibold text-teal-deep">{e.date}</p>
                    <h3 className="font-bold text-[#405862] leading-snug">{e.title}</h3>
                    <p className="text-xs text-[#405862]/85">{e.partner}</p>
                    <p className="text-sm text-[#405862]/90 leading-relaxed flex-1 line-clamp-3">{e.body}</p>
                    <p className="text-xs font-semibold text-[#405862] bg-[#4ecdc4]/10 rounded-md px-2 py-1.5">{e.stats}</p>
                  </div>
                </>
              )
              const cls =
                "w-[80%] shrink-0 snap-start md:w-auto bg-white rounded-xl overflow-hidden shadow-sm border border-[#405862]/10 flex flex-col hover:shadow-md transition-shadow"
              return e.href ? (
                <Link key={e.title} href={e.href} className={cls}>
                  {card}
                </Link>
              ) : (
                <div key={e.title} className={cls}>
                  {card}
                </div>
              )
            })}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-[#405862] font-semibold hover:text-teal-deep"
            >
              See all {YEAR_2026.events} events from 2026
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Chess club */}
      <section className="py-10 md:py-14 bg-white">
        <div className="container max-w-5xl mx-auto">
          <motion.div className="grid md:grid-cols-2 gap-6 items-center" {...inView} variants={fadeIn}>
            <div className="space-y-3">
              <PillarTags ids={["community"]} />
              <h2 className="text-2xl font-bold text-[#405862]">
                <Link href="https://chess.drinterested.org" target="_blank" rel="noopener noreferrer" className="hover:text-teal-deep">
                  Simmon Chang Chess (Against Cancer) Club
                </Link>
              </h2>
              <p className="text-xs text-[#405862]/85">November 2025 to present</p>
              <p className="text-[#405862]/90 text-sm leading-relaxed">
                Through chess tournaments, including the Terry Fox International and the Weiss Open, we raise funds for
                the Pediatric Cancer Research Fund. The club honours Simmon Chang, a young Canadian whose passion for
                chess and strength in the face of osteosarcoma continue to inspire our community, and carries his name
                with his family&apos;s permission. Within one year, Dr. Interested became one of the top 10 fundraisers
                for the Pediatric Cancer Research Fund.
              </p>
              <p className="text-xs font-semibold text-[#405862] bg-[#4ecdc4]/10 rounded-md px-2 py-1.5 inline-block">
                30 youth impacted, 14K reached
              </p>
            </div>
            <div className="relative h-[200px] md:h-[240px] rounded-xl overflow-hidden shadow-md">
              <Image src="/chessdrint.png" alt="Simmon Chang Chess (Against Cancer) Club" fill className="object-cover" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Voices */}
      <section className="py-10 md:py-14 bg-cream/60">
        <div className="container max-w-5xl mx-auto grid gap-8 md:grid-cols-[1.4fr_1fr] items-center">
          <motion.div {...inView} variants={fadeIn}>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-teal-deep">In their words</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-ink mb-4">Real opinions from real youth</h2>
            <QuoteCarousel quotes={QUOTES} />
          </motion.div>
          <motion.figure {...inView} variants={fadeIn} className="relative mx-auto aspect-[9/16] w-full max-w-[280px] overflow-hidden rounded-2xl shadow-lg">
            <BgVideo {...VIDEOS.psych} label="A keynote at the Culture and Psychology Conference" />
            <figcaption className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-medium text-ink">
              Culture and Psychology Conference
            </figcaption>
          </motion.figure>
        </div>
      </section>

      {/* In the media teaser */}
      <section className="py-10 md:py-14 bg-white">
        <div className="container max-w-5xl mx-auto">
          <motion.div
            {...inView}
            variants={fadeIn}
            className="rounded-2xl bg-[#405862] text-white p-6 md:p-10 grid md:grid-cols-[1fr_auto] gap-6 items-center"
          >
            <div>
              <div className="flex items-center gap-2 text-[#8ee6df] text-sm font-semibold mb-2">
                <Newspaper className="w-4 h-4" />
                In the Media
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Featured by CBC Radio, OMNI News, Insauga and more</h2>
              <p className="text-white/80 text-sm leading-relaxed">
                Coverage, podcasts, and recognition, including a Canadian Choice Award finalist spot and a listing as a
                civil society organization with the UN Department of Economic and Social Affairs.
              </p>
            </div>
            <Link
              href="/our-work/in-the-media"
              className="inline-flex items-center justify-center gap-2 bg-[#4ecdc4] text-[#2b3f47] px-6 py-3 rounded-lg font-semibold hover:bg-[#4ecdc4]/90"
            >
              See our media features
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 md:py-14 bg-gradient-to-br from-[#405862] to-[#2d4149] text-white">
        <div className="container max-w-4xl text-center mx-auto">
          <motion.div {...inView} variants={fadeIn}>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Ready to Make an Impact?</h2>
            <p className="text-white/90 mb-6 text-base leading-relaxed max-w-2xl mx-auto">
              Join {ALL_TIME.members} youth from {ALL_TIME.countries} countries and territories exploring healthcare
              careers, speaking up in policy spaces, and building community.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/members/join"
                className="bg-[#4ecdc4] text-[#2b3f47] px-7 py-2.5 rounded-lg font-semibold hover:bg-[#4ecdc4]/90 transition-colors"
              >
                Join Our Team
              </Link>
              <a
                href="https://discord.gg/pzbGRgsGXY"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 text-white px-7 py-2.5 rounded-lg font-semibold hover:bg-white/20 transition-colors"
              >
                Join Our Discord
              </a>
              <Link
                href="/sponsorships"
                className="bg-white/10 text-white px-7 py-2.5 rounded-lg font-semibold hover:bg-white/20 transition-colors"
              >
                Support Our Work
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
