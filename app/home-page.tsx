"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Instagram,
  Linkedin,
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  AlertCircle,
  ArrowRight,
  ChevronRight,
  Youtube,
  Music,
  Play,
  ShoppingBag,
  ShoppingCart,
  Tag,
  Link2,
} from "lucide-react"
import ScrollToTop from "@/components/scroll-to-top"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import { getFeaturedPosts, getRecentPosts } from "@/data/blog"
import NewsletterForm from "@/components/newsletter-form"
import { motion } from "framer-motion"
import { Quote, Users, TrendingUp, Heart, Award, BookOpen, Sparkles, Globe } from "lucide-react"

import { DomainAnnouncementPopup } from "@/components/domain-announcement-popup"
import DiscordIcon from "@/components/icons/discord-icon"
import { LiteYouTube, LiteSpotify } from "@/components/lite-embed"

export default function HomePage({ recentPost: passedRecentPost, featuredEvent: passedFeaturedEvent, featuredPosts: passedFeaturedPosts }: { recentPost?: any, featuredEvent?: any, featuredPosts?: any[] }) {
  const [isLoaded, setIsLoaded] = useState(false)

  // A13: scaleIn moved inside component (was incorrectly at module scope)
  const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  }

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Use the featured event from Supabase
  const latestEvent = passedFeaturedEvent
  // Get featured blog posts from Supabase (passed via props)
  const featuredPosts = passedFeaturedPosts || []
  // Get the most recent blog post (from Supabase)
  const recentPost = passedRecentPost

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <DomainAnnouncementPopup />

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
                Empowering Future Healthcare Leaders
              </div>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl text-[#405862]">
                Welcome to Dr. <span className="text-[#4ecdc4]">Interested</span>
              </h1>
              <p className="text-lg text-[#405862]/90 mt-2">
                Inspiring the Next Generation of Healthcare Professionals
              </p>
              <p className="text-[#405862]/80 max-w-md">
                Dr. Interested is a global organization helping students explore the vast world of healthcare, research, and advocacy. 
                We support youth in finding their unique "spark" in medicine through interactive programs, publishing opportunities, and leadership development.
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
                alt="Dr. Interested Logo - High School Healthcare Club"
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

      {/* Our Goal, Mission, and Vision */}
      <section className="py-10 bg-white">
  <div className="container">
    <motion.div
      className="text-center mb-6"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeIn}
    >
    </motion.div>

    <motion.div
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
    >
      <motion.div variants={scaleIn}>
        <div className="bg-gradient-to-br from-[#4ecdc4]/10 to-[#4ecdc4]/5 p-5 rounded-xl text-center border border-[#4ecdc4]/20 hover:border-[#4ecdc4]/40 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <Users className="w-7 h-7 text-[#4ecdc4] mx-auto mb-2" />
          <div className="text-3xl font-bold text-[#405862] mb-1">160,000+</div>
          <div className="text-[#405862]/70 text-xs font-medium">Youth Impacted</div>
        </div>
      </motion.div>

      <motion.div variants={scaleIn}>
        <div className="bg-gradient-to-br from-[#4ecdc4]/10 to-[#4ecdc4]/5 p-5 rounded-xl text-center border border-[#4ecdc4]/20 hover:border-[#4ecdc4]/40 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <Globe className="w-7 h-7 text-[#4ecdc4] mx-auto mb-2" />
          <div className="text-3xl font-bold text-[#405862] mb-1">106</div>
          <div className="text-[#405862]/70 text-xs font-medium">Countries Reached</div>
        </div>
      </motion.div>

      <motion.div variants={scaleIn}>
        <div className="bg-gradient-to-br from-[#4ecdc4]/10 to-[#4ecdc4]/5 p-5 rounded-xl text-center border border-[#4ecdc4]/20 hover:border-[#4ecdc4]/40 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <TrendingUp className="w-7 h-7 text-[#4ecdc4] mx-auto mb-2" />
          <div className="text-3xl font-bold text-[#405862] mb-1">1,400+</div>
          <div className="text-[#405862]/70 text-xs font-medium">Members</div>
        </div>
      </motion.div>

      <motion.div variants={scaleIn}>
        <div className="bg-gradient-to-br from-[#4ecdc4]/10 to-[#4ecdc4]/5 p-5 rounded-xl text-center border border-[#4ecdc4]/20 hover:border-[#4ecdc4]/40 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <Award className="w-7 h-7 text-[#4ecdc4] mx-auto mb-2" />
          <div className="text-3xl font-bold text-[#405862] mb-1">3.7M+</div>
          <div className="text-[#405862]/70 text-xs font-medium">Content Impressions</div>
        </div>
      </motion.div>
    </motion.div>

    {/* PURPOSE SECTION — FIXED NESTING */}
    <div className="text-center mb-10">
      <h2 className="text-2xl font-bold text-[#405862] inline-flex flex-col items-center">
        Our Purpose
        <div className="w-16 h-1 bg-[#4ecdc4] mt-2"></div>
      </h2>
      <p className="text-[#405862]/70 max-w-2xl mx-auto mt-2 text-sm">
        To bridge the gap betweer interest and action in youth healthcare leadership
        by offering accessible resources, mentorship, and research opportunities.
      </p>
    </div>

    {/* GOAL / MISSION / VISION Redploy-2*/}
    <motion.div
      className="grid md:grid-cols-3 gap-4"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
    >
      <motion.div
        className="border border-[#405862]/10 p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow transform hover:-translate-y-1 duration-300"
        variants={fadeIn}
      >
        <div className="bg-[#4ecdc4]/10 w-10 h-10 rounded-full flex items-center justify-center mb-3">
          {/* icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#4ecdc4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 4v5h-9l1-1v-4" />
            <path d="M15 4h6v5h-6" />
            <path d="M4 13h5" />
            <path d="M9 18h6" />
            <path d="M13 12v6" />
            <path d="M4 7v12a2 2 0 0 0 2 2h12" />
            <path d="M4 11V9a2 2 0 0 1 2-2h2" />
          </svg>
        </div>
        <h3 className="text-base font-bold mb-1 text-[#405862]">Goal</h3>
        <p className="text-[#405862]/80 text-sm">
          To inspire, educate, and support high school students on their journey toward a career in healthcare.
        </p>
      </motion.div>

      <motion.div
        className="border border-[#405862]/10 p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow transform hover:-translate-y-1 duration-300"
        variants={fadeIn}
      >
        <div className="bg-[#4ecdc4]/10 w-10 h-10 rounded-full flex items-center justify-center mb-3">
          {/* icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#4ecdc4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
        <h3 className="text-base font-bold mb-1 text-[#405862]">Mission</h3>
        <p className="text-[#405862]/80 text-sm">
          To empower the next generation of healthcare professionals through education,
          collaboration, and meaningful experiences.
        </p>
      </motion.div>

      <motion.div
        className="border border-[#405862]/10 p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow transform hover:-translate-y-1 duration-300"
        variants={fadeIn}
      >
        <div className="bg-[#4ecdc4]/10 w-10 h-10 rounded-full flex items-center justify-center mb-3">
          {/* icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#4ecdc4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
        </div>
        <h3 className="text-base font-bold mb-1 text-[#405862]">Vision</h3>
        <p className="text-[#405862]/80 text-sm">
          A world where every young person has the support to discover their passion in medicine
          and drive change through innovation and advocacy.
        </p>
      </motion.div>
    </motion.div>
  </div>
</section>


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

      {/* Merch Store Section */}
      <section className="py-10 bg-[#f5f1eb]/30">
        <div className="container">
          <motion.div
            className="text-center mb-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <h2 className="text-2xl font-bold text-[#405862] inline-flex flex-col items-center">
              Merch Store
              <div className="w-16 h-1 bg-[#4ecdc4] mt-2"></div>
            </h2>
            <p className="text-[#405862]/70 max-w-2xl mx-auto mt-2 text-sm">
              Show your support with Dr. Interested merchandise
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <Card className="overflow-hidden border-[#405862]/10 shadow-md hover:shadow-lg transition-all duration-300 group">
              <div className="grid md:grid-cols-2">
                <div className="relative h-64 md:h-auto overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#405862]/10 to-transparent z-10"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-2 p-4 w-full h-full">
                      <div className="bg-white rounded-lg shadow-sm overflow-hidden flex items-center justify-center p-2">
                        <Image
                          src="/tshirt.jpg"
                          alt="Dr. Interested T-Shirt - Healthcare Club Merchandise"
                          width={120}
                          height={120}
                          className="object-contain hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="bg-white rounded-lg shadow-sm overflow-hidden flex items-center justify-center p-2">
                        <Image
                          src="/hoodie.jpg"
                          alt="Dr. Interested Hoodie - Healthcare Club Merchandise"
                          width={120}
                          height={120}
                          className="object-contain hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="bg-white rounded-lg shadow-sm overflow-hidden flex items-center justify-center p-2">
                        <Image
                          src="/sticker.jpg"
                          alt="Dr. Interested Sticker - Healthcare Club Merchandise"
                          width={120}
                          height={120}
                          className="object-contain hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="bg-white rounded-lg shadow-sm overflow-hidden flex items-center justify-center p-2">
                        <Image
                          src="/mug.jpg"
                          alt="Dr. Interested Mug - Healthcare Club Merchandise"
                          width={120}
                          height={120}
                          className="object-contain hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <CardContent className="p-5 flex flex-col">
                  <div>
                    <h3 className="text-xl font-bold mb-3 text-[#405862]">Dr. Interested Merchandise</h3>
                    <p className="text-[#405862]/80 mb-4">
                      Support our mission while showing off your passion for healthcare! Our merchandise collection
                      includes t-shirts, hoodies, stickers, mugs, and more - all featuring our iconic Dr. Interested
                      designs.
                    </p>

                    <div className="space-y-3 mb-5">
                      <div className="flex items-center text-sm text-[#405862]/80">
                        <Tag className="h-4 w-4 mr-2 text-[#4ecdc4]" />
                        <span>High-quality apparel and accessories</span>
                      </div>
                      <div className="flex items-center text-sm text-[#405862]/80">
                        <ShoppingBag className="h-4 w-4 mr-2 text-[#4ecdc4]" />
                        <span>Multiple designs and colors available</span>
                      </div>
                      <div className="flex items-center text-sm text-[#405862]/80">
                        <ShoppingCart className="h-4 w-4 mr-2 text-[#4ecdc4]" />
                        <span>Proceeds support our educational programs</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-auto">
                    <Button className="w-full bg-[#405862] hover:bg-[#334852] group" asChild>
                      <Link
                        href="https://www.teepublic.com/user/dr-interested"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visit Our TeePublic Store
                        <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Latest Content Section */}
      <section className="py-10 bg-white">
        <div className="container">
          <motion.div
            className="text-center mb-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <h2 className="text-2xl font-bold text-[#405862] inline-flex flex-col items-center">
              Latest Content
              <div className="w-16 h-1 bg-[#4ecdc4] mt-2"></div>
            </h2>
            <p className="text-[#405862]/70 max-w-2xl mx-auto mt-2 text-sm">
              Explore our latest blog posts and podcast episodes
            </p>
          </motion.div>

          {/* Blog Section */}
          {recentPost && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="mb-10"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#405862]">Latest from Our Publications</h3>
                <Link href="/publications" className="text-[#405862] hover:text-[#4ecdc4] text-sm flex items-center group">
                  <span>View all posts</span>
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              <Card className="overflow-hidden border-[#405862]/10 shadow-md hover:shadow-lg transition-all duration-300 group">
                <div className="grid md:grid-cols-2">
                  <div className="relative h-48 md:h-auto overflow-hidden">
                    <Image
                      src={recentPost.coverImage || "/logo.png"}
                      alt={`Dr. Interested Blog: ${recentPost.title} - Healthcare education for high school students`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:hidden"></div>
                  </div>
                  <CardContent className="p-5 flex flex-col">
                    <div>
                      <div className="flex items-center text-xs text-[#405862]/70 mb-2 flex-wrap gap-2">
                        <span className="bg-[#405862]/10 px-2.5 py-0.5 rounded-full">{recentPost.topic}</span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {recentPost.readingTime}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {recentPost.date}
                        </span>
                      </div>
                      <Link href={`/blog/${recentPost.slug}`}>
                        <h3 className="text-lg font-bold mb-2 text-[#405862] group-hover:text-[#4ecdc4] transition-colors">
                          {recentPost.title}
                        </h3>
                      </Link>
                      <p className="text-[#405862]/80 mb-4 text-sm line-clamp-2">{recentPost.excerpt}</p>
                    </div>
                    <div className="mt-auto">
                      <div className="flex items-center mb-3">
                        <div className="relative h-8 w-8 rounded-full overflow-hidden mr-2">
                          <Image
                            src={recentPost.author.image || "/logo.png"}
                            alt={`${recentPost.author.name} - Dr. Interested Team Member`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="font-medium text-[#405862] text-sm">{recentPost.author.name}</span>
                      </div>
                      <Button className="w-full bg-[#405862] hover:bg-[#334852] group" asChild>
                        <Link href={`/blog/${recentPost.slug}`}>
                          Read Full Article
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Podcast Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#405862]">Dr. Interested Podcast</h3>
              <div className="flex items-center gap-2">
                <Link
                  href="https://open.spotify.com/show/6SLlRUL6co6fPxckAdrigf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1DB954] hover:text-[#1ed760] text-sm flex items-center group"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="mr-1"
                  >
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                  </svg>
                  <span>Spotify</span>
                </Link>
                <Link
                  href="https://www.youtube.com/playlist?list=PLhgtIQtU24W2axj8qIfCS-j1idk6LbCF4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FF0000] hover:text-[#ff3333] text-sm flex items-center group"
                >
                  <Youtube className="h-4 w-4 mr-1" />
                  <span>YouTube</span>
                </Link>
                <Link
                  href="https://music.youtube.com/playlist?list=PLhgtIQtU24W2axj8qIfCS-j1idk6LbCF4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#4285F4] hover:text-[#5a95f5] text-sm flex items-center group"
                >
                  <Music className="h-4 w-4 mr-1" />
                  <span>YouTube Music</span>
                </Link>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-4 border border-[#405862]/10">
                <h4 className="text-base font-semibold text-[#405862] mb-3">Listen on Spotify</h4>
                <LiteSpotify
                  episodeId="03vIYvBFFgNplGlVCKUmLm"
                  title="Eye Health and Vision Care — Dr. Interested Podcast"
                  watchHref="/listen/eye-health-and-vision-care"
                />
              </div>

              <div className="bg-white rounded-lg shadow-md p-4 border border-[#405862]/10">
                <h4 className="text-base font-semibold text-[#405862] mb-3 flex justify-between items-center">
                  <span>Watch on YouTube</span>
                  <Link
                    href="https://music.youtube.com/playlist?list=PLhgtIQtU24W2axj8qIfCS-j1idk6LbCF4"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#4285F4] hover:text-[#5a95f5] text-xs flex items-center"
                  >
                    <Music className="h-3 w-3 mr-1" />
                    <span>YouTube Music</span>
                  </Link>
                </h4>
                <LiteYouTube
                  id="dQiELtTYjQs"
                  title="Eye Health and Vision Care — Dr. Interested Podcast"
                  watchHref="/listen/eye-health-and-vision-care"
                />
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-[#405862]/80 mb-3">
                Our podcast features interviews with healthcare professionals, discussions about medical careers, and
                insights into the healthcare industry.
              </p>
              <div className="flex justify-center items-center gap-4 flex-wrap">
                <Link
                  href="https://open.spotify.com/show/6SLlRUL6co6fPxckAdrigf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-[#1DB954] hover:text-[#1ed760] text-sm font-medium"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="mr-1"
                  >
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                  </svg>
                  <span>Follow on Spotify</span>
                </Link>
                <Link
                  href="https://www.youtube.com/playlist?list=PLhgtIQtU24W2axj8qIfCS-j1idk6LbCF4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-[#FF0000] hover:text-[#ff3333] text-sm font-medium"
                >
                  <Play className="h-4 w-4 mr-1 fill-current" />
                  <span>Watch on YouTube</span>
                </Link>
                <Link
                  href="https://music.youtube.com/playlist?list=PLhgtIQtU24W2axj8qIfCS-j1idk6LbCF4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-[#4285F4] hover:text-[#5a95f5] text-sm font-medium"
                >
                  <Music className="h-4 w-4 mr-1" />
                  <span>Listen on YouTube Music</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

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

      {/* Stay Updated Section */}
      <section className="py-12 bg-[#405862] text-white">
        <div className="container max-w-4xl">
        </div>
      </section>
    </div>
  )
}
