"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, ChevronRight } from "lucide-react"
import ScrollToTop from "@/components/scroll-to-top"
import SeoSchema from "@/components/seo-schema"
import NewsletterForm from "@/components/newsletter-form"
import SafeImage from "@/components/safe-image"
import MediaCard, { type MediaItem } from "@/components/publications/media-card"

export type { MediaItem }

type Publication = {
  slug: string
  title: string
  excerpt: string
  content: string
  coverImage: string
  topic: string
  readingTime: string
  featured?: boolean
  contentType: string
  policyType?: string | null
  date: string
  author: {
    name: string
    image: string
    bio: string
    linkedIn?: string
    twitter?: string
    instagram?: string
  }
}

const ContentCard = ({ post, index, section }: { post: Publication; index: number; section: string }) => (
  <Card className="overflow-hidden border-[#405862]/20 hover:shadow-lg transition-all duration-300 hover:border-[#405862] flex flex-col h-full group">
    <div className="relative h-48 w-full bg-[#f5f1eb]">
      <SafeImage
        src={post.coverImage || "/websitebanner.jpg"}
        fallbackSrc="/websitebanner.jpg"
        alt={post.title}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-300"
        priority={index < 6}
      />
    </div>
    <CardContent className="p-6 flex flex-col flex-grow">
      <div>
        <div className="text-sm text-[#405862]/70 mb-2 flex items-center flex-wrap gap-2">
          <span className="bg-[#f5f1eb] px-2 py-1 rounded-full text-xs font-medium">{post.topic}</span>
          {post.policyType && (
            <span className="bg-[#e3f2fd] px-2 py-1 rounded-full text-xs font-medium text-[#1976d2]">
              {post.policyType.replace("-", " ")}
            </span>
          )}
          <span className="mx-1">•</span>
          <span className="flex items-center text-xs">
            <Clock className="h-3 w-3 mr-1" />
            {post.readingTime}
          </span>
        </div>
        <Link href={`/publications/${post.slug}`} className="block group-hover:text-[#4ecdc4] transition-colors">
          <h3 className="text-lg font-bold mb-2 text-[#405862] group-hover:text-[#4ecdc4] transition-colors">
            {post.title}
          </h3>
        </Link>
        <p className="text-[#405862]/80 mb-4 text-sm leading-relaxed line-clamp-3">{post.excerpt}</p>
      </div>
      <div className="mt-auto">
        <div className="flex items-center justify-between pt-4 border-t border-[#405862]/10">
          <div className="flex items-center">
            <div className="relative h-8 w-8 rounded-full overflow-hidden mr-2 bg-[#f5f1eb] flex-shrink-0">
              <SafeImage src={post.author.image || "/circle-logo.png"} alt={post.author.name} fill className="object-cover" />
            </div>
            <div>
              <span className="text-xs font-medium text-[#405862] block">{post.author.name}</span>
              <span className="text-xs text-[#405862]/70">{post.date}</span>
            </div>
          </div>
          <Link
            href={`/publications/${post.slug}`}
            className="text-[#4ecdc4] hover:text-[#405862] transition-colors text-sm font-medium"
          >
            Read
          </Link>
        </div>
      </div>
    </CardContent>
  </Card>
)

