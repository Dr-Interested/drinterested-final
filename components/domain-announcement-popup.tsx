"use client"
import { useState, useEffect } from "react"
import { X, PartyPopper } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ALL_TIME, IMPACT_REPORT_2026, YEAR_2026 } from "@/lib/impact-stats"

// Bump the key when a new report comes out so returning visitors see the announcement again.
const SEEN_KEY = "hasSeenImpactReport2026"

interface DomainAnnouncementPopupProps {
  onClose?: () => void
  isMainPage?: boolean
}

export function DomainAnnouncementPopup({ onClose, isMainPage = false }: DomainAnnouncementPopupProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const hasSeenAnnouncement = (() => {
      try {
        return localStorage.getItem(SEEN_KEY)
      } catch {
        return "1"
      }
    })()

    if (!hasSeenAnnouncement) {
      const timer = setTimeout(
        () => {
          setIsVisible(true)
        },
        isMainPage ? 1000 : 500,
      )

      return () => clearTimeout(timer)
    }
  }, [isMainPage])

  const handleClose = () => {
    setIsVisible(false)
    try {
      localStorage.setItem(SEEN_KEY, "true")
    } catch {}
    setTimeout(() => {
      onClose?.()
    }, 300)
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60 backdrop-blur-md"
        onClick={handleClose}
      />

      {/* Popup Container */}
      <div
        className={`relative transform transition-all duration-500 ease-out ${
          isVisible ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4"
        }`}
      >
        {/* Main Card */}
        <Card className={`w-full ${isMainPage ? "max-w-lg" : "max-w-md"} mx-auto overflow-hidden shadow-2xl border-0`}>
          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            aria-label="Close announcement"
            className="absolute right-3 top-3 z-10 h-8 w-8 p-0 rounded-full bg-white/80 hover:bg-white/90 shadow-sm"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close announcement</span>
          </Button>

          {/* Main Content */}
          <CardContent className="p-0">
            <div className="bg-gradient-to-br from-[#f5f1eb] to-[#f0ebe3] p-8 pt-12 relative overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#4ecdc4]/10 rounded-full -translate-y-16 translate-x-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#405862]/10 rounded-full translate-y-12 -translate-x-12" />

              <div className="relative z-10 text-center space-y-6">
                {/* Badge */}
                <div className="flex justify-center">
                  <Badge className="bg-[#4ecdc4] hover:bg-[#4ecdc4] text-white px-3 py-1 text-xs font-medium shadow-sm">
                    <PartyPopper className="h-3 w-3 mr-1" />
                    New Report
                  </Badge>
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-[#405862] leading-tight">Our 2026 Annual Impact Report Is Here</h2>
                  <p className="text-sm font-medium text-[#405862]/70">A year of youth led change and impact</p>
                </div>

                <p className="text-sm text-[#405862]/80 leading-relaxed max-w-md mx-auto">
                  This year, {YEAR_2026.executives} executives and {YEAR_2026.volunteers} volunteers helped us reach{" "}
                  {YEAR_2026.youthImpacted} young people through wellness career education, access to policy spaces, and
                  community spaces.
                </p>

                <div className="grid grid-cols-3 gap-2 bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-[#4ecdc4]/30">
                  <div>
                    <p className="text-lg font-bold text-[#405862]">{ALL_TIME.youthImpacted}</p>
                    <p className="text-[11px] text-[#405862]/70">youth impacted since 2025</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-[#405862]">{ALL_TIME.members}</p>
                    <p className="text-[11px] text-[#405862]/70">members</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-[#405862]">{ALL_TIME.countries}</p>
                    <p className="text-[11px] text-[#405862]/70">countries and territories</p>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Button
                    asChild
                    className="bg-gradient-to-r from-[#405862] to-[#4a6570] hover:from-[#4a6570] hover:to-[#405862] text-white px-6 py-3 rounded-xl font-medium shadow-lg"
                  >
                    <a href={IMPACT_REPORT_2026.path} target="_blank" rel="noopener" onClick={handleClose}>
                      Read the Report (PDF)
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="rounded-xl border-[#405862]/30 text-[#405862]">
                    <Link href="/impact-report" onClick={handleClose}>
                      See the highlights
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
