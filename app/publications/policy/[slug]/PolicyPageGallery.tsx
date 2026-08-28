"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import type { PolicyPageImage } from "@/data/policy-submissions"

export default function PolicyPageGallery({ label, pages }: { label: string; pages: PolicyPageImage[] }) {
  const [index, setIndex] = useState<number | null>(null)
  const open = index !== null
  const current = index !== null ? pages[index] : null

  return (
    <>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {pages.map((page, i) => (
          <button
            key={page.file}
            type="button"
            onClick={() => setIndex(i)}
            className="relative rounded-lg overflow-hidden border border-[#405862]/15 shadow-sm group bg-white"
            style={{ aspectRatio: `${page.w} / ${page.h}` }}
            aria-label={`View page ${i + 1} of ${label} at full size`}
          >
            <Image
              src={page.file}
              alt={`${label} — page ${i + 1} of ${pages.length}, official OHCHR submission by Dr. Interested`}
              fill
              sizes="(max-width: 640px) 33vw, 220px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute bottom-1 right-1.5 text-[10px] font-bold text-white bg-black/60 rounded px-1.5 py-0.5">
              {i + 1}
            </div>
          </button>
        ))}
      </div>

      <Dialog open={open} onOpenChange={(v) => !v && setIndex(null)}>
        <DialogContent className="max-w-3xl w-[95vw] p-0 bg-black border-0 overflow-hidden text-white">
          <DialogTitle className="sr-only">
            {label} — page {index !== null ? index + 1 : ""}
          </DialogTitle>
          {current && index !== null && (
            <div className="relative w-full flex items-center justify-center bg-black" style={{ minHeight: "60vh" }}>
              <div className="relative w-full" style={{ aspectRatio: `${current.w} / ${current.h}`, maxHeight: "85vh" }}>
                <Image
                  src={current.file}
                  alt={`${label} — page ${index + 1} of ${pages.length}, official OHCHR submission by Dr. Interested`}
                  fill
                  sizes="95vw"
                  className="object-contain"
                  priority
                />
              </div>
              {pages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setIndex((index - 1 + pages.length) % pages.length)}
                    aria-label="Previous page"
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/60 hover:bg-black/80 text-white p-2 transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIndex((index + 1) % pages.length)}
                    aria-label="Next page"
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/60 hover:bg-black/80 text-white p-2 transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 text-xs text-white/80 bg-black/60 rounded-full px-3 py-1">
                    Page {index + 1} / {pages.length}
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
