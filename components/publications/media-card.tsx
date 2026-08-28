import type { SVGProps } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import SafeImage from "@/components/safe-image"

export type MediaItem = {
  id: string
  slug: string
  title: string
  description: string
  date: string
  thumbnailPath: string
  youtubeUrl: string
  spotifyUrl?: string
  speaker?: string
}

const YoutubeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
)

const SpotifyIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
  </svg>
)

export default function MediaCard({ item, index, href }: { item: MediaItem; index: number; href: string }) {
  return (
    <Card className="overflow-hidden border-[#405862]/20 hover:shadow-lg transition-all duration-300 hover:border-[#405862] flex flex-col h-full group">
      <Link href={href} className="relative h-48 w-full bg-[#f5f1eb] block">
        <SafeImage
          src={item.thumbnailPath}
          fallbackSrc="/websitebanner.jpg"
          alt={item.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          priority={index < 6}
        />
      </Link>
      <CardContent className="p-6 flex flex-col flex-grow">
        <div>
          <Link href={href} className="block group-hover:text-[#4ecdc4] transition-colors">
            <h3 className="text-lg font-bold mb-2 text-[#405862] group-hover:text-[#4ecdc4] transition-colors">
              {item.title}
            </h3>
          </Link>
          <p className="text-[#405862]/80 mb-3 text-sm leading-relaxed line-clamp-3">{item.description}</p>
          <p className="text-xs text-[#405862]/60 mb-4">
            {item.speaker && <span className="font-medium">{item.speaker} &middot; </span>}
            {item.date}
          </p>
        </div>
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-[#405862]/10">
          <Link href={href} className="text-[#4ecdc4] hover:text-[#405862] transition-colors text-sm font-medium">
            View Episode
          </Link>
          <div className="flex items-center gap-2">
            <a
              href={item.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Watch "${item.title}" on YouTube`}
              className="text-[#405862]/50 hover:text-red-600 transition-colors"
            >
              <YoutubeIcon className="h-5 w-5" />
            </a>
            {item.spotifyUrl && (
              <a
                href={item.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Listen to "${item.title}" on Spotify`}
                className="text-[#405862]/50 hover:text-green-600 transition-colors"
              >
                <SpotifyIcon className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
