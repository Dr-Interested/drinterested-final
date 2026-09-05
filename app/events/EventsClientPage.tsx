"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Calendar, Clock, MapPin, AlertCircle, CheckCircle, ExternalLink, ArrowRight } from "lucide-react"
import NewsletterForm from "@/components/newsletter-form"
import { motion } from "framer-motion"

export default function EventsClientPage({ upcomingEvents, pastEvents }: { upcomingEvents: any[], pastEvents: any[] }) {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <div>
      <section className="hero-section bg-[#f5f1eb] py-10 md:py-16">
        <div className="container">
          <motion.div className="text-center" initial="hidden" animate="visible" variants={fadeIn}>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#405862]">Events & Initiatives</h1>
            <p className="text-lg text-[#405862]/80 mt-3 max-w-2xl mx-auto">
              Join us for engaging events and initiatives designed to educate and inspire the next generation of
              healthcare professionals.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-10 bg-white">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#405862] flex items-center">
              Upcoming
              <div className="w-12 h-1 bg-[#4ecdc4] ml-3"></div>
            </h2>
          </div>
          <p className="text-[#405862]/80 mb-8 max-w-2xl">
            Stay informed about our upcoming events and initiatives, designed to educate and inspire.
          </p>

          <motion.div
            className="grid md:grid-cols-3 gap-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {upcomingEvents.map((event, index) => (
              <motion.div key={index} variants={fadeIn}>
                <Card className="overflow-hidden border-[#405862]/10 hover:border-[#405862]/30 hover:shadow-lg transition-all duration-300 h-full group">
                  <div className="relative h-44">
                    <Image
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {event.status === "closed" && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        Registration Closed
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-base font-semibold mb-2 text-[#405862] group-hover:text-[#4ecdc4] transition-colors">
                      {event.title}
                    </h3>
                    <div className="space-y-1.5 mb-3">
                      <div className="flex items-center text-xs text-[#405862]/80">
                        <Calendar className="h-3.5 w-3.5 mr-1.5 text-[#4ecdc4]" />
                        {event.date}
                      </div>
                      {event.time && (
                        <div className="flex items-center text-xs text-[#405862]/80">
                          <Clock className="h-3.5 w-3.5 mr-1.5 text-[#4ecdc4]" />
                          {event.time}
                        </div>
                      )}
                      <div className="flex items-center text-xs text-[#405862]/80">
                        <MapPin className="h-3.5 w-3.5 mr-1.5 text-[#4ecdc4]" />
                        {event.location}
                      </div>
                    </div>
                    <p className="text-xs text-[#405862]/80 line-clamp-3">{event.description}</p>
                  </CardContent>
                  <CardFooter className="px-4 pb-4 pt-0">
                    {event.status === "open" ? (
                      <Button className="w-full bg-[#405862] hover:bg-[#334852] text-xs h-8 group" size="sm" asChild>
                        <Link href={event.link} target="_blank" rel="noopener noreferrer">
                          Register Now
                          <ExternalLink className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      </Button>
                    ) : event.status === "full" ? (
                      <Button
                        className="w-full bg-gray-500 hover:bg-gray-600 cursor-not-allowed text-xs h-8"
                        size="sm"
                        disabled
                      >
                        <AlertCircle className="mr-1.5 h-3.5 w-3.5" />
                        Registration Full
                      </Button>
                    ) : event.status === "closed" ? (
                      <Button
                        className="w-full bg-[#405862] hover:bg-[#334852] opacity-75 cursor-not-allowed text-xs h-8"
                        size="sm"
                        disabled
                      >
                        <AlertCircle className="mr-1.5 h-3.5 w-3.5" />
                        Registration Closed
                      </Button>
                    ) : (
                      <Button
                        className="w-full bg-[#405862]/20 text-[#405862]/50 cursor-not-allowed text-xs h-8"
                        size="sm"
                        disabled
                      >
                        <AlertCircle className="mr-1.5 h-3.5 w-3.5" />
                        Event Completed
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Past Events */}
      <section className="py-10 bg-[#f5f1eb]/50">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#405862] flex items-center">
              Past Events/Initiatives
              <div className="w-12 h-1 bg-[#4ecdc4] ml-3"></div>
            </h2>
          </div>
          <p className="text-[#405862]/80 mb-8 max-w-2xl">
            Take a look at some of the amazing events we've hosted so far!
          </p>

          <motion.div
            className="grid md:grid-cols-2 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {pastEvents.map((event, index) => (
              <motion.div key={index} variants={fadeIn}>
                <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-lg shadow-sm border-[#405862]/10 hover:border-[#405862]/30 hover:shadow-md transition-all duration-300 group">
                  <div className="md:w-1/3 relative h-40 md:h-auto rounded-lg overflow-hidden">
                    <Image
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="md:w-2/3">
                    <h3 className="text-base font-semibold mb-1.5 text-[#405862] group-hover:text-[#4ecdc4] transition-colors">
                      {event.title}
                    </h3>
                    <div className="flex items-center text-xs text-[#405862]/80 mb-2">
                      <Calendar className="h-3.5 w-3.5 mr-1.5 text-[#4ecdc4]" />
                      {event.date}
                    </div>
                    <p className="text-xs text-[#405862]/80 mb-3 line-clamp-3">{event.description}</p>
                     <Button
                      variant="outline"
                      className="w-full md:w-auto border-[#405862] text-[#405862] hover:bg-[#405862] hover:text-white h-8 text-xs group bg-transparent"
                      size="sm"
                      asChild
                    >
                      {event.title === "Dr. Interested Medical-Technological Internship" ? (
                        <Link href="/events/internship-recap" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center">
                          View Recap
                          <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      ) : (
                        <Link
                          href={event.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center"
                        >
                          View Recap
                          <ExternalLink className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stay Updated */}
      <section className="py-10 bg-[#405862] text-white">
        <div className="container max-w-4xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Stay in the Loop</h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Get notified about upcoming events, new initiatives, and opportunities — delivered straight to your inbox.
          </p>
          <div className="max-w-md mx-auto mb-6">
            <NewsletterForm darkMode={true} showFirstName={false} compact={true} />
          </div>
          <p className="text-white/60 text-sm">
            Or join our{" "}
            <Link href="https://discord.gg/pzbGRgsGXY" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">
              Discord community
            </Link>{" "}
            for real-time updates.
          </p>
        </div>
      </section>

      {/* Media Consent — deliberately small and at the very end, not a callout */}
      <p className="media-consent-note text-center text-xs text-[#405862]/50 py-4 px-4">
        Attendees under 18 require a parent/guardian's consent for photos and video at our events — see our{" "}
        <Link href="/media-consent" className="underline hover:text-[#405862]">
          Media Consent and Release
        </Link>
        .
      </p>
    </div>
  )
}
