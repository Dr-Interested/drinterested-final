import type { Metadata } from "next"
import { getEpisodesByCategory } from "@/lib/episodes"
import MediaCard from "@/components/publications/media-card"
import PageBreadcrumb from "@/components/page-breadcrumb"
import ScrollToTop from "@/components/scroll-to-top"

export const metadata: Metadata = {
  title: "Podcast",
  description:
    "Every episode of the Dr. Interested Podcast — written and hosted by our members, covering health topics from neuroscience to nutrition to mental health.",
  keywords: [
    "Dr. Interested Podcast",
    "healthcare podcast",
    "medical education podcast",
    "youth health podcast",
  ],
  alternates: { canonical: "https://www.drinterested.org/publications/podcasts" },
  openGraph: {
    title: "Podcast | Dr. Interested",
    description: "Every episode of the Dr. Interested Podcast, written and hosted by our members.",
    url: "https://www.drinterested.org/publications/podcasts",
    siteName: "Dr. Interested",
    type: "website",
  },
}

export const revalidate = 300

export default async function PodcastsPage() {
  const sorted = await getEpisodesByCategory("podcast")

  return (
    <div>
      <ScrollToTop />
      <section className="bg-[#f5f1eb] py-10 md:py-16">
        <div className="container">
          <PageBreadcrumb
            items={[
              { name: "Home", href: "/" },
              { name: "Publications", href: "/publications" },
              { name: "Podcasts", href: "/publications/podcasts" },
            ]}
          />
          <h1 className="text-3xl md:text-5xl font-bold text-[#405862] mb-4">Dr. Interested Podcast</h1>
          <p className="text-[#405862]/80 text-base md:text-lg max-w-2xl">
            Every episode, written and hosted by our members — {sorted.length} episodes and counting.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sorted.map((item, index) => (
              <MediaCard key={item.id} item={item} index={index} href={`/listen/${item.slug}`} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
