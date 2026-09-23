"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import { fadeIn } from "./animations"

export default function AboutSection() {
  return (
    <>
      {/* About Us Section */}
      <section className="py-10 bg-[#f5f1eb]/50">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              className="space-y-4 order-2 md:order-1"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
            >
              <div className="inline-block bg-[#405862]/10 px-3 py-1 rounded-full text-[#405862] font-medium text-sm">
                Our Mission
              </div>
              <h2 className="text-2xl font-bold text-[#405862]">About Dr. Interested</h2>
              <div className="w-16 h-1 bg-[#4ecdc4]"></div>
              <p className="text-[#405862]/90">
                Dr. Interested is a student-led organization empowering high school students to explore careers in
                healthcare and medical research. Through engaging events, leadership opportunities, and collaborative
                projects, we bridge the gap between passion and profession.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href="/our-work"
                  className="inline-flex items-center justify-center border border-[#405862] text-[#405862] hover:bg-[#405862] hover:text-white px-4 py-2 rounded-md font-medium transition-colors shadow-sm hover:shadow-md group"
                >
                  <span>Learn About Our Work</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/members"
                  className="inline-flex items-center justify-center bg-[#4ecdc4]/20 text-[#405862] hover:bg-[#4ecdc4]/30 px-4 py-2 rounded-md font-medium transition-colors shadow-sm hover:shadow-md group"
                >
                  <span>Meet Our Team</span>
                  <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </motion.div>

            <motion.div
              className="relative order-1 md:order-2 flex justify-center"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative h-[220px] w-[220px] md:h-[280px] md:w-[280px] rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-[#405862]/10 rounded-lg transform rotate-3"></div>
                <Image
                  src="/mindsproject.png"
                  alt="Dr. Interested - Resilent Minds Program Photo"
                  fill
                  sizes="(max-width: 768px) 220px, 280px"
                  className="object-contain rounded-lg transform -rotate-3 hover:rotate-0 transition-transform duration-500"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
