"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import ScrollToTop from "@/components/scroll-to-top"
import SeoSchema from "@/components/seo-schema"
import NewsletterForm from "@/components/newsletter-form"
import MediaCard, { type MediaItem } from "@/components/publications/media-card"
import ContentCard, { type Publication } from "@/components/publications/content-card"

export type { MediaItem, Publication }

const PREVIEW_COUNT = 6

/** Shared per-category header: clickable title + a real "View all" button, not a text link. */
function CategorySectionHeader({
  title,
  description,
  href,
  totalCount,
  itemLabel,
}: {
  title: string
  description: string
  href: string
  totalCount: number
  itemLabel: string
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-5 mb-8">
      <div>
        <Link href={href} className="inline-block group">
          <h2 className="text-2xl font-bold text-[#405862] group-hover:text-[#4ecdc4] transition-colors">
            {title}
          </h2>
          <div className="w-24 h-1 bg-[#4ecdc4] mt-2"></div>
        </Link>
        <p className="text-[#405862]/80 mt-4 max-w-2xl">{description}</p>
      </div>
      {totalCount > PREVIEW_COUNT && (
        <Link
          href={href}
          className="inline-flex items-center gap-2 bg-[#405862] hover:bg-[#4ecdc4] text-white font-semibold px-5 py-3 rounded-full shadow-sm hover:shadow-md transition-all whitespace-nowrap flex-shrink-0"
        >
          View All {totalCount} {itemLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  )
}

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
            <CategorySectionHeader
              title="Policy Work"
              description="Our policy reports, joint statements, and inputs to government bodies and organizations."
              href="/publications/policy"
              totalCount={policyWork.length}
              itemLabel="Policy Items"
            />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {policyWork.slice(0, PREVIEW_COUNT).map((post, index) => (
                <ContentCard key={post.slug} post={post} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Op-Eds Section */}
      {opEds.length > 0 && (
        <section id="op-eds" className={policyWork.length > 0 ? "py-16 bg-[#f5f1eb]" : "py-16 bg-white"}>
          <div className="container">
            <CategorySectionHeader
              title="Op-Eds"
              description="Opinion pieces and thought leadership from Dr. Interested on healthcare policy and youth engagement."
              href="/publications/op-eds"
              totalCount={opEds.length}
              itemLabel="Op-Eds"
            />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {opEds.slice(0, PREVIEW_COUNT).map((post, index) => (
                <ContentCard key={post.slug} post={post} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Blog Section */}
      {blogs.length > 0 && (
        <section id="blog" className="py-16 bg-white">
          <div className="container">
            <CategorySectionHeader
              title="Blog"
              description="Explore insights, research, and information about healthcare careers, medical advancements, and educational opportunities."
              href="/publications/blog"
              totalCount={blogs.length}
              itemLabel="Posts"
            />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.slice(0, PREVIEW_COUNT).map((post, index) => (
                <ContentCard key={post.slug} post={post} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Webinars Section */}
      {webinars.length > 0 && (
        <section id="webinars" className="py-16 bg-[#f5f1eb]">
          <div className="container">
            <CategorySectionHeader
              title="Webinars"
              description="Recordings from the Dr. Interested Webinar Series and Code Blue Planet 2026."
              href="/publications/webinars"
              totalCount={webinars.length}
              itemLabel="Webinars"
            />
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
            <CategorySectionHeader
              title="Podcasts"
              description="Every episode of the Dr. Interested Podcast, written and hosted by our members."
              href="/publications/podcasts"
              totalCount={podcasts.length}
              itemLabel="Episodes"
            />
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
