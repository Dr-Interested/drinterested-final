import { supabase } from "@/lib/supabase-client"
import { resolvePublicationAuthor } from "@/lib/author-backfill"
import { POLICY_SUBMISSIONS } from "@/data/policy-submissions"

export type Publication = {
  slug: string
  title: string
  excerpt: string
  content: string
  coverImage: string
  topic: string
  readingTime: string
  featured?: boolean
  contentType: string
  policyType?: string | null
  date: string
  author: {
    name: string
    image: string
    bio: string
    linkedIn?: string
    twitter?: string
    instagram?: string
  }
}

/**
 * Fetches every blog/op-ed/policy row from Supabase, resolves authors (live member →
 * historical roster backup → generic fallback), and merges in the manually-curated policy
 * submissions (e.g. UN/OHCHR filings) that live outside the CMS. Shared by the main
 * /publications page and its three CMS-backed category subpages (blog, op-eds, policy) so
 * they never drift out of sync on filtering/author logic.
 *
 * Returns full, unsliced, newest-first lists — callers decide how much to show.
 */
export async function getAllPublications(): Promise<{
  policyWork: Publication[]
  opEds: Publication[]
  blogs: Publication[]
}> {
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

  const formatContent = (contentData: any): Publication => {
    let authorData = contentData.author || {}
    if (Array.isArray(authorData)) authorData = authorData[0] || {}

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
      policyType: contentData.policy_type || null,
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
      },
    }
  }

  let policyWork: Publication[] = []
  let opEds: Publication[] = []
  let blogs: Publication[] = []

  if (!contentError && allContentData && Array.isArray(allContentData)) {
    const formatted = allContentData.map(formatContent)
    policyWork = formatted.filter((c) => c.contentType === "policy")
    opEds = formatted.filter((c) => c.contentType === "op-ed")
    blogs = formatted.filter((c) => c.contentType === "blog")
  } else if (contentError) {
    console.error("Error fetching publications:", contentError)
  }

  // Manually-curated policy submissions get their own richer page at
  // /publications/policy/[slug] (PDF page images + full text + prominent OHCHR links) than the
  // generic blog editor supports. Prefixing the slug with "policy/" makes the shared card's
  // /publications/${slug} link resolve straight there without a special case in the card itself.
  const curatedPolicyWork: Publication[] = POLICY_SUBMISSIONS.map((submission) => ({
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

  return { policyWork: [...curatedPolicyWork, ...policyWork], opEds, blogs }
}
