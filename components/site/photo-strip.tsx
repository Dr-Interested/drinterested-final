import Image from "next/image"
import { Marquee } from "@/components/site/marquee"
import type { Photo } from "@/lib/media"
import { cn } from "@/lib/utils"

/** A slow, endless row of event photos with small captions. */
export function PhotoStrip({
  photos,
  reverse = false,
  duration = 70,
  height = "h-44 sm:h-56",
  className,
}: {
  photos: Photo[]
  reverse?: boolean
  duration?: number
  height?: string
  className?: string
}) {
  return (
    <Marquee reverse={reverse} duration={duration} className={className}>
      {photos.map((ph, i) => (
        <figure key={`${ph.src}-${i}`} className={cn("relative mx-1.5 aspect-[4/3] shrink-0 overflow-hidden rounded-xl bg-cream", height)}>
          <Image src={ph.src} alt={ph.alt} fill sizes="320px" className="object-cover" />
          {ph.caption && (
            <figcaption className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-medium text-ink shadow-sm">
              {ph.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </Marquee>
  )
}
