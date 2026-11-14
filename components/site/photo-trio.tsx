import Image from "next/image"
import type { Photo } from "@/lib/media"
import { cn } from "@/lib/utils"

/** Three photos in a loose row, slightly tilted, for page headers. */
export function PhotoTrio({ photos, className, priority = false }: { photos: [Photo, Photo, Photo]; className?: string; priority?: boolean }) {
  const tilt = ["-rotate-2", "rotate-1 md:-translate-y-3", "-rotate-1"]
  return (
    <div className={cn("mx-auto grid max-w-3xl grid-cols-3 gap-2 sm:gap-4", className)}>
      {photos.map((ph, i) => (
        <figure
          key={ph.src}
          className={cn("relative aspect-[4/3] overflow-hidden rounded-xl border-[3px] border-white shadow-md sm:rounded-2xl sm:border-4", tilt[i])}
        >
          <Image src={ph.src} alt={ph.alt} fill sizes="(max-width: 640px) 33vw, 260px" className="object-cover" priority={priority} />
        </figure>
      ))}
    </div>
  )
}
