import type { MetadataRoute } from "next"
import { supabase } from "@/lib/supabase-client"
import { blogTopics } from "@/data/blog"
import { getAllMembersCombined } from "@/lib/members-data"
import galleryManifest from "@/public/medexplore-2026/gallery-manifest.json"
import documentManifest from "@/public/medexplore-2026/letters-manifest.json"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.drinterested.org"
  const currentDate = new Date()

  // Every MedExplore 2026 (MedX 2026) recap photo, letter, and certificate — indexed as an
  // image sitemap entry on the canonical /medx-2026 URL so each one is eligible for Google Images.
  const medExploreGalleryImages = Object.values(
    galleryManifest as Record<string, { file: string }[]>,
  ).flatMap((entries) => entries.map((e) => `${baseUrl}${e.file}`))
  const medExploreDocumentImages = (documentManifest as { image: string }[]).map((d) => `${baseUrl}${d.image}`)
  const medExplorePages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/medx-2026`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.9,
      images: [
        `${baseUrl}/medexplore-2026/MedExplore2026.png`,
        ...medExploreGalleryImages,
        ...medExploreDocumentImages,
      ],
    },
  ]

  const mainPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/our-work`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/members/apply`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/members`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/publications`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 1.0,
    },
  ]

  const impactReportPages: MetadataRoute.Sitemap = [
    {
      url: "https://impact.drinterested.org",
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: "https://impact.drinterested.org/2025/annual",
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.9,
    },
    {
      url: "https://impact.drinterested.org/2025/semi-annual",
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: "https://impact.drinterested.org/2025.pdf",
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/dr-interested-impact-report-2025%20(1).pdf`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.7,
    },
  ]

  const newsletterPage: MetadataRoute.Sitemap = [
    {
      url: "https://news.drinterested.org",
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ]

  const chessPage: MetadataRoute.Sitemap = [
    {
      url: "https://chess.drinterested.org",
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ]

  const otherPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/links`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sponsorships`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/events/internship-recap`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/certificate`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ]

  // Fetch blogs (only need slug and created_at for the blog post pages)
  const { data: blogs } = await supabase.from('blogs').select('slug, created_at')

  // Blog topic pages — derived from static slugs (guaranteed to match actual routes)
  const blogTopicPages: MetadataRoute.Sitemap = blogTopics.map((topic) => ({
    url: `${baseUrl}/blog/topic/${topic.slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly" as const,
    priority: 0.65,
  }))

  const blogPostPages: MetadataRoute.Sitemap = (blogs || []).map((post) => ({
    url: `${baseUrl}/publications/${post.slug}`,
    lastModified: new Date(post.created_at),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  // Fetch webinars
  const { data: webinars } = await supabase.from('webinars').select('id, created_at')
  const watchPages: MetadataRoute.Sitemap = (webinars || []).map((webinar) => ({
    url: `${baseUrl}/watch/${webinar.id}`,
    lastModified: new Date(webinar.created_at),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  // Fetch all members from database using helper
  const members = await getAllMembersCombined()
  const teamPages: MetadataRoute.Sitemap = members.map((member) => ({
    url: `${baseUrl}/team/${member.slug}`,
    lastModified: currentDate,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  return [
    ...mainPages,
    ...medExplorePages,
    ...impactReportPages,
    ...newsletterPage,
    ...chessPage,
    ...otherPages,
    ...watchPages,
    ...blogTopicPages,
    ...blogPostPages,
    ...teamPages,
  ]
}
