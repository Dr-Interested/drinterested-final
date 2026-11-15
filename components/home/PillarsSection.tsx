import Image from "@/components/site/img"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Marquee } from "@/components/site/marquee"
import { Reveal } from "@/components/site/reveal"
import { SectionHeading } from "@/components/site/section-heading"
import { HEALTHCARE_DEFINITION, PILLARS } from "@/lib/impact-stats"
import { AS_SEEN_IN, PHOTOS } from "@/lib/media"

const PILLAR_MEDIA = {
  career: { photo: PHOTOS.medexplore[1], href: "/medx-2026", link: "MedExplore 2026" },
  policy: { photo: PHOTOS.awards[0], href: "/our-work#pillars", link: "Youth in policy" },
  community: { photo: PHOTOS.community[0], href: "/events/community-2026", link: "Out in the community" },
} as const

export default function PillarsSection() {
  return (
    <>
      {/* Where we've been seen and listed, scrolling quietly under the hero. */}
      <div className="border-y border-ink/10 bg-white py-3">
        <Marquee duration={45}>
          {AS_SEEN_IN.map((name) => (
            <span key={name} className="mx-5 inline-flex items-center gap-5 whitespace-nowrap text-sm font-medium text-ink/85">
              {name}
              <span aria-hidden="true" className="h-1 w-1 rounded-full bg-teal" />
            </span>
          ))}
        </Marquee>
      </div>

      <section className="py-12 md:py-16">
        <div className="container">
          <SectionHeading eyebrow="What we do" title="Three pillars, one community">
            {HEALTHCARE_DEFINITION} Every program we run fits at least one pillar; the best fit all three.
          </SectionHeading>
          <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:px-0 md:pb-0">
            {PILLARS.map((p, i) => {
              const m = PILLAR_MEDIA[p.id]
              return (
                <Reveal key={p.id} delay={i * 0.06} as="article" className="group w-[82%] shrink-0 snap-start overflow-hidden rounded-2xl bg-cream/70 ring-1 ring-ink/5 md:w-auto">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={m.photo.src}
                      alt={m.photo.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-0.5 text-[11px] font-semibold text-ink">
                      Pillar {p.number}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-ink">{p.name}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink/85">{p.description}</p>
                    <Link href={m.href} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-teal-deep hover:text-ink">
                      {m.link}
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
