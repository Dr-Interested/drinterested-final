"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Quote } from "@/lib/media"
import { cn } from "@/lib/utils"

/** One quote at a time, changing every few seconds; pauses while hovered or focused. */
export function QuoteCarousel({ quotes, className, dark = false }: { quotes: Quote[]; className?: string; dark?: boolean }) {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduce = useReducedMotion()
  const q = quotes[i]

  useEffect(() => {
    if (paused || reduce) return
    const t = setTimeout(() => setI((n) => (n + 1) % quotes.length), 7500)
    return () => clearTimeout(t)
  }, [i, paused, reduce, quotes.length])

  const go = (d: number) => setI((n) => (n + d + quotes.length) % quotes.length)
  const text = dark ? "text-white" : "text-ink"
  const sub = dark ? "text-white/80" : "text-ink/85"

  return (
    <figure
      className={cn("relative", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      <span aria-hidden="true" className={cn("block font-display text-6xl leading-none -mb-4", dark ? "text-teal" : "text-teal")}>
        &ldquo;
      </span>
      <div className="min-h-[9.5rem] sm:min-h-[8rem]" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
          >
            <blockquote className={cn("font-display text-lg sm:text-xl leading-snug font-medium", text)}>{q.quote}</blockquote>
            <figcaption className={cn("mt-3 text-sm", sub)}>
              {q.who}
              {q.topic && <span className="ml-2 rounded-full bg-teal/15 px-2 py-0.5 text-xs font-medium text-teal-deep">{q.topic}</span>}
            </figcaption>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous quote"
          className={cn("rounded-full border p-1.5 transition", dark ? "border-white/30 hover:bg-white/10" : "border-ink/20 hover:bg-cream")}
        >
          <ChevronLeft className={cn("h-4 w-4", text)} />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next quote"
          className={cn("rounded-full border p-1.5 transition", dark ? "border-white/30 hover:bg-white/10" : "border-ink/20 hover:bg-cream")}
        >
          <ChevronRight className={cn("h-4 w-4", text)} />
        </button>
        <div className="flex gap-1.5 ml-1" aria-hidden="true">
          {quotes.map((_, n) => (
            <span
              key={n}
              className={cn("h-1.5 rounded-full transition-all", n === i ? "w-5 bg-teal" : cn("w-1.5", dark ? "bg-white/30" : "bg-ink/20"))}
            />
          ))}
        </div>
        <span className={cn("ml-auto text-xs tabular-nums", sub)}>
          {i + 1} / {quotes.length}
        </span>
      </div>
    </figure>
  )
}
