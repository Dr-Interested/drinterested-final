import type { Metadata } from "next"
import { blogTopics as topics } from "@/data/blog"
import BlogTopicClientPage from "./blog-topic-client"
import { supabase } from "@/lib/supabase-client"
import { resolvePublicationAuthor } from "@/lib/author-backfill"

export const revalidate = 300 // Revalidate topic pages every 5 minutes (ISR)

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const topic = topics.find((t) => t.slug === slug)

  if (!topic) {
    return {
      title: "Topic Not Found",
    }
  }

  const baseUrl = "https://www.drinterested.org"
  const topicUrl = `${baseUrl}/blog/topic/${topic.slug}`

  return {
    title: `${topic.name} | Dr. Interested Blog`,
    description: topic.description,
    keywords: [
      topic.name,
      "Dr. Interested",
      "blog",
      "healthcare",
      "medical education",
      "articles",
      ...topic.name.split(" "),
    ],
    openGraph: {
      title: `${topic.name} | Dr. Interested Blog`,
      description: topic.description,
      url: topicUrl,
      type: "website",
      siteName: "Dr. Interested",
      images: [
        {
          url: `${baseUrl}${topic.image}`,
          width: 1280,
          height: 720,
          alt: topic.name,
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${topic.name} | Dr. Interested Blog`,
      description: topic.description,
      images: {
        url: `${baseUrl}${topic.image}`,
        alt: topic.name,
      },
    },
    alternates: {
      canonical: topicUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function BlogTopicPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const topic = topics.find((t) => t.slug === slug)

  // Fetch live posts from Supabase filtered by this topic
  const { data: blogsData } = topic
    ? await supabase
        .from("blogs")
        .select(`
          slug, title, excerpt, cover_image, topic, reading_time, created_at, author_name,
          author:members (
            name,
            image,
            socials
          )
        `)
        .eq("topic", topic.name)
        .order("created_at", { ascending: false })
    : { data: [] }

  // Map DB shape to the shape the client component expects
  const formattedPosts = (blogsData || []).map((blog: any) => {
    let authorData = blog.author || {}
    if (Array.isArray(authorData)) authorData = authorData[0] || {}

    // Live member → historical roster backup → generic "Publications Team" fallback.
    const author = resolvePublicationAuthor({
      slug: blog.slug,
      authorName: blog.author_name,
      liveMember: authorData.name ? authorData : null,
    })

    return {
      slug: blog.slug,
      title: blog.title,
      excerpt: blog.excerpt,
      coverImage: blog.cover_image,
      topic: blog.topic,
      readingTime: blog.reading_time,
      date: new Date(blog.created_at).toLocaleDateString("en-US", {
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
  })

  return <BlogTopicClientPage slug={slug} initialPosts={formattedPosts} />
}
