import type { Metadata } from "next"
import { generateSeoMetadata } from "@/lib/seo-utils"
import { getAllPublications } from "@/lib/publications-data"
import ContentCard from "@/components/publications/content-card"
import PageBreadcrumb from "@/components/page-breadcrumb"
import SeoSchema from "@/components/seo-schema"
import ScrollToTop from "@/components/scroll-to-top"

export const revalidate = 300

export const metadata: Metadata = generateSeoMetadata({
  title: "Blog",
  description:
    "Every blog post from Dr. Interested — insights, research, and information about healthcare careers, medical advancements, and educational opportunities.",
  url: "https://www.drinterested.org/publications/blog",
  keywords: [
    "Dr. Interested blog",
    "healthcare careers blog",
    "premed blog",
    "medical education articles",
    "youth healthcare advocacy",
  ],
})

export default async function BlogListingPage() {
  const { blogs } = await getAllPublications()

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Dr. Interested Blog",
    description: "Every blog post from Dr. Interested on healthcare education and medical advocacy.",
    url: "https://www.drinterested.org/publications/blog",
    isPartOf: { "@type": "WebSite", name: "Dr. Interested", url: "https://www.drinterested.org" },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: blogs.map((post, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `https://www.drinterested.org/publications/${post.slug}`,
        name: post.title,
      })),
    },
  }

  return (
    <div>
      <ScrollToTop />
      <SeoSchema id="blog-listing-schema" schema={schema} />
      <section className="bg-[#f5f1eb] py-10 md:py-16">
        <div className="container">
          <PageBreadcrumb
            items={[
              { name: "Home", href: "/" },
              { name: "Publications", href: "/publications" },
              { name: "Blog", href: "/publications/blog" },
            ]}
          />
          <h1 className="text-3xl md:text-5xl font-bold text-[#405862] mb-4">Blog</h1>
          <p className="text-[#405862]/80 text-base md:text-lg max-w-2xl">
            Insights, research, and information about healthcare careers, medical advancements, and educational
            opportunities — {blogs.length} posts and counting.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white">
        <div className="container">
          {blogs.length === 0 ? (
            <p className="text-[#405862]/70 text-center py-12">No blog posts published yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((post, index) => (
                <ContentCard key={post.slug} post={post} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
