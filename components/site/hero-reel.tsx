"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Pause, Play } from "lucide-react"
import { cn } from "@/lib/utils"

export type ReelClip = { src: string; poster: string; label: string }

/**
 * Plays one short event clip after another, crossfading between them, with the event's name in
 * a chip. Only the clip on screen downloads; the next one is preloaded a moment before it is
 * needed. Pausable, and reduced-motion users see the first still instead. Render inside a
 * positioned container.
 */
export function HeroReel({ clips, className }: { clips: ReelClip[]; className?: string }) {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const [inView, setInView] = useState(true)
  const wrap = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPaused(true)
    const el = wrap.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const v = video.current
    if (!v) return
    if (paused || !inView) v.pause()
    else v.play().catch(() => {})
  }, [paused, inView, i])

  const next = () => setI((n) => (n + 1) % clips.length)
  const clip = clips[i]

  return (
    <div ref={wrap} className={cn("absolute inset-0 bg-ink", className)}>
      <AnimatePresence initial={false}>
        <motion.video
          key={clip.src}
          ref={video}
          className="absolute inset-0 h-full w-full object-cover"
          poster={clip.poster}
          src={clip.src}
          muted
          playsInline
          autoPlay={!paused}
          preload="auto"
          onEnded={next}
          aria-label={`Clip from ${clip.label}`}
          // framer sets the opacity on the client only; the difference is expected.
          suppressHydrationWarning
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.span
          key={clip.label}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.3 }}
          className="absolute left-3 top-3 z-10 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-[#405862] shadow-sm"
        >
          {clip.label}
        </motion.span>
      </AnimatePresence>

      <div className="absolute right-2 top-2 z-10 flex items-center gap-2">
        <div className="hidden gap-1 sm:flex" aria-hidden="true">
          {clips.map((c, n) => (
            <span key={c.src} className={cn("h-1.5 rounded-full transition-all", n === i ? "w-4 bg-white" : "w-1.5 bg-white/60")} />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? "Play videos" : "Pause videos"}
          className="grid h-8 w-8 place-items-center rounded-full bg-white/85 text-[#405862] shadow-sm backdrop-blur hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-deep"
        >
          {paused ? <Play className="h-3.5 w-3.5 translate-x-px" /> : <Pause className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  )
}
