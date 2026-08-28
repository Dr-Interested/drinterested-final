import type { Metadata } from "next"
import { generateSeoMetadata } from "@/lib/seo-utils"
import PublicationsClientPage from "./PublicationsClientPage"
import { supabase } from "@/lib/supabase-client"
import { resolvePublicationAuthor } from "@/lib/author-backfill"
import { POLICY_SUBMISSIONS } from "@/data/policy-submissions"
import { webinars as webinarData } from "@/data/webinars"
import { podcasts as podcastData } from "@/data/podcasts"
import type { MediaItem } from "./PublicationsClientPage"

// Newest-first by date; both data files use human-readable "Month D, YYYY" strings.
const byDateDesc = (a: { date: string }, b: { date: string }) =>
  new Date(b.date).getTime() - new Date(a.date).getTime()

const curatedWebinars: MediaItem[] = [...webinarData]
  .sort(byDateDesc)
  .map((w) => ({
    id: w.id,
    slug: w.slug,
    title: w.title,
    description: w.description,
    date: w.date,
    thumbnailPath: w.thumbnailPath,
    youtubeUrl: w.youtubeUrl,
    spotifyUrl: w.spotifyUrl,
    speaker: w.speaker,
  }))

const curatedPodcasts: MediaItem[] = [...podcastData]
  .sort(byDateDesc)
  .map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    description: p.description,
    date: p.date,
    thumbnailPath: p.thumbnailPath,
    youtubeUrl: p.youtubeUrl,
    spotifyUrl: p.spotifyUrl,
    speaker: p.speaker,
  }))

export const revalidate = 300; // Revalidate every 5 minutes (ISR)

export const metadata: Metadata = generateSeoMetadata({
  title: "Publications",
  description:
    "Explore Dr. Interested's blog posts, op-eds, and policy work on healthcare education and medical advocacy.",
  url: "https://www.drinterested.org/publications",
  keywords: [
    "healthcare publications",
    "medical policy",
    "op-eds",
    "healthcare research",
    "advocacy",
    "policy statements",
  ],
})

export default async function PublicationsPage() {
  // Fetch all content: blogs, op-eds, and policy work
  const { data: allContentData, error: contentError } = await supabase
    .from("blogs")
    .select(`
      *,
      author:members (
        name,
        bio,
        image,
        socials
      )
    `)
    .order("created_at", { ascending: false })

  const formatContent = (contentData: any) => {
    let authorData = contentData.author || {}
    if (Array.isArray(authorData)) authorData = authorData[0] || {}

    // Live member → historical roster backup → generic "Publications Team" fallback, so a
    // departed member's old posts still show a real name/photo instead of "Unknown Author".
    const author = resolvePublicationAuthor({
      slug: contentData.slug,
      authorName: contentData.author_name,
      liveMember: authorData.name ? authorData : null,
    })

    return {
      slug: contentData.slug,
      title: contentData.title,
      excerpt: contentData.excerpt,
      content: contentData.content,
      coverImage: contentData.cover_image,
      topic: contentData.topic,
      readingTime: contentData.reading_time,
      featured: contentData.featured,
      contentType: contentData.content_type || "blog",
      policyType: contentData.policy_type || null, // "report", "joint-statement", "input"
      date: new Date(contentData.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      author: {
        name: author.name,
        image: author.image,
        bio: author.bio,
        linkedIn: author.linkedIn || "",
        twitter: "",
        instagram: author.instagram || "",
      }
    }
  }

  let policyWork: any[] = []
  let opEds: any[] = []
  let blogs: any[] = []

  if (!contentError && allContentData && Array.isArray(allContentData)) {
    const formattedContent = allContentData.map(formatContent)
    policyWork = formattedContent.filter(c => c.contentType === "policy")
    opEds = formattedContent.filter(c => c.contentType === "op-ed")
    blogs = formattedContent.filter(c => c.contentType === "blog")
  } else if (contentError) {
    console.error("Error fetching publications:", contentError)
  }

  // Manually-curated policy submissions (e.g. UN/OHCHR filings) that live outside the CMS —
  // their own dedicated page at /publications/policy/[slug] gets richer treatment (PDF page
  // images + full text + prominent OHCHR links) than the generic blog editor supports.
  // Prefixing the slug with "policy/" makes the existing card's /publications/${slug} link
  // resolve straight to that route without needing to change the shared card component.
  const curatedPolicyWork = POLICY_SUBMISSIONS.map((submission) => ({
    slug: `policy/${submission.slug}`,
    title: submission.title,
    excerpt: submission.summary,
    content: "",
    coverImage: submission.documents[0]?.pages[0]?.file || "/websitebanner.jpg",
    topic: submission.resolution,
    readingTime: `${submission.documents.reduce((n, d) => n + d.paragraphs.length, 0)} min read`,
    featured: true,
    contentType: "policy",
    policyType: "input",
    date: submission.date,
    author: {
      name: "Dr. Interested",
      image: "/circle-logo.png",
      bio: "",
      linkedIn: "",
      twitter: "",
      instagram: "",
    },
  }))

  policyWork = [...curatedPolicyWork, ...policyWork]

  return (
    <PublicationsClientPage
      policyWork={policyWork}
      opEds={opEds}
      blogs={blogs}
      webinars={curatedWebinars}
      podcasts={curatedPodcasts}
    />
  )
}
