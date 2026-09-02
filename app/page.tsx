import type { Metadata } from "next"
import ClientPage from "./client-page"
import { supabase } from "@/lib/supabase-client"

export const revalidate = 300; // Revalidate homepage every 5 minutes (ISR)

export const metadata: Metadata = {
  title: "Dr. Interested - Inspiring Future Healthcare Leaders",
  description:
    'Dr. Interested supports youth in finding their unique "spark" in medicine through programs & opportunities. Earn volunteer hours while building your future!',
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

  return <ClientPage recentPost={recentPost} featuredEvent={featuredEvent} featuredPosts={featuredPosts} />
}
