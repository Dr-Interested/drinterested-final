import type { Metadata } from "next"
import { notFound } from "next/navigation"
import WatchPageClient from "@/components/watch/WatchPageClient"
import { supabase } from "@/lib/supabase-client"
import { getWebinarBySlug, type Webinar } from "@/data/webinars"

export const revalidate = 3600; // Revalidate individual webinars every hour (ISR)

const baseUrl = "https://www.drinterested.org"

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function mapRow(row: any): Webinar {
  return {
    id: row.id,
    slug: row.slug || row.id,
    title: row.title,
    description: row.description || "",
    longDescription: row.description || "",
    date: row.date || "",
    views: 0,
    duration: row.time || "",
    videoPath: row.video_url && !row.video_url.includes("youtu") ? row.video_url : "",
    thumbnailPath: row.image || "/logo.png",
    youtubeUrl: row.video_url && row.video_url.includes("youtu") ? row.video_url : "",
    spotifyUrl: row.spotify_url || undefined,
    tags: [],
    speaker: row.speaker || undefined,
    host: row.speaker_title || "Dr. Interested Webinar Series",
  }
}

/**
 * Resolves a /watch/[id] request against two sources:
 *  1. The Supabase `webinars` table — admin-managed, covers both admin-announced
 *     upcoming/completed webinars (keyed by UUID `id`) and the migrated episode archive
 *     (keyed by `slug`, e.g. /watch/exploring-medicine-early).
 *  2. The static archive in data/webinars.ts as a fallback, for the window before the
 *     webinars-podcasts-migration.sql seed has been run against Supabase.
 */
async function resolveWebinar(id: string): Promise<Webinar | null> {
  const { data: row } = await supabase
    .from("webinars")
    .select("*")
    .eq(UUID_RE.test(id) ? "id" : "slug", id)
    .maybeSingle()

  if (row) return mapRow(row)

  return getWebinarBySlug(id) || null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  if (!id) notFound()

  const webinar = await resolveWebinar(id)
  if (!webinar) return { title: "Webinar Not Found" }

  const watchUrl = `${baseUrl}/watch/${id}`
  const imageUrl = webinar.thumbnailPath.startsWith("http") ? webinar.thumbnailPath : `${baseUrl}${webinar.thumbnailPath}`

  return {
    title: webinar.title,
    description: webinar.description,
    keywords: ["Dr. Interested", "webinar", "medical education", "premed", "healthcare careers", ...(webinar.tags || [])],
    authors: [{ name: "Dr. Interested" }],
    creator: "Dr. Interested",
    publisher: "Dr. Interested",
    openGraph: {
      type: "video.other",
      locale: "en_US",
      url: watchUrl,
      title: webinar.title,
      description: webinar.description,
      siteName: "Dr. Interested",
      images: [{ url: imageUrl, width: 1280, height: 720, alt: webinar.title, type: "image/jpeg" }],
    },
    twitter: {
      card: "summary_large_image",
      title: webinar.title,
      description: webinar.description,
      images: [imageUrl],
    },
    alternates: { canonical: watchUrl },
    robots: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  }
}

export default async function WatchPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const webinar = await resolveWebinar(id)

  if (!webinar) {
    notFound()
  }

  return <WatchPageClient webinar={webinar} />
}
