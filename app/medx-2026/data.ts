import galleryManifest from "@/public/medexplore-2026/gallery-manifest.json"
import documentManifest from "@/public/medexplore-2026/letters-manifest.json"

export type GalleryImage = { file: string; w: number; h: number }

export type AgendaItem = {
  time: string
  session: string
  who: string
  gallerySlug?: keyof typeof galleryManifest
}

export type SupportDocument = {
  slug: string
  category: "letters" | "certificates"
  name: string
  role: string
  image: string
  pdf: string | null
  w: number
  h: number
}

export const AGENDA: AgendaItem[] = [
  { time: "9:30 AM", session: "Check In and Breakfast", who: "—" },
  {
    time: "9:45 AM",
    session: "Opening Ceremonies",
    who: "Adil Mukhi; MPP Nina Tangri; MPP Sheref Sabawy; Deputy Mayor Harkirat Singh",
    gallerySlug: "opening-ceremonies",
  },
  {
    time: "10:15 AM",
    session: "What is Dr. Interested",
    who: "Adil Mukhi",
    gallerySlug: "what-is-dr-interested",
  },
  {
    time: "10:25 AM",
    session: "Getting to Know Each Other (icebreaker)",
    who: "—",
    gallerySlug: "icebreaker",
  },
  {
    time: "10:40 AM",
    session: "Research, Advocacy, and Finding Your Path in Health",
    who: "Doreen Zarrabian, Founder and President, Bloom Forward Foundation",
    gallerySlug: "research-advocacy",
  },
  {
    time: "10:55 AM",
    session: "Inside a PhD: Exploring Neuromuscular Physiology",
    who: "Raaj Dudani, PhD Student, Western University",
    gallerySlug: "inside-a-phd",
  },
  {
    time: "(~11:05 AM)",
    session: "Remarks",
    who: "MPP Rudy Cuzzetto",
    gallerySlug: "remarks-cuzzetto",
  },
  {
    time: "11:10 AM",
    session: "University Life 101: Research, Involvement, and Surviving First Year",
    who: "UTM Pre Medical Club: Shaivya Thukral, Efe Sahinoglu, Norhan Ahmadoun, Maryam Shaikh",
    gallerySlug: "university-life-101",
  },
  {
    time: "11:40 AM",
    session: "Closing Morning Remarks",
    who: "MPP Andrea Hazell; Councillor Chris Fonseca; MP Fares Al Soud",
    gallerySlug: "closing-morning-remarks",
  },
  { time: "12:00 PM", session: "Lunch and Networking", who: "—", gallerySlug: "lunch" },
  {
    time: "1:00 PM",
    session: "Afternoon Welcome",
    who: "Councillor Dipika Damerla",
    gallerySlug: "afternoon-welcome",
  },
  {
    time: "1:25 PM",
    session: "Beyond the Undergrad: Research, Grad School, and Leadership Paths",
    who: "Ibrahim Khan and Anita Alizadeh, Medicine4Youth; Raaj Dudani; Maiwand Amiri",
    gallerySlug: "beyond-the-undergrad",
  },
  {
    time: "2:00 PM",
    session: "From Hours to Impact",
    who: "Volunteering Peel: Sienna Thomas, Julia Tsang, Harjap Singh Johar",
    gallerySlug: "from-hours-to-impact",
  },
  {
    time: "2:30 PM",
    session: "Policy and Health: How Are They Connected?",
    who: "Adil Mukhi",
    gallerySlug: "policy-and-health",
  },
  {
    time: "3:00 PM",
    session: "Managing Mental Health and School",
    who: "Maiwand Amiri",
    gallerySlug: "managing-mental-health",
  },
  {
    time: "3:30 PM",
    session: "A Career in Internal Medicine: A Day in the Life",
    who: "Dr. Tarek Abdelhalim, Toronto Western Hospital, UHN",
    gallerySlug: "career-internal-medicine",
  },
  {
    time: "4:00 PM",
    session: "Closing Ceremonies",
    who: "Councillor Natalie Hart",
    gallerySlug: "closing-ceremonies",
  },
  { time: "4:30 PM", session: "Conference Concludes", who: "—" },
]

export function galleryFor(slug?: keyof typeof galleryManifest): GalleryImage[] {
  if (!slug) return []
  return (galleryManifest as Record<string, GalleryImage[]>)[slug] ?? []
}

export const HIGHLIGHT_PHOTOS: GalleryImage[] = (galleryManifest as Record<string, GalleryImage[]>).highlights ?? []

// Dedicated hero photo for the recap page — also used as the base for the OG/Twitter share image.
export const HERO_PHOTO: GalleryImage = {
  file: "/medexplore-2026/MedExplore2026.png",
  w: 2200,
  h: 1649,
}

const documents = documentManifest as SupportDocument[]

export const LETTERS: SupportDocument[] = documents.filter((d) => d.category === "letters")
export const CERTIFICATES: SupportDocument[] = documents.filter((d) => d.category === "certificates")
