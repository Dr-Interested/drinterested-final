import type { Metadata } from "next"
import { notFound } from "next/navigation"
import WatchPageClient from "@/components/watch/WatchPageClient"
import { getPodcastBySlug, podcasts } from "@/data/podcasts"
import type { Webinar } from "@/data/webinars"

export const revalidate = 3600

const baseUrl = "https://www.drinterested.org"

export function generateStaticParams() {
  return podcasts.map((p) => ({ id: p.slug }))
}

/** Podcasts have no self-hosted video file — always plays via the YouTube embed in WatchPageClient. */
function toWebinarShape(podcast: NonNullable<ReturnType<typeof getPodcastBySlug>>): Webinar {
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const podcast = getPodcastBySlug(id)
  if (!podcast) return { title: "Episode Not Found" }

  const url = `${baseUrl}/listen/${podcast.slug}`
  const imageUrl = podcast.thumbnailPath.startsWith("http") ? podcast.thumbnailPath : `${baseUrl}${podcast.thumbnailPath}`

  return {
    title: `${podcast.title} | Dr. Interested Podcast`,
    description: podcast.description,
    keywords: ["Dr. Interested", "podcast", "healthcare", "medical education", ...podcast.tags],
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
  const podcast = getPodcastBySlug(id)
  if (!podcast) notFound()

  return <WatchPageClient webinar={toWebinarShape(podcast)} />
}
