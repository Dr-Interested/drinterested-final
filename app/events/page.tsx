import type { Metadata } from "next"
import EventsClientPage from "./EventsClientPage"
import { supabase } from "@/lib/supabase-client"
import { recapHrefFor } from "@/data/recaps"
import { todayET } from "@/lib/dates"
import { isDateRange, parseEventDate } from "@/lib/event-date"
import SeoSchema from "@/components/seo-schema"

const baseUrl = "https://www.drinterested.org"

function toIsoDate(dateStr: string, timeStr?: string): string {
  const combined = timeStr ? `${dateStr} ${timeStr}` : dateStr
  const parsed = new Date(combined)
  if (!isNaN(parsed.getTime())) return parsed.toISOString()
  const dateOnly = new Date(dateStr)
  return isNaN(dateOnly.getTime()) ? dateStr : dateOnly.toISOString()
}

function eventSchema(e: any) {
  const isVirtual = /virtual|online|zoom|webinar/i.test(e.location || "")
  const registrationUrl = e.link && e.link.startsWith("http") ? e.link : `${baseUrl}/events`
  // Availability tracks the registration status.
  const availability =
    e.status === "full" || e.status === "closed"
      ? "https://schema.org/SoldOut"
      : "https://schema.org/InStock"
  return {
    "@type": "Event",
    name: e.title,
    description: e.description,
    startDate: toIsoDate(e.date, e.time),
    // schema.org's EventStatusType has no "completed" value — EventScheduled is correct
    // regardless, and this function is only ever called for upcoming events anyway.
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: isVirtual
      ? "https://schema.org/OnlineEventAttendanceMode"
      : "https://schema.org/OfflineEventAttendanceMode",
    location: isVirtual
      ? { "@type": "VirtualLocation", url: e.link || baseUrl }
      : { "@type": "Place", name: e.location, address: e.location },
    image: e.image ? (e.image.startsWith("http") ? e.image : `${baseUrl}${e.image}`) : `${baseUrl}/websitebanner.jpg`,
    organizer: { "@type": "Organization", name: "Dr. Interested", url: baseUrl },
    performer: { "@type": "Organization", name: "Dr. Interested", url: baseUrl },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "CAD",
      availability,
      url: registrationUrl,
      validFrom: toIsoDate(e.created_at || e.date),
    },
    url: registrationUrl,
  }
}

/** Office Hours never ends: always shown as open, never moved to past. */
function isOngoing(e: any) {
  return /office hours/i.test(e.title || "")
}

export const revalidate = 60; // Revalidate events every 60 seconds (ISR)

export const metadata: Metadata = {
  title: "Events",
  description:
    "Accessible, low barrier events for youth from Dr. Interested: healthcare career webinars, conferences, case and research competitions, and policy sessions. Find your next event.",
  keywords: [
    "Dr. Interested events",
    "youth healthcare events",
    "healthcare career webinars",
    "healthcare career events",
    "youth policy events",
    "case competition for high school students",
    "student research competitions",
    "MedExplore conference",
    "volunteer opportunities",
  ],
  openGraph: {
    title: "Events | Dr. Interested",
    description:
      "Accessible Dr. Interested events for youth: healthcare career talks, conferences, case competitions, policy sessions and community events.",
    url: "https://www.drinterested.org/events",
    siteName: "Dr. Interested",
    type: "website",
    images: [
      {
        url: "/og-2026.jpg",
        width: 1200,
        height: 630,
        alt: "Dr. Interested Events",
      },
    ],
  },
  alternates: {
    canonical: "https://www.drinterested.org/events",
  },
}

export default async function EventsPage() {

  const { data: allEventsData } = await supabase
    .from("events")
    .select("*")
    .order("created_at", { ascending: false })

  // Dated events in date order (newest first for past, soonest first for upcoming); events
  // with no readable date go last, newest added first.
  const sortEvents = (eventsList: any[], ascending = true) => {
    return [...eventsList].sort((a, b) => {
      const dateA = parseEventDate(a.date)
      const dateB = parseEventDate(b.date)
      if (dateA === null && dateB === null) {
        return String(b.created_at ?? "").localeCompare(String(a.created_at ?? ""))
      }
      if (dateA === null) return 1
      if (dateB === null) return -1
      return ascending ? dateA - dateB : dateB - dateA
    })
  }

  // An event counts as past once its date is behind us (ET), even if nobody has flipped
  // is_past in the portal yet; that is how the 2026 Explore 3 showed as upcoming. Ranges
  // ("October to November 2026") and unreadable dates rely on the is_past flag, so a program
  // that is still running is never moved early.
  const today = todayET()
  const isPast = (e: any) => {
    if (isOngoing(e)) return false
    if (e.is_past) return true
    if (isDateRange(e.date)) return false
    const t = parseEventDate(e.date)
    if (t === null) return false
    return new Date(t).toISOString().slice(0, 10) < today
  }
  const withRecap = (e: any) => ({ ...e, recapHref: recapHrefFor(e.title || "", e.date) })
  // Ongoing programs (Office Hours) stay open, whatever the portal says.
  const asOngoing = (e: any) => ({
    ...e,
    ongoing: true,
    date: "Ongoing, all year",
    status: "open",
    link: e.link || "https://discord.gg/pzbGRgsGXY",
    image: "/media/programs/office-hours.webp",
  })
  const ongoingEvents = (allEventsData?.filter(isOngoing) || []).map(asOngoing)
  const rawUpcoming = (allEventsData?.filter((e) => !isPast(e) && !isOngoing(e)) || []).map(withRecap)
  const rawPast = (allEventsData?.filter(isPast) || []).map(withRecap)

  const datedUpcoming = sortEvents(rawUpcoming, true)
  const upcomingEvents = [...datedUpcoming, ...ongoingEvents]
  const pastEvents = sortEvents(rawPast, false)

  // Only upcoming events get Event structured data — schema.org has no real "completed" status,
  // and Google's Event rich results are meant for things people can still attend/register for.
  const eventsListSchema = {
    "@context": "https://schema.org",
    "@graph": datedUpcoming.map(eventSchema),
  }

  return (
    <>
      {datedUpcoming.length > 0 && <SeoSchema id="events-schema" schema={eventsListSchema} />}
      <EventsClientPage upcomingEvents={upcomingEvents} pastEvents={pastEvents} />
    </>
  )
}
