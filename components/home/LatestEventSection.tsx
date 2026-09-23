"use client"

import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, MapPin, ExternalLink, AlertCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

export default function LatestEventSection({ latestEvent }: { latestEvent: any }) {
  return (
    <>
      {/* Latest Event Section */}
      {latestEvent && (
        <section className="py-10 bg-white">
          <div className="container">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-[#405862] flex items-center">
                Latest Event
                <div className="w-12 h-1 bg-[#4ecdc4] ml-3"></div>
              </h2>
              <Link href="/events" className="text-[#405862] hover:text-[#4ecdc4] text-sm flex items-center group">
                <span>View all events</span>
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
            >
              <Card className="overflow-hidden border-[#405862]/10 shadow-md hover:shadow-lg transition-all duration-300 group">
                <div className="grid md:grid-cols-2">
                  <div className="relative h-48 md:h-auto">
                    <Image
                      src={latestEvent.image || "/logo.png"}
                      alt={`Dr. Interested Event: ${latestEvent.title} - Healthcare volunteer opportunity for high school students`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      priority
                    />
                    {latestEvent.status === "closed" && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white px-2.5 py-0.5 rounded-full text-xs font-bold">
                        Registration Closed
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:hidden"></div>
                  </div>
                  <CardContent className="p-5 flex flex-col relative">
                    <div>
                      <div className="inline-block bg-[#405862]/10 px-2.5 py-0.5 rounded-full text-[#405862] font-medium text-xs mb-2">
                        {latestEvent.status === "open"
                          ? "Registration Open"
                          : latestEvent.status === "full"
                            ? "Registration Full"
                            : latestEvent.status === "closed"
                              ? "Registration Closed"
                              : "Completed"}
                      </div>
                      <h3 className="text-lg font-bold mb-2 text-[#405862] group-hover:text-[#4ecdc4] transition-colors">
                        {latestEvent.title}
                      </h3>
                      <div className="space-y-1.5 mb-3">
                        <div className="flex items-center text-sm text-[#405862]/80">
                          <Calendar className="h-4 w-4 mr-2 text-[#4ecdc4]" />
                          {latestEvent.date}
                        </div>
                        {latestEvent.time && (
                          <div className="flex items-center text-sm text-[#405862]/80">
                            <Clock className="h-4 w-4 mr-2 text-[#4ecdc4]" />
                            {latestEvent.time}
                          </div>
                        )}
                        <div className="flex items-center text-sm text-[#405862]/80">
                          <MapPin className="h-4 w-4 mr-2 text-[#4ecdc4]" />
                          {latestEvent.location}
                        </div>
                      </div>
                      <p className="text-[#405862]/80 text-sm mb-5 line-clamp-2">{latestEvent.description}</p>
                    </div>
                    <div className="mt-auto">
                      {latestEvent.status === "open" ? (
                        <Button className="w-full bg-[#405862] hover:bg-[#334852] group" asChild>
                          <Link href={latestEvent.link} target="_blank" rel="noopener noreferrer">
                            Register Now
                            <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                          </Link>
                        </Button>
                      ) : latestEvent.status === "full" ? (
                        <Button className="w-full bg-gray-500 hover:bg-gray-600 cursor-not-allowed" disabled>
                          <AlertCircle className="mr-2 h-4 w-4" />
                          Registration Full
                        </Button>
                      ) : latestEvent.status === "closed" ? (
                        <Button
                          className="w-full bg-[#405862] hover:bg-[#334852] opacity-75 cursor-not-allowed"
                          disabled
                        >
                          <AlertCircle className="mr-2 h-4 w-4" />
                          Registration Closed
                        </Button>
                      ) : (
                        <Button
                          className="w-full bg-[#405862]/20 text-[#405862]/50 cursor-not-allowed"
                          disabled
                        >
                          <AlertCircle className="mr-2 h-4 w-4" />
                          Event Completed
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          </div>
        </section>
      )}
    </>
  )
}
