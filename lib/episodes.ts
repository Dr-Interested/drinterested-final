import { supabase } from "@/lib/supabase-client"
import { webinars as staticWebinars } from "@/data/webinars"
import { podcasts as staticPodcasts } from "@/data/podcasts"
import type { MediaItem } from "@/components/publications/media-card"

export type EpisodeCategory = "webinar" | "podcast"

const byDateDesc = (a: { date: string }, b: { date: string }) =>
  new Date(b.date).getTime() - new Date(a.date).getTime()

function fromStaticWebinars(): MediaItem[] {
  return staticWebinars.map((w) => ({
    id: w.id,
    slug: w.slug,
    title: w.title,
    description: w.description,
    date: w.date,
    thumbnailPath: w.thumbnailPath,
    youtubeUrl: w.youtubeUrl,
    spotifyUrl: w.spotifyUrl,
    speaker: w.speaker,
  }))
}

function fromStaticPodcasts(): MediaItem[] {
  return staticPodcasts.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    description: p.description,
    date: p.date,
    thumbnailPath: p.thumbnailPath,
    youtubeUrl: p.youtubeUrl,
    spotifyUrl: p.spotifyUrl,
    speaker: p.speaker,
  }))
}

/**
 * Fetches every episode in a category (webinar/podcast) from the admin-managed Supabase
 * `webinars` table — the single source of truth once scripts/webinars-podcasts-migration.sql
 * has been run. Falls back to the static data/webinars.ts + data/podcasts.ts archive if the
 * table is empty for that category (e.g. the migration hasn't been run yet) or the query fails,
 * so the site never shows an empty section.
 */
export async function getEpisodesByCategory(category: EpisodeCategory): Promise<MediaItem[]> {
  const { data, error } = await supabase
    .from("webinars")
    .select("id, slug, title, description, date, image, video_url, spotify_url, speaker")
    .eq("category", category)
    // Only watchable/listenable past episodes belong in this archive — an "upcoming,
    // register now" announcement isn't ready to show up as something to watch yet.
    .eq("status", "completed")
    .order("date", { ascending: false })

  if (error || !data || data.length === 0) {
    return category === "webinar" ? [...fromStaticWebinars()].sort(byDateDesc) : [...fromStaticPodcasts()].sort(byDateDesc)
  }

  return data
    .map((row) => ({
      id: row.id,
      slug: row.slug || row.id,
      title: row.title,
      description: row.description || "",
      date: row.date || "",
      thumbnailPath: row.image || "/logo.png",
      youtubeUrl: row.video_url || "",
      spotifyUrl: row.spotify_url || undefined,
      speaker: row.speaker || undefined,
    }))
    .sort(byDateDesc)
}
