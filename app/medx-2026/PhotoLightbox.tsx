"use client"

import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import type { GalleryImage } from "./data"

type LightboxState = { images: GalleryImage[]; index: number; caption?: string }

export default function PhotoLightbox({
  state,
  onClose,
  onNavigate,
}: {
  state: LightboxState | null
  onClose: () => void
  onNavigate: (index: number) => void
}) {
  const open = !!state
  const current = state?.images[state.index]

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-4xl w-[95vw] p-0 bg-black border-0 overflow-hidden text-white">
        <DialogTitle className="sr-only">{state?.caption ?? "Conference photo"}</DialogTitle>
        {current && (
          <div className="relative w-full flex items-center justify-center bg-black" style={{ minHeight: "50vh" }}>
            <div className="relative w-full" style={{ aspectRatio: `${current.w} / ${current.h}`, maxHeight: "85vh" }}>
              <Image
                src={current.file}
                alt={state?.caption ?? "MedExplore 2026 conference photo"}
                fill
                sizes="95vw"
                className="object-contain"
                priority
              />
            </div>

            {state && state.images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => onNavigate((state.index - 1 + state.images.length) % state.images.length)}
                  aria-label="Previous photo"
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/60 hover:bg-black/80 text-white p-2 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate((state.index + 1) % state.images.length)}
                  aria-label="Next photo"
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/60 hover:bg-black/80 text-white p-2 transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 text-xs text-white/80 bg-black/60 rounded-full px-3 py-1">
                  {state.index + 1} / {state.images.length}
                </div>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
