"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Mail, Globe, Linkedin, Instagram, ArrowLeft } from "lucide-react"
import { UnifiedMember } from "@/lib/members-data"
import { Button } from "@/components/ui/button"

interface MemberCardProps {
  member: UnifiedMember
}

export default function MemberCard({ member }: MemberCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const maxTilt = 8 // maximum tilt angle in degrees

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width // 0..1
    const y = (e.clientY - rect.top) / rect.height // 0..1
    const rotateY = (x - 0.5) * (maxTilt * 2)
    const rotateX = -(y - 0.5) * (maxTilt * 2)
    setTilt({
      x: Math.max(-maxTilt, Math.min(maxTilt, rotateX)),
      y: Math.max(-maxTilt, Math.min(maxTilt, rotateY)),
    })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
  }

  const getFormattedEmail = (name: string) => {
    const parts = name.trim().toLowerCase().split(/\s+/).filter(Boolean)
    if (parts.length === 0) return "info@drinterested.org"
    if (parts.length === 1) return `${parts[0]}@drinterested.org`
    const firstName = parts[0]
    const lastInitial = parts[parts.length - 1][0]
    return `${firstName}${lastInitial}@drinterested.org`
  }

  // Derive display email (use custom mailto if available, else firstnamelastinitial@drinterested.org)
  const formattedEmail = member.socials?.website?.includes("mailto:")
    ? member.socials.website.replace("mailto:", "")
    : getFormattedEmail(member.name)

  // Derive website link
  const websiteUrl = member.socials?.website && !member.socials.website.includes("mailto:")
    ? member.socials.website
    : "https://drinterested.org"
  
  const websiteDisplay = websiteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")

  // Derive tags/departments
  const departmentTags = member.department
    ? member.department.replace(/Department|Board/gi, "").trim()
    : "Healthcare | Education | Leadership"

  return (
    <div className="w-full flex flex-col items-center justify-center py-6 md:py-12 px-4">
      {/* Top Navigation */}
      <div className="w-full max-w-3xl mb-6 flex justify-start">
        <Link href="/members">
          <Button
            variant="outline"
            className="flex items-center gap-2 border-[#405862]/20 text-[#405862] hover:bg-[#4ecdc4]/10 hover:text-[#405862] hover:border-[#4ecdc4] transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all members
          </Button>
        </Link>
      </div>

      {/* 3D Tilt Business Card Container */}
      <div className="w-full max-w-3xl group" style={{ perspective: "1000px" }}>
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
          className="relative mx-auto rounded-2xl bg-white p-8 md:p-12 shadow-xl border border-[#4ecdc4]/30 ring-1 ring-[#405862]/5 transform-gpu transition-transform duration-200 ease-out [transform-style:preserve-3d] hover:shadow-2xl"
        >
          {/* Header Row with Brand & Logo Badge */}
          <div className="flex items-start justify-between gap-4 pb-6 border-b border-[#405862]/10">
            <div>
              <p className="text-xs md:text-sm font-semibold tracking-wider text-[#4ecdc4] uppercase font-bricolage">
                Dr. Interested
              </p>
              <h1 className="mt-1 text-2xl md:text-4xl font-bold text-[#405862] font-bricolage tracking-tight">
                {member.name}
              </h1>
              <p className="mt-1 text-sm md:text-base font-medium text-[#405862]/75">
                {member.role}
              </p>
            </div>

            {/* Logo Badge Icon */}
            <div className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-[#EDFAF9] border border-[#4ecdc4]/30 flex items-center justify-center p-2 shadow-sm overflow-hidden">
              <Image
                src="/circle-logo.png"
                alt="Dr. Interested Logo"
                width={48}
                height={48}
                className="object-contain rounded-full"
              />
            </div>
          </div>

          {/* Main Card Content */}
          <div className="mt-6 space-y-6">
            {/* Member Photo & Quick Contact Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Member Photo */}
              <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-xl overflow-hidden border-2 border-[#4ecdc4]/40 shadow-md flex-shrink-0 bg-[#f5f1eb]">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="(max-width: 768px) 128px, 144px"
                  className="object-cover"
                  priority
                />
              </div>

              {/* Quick Info & Email/Website */}
              <div className="flex-1 space-y-3 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-[#405862]/90">
                  <Mail className="h-4 w-4 text-[#4ecdc4] shrink-0" />
                  <a
                    href={`mailto:${formattedEmail}`}
                    className="hover:text-[#4ecdc4] transition-colors underline-offset-2 hover:underline"
                  >
                    {formattedEmail}
                  </a>
                </div>

                <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-[#405862]/90">
                  <Globe className="h-4 w-4 text-[#4ecdc4] shrink-0" />
                  <a
                    href={websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#4ecdc4] transition-colors underline-offset-2 hover:underline"
                  >
                    {websiteDisplay}
                  </a>
                </div>

                {/* Tagline */}
                <p className="text-xs md:text-sm text-[#405862]/70 italic pt-1">
                  Inspiring and supporting students on their path to healthcare careers.
                </p>

                {/* Department / Skill Tags */}
                <div className="pt-2">
                  <span className="inline-block text-xs font-semibold text-[#405862] bg-[#f5f1eb] px-3 py-1 rounded-full border border-[#405862]/10">
                    {departmentTags}
                  </span>
                </div>
              </div>
            </div>

            {/* Biography Section */}
            {member.bio && (
              <div className="pt-4 border-t border-[#405862]/10">
                <h3 className="text-xs uppercase font-bold text-[#405862]/60 tracking-wider mb-2 font-bricolage">
                  About {member.name.split(" ")[0]}
                </h3>
                <p className="text-sm md:text-base text-[#405862]/90 leading-relaxed font-normal">
                  {member.bio}
                </p>
              </div>
            )}

            {/* Social Links Footer */}
            {(member.socials?.linkedin || member.socials?.instagram || member.socials?.website) && (
              <div className="pt-4 border-t border-[#405862]/10 flex items-center justify-center sm:justify-start gap-4">
                {member.socials.linkedin && (
                  <a
                    href={member.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name}'s LinkedIn`}
                    className="p-2 rounded-full bg-[#f5f1eb] text-[#405862] hover:text-[#4ecdc4] hover:bg-[#EDFAF9] transition-all border border-[#405862]/10"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                )}

                {member.socials.instagram && (
                  <a
                    href={member.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name}'s Instagram`}
                    className="p-2 rounded-full bg-[#f5f1eb] text-[#405862] hover:text-[#4ecdc4] hover:bg-[#EDFAF9] transition-all border border-[#405862]/10"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                )}

                {member.socials.website && (
                  <a
                    href={member.socials.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name}'s Website`}
                    className="p-2 rounded-full bg-[#f5f1eb] text-[#405862] hover:text-[#4ecdc4] hover:bg-[#EDFAF9] transition-all border border-[#405862]/10"
                  >
                    <Globe className="h-5 w-5" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Back Button */}
      <div className="w-full max-w-3xl mt-8 flex justify-center">
        <Link href="/members">
          <Button
            size="lg"
            className="bg-[#405862] hover:bg-[#4ecdc4] text-white transition-colors flex items-center gap-2 px-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all members
          </Button>
        </Link>
      </div>
    </div>
  )
}
