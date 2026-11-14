import type { Metadata } from "next"
import ClientPage from "./client-page"
import { supabase } from "@/lib/supabase-client"
import SeoSchema from "@/components/seo-schema"
import { ALL_TIME, IMPACT_REPORT_2026, YEAR_2026 } from "@/lib/impact-stats"

export const revalidate = 300; // Revalidate homepage every 5 minutes (ISR)

export const metadata: Metadata = {
  // An absolute title: the root template would otherwise append "| Dr. Interested" twice.
  title: { absolute: "Dr. Interested | Youth Led Global Wellness Organization" },
  description: `Youth led global wellness organization. ${ALL_TIME.youthImpacted} youth impacted in ${ALL_TIME.countries} countries through free wellness career education, policy access, and community spaces.`,
  alternates: {
    canonical: "https://www.drinterested.org",
    languages: {
      "en-US": "https://www.drinterested.org",
    },
  },
}

export default async function Page() {
  // Fetch featured event from Supabase
  const { data: featuredEventData } = await supabase
    .from("events")
    .select("*")
    .eq("featured", true)
    .eq("is_past", false)
    .order("date", { ascending: true })
    .limit(1)
    .single()

  // If no featured upcoming event, get the latest upcoming event
  let featuredEvent = null
  if (featuredEventData) {
    featuredEvent = featuredEventData
  } else {
    const { data: latestEventData } = await supabase
      .from("events")
      .select("*")
      .eq("is_past", false)
      .order("date", { ascending: true })
      .limit(1)
      .single()
    featuredEvent = latestEventData
  }

  // Fetch featured blog posts from Supabase
  const { data: featuredBlogsData } = await supabase
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
    .eq("featured", true)
    .eq("content_type", "blog")
    .order("created_at", { ascending: false })
    .limit(3)

  // Fetch most recent blog post from Supabase
  const { data: recentPostData } = await supabase
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
    .eq("content_type", "blog")
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  // Helper function to format blog posts
  const formatBlogPost = (blogData: any) => {
    let authorData = blogData.author || {}
    if (Array.isArray(authorData)) authorData = authorData[0] || {}
    
    // Priority: manual author_name field > joined member name > "Unknown Author"
    const resolvedAuthorName = blogData.author_name || authorData.name || "Unknown Author"

    return {
      slug: blogData.slug,
      title: blogData.title,
      excerpt: blogData.excerpt,
      content: blogData.content,
      coverImage: blogData.cover_image,
      topic: blogData.topic,
      readingTime: blogData.reading_time,
      featured: blogData.featured,
      date: new Date(blogData.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      author: {
        name: resolvedAuthorName,
        image: authorData.image || "/logo.png",
        bio: authorData.bio || "",
        linkedIn: authorData.socials?.linkedin || "",
        twitter: authorData.socials?.twitter || "",
        instagram: authorData.socials?.instagram || "",
      }
    }
  }

  let recentPost = null
  if (recentPostData) {
    recentPost = formatBlogPost(recentPostData)
  }

  let featuredPosts: any[] = []
  if (featuredBlogsData && Array.isArray(featuredBlogsData)) {
    featuredPosts = featuredBlogsData.map(formatBlogPost)
  }

  return (
    <>
      {/* Homepage-only structured data: the site name Google shows in results, and the latest
          Impact Report (the 2026 report is listed first so it is the one search engines surface). */}
      <SeoSchema
        id="website-schema"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Dr. Interested",
          alternateName: ["Dr Interested", "Doctor Interested"],
          url: "https://www.drinterested.org",
        }}
      />
      <SeoSchema
        id="impact-report-schema"
        schema={{
          "@context": "https://schema.org",
          "@type": "Report",
          name: IMPACT_REPORT_2026.title,
          url: "https://www.drinterested.org/impact-report",
          encodingFormat: "application/pdf",
          contentUrl: IMPACT_REPORT_2026.url,
          thumbnailUrl: `https://www.drinterested.org${IMPACT_REPORT_2026.cover}`,
          datePublished: IMPACT_REPORT_2026.published,
          inLanguage: "en",
          author: { "@type": "Organization", name: "Dr. Interested", url: "https://www.drinterested.org" },
          description: `Dr. Interested's 2026 Annual Impact Report: ${YEAR_2026.youthImpacted} youth impacted in 2026 and ${ALL_TIME.youthImpacted} across 2025 and 2026, through wellness career education, access to policy spaces, and community spaces.`,
        }}
      />
      <ClientPage recentPost={recentPost} featuredEvent={featuredEvent} featuredPosts={featuredPosts} />
    </>
  )
}
