import type { Metadata } from "next"
import { generateSeoMetadata } from "@/lib/seo-utils"
import { getAllPublications } from "@/lib/publications-data"
import ContentCard from "@/components/publications/content-card"
import PageBreadcrumb from "@/components/page-breadcrumb"
import SeoSchema from "@/components/seo-schema"
import ScrollToTop from "@/components/scroll-to-top"

export const revalidate = 300

export const metadata: Metadata = generateSeoMetadata({
  title: "Op-Eds",
  description:
    "Every op-ed from Dr. Interested — opinion pieces and thought leadership on healthcare policy and youth engagement.",
  url: "https://www.drinterested.org/publications/op-eds",
  keywords: [
    "Dr. Interested op-eds",
    "healthcare policy opinion",
    "youth advocacy op-ed",
    "medical education opinion pieces",
  ],
})

export default async function OpEdsListingPage() {
  const { opEds } = await getAllPublications()

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Dr. Interested Op-Eds",
    description: "Every op-ed from Dr. Interested on healthcare policy and youth engagement.",
    url: "https://www.drinterested.org/publications/op-eds",
    isPartOf: { "@type": "WebSite", name: "Dr. Interested", url: "https://www.drinterested.org" },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: opEds.map((post, i) => ({
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
      <SeoSchema id="op-eds-listing-schema" schema={schema} />
      <section className="bg-[#f5f1eb] py-10 md:py-16">
        <div className="container">
          <PageBreadcrumb
            items={[
              { name: "Home", href: "/" },
              { name: "Publications", href: "/publications" },
              { name: "Op-Eds", href: "/publications/op-eds" },
            ]}
          />
          <h1 className="text-3xl md:text-5xl font-bold text-[#405862] mb-4">Op-Eds</h1>
          <p className="text-[#405862]/80 text-base md:text-lg max-w-2xl">
            Opinion pieces and thought leadership from Dr. Interested on healthcare policy and youth engagement —
            {" "}{opEds.length} pieces and counting.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white">
        <div className="container">
          {opEds.length === 0 ? (
            <p className="text-[#405862]/70 text-center py-12">No op-eds published yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {opEds.map((post, index) => (
                <ContentCard key={post.slug} post={post} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
