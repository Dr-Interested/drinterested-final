"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Play, ArrowUpRight } from "lucide-react"

/**
 * Click-to-load facades for third-party media players. Nothing from YouTube or Spotify
 * (script, iframe, font, cookie) is requested until the visitor actually clicks play —
 * this keeps the ~2 MB of YouTube embed JS and its web fonts off the initial page load.
 * Each facade also links out to the matching on-site /watch or /listen page.
 */

function OpenFullPageLink({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[#405862] hover:text-[#4ecdc4] transition-colors"
    >
      Open full page
      <ArrowUpRight className="h-3 w-3" />
    </Link>
  )
}

export function LiteYouTube({
  id,
  title,
  watchHref,
}: {
  id: string
  title: string
  watchHref?: string
}) {
  const [active, setActive] = useState(false)

  return (
    <div>
      <div className="relative aspect-video w-full overflow-hidden rounded-md bg-[#f5f1eb]">
        {active ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setActive(true)}
            aria-label={`Play video: ${title}`}
            className="group absolute inset-0 h-full w-full"
          >
            <Image
              src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/30">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition-transform group-hover:scale-110">
                <Play className="h-6 w-6 translate-x-0.5 fill-current" />
              </span>
            </span>
          </button>
        )}
      </div>
      {watchHref && <OpenFullPageLink href={watchHref} />}
    </div>
  )
}

export function LiteSpotify({
  episodeId,
  title,
  watchHref,
  type = "episode",
}: {
  episodeId: string
  title: string
  watchHref?: string
  type?: "episode" | "show"
}) {
  const [active, setActive] = useState(false)

  return (
    <div>
      <div className="relative h-[152px] w-full overflow-hidden rounded-xl bg-[#f5f1eb]">
        {active ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            style={{ borderRadius: "12px" }}
            src={`https://open.spotify.com/embed/${type}/${episodeId}?utm_source=generator`}
            title={title}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setActive(true)}
            aria-label={`Play on Spotify: ${title}`}
            className="group flex h-full w-full items-center justify-center gap-3 bg-[#405862]/5 transition-colors hover:bg-[#405862]/10"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1DB954] text-white shadow-md transition-transform group-hover:scale-110">
              <Play className="h-5 w-5 translate-x-0.5 fill-current" />
            </span>
            <span className="text-sm font-medium text-[#405862]">Play on Spotify</span>
          </button>
        )}
      </div>
      {watchHref && <OpenFullPageLink href={watchHref} />}
    </div>
  )
}
