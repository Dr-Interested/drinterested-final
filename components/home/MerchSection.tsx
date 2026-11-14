import Image from "next/image"
import { ExternalLink } from "lucide-react"
import { Reveal } from "@/components/site/reveal"

const ITEMS = [
  { src: "/tshirt.jpg", alt: "Dr. Interested t-shirt" },
  { src: "/hoodie.jpg", alt: "Dr. Interested hoodie" },
  { src: "/sticker.jpg", alt: "Dr. Interested sticker" },
  { src: "/mug.jpg", alt: "Dr. Interested mug" },
]

/** A compact merch strip: four products and one link out. */
export default function MerchSection() {
  return (
    <section className="pb-10 md:pb-14">
      <div className="container">
        <Reveal className="grid items-center gap-5 rounded-3xl bg-cream/70 p-5 ring-1 ring-ink/5 md:grid-cols-[1fr_auto] md:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex -space-x-3">
              {ITEMS.map((it, i) => (
                <div
                  key={it.src}
                  className="relative h-16 w-16 overflow-hidden rounded-2xl border-2 border-cream bg-white shadow-sm sm:h-20 sm:w-20"
                  style={{ transform: `rotate(${[-4, 2, -2, 4][i]}deg)` }}
                >
                  <Image src={it.src} alt={it.alt} fill sizes="80px" className="object-contain p-1.5" />
                </div>
              ))}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-ink md:text-xl">Wear the mission</h2>
              <p className="text-sm text-ink/70">T-shirts, hoodies, stickers and mugs. Every order supports our free programs.</p>
            </div>
          </div>
          <a
            href="https://www.teepublic.com/user/dr-interested"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/20 bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:border-ink/40"
          >
            Shop on TeePublic
            <ExternalLink className="h-4 w-4" />
          </a>
        </Reveal>
      </div>
    </section>
  )
}
