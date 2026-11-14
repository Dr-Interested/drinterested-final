"use client"

import { useEffect, useRef, useState } from "react"
import { Pause, Play } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * A short, muted, looping clip used as moving photography. It only downloads and plays while
 * on screen, has a small pause button (anything that moves for more than five seconds must be
 * pausable), and people who prefer reduced motion get the still poster until they press play.
 * Render it inside a positioned (relative) container.
 */
export function BgVideo({
  src,
  poster,
  className,
  label,
}: {
  src: string
  poster: string
  className?: string
  /** Describes the clip for screen readers; omit for purely decorative clips. */
  label?: string
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const [inView, setInView] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [userPaused, setUserPaused] = useState(false)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setUserPaused(true)
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: "150px" })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (inView && !userPaused) {
      if (!el.getAttribute("src")) el.setAttribute("src", src)
      el.play().catch(() => {})
    } else {
      el.pause()
    }
  }, [inView, userPaused, src])

  return (
    <>
      <video
        ref={ref}
        className={cn("h-full w-full object-cover", className)}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        aria-label={label}
        aria-hidden={label ? undefined : true}
      />
      <button
        type="button"
        onClick={() => setUserPaused((p) => !p)}
        aria-label={playing ? "Pause video" : "Play video"}
        className="absolute right-2 top-2 z-10 grid h-8 w-8 place-items-center rounded-full bg-white/85 text-ink shadow-sm backdrop-blur transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-deep"
      >
        {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 translate-x-px" />}
      </button>
    </>
  )
}
