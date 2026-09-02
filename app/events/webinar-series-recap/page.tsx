import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase-client"

export const revalidate = 300; // Revalidate webinars every 5 minutes (ISR)

export const metadata: Metadata = {
  title: "Dr. Interested Webinar Series",
  description:
    "Watch every session from the Dr. Interested Webinar Series — youth, professionals, and experts discussing medicine, healthcare, and research.",
  alternates: {
    canonical: "https://www.drinterested.org/events/webinar-series-recap",
  },
  openGraph: {
    title: "Dr. Interested Webinar Series",
    description:
      "Watch every session from the Dr. Interested Webinar Series on medicine, healthcare, and research.",
    url: "https://www.drinterested.org/events/webinar-series-recap",
    siteName: "Dr. Interested",
    type: "website",
  },
}

export default async function WebinarGalleryPage() {

  const { data: webinars } = await supabase
    .from("webinars")
    .select("*")
    .order("created_at", { ascending: true })

  return (
    <div>
      {/* Header Section */}
      <section className="hero-section bg-[#f5f1eb] py-12">
        <div className="container">
          <div className="flex items-center gap-2 mb-6">
            <Link
              href="/events"
              className="text-[#405862] hover:text-[#4ecdc4] transition-colors flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Events
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-center text-[#405862]">
            Dr. Interested Webinar Series
          </h1>
          <p className="text-center text-[#405862] mt-4 max-w-3xl mx-auto">
            Explore our ongoing webinar series where youth, professionals, and
            experts discuss topics in medicine, healthcare, and research.
            Click on any thumbnail to watch the full session.
          </p>
        </div>
      </section>

      {/* Webinar Thumbnails */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {webinars && webinars.map((webinar) => (
              <Link
                key={webinar.id}
                href={`/watch/${webinar.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Card className="overflow-hidden border-[#405862] shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="relative w-full aspect-video">
                    <Image
                      src={webinar.image || "/placeholder.svg"}
                      alt={webinar.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h2 className="text-lg font-bold text-[#405862] mb-1 line-clamp-2">
                      {webinar.title}
                    </h2>
                    <p className="text-sm text-[#405862] mb-2 line-clamp-3">
                      {webinar.description}
                    </p>
                    <p className="text-xs text-[#4ecdc4]">
                      {webinar.date} • {webinar.time}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-12 bg-[#405862] text-white">
        <div className="container text-center">
          <h2 className="text-2xl font-bold mb-4">
            Interested in Future Webinars?
          </h2>
          <p className="max-w-2xl mx-auto mb-6">
            Stay informed about our upcoming Dr. Interested sessions, where we
            discuss pathways, challenges, and innovations in healthcare and
            science.
          </p>
          <Button className="bg-[#4ecdc4] hover:bg-[#3dbdb5] text-white" asChild>
            <Link href="/contact">Join Our Mailing List</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
