"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Award,
  Heart,
  Share2,
  Check,
  Instagram,
  Newspaper,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import NewsletterForm from "@/components/newsletter-form"
import PageBreadcrumb from "@/components/page-breadcrumb"
import PhotoLightbox from "./PhotoLightbox"
import DocumentStrip from "./DocumentStrip"
import { AGENDA, HIGHLIGHT_PHOTOS, HERO_PHOTO, LETTERS, CERTIFICATES, galleryFor, type GalleryImage } from "./data"

type LightboxState = { images: GalleryImage[]; index: number; caption?: string; context?: string }

const PRESS_URL =
  "https://www.insauga.com/mississauga-teen-starts-global-organization-helping-students-explore-healthcare-careers/"
const INSTAGRAM_URL = "https://www.instagram.com/dr.interested/"

const EVENT_CONTEXT =
  "Dr. Interested MedExplore 2026 Conference (MedX 2026) — University of Toronto Mississauga, Davis Building — Sunday, August 16, 2026"

function photoAlt(caption: string, index: number, total: number) {
  return `${caption} — ${EVENT_CONTEXT}${total > 1 ? ` (photo ${index + 1} of ${total})` : ""}`
}

function AgendaPhotoGrid({
  images,
  caption,
  onOpen,
}: {
  images: GalleryImage[]
  caption: string
  onOpen: (state: LightboxState) => void
}) {
  if (images.length === 0) return null
  const MAX_PREVIEW = 6
  const preview = images.slice(0, MAX_PREVIEW)
  const remaining = images.length - MAX_PREVIEW

  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-3">
      {preview.map((img, i) => {
        const isLastWithMore = i === MAX_PREVIEW - 1 && remaining > 0
        return (
          <button
            key={img.file}
            type="button"
            onClick={() => onOpen({ images, index: i, caption, context: EVENT_CONTEXT })}
            className="relative aspect-square rounded-lg overflow-hidden border border-[#405862]/15 group"
            aria-label={isLastWithMore ? `View all ${images.length} photos` : `View photo from ${caption}`}
          >
            <Image
              src={img.file}
              alt={photoAlt(caption, i, images.length)}
              fill
              sizes="(max-width: 640px) 33vw, 140px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            {isLastWithMore && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-sm">
                +{remaining}
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}

export default function MedXConferenceClient() {
  const [copied, setCopied] = useState(false)
  const [lightbox, setLightbox] = useState<LightboxState | null>(null)

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "MedExplore 2026 Recap | Dr. Interested",
          text: "See how MedExplore 2026 (MedX 2026) went at UTM on August 16th!",
          url: window.location.href,
        })
      } catch (err) {
        copyToClipboard()
      }
    } else {
      copyToClipboard()
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f1eb] via-white to-[#f5f1eb]/40 dark:from-[#080b0e] dark:via-[#0c1015] dark:to-[#080b0e] text-[#405862] dark:text-[#f1ece7] pb-20">
      {/* Top Banner Navigation back to Main Site */}
      <div className="bg-[#405862] text-white py-2.5 px-4 shadow-inner">
        <div className="container max-w-6xl mx-auto flex items-center justify-between text-xs md:text-sm">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-medium hover:text-[#4ecdc4] transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Return to Main Website</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-white/70">Organized by Dr. Interested</span>
            <Button
              onClick={handleShare}
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-white hover:text-[#4ecdc4] hover:bg-white/10 px-2"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 mr-1 text-[#4ecdc4]" /> Link Copied!
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5 mr-1" /> Share
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="container max-w-6xl mx-auto px-4 pt-3">
        <PageBreadcrumb
          items={[
            { name: "Home", href: "/" },
            { name: "Events", href: "/events" },
            { name: "MedExplore 2026 Recap", href: "/medx-2026" },
          ]}
        />
      </div>

      {/* Hero Section */}
      <section className="relative pt-4 pb-12 md:pt-8 md:pb-16 overflow-hidden border-b border-[#4ecdc4]/20">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#4ecdc4]/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 right-10 w-[300px] h-[300px] bg-[#405862]/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="container max-w-6xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-12 gap-6 md:gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 text-left space-y-6">
              <div className="flex flex-wrap items-center gap-2.5">
                <Badge className="bg-[#4ecdc4] hover:bg-[#3dbcb3] text-[#405862] font-semibold px-3 py-1 text-xs md:text-sm rounded-full shadow-sm">
                  Event Recap
                </Badge>
                <Badge variant="outline" className="border-[#405862]/30 text-[#405862] dark:text-[#f1ece7] px-3 py-1 text-xs rounded-full">
                  Formerly Promoted as MedX 2026
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 md:w-16 md:h-16 flex-shrink-0">
                    <Image src="/medx.png" alt="Dr. Interested MedExplore Logo" fill className="object-contain" priority />
                  </div>
                  <div>
                    <h2 className="text-[#4ecdc4] font-extrabold tracking-wider uppercase text-sm md:text-base">
                      Dr. Interested Presents
                    </h2>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#405862] dark:text-white leading-tight tracking-tight">
                      MedExplore 2026 <span className="text-[#4ecdc4]">Recap</span>
                    </h1>
                  </div>
                </div>

                <p className="text-lg md:text-xl font-medium text-[#405862]/90 dark:text-[#f1ece7]/90">
                  The Dr. Interested MedExplore 2026 Conference{" "}
                  <span className="italic text-muted-foreground">(known as MedX 2026 at the time)</span> has come and gone!
                </p>
              </div>

              <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl text-pretty">
                On Sunday, August 16, 2026, over 100 students, 23 speakers, guests, and panelists, and a team of 17
                volunteers came together at the University of Toronto Mississauga for a full day exploring careers in
                healthcare.
              </p>

              <div className="grid sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-white/80 dark:bg-[#11161d]/80 backdrop-blur-sm p-4 rounded-xl border border-[#4ecdc4]/20 shadow-sm flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-[#4ecdc4] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Date</p>
                    <p className="font-bold text-[#405862] dark:text-white text-sm md:text-base">Sun, Aug 16, 2026</p>
                  </div>
                </div>

                <div className="bg-white/80 dark:bg-[#11161d]/80 backdrop-blur-sm p-4 rounded-xl border border-[#4ecdc4]/20 shadow-sm flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-[#4ecdc4] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Location</p>
                    <p className="font-bold text-[#405862] dark:text-white text-sm md:text-base">UTM, Davis Building</p>
                  </div>
                </div>

                <div className="bg-white/80 dark:bg-[#11161d]/80 backdrop-blur-sm p-4 rounded-xl border border-[#4ecdc4]/20 shadow-sm flex items-start gap-3">
                  <Users className="h-5 w-5 text-[#4ecdc4] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Turnout</p>
                    <p className="font-bold text-[#405862] dark:text-white text-sm md:text-base">100+ students</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Stat Card + Hero Photo */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden border-2 border-[#4ecdc4]/40 shadow-2xl bg-white dark:bg-[#11161d]">
                <button
                  type="button"
                  onClick={() =>
                    setLightbox({
                      images: [HERO_PHOTO, ...HIGHLIGHT_PHOTOS],
                      index: 0,
                      caption: "MedExplore 2026 Recap",
                      context: EVENT_CONTEXT,
                    })
                  }
                  className="relative w-full aspect-[4/3] block group"
                >
                  <Image
                    src={HERO_PHOTO.file}
                    alt={`Students, speakers, and volunteers at the ${EVENT_CONTEXT}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 500px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    priority
                  />
                </button>
                <div className="p-5 md:p-6 grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-2xl md:text-3xl font-black text-[#405862] dark:text-white">100+</p>
                    <p className="text-[10px] md:text-xs text-muted-foreground uppercase font-semibold tracking-wide">
                      Students
                    </p>
                  </div>
                  <div className="border-x border-[#405862]/10">
                    <p className="text-2xl md:text-3xl font-black text-[#405862] dark:text-white">23</p>
                    <p className="text-[10px] md:text-xs text-muted-foreground uppercase font-semibold tracking-wide">
                      Speakers &amp; Guests
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl md:text-3xl font-black text-[#405862] dark:text-white">17</p>
                    <p className="text-[10px] md:text-xs text-muted-foreground uppercase font-semibold tracking-wide">
                      Volunteers
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Agenda Recap Section */}
      <section className="py-10 md:py-16 bg-[#f5f1eb]/60 dark:bg-[#0c1015]">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="text-center space-y-4 mb-10">
            <Badge className="bg-[#405862] text-[#4ecdc4] font-bold px-4 py-1 text-sm rounded-full">
              How the Day Went
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#405862] dark:text-white">
              Full Day Agenda Recap
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              From opening ceremonies to closing remarks, here&apos;s a look back at every session of MedExplore
              2026, with photos from the day.
            </p>
          </div>

          {HIGHLIGHT_PHOTOS.length > 0 && (
            <div className="mb-10">
              <AgendaPhotoGrid
                images={HIGHLIGHT_PHOTOS}
                caption="MedExplore 2026 Highlights"
                onOpen={setLightbox}
              />
            </div>
          )}

          <div className="space-y-3">
            {AGENDA.map((item) => {
              const images = galleryFor(item.gallerySlug)
              return (
                <div
                  key={`${item.time}-${item.session}`}
                  className="bg-white dark:bg-[#11161d] rounded-2xl border border-[#405862]/10 shadow-sm p-5 md:p-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-4">
                    <span className="text-sm font-extrabold text-[#4ecdc4] uppercase tracking-wide flex-shrink-0 sm:w-28">
                      {item.time}
                    </span>
                    <div className="flex-1">
                      <h3 className="font-bold text-[#405862] dark:text-white text-base md:text-lg">
                        {item.session}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-0.5">{item.who}</p>
                    </div>
                  </div>
                  <AgendaPhotoGrid images={images} caption={item.session} onOpen={setLightbox} />
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Letters of Support Section */}
      <section className="py-10 md:py-16 bg-white dark:bg-[#080b0e]">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center space-y-3 mb-8">
            <Badge className="bg-[#405862] text-[#4ecdc4] font-bold px-4 py-1 text-sm rounded-full">
              Letters of Support
            </Badge>
            <h2 className="text-3xl md:text-4xl font-black text-[#405862] dark:text-white">
              Messages From Elected Officials
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base text-pretty">
              Members of Parliament, MPPs, mayors, and councillors sent letters of support and welcome for
              MedExplore 2026. Tap any letter to read it in full.
            </p>
          </div>
          <DocumentStrip documents={LETTERS} />
        </div>
      </section>

      {/* Certificates Section */}
      <section className="py-10 md:py-16 bg-[#f5f1eb]/60 dark:bg-[#0c1015]">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center space-y-3 mb-8">
            <Badge className="bg-[#405862] text-[#4ecdc4] font-bold px-4 py-1 text-sm rounded-full">
              Certificates of Recognition
            </Badge>
            <h2 className="text-3xl md:text-4xl font-black text-[#405862] dark:text-white">
              Official Recognition
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base text-pretty">
              MedExplore 2026 was formally recognized by all levels of government. Tap any certificate to view it
              at full size.
            </p>
          </div>
          <DocumentStrip documents={CERTIFICATES} />
        </div>
      </section>

      {/* Thank You / Partners Section */}
      <section className="py-10 bg-white dark:bg-[#080b0e] border-t border-b border-[#4ecdc4]/20">
        <div className="container max-w-5xl mx-auto px-4 text-center space-y-8">
          <div>
            <Badge variant="secondary" className="bg-[#f5f1eb] dark:bg-[#161c24] text-[#405862] dark:text-[#4ecdc4] font-bold mb-2">
              Thank You
            </Badge>
            <h3 className="text-2xl font-extrabold text-[#405862] dark:text-white">
              None of This Would Have Been Possible Without
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-stretch justify-center">
            <div className="bg-[#f5f1eb]/50 dark:bg-[#11161d] p-5 rounded-2xl border border-[#405862]/10 shadow-xs flex flex-col items-center justify-between gap-3 min-h-[120px]">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Presented By</span>
              <div className="relative w-full h-10 flex-shrink-0">
                <Image src="/medx/dr-interested-logo.png" alt="Dr. Interested" fill className="object-contain" />
              </div>
              <span className="font-semibold text-xs text-[#405862] dark:text-white">Dr. Interested</span>
            </div>

            <div className="bg-[#f5f1eb]/50 dark:bg-[#11161d] p-5 rounded-2xl border border-[#405862]/10 shadow-xs flex flex-col items-center justify-between gap-3 min-h-[120px]">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Sponsored By</span>
              <div className="relative w-full h-12 flex-shrink-0">
                <Image src="/taking-it-global-logo.png" alt="TakingITGlobal" fill className="object-contain" />
              </div>
              <span className="font-semibold text-xs text-[#405862] dark:text-white">TakingITGlobal</span>
            </div>

            <div className="bg-[#f5f1eb]/50 dark:bg-[#11161d] p-5 rounded-2xl border border-[#405862]/10 shadow-xs flex flex-col items-center justify-between gap-3 min-h-[120px]">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Sponsored By</span>
              <div className="relative w-full h-12 flex-shrink-0">
                <Image src="/sprout-fellowship-logo.png" alt="Sprout Fellowship" fill className="object-contain" />
              </div>
              <span className="font-semibold text-xs text-[#405862] dark:text-white">Sprout Fellowship</span>
            </div>

            <div className="bg-[#f5f1eb]/50 dark:bg-[#11161d] p-5 rounded-2xl border border-[#405862]/10 shadow-xs flex flex-col items-center justify-between gap-3 min-h-[120px]">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Funded By</span>
              <div className="relative w-full h-12 flex-shrink-0">
                <Image
                  src="/medx/canada-service-corps-logo.png"
                  alt="Canada Service Corps"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-semibold text-xs text-[#405862] dark:text-white">Canada Service Corps</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground max-w-2xl mx-auto flex items-center justify-center gap-2">
            <Heart className="h-4 w-4 text-[#4ecdc4] flex-shrink-0" />
            And to every speaker, volunteer, and student who showed up on August 16th &mdash; thank you.
          </p>
        </div>
      </section>

      {/* Press Mention Section */}
      <section className="py-10 md:py-14 bg-[#f5f1eb]/60 dark:bg-[#0c1015]">
        <div className="container max-w-3xl mx-auto px-4">
          <a
            href={PRESS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col md:flex-row items-center gap-6 bg-white dark:bg-[#11161d] rounded-2xl border border-[#405862]/10 shadow-md p-6 md:p-8 hover:shadow-lg hover:border-[#4ecdc4]/40 transition-all group"
          >
            <div className="w-14 h-14 rounded-xl bg-[#4ecdc4]/15 flex items-center justify-center flex-shrink-0">
              <Newspaper className="h-7 w-7 text-[#405862] dark:text-[#4ecdc4]" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <p className="text-xs font-bold uppercase tracking-wide text-[#4ecdc4] mb-1">As Featured In insauga</p>
              <p className="font-bold text-[#405862] dark:text-white text-base md:text-lg leading-snug">
                &ldquo;Mississauga teen starts global organization helping students explore healthcare careers&rdquo;
              </p>
              <p className="text-xs text-muted-foreground mt-1">Published August 12, 2026</p>
            </div>
            <ExternalLink className="h-5 w-5 text-[#405862] dark:text-white flex-shrink-0 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </section>

      {/* Call To Action Section */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-[#405862] via-[#334852] to-[#405862] text-white">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center space-y-3 mb-8">
            <Award className="h-8 w-8 text-[#4ecdc4] mx-auto" />
            <h3 className="text-2xl md:text-3xl font-black">Don&apos;t Miss What&apos;s Next</h3>
            <p className="text-white/80 max-w-xl mx-auto text-sm md:text-base">
              Registration for MedExplore 2026 is closed, but that&apos;s not the end. Follow along and be the
              first to know about future Dr. Interested events.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <Link href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                className="bg-[#4ecdc4] hover:bg-[#3dbcb3] text-[#405862] font-extrabold px-8 py-6 rounded-xl text-base shadow-lg flex items-center gap-2"
              >
                <Instagram className="h-5 w-5" />
                Follow @dr.interested
              </Button>
            </Link>
            <Link href="/">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white text-white bg-white/10 hover:bg-white/20 font-semibold px-6 py-6 rounded-xl text-base"
              >
                Return to Main Website
              </Button>
            </Link>
          </div>

          <div className="bg-white dark:bg-[#11161d] rounded-2xl p-6 md:p-8 max-w-md mx-auto shadow-xl">
            <NewsletterForm compact darkMode={false} />
          </div>
        </div>
      </section>

      <PhotoLightbox
        state={lightbox}
        onClose={() => setLightbox(null)}
        onNavigate={(index) => setLightbox((prev) => (prev ? { ...prev, index } : prev))}
      />
    </div>
  )
}
