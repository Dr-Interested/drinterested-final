import { PHOTOS, QUOTES, VIDEOS, type Photo, type Quote } from "@/lib/media"

/**
 * Recap pages for events in the 2026 Annual Impact Report that did not have one. Facts and
 * numbers come from the report; photos and clips from public/media. Rendered by
 * app/events/[slug]/page.tsx and listed on /events.
 */

export type Recap = {
  slug: string
  title: string
  /** Shown on cards. */
  short: string
  date: string
  /** ISO date, for sorting and structured data. */
  isoDate: string
  location: string
  partner?: string
  pillars: ("Career Education" | "Youth in Policy" | "Community")[]
  summary: string
  body: string[]
  stats: [string, string][]
  cover: Photo
  video?: { src: string; poster: string; label: string; portrait?: boolean }
  gallery: Photo[]
  sessions?: string[]
  quote?: Quote
  links?: { label: string; href: string }[]
  /** Words that identify this event's row in the events database, so its card links here. */
  match: string[]
}

const img = (src: string, alt: string, caption?: string): Photo => ({ src, alt, caption })

export const RECAPS: Recap[] = [
  {
    slug: "explore-3-2026",
    title: "The 2026 Explore 3 Case Competition",
    short: "Explore 3 Case Competition 2026",
    date: "October 25, 2026",
    isoDate: "2026-10-25",
    location: "Humber Polytechnic Downtown, Toronto",
    partner: "Founding partners: Dr. Interested, Hope In Every Hand and Youth Law Advocacy",
    pillars: ["Career Education", "Youth in Policy"],
    summary:
      "High school teams tackled real world problems across medicine, law and finance, then pitched to a panel of judges for a cash prize and certificates.",
    body: [
      "Explore 3 is the case competition we built with Hope In Every Hand and Youth Law Advocacy. Its name comes from the three fields every case pulls together: medicine, law and finance. Teams get a real problem in the morning, work it through with mentors, and present their solution to judges in the afternoon.",
      "The 2026 competition brought teams to Humber Polytechnic Downtown for a day of keynotes, a speaker panel, and pitches. Teams competed for a cash prize, and every participant left with a certificate and a few new people to call on.",
    ],
    stats: [
      ["40", "youth impacted"],
      ["183K", "reached"],
      ["3", "fields: medicine, law, finance"],
    ],
    cover: PHOTOS.explore3_2026[1],
    video: { ...VIDEOS.explore3Panel2026, label: "The speaker panel Q&A at Explore 3 2026" },
    // Only 2026 material here; the 2025 photos live on their own recap.
    gallery: [PHOTOS.explore3_2026[0], PHOTOS.explore3_2026[1]],
    quote: QUOTES.find((q) => q.quote.startsWith("Career education should")),
    links: [{ label: "explore3.live", href: "https://www.explore3.live/" }],
    match: ["explore 3", "explore3", "2026"],
  },
  {
    slug: "explore-3-2025",
    title: "The 2025 Explore 3 Case Competition",
    short: "Explore 3 Case Competition 2025",
    date: "November 22, 2025",
    isoDate: "2025-11-22",
    location: "University of Toronto Mississauga",
    partner: "With Hope In Every Hand and Youth Law Advocacy",
    pillars: ["Career Education", "Youth in Policy"],
    summary:
      "The first Explore 3: high school teams solved cases spanning medicine, law and finance, opened by a keynote from MP Peter Fonseca and Ward 3 Councillor Chris Fonseca.",
    body: [
      "The first Explore 3 Case Competition filled a lecture hall with high school teams working through cases that crossed medicine, law and finance. MP Peter Fonseca and Ward 3 Councillor Chris Fonseca opened the day with a keynote on why young people belong in the conversations that shape their communities.",
      "Teams pitched to a panel of judges and took questions from them, and the day ended with finalists on stage. It became the model for the 2026 competition.",
    ],
    stats: [
      ["3", "fields in every case"],
      ["2", "elected officials gave the keynote"],
    ],
    cover: PHOTOS.explore3[0],
    video: { ...VIDEOS.explore3Room, label: "Teams at the 2025 Explore 3 Case Competition" },
    gallery: PHOTOS.explore3,
    quote: QUOTES.find((q) => q.quote.startsWith("My message to the future")),
    match: ["explore 3", "explore3", "2025"],
  },
  {
    slug: "code-blue-planet-2026",
    title: "Code Blue Planet: Indigenous Wisdom and Climate Medicine",
    short: "Code Blue Planet",
    date: "June 7, 2026",
    isoDate: "2026-06-07",
    location: "Humber Polytechnic Downtown, Toronto",
    partner: "Part of Toronto Climate Week, with Humber Polytechnic and GLOCAL",
    pillars: ["Career Education", "Youth in Policy", "Community"],
    summary:
      "An in person day where high school and university students joined Indigenous Elders, Knowledge Holders and health experts to explore climate resilient healthcare, traditional healing and career paths.",
    body: [
      "Climate change is already reshaping healthcare, from rising temperatures to disrupted ecosystems. Code Blue Planet brought students together with Indigenous Elders, Knowledge Holders and health experts to look at where climate science, modern healthcare and Indigenous medicine meet.",
      "The day ran from opening ceremonies to closing remarks, with sessions, lunch and plenty of time to talk. Before leaving, attendees signed a Code Blue Planet wall with what they would take home.",
    ],
    stats: [
      ["200", "youth impacted"],
      ["70K", "reached"],
      ["5", "sessions"],
    ],
    sessions: [
      "The Changing Climate and Indigenous Wellness",
      "Ayurveda and Climate Change",
      "Pharmacy and Climate Change",
      "Mental Health and Climate Change",
      "Modern Medicine and Climate Change",
    ],
    cover: PHOTOS.codeblue[0],
    video: { ...VIDEOS.codeblue, label: "Students talking at tables during Code Blue Planet", portrait: true },
    gallery: PHOTOS.codeblue,
    quote: QUOTES.find((q) => q.quote.startsWith("Young people from different backgrounds")),
    match: ["code blue"],
  },
  {
    slug: "research-proposal-competition-2026",
    title: "The 2026 Research Proposal Competition",
    short: "Research Proposal Competition",
    date: "October to November 2026",
    isoDate: "2026-11-01",
    location: "Online",
    pillars: ["Career Education", "Youth in Policy"],
    summary:
      "Youth from around the world pitched original research ideas, regardless of prior experience, with guidance from 10 medical student advisors.",
    body: [
      "Our flagship competition gives young people the chance to pitch an original research idea, whether or not they have done research before. An information meeting and a second session on how to write a proposal opened the competition, and 10 medical student advisors gave mentorship and feedback throughout.",
      "Participants built skills in research design, scientific communication and collaborative problem solving. The top 5 submissions were awarded mentorship and full publication and monetary support, including DOI registration. The competition ran in 2025 and again in 2026.",
    ],
    stats: [
      ["400", "submissions"],
      ["30+", "countries"],
      ["600", "youth engaged"],
      ["90K", "social impressions"],
    ],
    cover: PHOTOS.programs[1],
    gallery: [PHOTOS.programs[1], PHOTOS.programs[2], img("/research.png", "Research Proposal Competition participants", "2025")],
    quote: QUOTES.find((q) => q.quote.startsWith("Instead of just scrolling")),
    links: [{ label: "Watch last year's participant feedback", href: "https://www.instagram.com/reel/DO_Peudgriv/" }],
    match: ["research proposal"],
  },
  {
    slug: "canadian-innovation-week-2026",
    title: "Scaling Accessible Healthcare Education at Canadian Innovation Week",
    short: "Canadian Innovation Week",
    date: "May 11, 2026",
    isoDate: "2026-05-11",
    location: "Online (Discord)",
    partner: "Hosted during Canadian Innovation Week",
    pillars: ["Career Education", "Community"],
    summary:
      "A virtual social session on scaling accessible healthcare education, with our founder's story, a student innovation showcase and a mini workshop that turns an idea into action.",
    body: [
      "For Canadian Innovation Week we looked at a question we live with every day: how do you make healthcare education reach people who would never otherwise get it? Our founder shared how Dr. Interested started and the barriers it was built to break.",
      "Students then showcased real healthcare solutions, and a short workshop helped everyone name a challenge in their own community and leave with a first step to act on it.",
    ],
    stats: [
      ["105", "youth impacted"],
      ["9K", "reached"],
    ],
    cover: PHOTOS.programs[4],
    gallery: [PHOTOS.programs[4], img("/CIWEvent.png", "Canadian Innovation Week event poster")],
    match: ["innovation week", "ciw"],
  },
  {
    slug: "race-to-fight-cancer-2026",
    title: "The Race to Fight Cancer: Documentary Watch Party and Surgeon Scientist Q&A",
    short: "The Race to Fight Cancer",
    date: "April 17, 2026",
    isoDate: "2026-04-17",
    location: "Online",
    partner: "With Curiosity Films",
    pillars: ["Career Education"],
    summary:
      "A watch party of a CBC documentary on lung cancer diagnostics, followed by a live Q&A with the Yasufuku Lab team at UHN.",
    body: [
      "Together with Curiosity Films we screened a CBC documentary on the race to diagnose lung cancer earlier, then opened the floor to the researchers behind the work.",
      "Three guests from the Yasufuku Lab at UHN answered questions on what surgeon scientists actually do, how research reaches patients, and the paths that led them there.",
    ],
    stats: [
      ["68", "youth impacted"],
      ["7K", "reached"],
      ["3", "guest speakers"],
    ],
    cover: PHOTOS.programs[3],
    gallery: [PHOTOS.programs[3], img("/The Race to Fight Cancer Documentary.png", "The Race to Fight Cancer event poster")],
    match: ["race to fight", "lung cancer"],
  },
  {
    slug: "classroom-to-career-2026",
    title: "From Classroom to Career: Expanding Pathways in a Changing World",
    short: "From Classroom to Career",
    date: "January 27, 2026",
    isoDate: "2026-01-27",
    location: "Online",
    partner: "Part of the Learning Planet Festival, with UNESCO",
    pillars: ["Youth in Policy", "Career Education"],
    summary:
      "An online policy session on how education systems can help young people move into work: flexibility, early exposure and interdisciplinary skills.",
    body: [
      "As part of the Learning Planet Festival, powered by UNESCO, we hosted a policy conversation on the gap between school and work, and what education systems could do differently.",
      "Speakers Maiwand Amiri and Adil Mukhi led a discussion on flexible pathways, early exposure to careers, and the interdisciplinary skills young people need, with educators taking part alongside students.",
    ],
    stats: [
      ["90", "youth impacted"],
      ["12K", "reached"],
    ],
    cover: img("/unesco-webinar.png", "From Classroom to Career event graphic", "Learning Planet Festival"),
    gallery: [img("/unesco-webinar.png", "From Classroom to Career event graphic")],
    match: ["classroom to career"],
  },
  {
    slug: "community-2026",
    title: "Out in the Community, 2026",
    short: "Community events",
    date: "Spring to fall 2026",
    isoDate: "2026-07-12",
    location: "Mississauga and the Greater Toronto Area",
    pillars: ["Community"],
    summary:
      "The community events we showed up for in 2026, from the MYAC Fair and the Ward 3 BBQ to the City of Mississauga Civic Awards.",
    body: [
      "Our third pillar is about being a welcoming space beyond home and school. Most of that happens online, but in 2026 we also showed up in person: speaking at the MYAC Fair, running a booth at the Ward 3 BBQ, and joining community fairs across the city.",
      "Our members were recognized for it twice: with the Ontario Volunteer Service Award on May 19, and the City of Mississauga Civic Award on July 12.",
    ],
    stats: [
      ["2", "awards for community service"],
      ["600", "volunteers in 2026"],
      ["6,800", "volunteer hours in 2026"],
    ],
    cover: PHOTOS.community[0],
    video: { ...VIDEOS.communityFair, label: "Booths at a community fair", portrait: true },
    gallery: [PHOTOS.community[0], PHOTOS.community[1], ...PHOTOS.awards, PHOTOS.community[2]],
    quote: QUOTES.find((q) => q.quote.startsWith("I arrived not knowing")),
    match: ["ward 3", "myac", "community fair"],
  },
]

export const recapBySlug = (slug: string) => RECAPS.find((r) => r.slug === slug)

/** Existing recap pages built before this list, keyed by words in the event title. */
export const LEGACY_RECAPS: { href: string; match: string[] }[] = [
  { href: "/medx-2026", match: ["medexplore", "medx"] },
  { href: "/events/psychology-conference", match: ["psychology"] },
  { href: "/events/internship-recap", match: ["internship"] },
  { href: "/events/webinar-series-recap", match: ["webinar series"] },
]

/** The recap page for a database event, if there is one. */
export function recapHrefFor(title: string, date?: string): string | undefined {
  const t = `${title} ${date ?? ""}`.toLowerCase()
  const isYear = (m: string) => /^\d{4}$/.test(m)
  // A recap matches when one of its keywords is in the title and, if it names a year, that
  // year is in the title or date (so Explore 3 2025 and 2026 each find their own page).
  const hit = RECAPS.find(
    (r) => r.match.filter((m) => !isYear(m)).some((m) => t.includes(m)) && r.match.filter(isYear).every((y) => t.includes(y)),
  )
  if (hit) return `/events/${hit.slug}`
  return LEGACY_RECAPS.find((l) => l.match.some((m) => t.includes(m)))?.href
}
