"use client"

import Image from "next/image"
import Link from "next/link"
import { Instagram, Linkedin, Link2 } from "lucide-react"
import { motion } from "framer-motion"
import DiscordIcon from "@/components/icons/discord-icon"
import { fadeIn } from "./animations"
import { IMPACT_REPORT_2026 } from "@/lib/impact-stats"

export default function HeroSection({ isLoaded }: { isLoaded: boolean }) {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-10 md:py-16 overflow-hidden bg-gradient-to-b from-[#f5f1eb] to-white">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Ccircle cx='2' cy='2' r='1.5' fill='%23405862'/%3E%3C/svg%3E\")",
          }}
        ></div>
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-[#4ecdc4]/5 via-transparent to-[#405862]/5 opacity-70"></div>

        <div className="container relative z-10">
          <div className="grid gap-6 md:grid-cols-2 md:gap-10 items-center">
            <motion.div
              className="space-y-4"
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
              variants={fadeIn}
            >
              <div className="inline-block bg-[#4ecdc4]/20 px-3 py-1 rounded-full text-[#405862] font-medium text-sm mb-2 shadow-sm">
                A Youth Led Global Wellness Organization
              </div>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl text-[#405862]">
                Welcome to Dr. <span className="text-[#4ecdc4]">Interested</span>
              </h1>
              <p className="text-lg text-[#405862]/90 mt-2">
                Wellness careers, a voice in policy, and a community to belong to
              </p>
              <p className="text-[#405862]/80 max-w-md">
                Dr. Interested helps young people explore careers in wellness, from health and medicine to law and finance,
                take part in the policy decisions that shape their lives, and find a safe, open space to belong. Everything
                we run is free and youth led.
              </p>
              <div className="flex flex-wrap gap-3 items-center mt-4">
                <Link
                  href="https://discord.gg/pzbGRgsGXY"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#405862] text-white hover:bg-[#334852] px-5 py-2.5 rounded-md font-medium inline-flex items-center shadow-md hover:shadow-lg transition-transform hover:scale-105 duration-300"
                >
                  Join Our Community
                </Link>

                <div className="flex items-center gap-3 flex-wrap mt-1">
                  <Link
                    href="https://discord.gg/pzbGRgsGXY"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-[#405862] hover:text-[#4ecdc4] transition-colors gap-1 hover:scale-110 duration-200"
                    aria-label="Discord"
                  >
                    <DiscordIcon className="h-5 w-5" />
                  </Link>
                  <Link
                    href="https://www.instagram.com/dr.interested/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-[#405862] hover:text-[#4ecdc4] transition-colors gap-1 hover:scale-110 duration-200"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-5 w-5" />
                  </Link>
                  <Link
                    href="https://www.linkedin.com/company/dr-interested"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-[#405862] hover:text-[#4ecdc4] transition-colors gap-1 hover:scale-110 duration-200"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-5 w-5" />
                  </Link>
                  <Link
                    href="/links"
                    className="inline-flex items-center text-[#405862] hover:text-[#4ecdc4] transition-colors gap-1 hover:scale-110 duration-200"
                    aria-label="All Links"
                  >
                    <Link2 className="h-5 w-5" />
                  </Link>
                </div>
              </div>
              <Link
                href="/impact-report"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#405862] underline decoration-[#4ecdc4] decoration-2 underline-offset-4 hover:text-[#2d8659]"
              >
                Read our {IMPACT_REPORT_2026.shortTitle}
              </Link>
              <div className="mt-6 grid grid-cols-2 gap-4 max-w-sm w-full justify-items-center">
                <div className="relative h-14 w-full max-w-[140px] rounded-lg overflow-hidden shadow-sm">
                  <Image
                    src="/imaginecan.png"
                    alt="Imagine Canada Member"
                    fill
                    className="object-contain"
                  />
                </div>

                <div className="relative h-14 w-full max-w-[140px] rounded-lg overflow-hidden shadow-sm">
                  <Image
                    src="/development.png"
                    alt="Youth development recognition"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              className="relative flex items-center justify-center order-1 md:order-2 my-6 md:my-0"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isLoaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.7 }}
            >
              <div className="absolute w-[280px] h-[280px] md:w-[320px] md:h-[320px] rounded-full bg-[#4ecdc4]/10 animate-pulse-slow"></div>
              <div className="absolute w-[260px] h-[260px] md:w-[300px] md:h-[300px] rounded-full border-2 border-dashed border-[#405862]/20 animate-spin-slow"></div>
              <Image
                src="/logo.png"
                alt="Dr. Interested logo"
                width={240}
                height={240}
                className="object-contain z-10 rounded-lg hover:scale-105 transition-transform duration-500"
                priority
              />
            </motion.div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-r from-[#4ecdc4]/20 via-white to-[#405862]/20 opacity-70"></div>
      </section>
    </>
  )
}
