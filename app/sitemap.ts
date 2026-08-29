import type { MetadataRoute } from "next"
import { supabase } from "@/lib/supabase-client"
import { blogTopics } from "@/data/blog"
import { getAllMembersCombined } from "@/lib/members-data"
import galleryManifest from "@/public/medexplore-2026/gallery-manifest.json"
import documentManifest from "@/public/medexplore-2026/letters-manifest.json"
import { POLICY_SUBMISSIONS } from "@/data/policy-submissions"
import { webinars as webinarData } from "@/data/webinars"
import { podcasts as podcastData } from "@/data/podcasts"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.drinterested.org"
  const currentDate = new Date()

  // Sitemap/RSS image URLs must be absolute — several curated data entries store a
  // site-relative path (e.g. "/11.png") rather than a full URL.
  const absoluteUrl = (path: string) => (path.startsWith("http") ? path : `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`)

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
    // Note: /blog and /blog/[slug] intentionally omitted — they 301-redirect to /publications
    // and /publications/[slug]. Listing a redirecting URL in the sitemap wastes crawl budget
    // and shows up as a "Page with redirect" issue in Search Console.
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

  // Fetch blogs — slug/created_at for the URL, cover_image so every post's image is
  // indexable via the sitemap's image extension (Google Images eligibility).
  const { data: blogs } = await supabase.from('blogs').select('slug, created_at, cover_image, title')

  // Blog topic pages — derived from static slugs (guaranteed to match actual routes)
  const blogTopicPages: MetadataRoute.Sitemap = blogTopics.map((topic) => ({
    url: `${baseUrl}/blog/topic/${topic.slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly" as const,
    priority: 0.65,
    images: topic.image ? [`${baseUrl}${topic.image}`] : undefined,
  }))

  const blogPostPages: MetadataRoute.Sitemap = (blogs || []).map((post) => {
    const coverImage = post.cover_image
      ? post.cover_image.startsWith("http")
        ? post.cover_image
        : `${baseUrl}${post.cover_image.startsWith("/") ? "" : "/"}${post.cover_image}`
      : undefined
    return {
      url: `${baseUrl}/publications/${post.slug}`,
      lastModified: new Date(post.created_at),
      changeFrequency: "monthly" as const,
      priority: 0.6,
      images: coverImage ? [coverImage] : undefined,
    }
  })

  // Fetch admin-announced webinars from Supabase (upcoming/completed, registration flow)
  const { data: dbWebinars } = await supabase.from('webinars').select('id, created_at')
  const dbWatchPages: MetadataRoute.Sitemap = (dbWebinars || []).map((webinar) => ({
    url: `${baseUrl}/watch/${webinar.id}`,
    lastModified: new Date(webinar.created_at),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  // Curated static episode archive — Dr. Interested Webinar Series, Code Blue Planet 2026, and
  // the Dr. Interested Podcast, pulled from their YouTube/Spotify sources. Each entry's YouTube
  // thumbnail is listed as that page's sitemap image (Google Images eligibility).
  const curatedWatchPages: MetadataRoute.Sitemap = webinarData.map((w) => ({
    url: `${baseUrl}/watch/${w.slug}`,
    lastModified: currentDate,
    changeFrequency: "yearly" as const,
    priority: 0.6,
    images: [absoluteUrl(w.thumbnailPath)],
  }))
  const listenPages: MetadataRoute.Sitemap = podcastData.map((p) => ({
    url: `${baseUrl}/listen/${p.slug}`,
    lastModified: currentDate,
    changeFrequency: "yearly" as const,
    priority: 0.6,
    images: [absoluteUrl(p.thumbnailPath)],
  }))
  const watchPages = [...dbWatchPages, ...curatedWatchPages]

  const publicationsCategoryPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/publications/webinars`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/publications/podcasts`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ]

  // Fetch all members from database using helper. Each member's headshot is listed as that
  // page's sitemap image — pairs the photo with the page whose <h1>/alt text carries their name,
  // which is what makes an image (not just the page) eligible for Google Images.
  const members = await getAllMembersCombined()
  const teamPages: MetadataRoute.Sitemap = members.map((member) => ({
    url: `${baseUrl}/team/${member.slug}`,
    lastModified: currentDate,
    changeFrequency: "monthly" as const,
    priority: 0.7,
    images: [member.image.startsWith("http") ? member.image : `${baseUrl}${member.image}`],
  }))

  // Policy submissions (e.g. UN/OHCHR filings) — each page's rendered PDF pages listed as
  // sitemap images too, same reasoning as the MedExplore image sitemap entries above.
  const policyPages: MetadataRoute.Sitemap = POLICY_SUBMISSIONS.map((submission) => ({
    url: `${baseUrl}/publications/policy/${submission.slug}`,
    lastModified: new Date(submission.isoDate),
    changeFrequency: "yearly",
    priority: 0.8,
    images: submission.documents.flatMap((doc) => doc.pages.map((p) => `${baseUrl}${p.file}`)),
  }))

  return [
    ...mainPages,
    ...medExplorePages,
    ...policyPages,
    ...impactReportPages,
    ...newsletterPage,
    ...chessPage,
    ...otherPages,
    ...publicationsCategoryPages,
    ...watchPages,
    ...listenPages,
    ...blogTopicPages,
    ...blogPostPages,
    ...teamPages,
  ]
}
