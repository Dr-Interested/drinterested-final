import type { Metadata } from "next"
import EventsClientPage from "./EventsClientPage"
import { supabase } from "@/lib/supabase-client"
import { recapHrefFor } from "@/data/recaps"
import { todayET } from "@/lib/dates"
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
  // Dr. Interested events are free to attend; availability tracks the registration status.
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

export const revalidate = 60; // Revalidate events every 60 seconds (ISR)

export const metadata: Metadata = {
  title: "Events",
  description:
    "Free events for youth from Dr. Interested: healthcare career webinars, conferences, case and research competitions, and policy sessions. Find your next event.",
  keywords: [
    "Dr. Interested events",
    "free youth events",
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
      "Free Dr. Interested events for youth: healthcare career talks, conferences, case competitions, policy sessions and community events.",
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

  const sortEvents = (eventsList: any[], ascending = true) => {
    return [...eventsList].sort((a, b) => {
      const dateA = new Date(a.date).getTime() || 0
      const dateB = new Date(b.date).getTime() || 0
      return ascending ? dateA - dateB : dateB - dateA
    })
  }

  // An event counts as past once its date is behind us (ET), even if nobody has flipped
  // is_past in the portal yet; that is how the 2026 Explore 3 showed as upcoming. Dates that
  // can't be parsed ("Details coming soon") fall back to the is_past flag.
  const today = todayET()
  const isPast = (e: any) => {
    if (e.is_past) return true
    const d = new Date(e.date)
    if (Number.isNaN(d.getTime())) return false
    return d.toISOString().slice(0, 10) < today
  }
  const withRecap = (e: any) => ({ ...e, recapHref: recapHrefFor(e.title || "", e.date) })
  const rawUpcoming = (allEventsData?.filter((e) => !isPast(e)) || []).map(withRecap)
  const rawPast = (allEventsData?.filter(isPast) || []).map(withRecap)

  const upcomingEvents = sortEvents(rawUpcoming, true)
  const pastEvents = sortEvents(rawPast, false)

  // Only upcoming events get Event structured data — schema.org has no real "completed" status,
  // and Google's Event rich results are meant for things people can still attend/register for.
  const eventsListSchema = {
    "@context": "https://schema.org",
    "@graph": upcomingEvents.map(eventSchema),
  }

  return (
    <>
      {upcomingEvents.length > 0 && <SeoSchema id="events-schema" schema={eventsListSchema} />}
      <EventsClientPage upcomingEvents={upcomingEvents} pastEvents={pastEvents} />
    </>
  )
}
