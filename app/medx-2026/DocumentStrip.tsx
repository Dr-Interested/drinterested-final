"use client"

import { useState } from "react"
import Image from "next/image"
import { Download } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import type { SupportDocument } from "./data"

function docAlt(doc: SupportDocument) {
  const kind = doc.category === "letters" ? "Letter of support" : "Certificate of recognition"
  return `${kind} from ${doc.name}, ${doc.role} — Dr. Interested MedExplore 2026 Conference (MedX 2026), August 16, 2026`
}

export default function DocumentStrip({ documents }: { documents: SupportDocument[] }) {
  const [active, setActive] = useState<SupportDocument | null>(null)
  // duplicate the list so the CSS marquee can loop seamlessly
  const track = [...documents, ...documents]

  return (
    <>
      <div className="doc-marquee">
        <div className="doc-marquee__track">
          {track.map((doc, i) => (
            <button
              key={`${doc.slug}-${i}`}
              type="button"
              onClick={() => setActive(doc)}
              className="doc-marquee__card"
              aria-label={`View ${doc.category === "letters" ? "letter" : "certificate"} from ${doc.name}`}
            >
              <div className="relative w-full aspect-[17/22] rounded-lg overflow-hidden border border-[#405862]/15 shadow-sm bg-white">
                <Image
                  src={doc.image}
                  alt={docAlt(doc)}
                  fill
                  sizes="180px"
                  className="object-cover object-top"
                  loading="lazy"
                />
              </div>
              <p className="mt-2 text-xs font-bold text-[#405862] dark:text-white leading-tight">{doc.name}</p>
              <p className="text-[10px] text-muted-foreground leading-tight">{doc.role}</p>
            </button>
          ))}
        </div>
      </div>

      <Dialog open={!!active} onOpenChange={(v) => !v && setActive(null)}>
        <DialogContent className="max-w-2xl w-[92vw] p-0 bg-white dark:bg-[#11161d] border-0 overflow-hidden">
          <DialogTitle className="sr-only">
            {active ? `${active.category === "letters" ? "Letter" : "Certificate"} from ${active.name}` : "Document"}
          </DialogTitle>
          {active && (
            <div className="relative">
              <div
                className="relative w-full bg-[#f5f1eb] dark:bg-black"
                style={{ aspectRatio: `${active.w} / ${active.h}`, maxHeight: "80vh" }}
              >
                <Image
                  src={active.image}
                  alt={docAlt(active)}
                  fill
                  sizes="90vw"
                  className="object-contain"
                />
              </div>
              <div className="flex items-center justify-between gap-4 p-4 border-t border-[#405862]/10">
                <div>
                  <p className="font-bold text-[#405862] dark:text-white text-sm">{active.name}</p>
                  <p className="text-xs text-muted-foreground">{active.role}</p>
                </div>
                {active.pdf && (
                  <a
                    href={active.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#405862] dark:text-[#4ecdc4] hover:underline flex-shrink-0"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Open original PDF
                  </a>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
