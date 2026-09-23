"use client"

import Link from "next/link"
import { Calendar, ShoppingBag } from "lucide-react"
import { motion } from "framer-motion"
import { fadeIn, staggerContainer } from "./animations"

export default function QuickLinksSection() {
  return (
    <>
      {/* Quick Links Section */}
      <section className="py-10 bg-[#f5f1eb]/30">
        <div className="container">
          <motion.div
            className="text-center mb-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <h2 className="text-xl font-bold text-[#405862] inline-flex flex-col items-center">
              Explore Dr. Interested
              <div className="w-16 h-1 bg-[#4ecdc4] mt-2"></div>
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn}>
              <Link
                href="/events"
                className="flex flex-col items-center p-4 rounded-lg border border-[#405862]/10 hover:border-[#4ecdc4]/30 hover:bg-[#f5f1eb]/30 transition-all duration-300 h-full group"
              >
                <div className="w-12 h-12 rounded-full bg-[#4ecdc4]/10 flex items-center justify-center mb-3 group-hover:bg-[#4ecdc4]/20 transition-colors">
                  <Calendar className="h-6 w-6 text-[#405862]" />
                </div>
                <h3 className="font-semibold text-[#405862] text-sm mb-1">Events</h3>
                <p className="text-xs text-center text-[#405862]/70">Join our webinars and workshops</p>
              </Link>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Link
                href="/publications"
                className="flex flex-col items-center p-4 rounded-lg border border-[#405862]/10 hover:border-[#4ecdc4]/30 hover:bg-[#f5f1eb]/30 transition-all duration-300 h-full group"
              >
                <div className="w-12 h-12 rounded-full bg-[#4ecdc4]/10 flex items-center justify-center mb-3 group-hover:bg-[#4ecdc4]/20 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-[#405862]"
                  >
                    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"></path>
                    <path d="M18 14h-8"></path>
                    <path d="M15 18h-5"></path>
                    <path d="M10 6h8v4h-8V6Z"></path>
                  </svg>
                </div>
                <h3 className="font-semibold text-[#405862] text-sm mb-1">Blog</h3>
                <p className="text-xs text-center text-[#405862]/70">Read our latest articles</p>
              </Link>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Link
                href="/members"
                className="flex flex-col items-center p-4 rounded-lg border border-[#405862]/10 hover:border-[#4ecdc4]/30 hover:bg-[#f5f1eb]/30 transition-all duration-300 h-full group"
              >
                <div className="w-12 h-12 rounded-full bg-[#4ecdc4]/10 flex items-center justify-center mb-3 group-hover:bg-[#4ecdc4]/20 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-[#405862]"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <h3 className="font-semibold text-[#405862] text-sm mb-1">Our Team</h3>
                <p className="text-xs text-center text-[#405862]/70">Meet the people behind Dr. Interested</p>
              </Link>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Link
                href="https://www.teepublic.com/user/dr-interested"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-4 rounded-lg border border-[#405862]/10 hover:border-[#4ecdc4]/30 hover:bg-[#f5f1eb]/30 transition-all duration-300 h-full group"
              >
                <div className="w-12 h-12 rounded-full bg-[#4ecdc4]/10 flex items-center justify-center mb-3 group-hover:bg-[#4ecdc4]/20 transition-colors">
                  <ShoppingBag className="h-6 w-6 text-[#405862]" />
                </div>
                <h3 className="font-semibold text-[#405862] text-sm mb-1">Merch Store</h3>
                <p className="text-xs text-center text-[#405862]/70">Get Dr. Interested merchandise</p>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
