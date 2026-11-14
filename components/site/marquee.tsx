"use client"

import { useState } from "react"
import type React from "react"
import { Pause, Play } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * An endless, slow scroller. The content is rendered twice and the track moves by half its
 * length, so the loop is seamless. It pauses on hover and keyboard focus, has an optional pause
 * button (`controls`), and stops entirely for reduced-motion users (globals.css).
 */
export function Marquee({
  children,
  reverse = false,
  vertical = false,
  duration = 60,
  controls = false,
  label = "scrolling photos",
  className,
  trackClassName,
}: {
  children: React.ReactNode
  reverse?: boolean
  vertical?: boolean
  duration?: number
  controls?: boolean
  label?: string
  className?: string
  trackClassName?: string
}) {
  const [paused, setPaused] = useState(false)
  return (
    <div className={cn("group/marquee relative", className)}>
      <div className={cn("overflow-hidden", vertical ? "edge-fade-y" : "edge-fade-x")}>
        <div
          className={cn(
            "marquee-track flex w-max",
            vertical ? "flex-col h-max w-full animate-marquee-y" : reverse ? "animate-marquee-reverse" : "animate-marquee",
            trackClassName,
          )}
          style={{ "--marquee-duration": `${duration}s`, animationPlayState: paused ? "paused" : undefined } as React.CSSProperties}
        >
          <div className={cn("flex shrink-0", vertical ? "flex-col" : "")}>{children}</div>
          <div className={cn("flex shrink-0", vertical ? "flex-col" : "")} aria-hidden="true">
            {children}
          </div>
        </div>
      </div>
      {controls && (
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? `Play ${label}` : `Pause ${label}`}
          className="absolute right-3 top-2 z-10 grid h-7 w-7 place-items-center rounded-full bg-white/90 text-ink shadow-sm opacity-80 transition hover:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-deep"
        >
          {paused ? <Play className="h-3 w-3 translate-x-px" /> : <Pause className="h-3 w-3" />}
        </button>
      )}
    </div>
  )
}
