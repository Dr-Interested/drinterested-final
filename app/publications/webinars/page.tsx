import type { Metadata } from "next"
import { webinars as webinarData } from "@/data/webinars"
import MediaCard from "@/components/publications/media-card"
import PageBreadcrumb from "@/components/page-breadcrumb"
import ScrollToTop from "@/components/scroll-to-top"

export const metadata: Metadata = {
  title: "Webinars",
  description:
    "Every recording from the Dr. Interested Webinar Series and Code Blue Planet 2026 — premed pathways, research, medical ethics, and more.",
  keywords: [
    "Dr. Interested webinars",
    "premed webinars",
    "medical education webinars",
    "healthcare careers webinars",
    "Code Blue Planet",
  ],
  alternates: { canonical: "https://www.drinterested.org/publications/webinars" },
  openGraph: {
    title: "Webinars | Dr. Interested",
    description: "Every recording from the Dr. Interested Webinar Series and Code Blue Planet 2026.",
    url: "https://www.drinterested.org/publications/webinars",
    siteName: "Dr. Interested",
    type: "website",
  },
}

export default function WebinarsPage() {
  const sorted = [...webinarData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div>
      <ScrollToTop />
      <section className="bg-[#f5f1eb] py-10 md:py-16">
        <div className="container">
          <PageBreadcrumb
            items={[
              { name: "Home", href: "/" },
              { name: "Publications", href: "/publications" },
              { name: "Webinars", href: "/publications/webinars" },
            ]}
          />
          <h1 className="text-3xl md:text-5xl font-bold text-[#405862] mb-4">Webinars</h1>
          <p className="text-[#405862]/80 text-base md:text-lg max-w-2xl">
            Every recording from the Dr. Interested Webinar Series and Code Blue Planet 2026 — {sorted.length} episodes and counting.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sorted.map((item, index) => (
              <MediaCard key={item.id} item={item} index={index} href={`/watch/${item.slug}`} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
