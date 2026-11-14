import type React from "react"
import { cn } from "@/lib/utils"

/**
 * An endless, slow scroller. The content is rendered twice and the track moves by half its
 * length, so the loop is seamless. Pauses on hover; stops for reduced-motion users (globals.css).
 */
export function Marquee({
  children,
  reverse = false,
  vertical = false,
  duration = 60,
  className,
  trackClassName,
}: {
  children: React.ReactNode
  reverse?: boolean
  vertical?: boolean
  duration?: number
  className?: string
  trackClassName?: string
}) {
  return (
    <div className={cn("overflow-hidden", vertical ? "edge-fade-y" : "edge-fade-x", className)}>
      <div
        className={cn(
          "marquee-track flex w-max",
          vertical ? "flex-col h-max w-full animate-marquee-y" : reverse ? "animate-marquee-reverse" : "animate-marquee",
          trackClassName,
        )}
        style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
      >
        <div className={cn("flex shrink-0", vertical ? "flex-col" : "")}>{children}</div>
        <div className={cn("flex shrink-0", vertical ? "flex-col" : "")} aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  )
}
