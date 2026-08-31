import type { Metadata } from "next"
import { generateSeoMetadata } from "@/lib/seo-utils"
import { supabase } from "@/lib/supabase-client"
import Link from "next/link"
import { Calendar, Clock, ArrowLeft, Share2 } from "lucide-react"
import ScrollToTop from "@/components/scroll-to-top"
import NewsletterForm from "@/components/newsletter-form"
import ReactMarkdown from "react-markdown"
import SeoSchema from "@/components/seo-schema"
import PageBreadcrumb from "@/components/page-breadcrumb"
import SafeImage from "@/components/safe-image"
import { resolvePublicationAuthor } from "@/lib/author-backfill"
import { normalizeMarkdown } from "@/lib/markdown-utils"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const { data: publication } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .single()

  if (!publication) {
    return { title: "Publication Not Found" }
  }

  const contentTypeLabel =
    publication.content_type === "op-ed" ? "Op-Ed" : publication.content_type === "policy" ? "Policy Work" : "Blog"

  // Real, per-post keywords — title terms + topic + content type + policy type, so each post
  // is indexed under its own relevant terms rather than emitting an empty keywords tag.
  const keywords = [
    publication.title,
    publication.topic,
    contentTypeLabel,
    publication.policy_type ? publication.policy_type.replace(/-/g, " ") : undefined,
    "Dr. Interested",
    "healthcare education",
    "medical education",
    ...String(publication.title || "")
      .split(/\s+/)
      .filter((w: string) => w.length > 3),
  ].filter((v, i, arr): v is string => Boolean(v) && arr.indexOf(v) === i)

  return generateSeoMetadata({
    title: publication.title,
    description: publication.excerpt,
    keywords,
    url: `https://www.drinterested.org/publications/${publication.slug}`,
    image: publication.cover_image || "/websitebanner.jpg",
    type: "article",
    publishedTime: publication.created_at,
    modifiedTime: publication.updated_at || publication.created_at,
    author: publication.author_name || undefined,
    section: publication.topic,
    // A short, focused set for Google's news_keywords signal — just the topic/type, not the
    // long tail of title-derived terms already in `keywords` above.
    newsKeywords: [publication.topic, contentTypeLabel, "Dr. Interested"].filter(Boolean),
  })
}