export default function PublicationsClientPage({
  policyWork = [],
  opEds = [],
  blogs = [],
  webinars = [],
  podcasts = [],
}: {
  policyWork: Publication[]
  opEds: Publication[]
  blogs: Publication[]
  webinars?: MediaItem[]
  podcasts?: MediaItem[]
}) {
  const PREVIEW_COUNT = 6

  const publicationsListingSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Dr. Interested Publications",
    description: "Explore blog posts, op-eds, and policy work on healthcare education and medical advocacy.",
    url: "https://www.drinterested.org/publications",
    isPartOf: {
      "@type": "WebSite",
      name: "Dr. Interested",
      url: "https://www.drinterested.org",
    },
  }

  return (
    <div>
      <ScrollToTop />
      <SeoSchema id="publications-listing-schema" schema={publicationsListingSchema} />

      {/* Hero Section */}
      <section className="hero-section bg-[#f5f1eb] py-10 md:py-16">
        <div className="container">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-[#405862] mb-4">
            Publications
          </h1>
          <p className="text-center text-lg text-[#405862]/80 max-w-2xl mx-auto mb-3">
            Explore our blog posts, op-eds, and policy work on healthcare education, medical advocacy, and systemic change.
          </p>
          <p className="text-center text-xs text-[#405862]/50 max-w-2xl mx-auto mb-8">
            Content on this page is for informational and entertainment purposes only and is not medical or career
            advice. See our{" "}
            <Link href="/terms" className="underline hover:text-[#405862]">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy-policy" className="underline hover:text-[#405862]">
              Privacy Policy
            </Link>{" "}
            for more information.
          </p>
        </div>
      </section>

      {/* Policy Work Section */}
      {policyWork.length > 0 && (
        <section id="policy-work" className="py-16 bg-white">
          <div className="container">
            <h2 className="text-2xl font-bold mb-8 text-[#405862]">
              Policy Work
              <div className="w-24 h-1 bg-[#4ecdc4] mt-2"></div>
            </h2>
            <p className="text-[#405862]/80 mb-8 max-w-2xl">
              Our policy reports, joint statements, and inputs to government bodies and organizations.
            </p>
            {policyWork.length === 0 ? (
              <p className="text-[#405862]/70 text-center py-12">No policy work published yet.</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {policyWork.map((post, index) => (
                  <ContentCard key={index} post={post} index={index} section="policy" />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Op-Eds Section */}
      {opEds.length > 0 && (
        <section id="op-eds" className={policyWork.length > 0 ? "py-16 bg-[#f5f1eb]" : "py-16 bg-white"}>
          <div className="container">
            <h2 className="text-2xl font-bold mb-8 text-[#405862]">
              Op-Eds
              <div className="w-24 h-1 bg-[#4ecdc4] mt-2"></div>
            </h2>
            <p className="text-[#405862]/80 mb-8 max-w-2xl">
              Opinion pieces and thought leadership from Dr. Interested on healthcare policy and youth engagement.
            </p>
            {opEds.length === 0 ? (
              <p className="text-[#405862]/70 text-center py-12">No op-eds published yet.</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {opEds.map((post, index) => (
                  <ContentCard key={index} post={post} index={index} section="op-ed" />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Blog Section */}
      {blogs.length > 0 && (
        <section id="blog" className={opEds.length > 0 || policyWork.length > 0 ? "py-16 bg-white" : "py-16 bg-white"}>
          <div className="container">
            <h2 className="text-2xl font-bold mb-8 text-[#405862]">
              Blog
              <div className="w-24 h-1 bg-[#4ecdc4] mt-2"></div>
            </h2>
            <p className="text-[#405862]/80 mb-8 max-w-2xl">
              Explore insights, research, and information about healthcare careers, medical advancements, and educational opportunities.
            </p>
            {blogs.length === 0 ? (
              <p className="text-[#405862]/70 text-center py-12">No blog posts published yet.</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((post, index) => (
                  <ContentCard key={index} post={post} index={index} section="blog" />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Webinars Section */}
      {webinars.length > 0 && (
        <section id="webinars" className="py-16 bg-[#f5f1eb]">
          <div className="container">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-[#405862]">
                  Webinars
                  <div className="w-24 h-1 bg-[#4ecdc4] mt-2"></div>
                </h2>
                <p className="text-[#405862]/80 mt-4 max-w-2xl">
                  Recordings from the Dr. Interested Webinar Series and Code Blue Planet 2026.
                </p>
              </div>
              {webinars.length > PREVIEW_COUNT && (
                <Link
                  href="/publications/webinars"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-[#405862] hover:text-[#4ecdc4] transition-colors whitespace-nowrap"
                >
                  View all {webinars.length} webinars <ChevronRight className="h-4 w-4" />
                </Link>
              )}
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {webinars.slice(0, PREVIEW_COUNT).map((item, index) => (
                <MediaCard key={item.id} item={item} index={index} href={`/watch/${item.slug}`} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Podcasts Section */}
      {podcasts.length > 0 && (
        <section id="podcasts" className="py-16 bg-white">
          <div className="container">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-[#405862]">
                  Podcasts
                  <div className="w-24 h-1 bg-[#4ecdc4] mt-2"></div>
                </h2>
                <p className="text-[#405862]/80 mt-4 max-w-2xl">
                  Every episode of the Dr. Interested Podcast, written and hosted by our members.
                </p>
              </div>
              {podcasts.length > PREVIEW_COUNT && (
                <Link
                  href="/publications/podcasts"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-[#405862] hover:text-[#4ecdc4] transition-colors whitespace-nowrap"
                >
                  View all {podcasts.length} episodes <ChevronRight className="h-4 w-4" />
                </Link>
              )}
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {podcasts.slice(0, PREVIEW_COUNT).map((item, index) => (
                <MediaCard key={item.id} item={item} index={index} href={`/listen/${item.slug}`} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="py-16 bg-[#405862] text-white">
        <div className="container max-w-4xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Never Miss Our Latest Publications</h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Subscribe to get the latest healthcare insights, policy updates, and thought leadership from our team.
          </p>
          <div className="max-w-md mx-auto mb-6">
            <NewsletterForm darkMode={true} showFirstName={false} compact={true} />
          </div>
          <p className="text-white/60 text-sm">
            Or join the conversation on our{" "}
            <Link
              href="https://discord.gg/pzbGRgsGXY"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white transition-colors"
            >
              Discord server
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  )
}
