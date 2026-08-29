import type { Metadata } from "next"
import { generateSeoMetadata } from "@/lib/seo-utils"
import { getAllPublications } from "@/lib/publications-data"
import ContentCard from "@/components/publications/content-card"
import PageBreadcrumb from "@/components/page-breadcrumb"
import SeoSchema from "@/components/seo-schema"
import ScrollToTop from "@/components/scroll-to-top"

export const revalidate = 300

export const metadata: Metadata = generateSeoMetadata({
  title: "Policy Work",
  description:
    "Dr. Interested's policy reports, joint statements, and inputs to government bodies and international organizations, including our submission to the UN Human Rights Council.",
  url: "https://www.drinterested.org/publications/policy",
  keywords: [
    "Dr. Interested policy work",
    "UN Human Rights Council submission",
    "OHCHR",
    "youth mental health policy",
    "health policy reports",
  ],
})

export default async function PolicyListingPage() {
  const { policyWork } = await getAllPublications()

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Dr. Interested Policy Work",
    description: "Dr. Interested's policy reports, joint statements, and inputs to government bodies and organizations.",
    url: "https://www.drinterested.org/publications/policy",
    isPartOf: { "@type": "WebSite", name: "Dr. Interested", url: "https://www.drinterested.org" },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: policyWork.map((post, i) => ({
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
      <SeoSchema id="policy-listing-schema" schema={schema} />
      <section className="bg-[#f5f1eb] py-10 md:py-16">
        <div className="container">
          <PageBreadcrumb
            items={[
              { name: "Home", href: "/" },
              { name: "Publications", href: "/publications" },
              { name: "Policy Work", href: "/publications/policy" },
            ]}
          />
          <h1 className="text-3xl md:text-5xl font-bold text-[#405862] mb-4">Policy Work</h1>
          <p className="text-[#405862]/80 text-base md:text-lg max-w-2xl">
            Our policy reports, joint statements, and inputs to government bodies and organizations — {policyWork.length}{" "}
            items and counting.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white">
        <div className="container">
          {policyWork.length === 0 ? (
            <p className="text-[#405862]/70 text-center py-12">No policy work published yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {policyWork.map((post, index) => (
                <ContentCard key={post.slug} post={post} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
