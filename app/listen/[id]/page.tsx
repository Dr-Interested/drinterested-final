import type { Metadata } from "next"
import { notFound } from "next/navigation"
import WatchPageClient from "@/components/watch/WatchPageClient"
import { supabase } from "@/lib/supabase-client"
import { getPodcastBySlug } from "@/data/podcasts"
import type { Webinar } from "@/data/webinars"

export const revalidate = 3600

const baseUrl = "https://www.drinterested.org"

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
    videoPath: "", // podcast episodes always play via the YouTube embed, never a hosted file
    thumbnailPath: row.image || "/logo.png",
    youtubeUrl: row.video_url || "",
    spotifyUrl: row.spotify_url || undefined,
    tags: [],
    speaker: row.speaker || undefined,
    host: "Dr. Interested Podcast",
  }
}

/** Podcasts have no self-hosted video file — always plays via the YouTube embed in WatchPageClient. */
function fromStatic(podcast: NonNullable<ReturnType<typeof getPodcastBySlug>>): Webinar {
  return {
    id: podcast.id,
    slug: podcast.slug,
    title: podcast.title,
    description: podcast.description,
    longDescription: podcast.longDescription,
    date: podcast.date,
    views: 0,
    duration: podcast.duration,
    videoPath: "",
    thumbnailPath: podcast.thumbnailPath,
    youtubeUrl: podcast.youtubeUrl,
    spotifyUrl: podcast.spotifyUrl,
    tags: podcast.tags,
    speaker: podcast.speaker,
    host: "Dr. Interested Podcast",
  }
}

/**
 * Resolves a /listen/[id] request against the Supabase `webinars` table (category='podcast',
 * admin-managed via the dashboard) first, falling back to the static data/podcasts.ts archive
 * for the window before webinars-podcasts-migration.sql has been run.
 */
async function resolvePodcast(id: string): Promise<Webinar | null> {
  const { data: row } = await supabase
    .from("webinars")
    .select("*")
    .eq("category", "podcast")
    .eq("slug", id)
    .maybeSingle()

  if (row) return mapRow(row)

  const staticMatch = getPodcastBySlug(id)
  return staticMatch ? fromStatic(staticMatch) : null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const podcast = await resolvePodcast(id)
  if (!podcast) return { title: "Episode Not Found" }

  const url = `${baseUrl}/listen/${id}`
  const imageUrl = podcast.thumbnailPath.startsWith("http") ? podcast.thumbnailPath : `${baseUrl}${podcast.thumbnailPath}`

  return {
    title: `${podcast.title} | Dr. Interested Podcast`,
    description: podcast.description,
    keywords: ["Dr. Interested", "podcast", "healthcare", "medical education"],
    authors: [{ name: "Dr. Interested" }],
    creator: "Dr. Interested",
    publisher: "Dr. Interested",
    openGraph: {
      type: "video.other",
      locale: "en_US",
      url,
      title: podcast.title,
      description: podcast.description,
      siteName: "Dr. Interested",
      images: [{ url: imageUrl, width: 1280, height: 720, alt: podcast.title, type: "image/jpeg" }],
    },
    twitter: {
      card: "summary_large_image",
      title: podcast.title,
      description: podcast.description,
      images: [imageUrl],
    },
    alternates: { canonical: url },
    robots: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  }
}

export default async function ListenPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const podcast = await resolvePodcast(id)
  if (!podcast) notFound()

  return <WatchPageClient webinar={podcast} />
}
