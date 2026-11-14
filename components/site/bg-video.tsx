"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

/**
 * A short, muted, looping clip used as moving photography. It only downloads and plays while
 * on screen, and people who prefer reduced motion get the still poster instead.
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
  const [active, setActive] = useState(false)
  const [reduce, setReduce] = useState(false)

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setActive(true)
        if (!el.src && !entry.isIntersecting) return
        if (entry.isIntersecting) el.play().catch(() => {})
        else el.pause()
      },
      { rootMargin: "200px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <video
      ref={ref}
      className={cn("h-full w-full object-cover", className)}
      poster={poster}
      src={active && !reduce ? src : undefined}
      muted
      loop
      playsInline
      autoPlay={!reduce}
      preload="none"
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  )
}