export default async function PublicationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data: publication } = await supabase
    .from("blogs")
    .select(
      `
      *,
      author:members (
        id,
        name,
        image,
        bio,
        socials
      )
    `
    )
    .eq("slug", slug)
    .single()

  if (!publication) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-[#405862] mb-4">Publication Not Found</h1>
        <Link href="/publications" className="text-[#4ecdc4] hover:text-[#405862] underline">
          Back to Publications
        </Link>
      </div>
    )
  }

  let authorData = publication.author || {}
  if (Array.isArray(authorData)) authorData = authorData[0] || {}

  // Resolves the byline through the live member → historical roster backup → generic
  // "Publications Team" fallback chain, so departed members still get credited for their work.
  const author = resolvePublicationAuthor({
    slug: publication.slug,
    authorName: publication.author_name,
    liveMember: authorData.name ? authorData : null,
  })
  const resolvedAuthorName = author.name

  const postUrl = `https://www.drinterested.org/publications/${publication.slug}`
  const absoluteImage = (publication.cover_image || "/websitebanner.jpg").startsWith("http")
    ? publication.cover_image
    : `https://www.drinterested.org${publication.cover_image || "/websitebanner.jpg"}`
  const absoluteAuthorImage = author.image?.startsWith("http")
    ? author.image
    : author.image
      ? `https://www.drinterested.org${author.image}`
      : undefined

  // NewsArticle (a subtype of Article) is what Google's own docs recommend for Top Stories /
  // news-result eligibility — same required fields as Article, plus a couple of extra signals
  // (isAccessibleForFree, absolute image) News specifically looks for.
  const publicationSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: publication.title,
    description: publication.excerpt,
    image: [absoluteImage],
    datePublished: publication.created_at,
    dateModified: publication.updated_at || publication.created_at,
    keywords: [publication.topic, publication.content_type, publication.policy_type].filter(Boolean).join(", "),
    articleSection: publication.topic,
    url: postUrl,
    isAccessibleForFree: true,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
    author: {
      "@type": author.isGenericFallback ? "Organization" : "Person",
      name: resolvedAuthorName,
      image: absoluteAuthorImage,
    },
    publisher: {
      "@type": "Organization",
      name: "Dr. Interested",
      logo: {
        "@type": "ImageObject",
        url: "https://www.drinterested.org/android-chrome-512x512.png",
        width: 512,
        height: 512,
      },
    },
  }

  const contentTypeLabel =
    publication.content_type === "op-ed"
      ? "Op-Ed"
      : publication.content_type === "policy"
        ? "Policy Work"
        : "Blog"

  return (
    <div>
      <ScrollToTop />
      <SeoSchema id="article-schema" schema={publicationSchema} />

      {/* Article Header */}
      <section className="bg-[#f5f1eb] py-10 md:py-16">
        <div className="container max-w-3xl">
          <PageBreadcrumb
            items={[
              { name: "Home", href: "/" },
              { name: "Publications", href: "/publications" },
              { name: publication.title, href: `/publications/${publication.slug}` },
            ]}
          />
          <Link
            href="/publications"
            className="inline-flex items-center text-[#405862] hover:text-[#4ecdc4] mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Publications
          </Link>

          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="bg-[#405862]/10 px-3 py-1 rounded-full text-sm font-medium text-[#405862]">
              {contentTypeLabel}
            </span>
            {publication.policy_type && (
              <span className="bg-[#e3f2fd] px-3 py-1 rounded-full text-sm font-medium text-[#1976d2]">
                {publication.policy_type.replace("-", " ")}
              </span>
            )}
            <span className="bg-[#405862]/10 px-3 py-1 rounded-full text-sm font-medium text-[#405862]">
              {publication.topic}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-[#405862] mb-6 leading-tight">
            {publication.title}
          </h1>

          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8 pb-8 border-b border-[#405862]/20">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 rounded-full overflow-hidden flex-shrink-0 bg-[#f5f1eb]">
                <SafeImage src={author.image} alt={resolvedAuthorName} fill className="object-cover" />
              </div>
              <div>
                <p className="font-semibold text-[#405862]">{resolvedAuthorName}</p>
                {author.bio && <p className="text-sm text-[#405862]/70">{author.bio}</p>}
              </div>
            </div>

            <div className="flex gap-6 text-sm text-[#405862]/70 ml-auto">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(publication.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {publication.reading_time}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Cover Image */}
      {publication.cover_image && (
        <section className="bg-white">
          <div className="container max-w-3xl">
            <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-lg bg-[#f5f1eb]">
              <SafeImage
                src={publication.cover_image}
                fallbackSrc="/websitebanner.jpg"
                alt={publication.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </section>
      )}

      {/* Article Content */}
      <section className="py-16 bg-white">
        <div className="container max-w-3xl">
          <div className="blog-prose">
            <ReactMarkdown>{normalizeMarkdown(publication.content)}</ReactMarkdown>
          </div>
        </div>
      </section>

      {/* Author Bio Section */}
      <section className="py-12 bg-[#f5f1eb]">
        <div className="container max-w-3xl">
          <div className="bg-white rounded-lg p-8 border border-[#405862]/10">
            <h3 className="text-xl font-bold text-[#405862] mb-4">About the Author</h3>
            <div className="flex gap-6">
              <div className="relative h-24 w-24 rounded-full overflow-hidden flex-shrink-0 bg-[#f5f1eb]">
                <SafeImage src={author.image} alt={resolvedAuthorName} fill className="object-cover" />
              </div>
              <div>
                <p className="font-semibold text-[#405862] mb-2">{resolvedAuthorName}</p>
                {author.bio && <p className="text-[#405862]/80 text-sm mb-4">{author.bio}</p>}
                {author.isGenericFallback && (
                  <Link
                    href="/members"
                    className="text-[#4ecdc4] hover:text-[#405862] transition-colors text-sm font-semibold"
                  >
                    Meet the current Dr. Interested team →
                  </Link>
                )}
                {(author.linkedIn || author.instagram) && (
                  <div className="flex gap-4">
                    {author.linkedIn && (
                      <Link
                        href={author.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#405862] hover:text-[#4ecdc4] transition-colors text-sm font-medium"
                      >
                        LinkedIn
                      </Link>
                    )}
                    {author.instagram && (
                      <Link
                        href={author.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#405862] hover:text-[#4ecdc4] transition-colors text-sm font-medium"
                      >
                        Instagram
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-[#405862] text-white">
        <div className="container max-w-2xl text-center">
          <h2 className="text-3xl font-bold mb-3">Stay Updated</h2>
          <p className="text-white/80 mb-8">
            Get the latest publications and insights delivered to your inbox.
          </p>
          <NewsletterForm darkMode={true} showFirstName={false} compact={true} />
        </div>
      </section>
    </div>
  )
}
