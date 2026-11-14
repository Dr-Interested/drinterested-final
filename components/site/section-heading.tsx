import type React from "react"
import { cn } from "@/lib/utils"

/** Eyebrow, heading and an optional line of context, left aligned by default. */
export function SectionHeading({
  eyebrow,
  title,
  children,
  center = false,
  className,
  as: Tag = "h2",
}: {
  eyebrow?: string
  title: React.ReactNode
  children?: React.ReactNode
  center?: boolean
  className?: string
  as?: "h1" | "h2" | "h3"
}) {
  return (
    <div className={cn("mb-6 md:mb-8", center && "text-center mx-auto max-w-2xl", className)}>
      {eyebrow && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-teal-deep">{eyebrow}</p>
      )}
      <Tag className="text-2xl md:text-3xl font-semibold text-ink leading-tight">{title}</Tag>
      {children && <div className="mt-2 text-ink/70 text-[15px] leading-relaxed max-w-2xl">{children}</div>}
    </div>
  )
}
