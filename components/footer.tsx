"use client"

import Link from "next/link"
import Image from "next/image"
import { Instagram, Linkedin, ArrowUp } from "lucide-react"
import NewsletterForm from "./newsletter-form"
import DiscordIcon from "@/components/icons/discord-icon"

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <footer className="bg-[#405862] text-white py-10">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Column 1: Logo and Description */}
          <div className="md:col-span-3">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/circle-logo.png"
                alt="Dr. Interested Logo"
                width={50}
                height={50}
                className="rounded-full"
                priority
              />
              <span className="font-bold text-lg">
                Dr. <span className="text-[#4ecdc4]">Interested</span>
              </span>
            </div>
            <p className="text-sm mb-4 text-white/80">
              Inspiring the next generation of healthcare professionals through education, collaboration, and meaningful
              experiences.
            </p>
            <div className="flex space-x-3">
              <Link
                href="https://www.instagram.com/dr.interested/"
                className="text-white hover:text-[#4ecdc4] transition-colors"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.linkedin.com/company/dr-interested"
                className="text-white hover:text-[#4ecdc4] transition-colors"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link
                href="https://discord.gg/pzbGRgsGXY"
                className="text-white hover:text-[#4ecdc4] transition-colors"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Discord"
              >
                <DiscordIcon className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="md:col-span-2">
            <h3 className="text-base font-semibold mb-3 flex items-center">
              <span className="w-2 h-4 bg-[#4ecdc4] mr-2"></span>
              Quick Links
            </h3>
            <ul className="space-y-1.5 text-sm">
              <li>
                <Link href="/" className="text-white/80 hover:text-[#4ecdc4] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/our-work" className="text-white/80 hover:text-[#4ecdc4] transition-colors">
                  Our Work
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-white/80 hover:text-[#4ecdc4] transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/publications" className="text-white/80 hover:text-[#4ecdc4] transition-colors">
                  Publications
                </Link>
              </li>
              <li>
                <Link href="/members" className="text-white/80 hover:text-[#4ecdc4] transition-colors">
                  Members
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/80 hover:text-[#4ecdc4] transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="https://impact.drinterested.org/2025/annual"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-[#4ecdc4] transition-colors"
                >
                  2025 Annual Impact Report
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Us */}
          <div className="md:col-span-3">
            <h3 className="text-base font-semibold mb-3 flex items-center">
              <span className="w-2 h-4 bg-[#4ecdc4] mr-2"></span>
              Contact Us
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <div className="text-[#4ecdc4] font-medium text-xs">Need our Admin?</div>
                <a
                  href="mailto:admin@drinterested.org"
                  className="text-white/80 hover:text-[#4ecdc4] transition-colors"
                >
                  admin@drinterested.org
                </a>
              </li>
              <li>
                <div className="text-[#4ecdc4] font-medium text-xs">Want to sponsor us?</div>
                <a
                  href="mailto:finance@drinterested.org"
                  className="text-white/80 hover:text-[#4ecdc4] transition-colors"
                >
                  finance@drinterested.org
                </a>
              </li>
              <li>
                <div className="text-[#4ecdc4] font-medium text-xs">Want to work with us?</div>
                <a
                  href="mailto:outreach@drinterested.org"
                  className="text-white/80 hover:text-[#4ecdc4] transition-colors"
                >
                  outreach@drinterested.org
                </a>
              </li>
              <li>
                <div className="text-[#4ecdc4] font-medium text-xs">Everything else:</div>
                <a
                  href="mailto:general@drinterested.org"
                  className="text-white/80 hover:text-[#4ecdc4] transition-colors"
                >
                  general@drinterested.org
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Stay Updated */}
          <div className="md:col-span-4">
            <h3 className="text-base font-semibold mb-3 flex items-center">
              <span className="w-2 h-4 bg-[#4ecdc4] mr-2"></span>
              Stay Updated
            </h3>
            <p className="text-sm mb-3 text-white/80">Subscribe for the latest events and opportunities.</p>

            {/* Use our newsletter component with compact styling for the footer */}
            <div className="bg-[#4f6b75] p-3 rounded">
              <NewsletterForm darkMode={true} showFirstName={false} compact={true} />
            </div>
          </div>
        </div>

        <div className="mt-8 pt-5 border-t border-[#4f6b75] flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="text-xs text-white/70">© {new Date().getFullYear()} Dr. Interested. All rights reserved.</div>

          <div className="flex items-center gap-3 text-xs">
            <Link
              href="/dashboard?login=true"
              className="bg-[#4f6b75] hover:bg-[#4ecdc4] hover:text-[#405862] text-white px-2.5 py-1 rounded transition-all font-medium"
            >
              Portal Dashboard
            </Link>
            <span className="text-white/50">•</span>
            <Link href="/terms" className="text-white/70 hover:text-[#4ecdc4] transition-colors">
              Terms & Conditions
            </Link>
            <span className="text-white/50">•</span>
            <Link href="/privacy-policy" className="text-white/70 hover:text-[#4ecdc4] transition-colors">
              Privacy Policy
            </Link>
            <span className="text-white/50">•</span>
            <Link href="/ai-policy" className="text-white/70 hover:text-[#4ecdc4] transition-colors">
              AI Policy
            </Link>
            <span className="text-white/50">•</span>
            <Link href="/safeguarding-policy" className="text-white/70 hover:text-[#4ecdc4] transition-colors">
              Safeguarding Policy
            </Link>
            <button
              onClick={scrollToTop}
              className="text-white hover:text-[#4ecdc4] transition-colors bg-[#4f6b75] p-1.5 rounded-full ml-2"
              aria-label="Scroll to top"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
