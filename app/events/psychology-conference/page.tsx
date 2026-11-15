"use client"

import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import ScrollToTop from "@/components/scroll-to-top"

const conferenceImages = [
  { id: 1, src: "/psychimg1.JPG", caption: "Meet Jessica Agbolade" },
  { id: 2, src: "/psychimage2.JPG", caption: "Keynote on the Bridge of Culture" },
  { id: 3, src: "/psychimage3.JPG", caption: "The ySpace" },
  { id: 4, src: "/psychimage4.JPG", caption: "Meet the attendees" },
  { id: 5, src: "/psychimage5.JPG", caption: "Quick Break!" },
  { id: 6, src: "/psychimage6.JPG", caption: "Dr Interested President with the Speaker" },
  { id: 7, src: "/psychimage7.JPG", caption: "Presentation Beginning" },
  { id: 8, src: "/psychimage8.png", caption: "Keynote by Adil Mukhi Representing Dr. Interested" },
  { id: 9, src: "/psychimage9.jpeg", caption: "Opening Reflection" },
]

export default function CulturePsychGallery() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div>
      <ScrollToTop />

      {/* Header Section */}
      <section className="hero-section bg-[#f5f1eb] py-12">
        <div className="container">
          <div className="flex items-center gap-2 mb-6">
            <Link
              href="/events"
              className="text-[#405862] hover:text-teal-deep transition-colors flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Events
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-center text-[#405862]">
            Culture & Psychology Conference Gallery
          </h1>
          <p className="text-center text-[#405862] mt-4 max-w-3xl mx-auto">
            Explore highlights from our recent conference where researchers,
            youth leaders, and mental health professionals discussed the influence 
            of culture on psychology, identity, and wellbeing.
          </p>
        </div>
      </section>

      {/* Image Grid */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {conferenceImages.map((item) => (
              <Card
                key={item.id}
                className="overflow-hidden border-[#405862] shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="relative w-full aspect-video">
                  <Image
                    src={item.src}
                    alt={item.caption}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <p className="text-sm text-[#405862] line-clamp-3">
                    {item.caption}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-12 bg-[#405862] text-white">
        <div className="container text-center">
          <h2 className="text-2xl font-bold mb-4">See More Events</h2>
          <p className="max-w-2xl mx-auto mb-6">
            Stay updated on future conferences, educational events, and initiatives related to culture, psychology, and community wellbeing.
          </p>
          <Button className="bg-[#4ecdc4] hover:bg-[#3dbdb5] text-white" asChild>
            <Link href="/contact">Join Our Mailing List</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
