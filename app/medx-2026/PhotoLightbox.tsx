"use client"

import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import type { GalleryImage } from "./data"

type LightboxState = { images: GalleryImage[]; index: number; caption?: string; context?: string }

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
          <div className="flex flex-col">
            <div className="relative w-full flex items-center justify-center bg-black" style={{ minHeight: "50vh" }}>
              <div className="relative w-full" style={{ aspectRatio: `${current.w} / ${current.h}`, maxHeight: "80vh" }}>
                <Image
                  src={current.file}
                  alt={`${state?.caption ?? "MedExplore 2026 conference photo"} — ${
                    state?.context ??
                    "Dr. Interested MedExplore 2026 Conference (MedX 2026), University of Toronto Mississauga, August 16, 2026"
                  }${state && state.images.length > 1 ? ` (photo ${state.index + 1} of ${state.images.length})` : ""}`}
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

            {state?.caption && (
              <div className="px-4 py-3 bg-[#11161d] border-t border-white/10 text-center">
                <p className="text-sm font-semibold text-white">{state.caption}</p>
                <p className="text-xs text-white/60 mt-0.5">
                  Dr. Interested MedExplore 2026 Conference (MedX 2026) &middot; University of Toronto Mississauga,
                  Davis Building &middot; Sunday, August 16, 2026
                </p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
