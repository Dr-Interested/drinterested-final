"use client"

import { useEffect, useState } from "react"
import ScrollToTop from "@/components/scroll-to-top"
import { DomainAnnouncementPopup } from "@/components/domain-announcement-popup"
import HeroSection from "@/components/home/HeroSection"
import MissionSection from "@/components/home/MissionSection"
import AboutSection from "@/components/home/AboutSection"
import LatestEventSection from "@/components/home/LatestEventSection"
import MerchSection from "@/components/home/MerchSection"
import LatestContentSection from "@/components/home/LatestContentSection"
import QuickLinksSection from "@/components/home/QuickLinksSection"
import StayUpdatedSection from "@/components/home/StayUpdatedSection"

// The home page, one component per section (task.md A7). Data comes from app/page.tsx.
export default function HomePage({
  recentPost,
  featuredEvent,
  featuredPosts,
}: {
  recentPost?: any
  featuredEvent?: any
  featuredPosts?: any[]
}) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <DomainAnnouncementPopup />
      <HeroSection isLoaded={isLoaded} />
      <MissionSection />
      <AboutSection />
      <LatestEventSection latestEvent={featuredEvent} />
      <MerchSection />
      <LatestContentSection featuredPosts={featuredPosts || []} recentPost={recentPost} />
      <QuickLinksSection />
      <StayUpdatedSection />
    </div>
  )
}
