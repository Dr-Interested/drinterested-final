"use client"
import { useState, useEffect } from "react"
import { X, Sparkles, PartyPopper } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface DomainAnnouncementPopupProps {
  onClose?: () => void
  isMainPage?: boolean
}

export function DomainAnnouncementPopup({ onClose, isMainPage = false }: DomainAnnouncementPopupProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const hasSeenAnnouncement = localStorage.getItem("hasSeenDomainAnnouncement_v2")

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
    localStorage.setItem("hasSeenDomainAnnouncement_v2", "true")
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
                    Important Announcement
                  </Badge>
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-[#405862] leading-tight">2025 Annual Impact Report Released!</h2>
                  <p className="text-sm font-medium text-[#405862]/70">See the Latest Numbers and Achievements</p>
                </div>

                {/* Description */}
                <div className="space-y-3">
                  <p className="text-sm text-[#405862]/80 leading-relaxed max-w-md mx-auto">
                    We're thrilled to share our 2025 Annual Impact Report, showcasing the incredible journey of Dr. Interested and our global community of healthcare-focused youth.
                  </p>

                  <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-[#4ecdc4]/30">
                    <p className="text-lg font-bold text-[#405862]">View Our Impact Report</p>
                    <p className="text-xs text-[#405862]/70 mt-1">Download the full 2025 report</p>
                  </div>

                  <p className="text-sm text-[#405862]/80 leading-relaxed max-w-md mx-auto">
                    Discover how we've impacted thousands of students worldwide and helped shape the future of healthcare education.
                  </p>
                </div>

                {/* CTA Button */}
                <Button
                  asChild
                  className="bg-gradient-to-r from-[#405862] to-[#4a6570] hover:from-[#4a6570] hover:to-[#405862] text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <a href="https://impact.drinterested.org/2025/annual" target="_blank" rel="noopener noreferrer">
                    View Report
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
