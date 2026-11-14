"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Instagram,
  Linkedin,
  ExternalLink,
  Youtube,
  Music,
  ShoppingBag,
  Calendar,
  BookOpen,
  Users,
  Mail,
  Copy,
  Check,
} from "lucide-react"
import DiscordIcon from "@/components/icons/discord-icon"

export default function LinksPageClient() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const copyToClipboard = () => {
    navigator.clipboard.writeText("https://www.drinterested.org/links")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const links = [
    {
      title: "Join Our Discord Community",
      url: "https://discord.gg/pzbGRgsGXY",
      icon: <DiscordIcon className="h-5 w-5" />,
      color: "bg-[#5865F2] hover:bg-[#4752C4]",
    },
    {
      title: "Follow Us on Instagram",
      url: "https://www.instagram.com/dr.interested/",
      icon: <Instagram className="h-5 w-5" />,
      color:
        "bg-gradient-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] hover:from-[#e9be24] hover:via-[#de1a6b] hover:to-[#5218c7]",
    },
    {
      title: "Connect on LinkedIn",
      url: "https://www.linkedin.com/company/dr-interested",
      icon: <Linkedin className="h-5 w-5" />,
      color: "bg-[#0077B5] hover:bg-[#006699]",
    },
    {
      title: "Subscribe on YouTube",
      url: "https://www.youtube.com/@Dr.Interested",
      icon: <Youtube className="h-5 w-5" />,
      color: "bg-[#FF0000] hover:bg-[#CC0000]",
    },
    {
      title: "Listen on YouTube Music",
      url: "https://music.youtube.com/playlist?list=PLhgtIQtU24W2axj8qIfCS-j1idk6LbCF4",
      icon: <Music className="h-5 w-5" />,
      color: "bg-[#4285F4] hover:bg-[#3367D6]",
    },
    {
      title: "Listen on Spotify",
      url: "https://open.spotify.com/show/6SLlRUL6co6fPxckAdrigf",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="mr-1"
        >
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
        </svg>
      ),
      color: "bg-[#1DB954] hover:bg-[#1AA34A]",
    },
    {
      title: "Shop Our Merch",
      url: "https://www.teepublic.com/user/dr-interested",
      icon: <ShoppingBag className="h-5 w-5" />,
      color: "bg-[#374151] hover:bg-[#1F2937]",
    },
    {
      title: "Read Our 2026 Impact Report",
      url: "/impact-report",
      icon: <BookOpen className="h-5 w-5" />,
      color: "bg-[#2d8659] hover:bg-[#256f4a]",
    },
    {
      title: "Apply to Join the Team",
      url: "/members/apply",
      icon: <Users className="h-5 w-5" />,
      color: "bg-[#405862] hover:bg-[#334852]",
    },
    {
      title: "Upcoming Events",
      url: "/events",
      icon: <Calendar className="h-5 w-5" />,
      color: "bg-[#4ecdc4] hover:bg-[#3dbdb5]",
    },
    {
      title: "Read Our Blog",
      url: "/publications",
      icon: <BookOpen className="h-5 w-5" />,
      color: "bg-[#405862] hover:bg-[#334852]",
    },
    {
      title: "Meet Our Team",
      url: "/members",
      icon: <Users className="h-5 w-5" />,
      color: "bg-[#8B5CF6] hover:bg-[#7C3AED]",
    },
    {
      title: "Contact Us",
      url: "/contact",
      icon: <Mail className="h-5 w-5" />,
      color: "bg-[#EC4899] hover:bg-[#DB2777]",
    },
  ]

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
    <div className="hero-section min-h-screen bg-gradient-to-b from-[#f5f1eb] to-white py-10 px-4">
      <div className="max-w-md mx-auto">
        <motion.div
          className="flex flex-col items-center mb-8"
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          variants={fadeIn}
        >
          <div className="relative h-24 w-24 mb-4">
            <Image
              src="/logo.png"
              alt="Dr. Interested Logo"
              fill
              className="object-contain rounded-full border-2 border-[#4ecdc4] p-1"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold text-[#405862] text-center">
            Dr. <span className="text-[#4ecdc4]">Interested</span>
          </h1>
          <p className="text-[#405862]/80 text-center mt-2 text-sm max-w-xs">
            A youth led global wellness organization
          </p>

          <div className="flex items-center mt-3 text-sm bg-[#f0ebe3] rounded-full px-3 py-1.5">
            <span className="text-[#405862]/70 mr-2">www.drinterested.org/links</span>
            <button
              onClick={copyToClipboard}
              className="text-[#4ecdc4] hover:text-[#3dbdb5] transition-colors"
              aria-label="Copy link to clipboard"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </motion.div>

        <motion.div
          className="space-y-3"
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          {links.map((link, index) => (
            <motion.div key={index} variants={fadeIn}>
              <Link
                href={link.url}
                target={link.url.startsWith("http") ? "_blank" : undefined}
                rel={link.url.startsWith("http") ? "noopener noreferrer" : undefined}
                className={`flex items-center justify-between w-full px-4 py-3 rounded-lg text-white transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md ${link.color}`}
              >
                <div className="flex items-center">
                  {link.icon}
                  <span className="ml-2 font-medium">{link.title}</span>
                </div>
                {link.url.startsWith("http") && <ExternalLink className="h-4 w-4 opacity-70" />}
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-10 text-center text-sm text-[#405862]/60"
          initial={{ opacity: 0 }}
          animate={isLoaded ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <p>© {new Date().getFullYear()} Dr. Interested</p>
          <div className="flex justify-center space-x-3 mt-2">
            <Link href="/privacy-policy" className="hover:text-[#4ecdc4] transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-[#4ecdc4] transition-colors">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-[#4ecdc4] transition-colors">
              Contact
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
