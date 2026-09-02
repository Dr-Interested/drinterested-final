"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { blogTopics, type BlogTopic } from "@/data/blog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, ChevronLeft, ChevronRight } from "lucide-react"
import ScrollToTop from "@/components/scroll-to-top"

type BlogPost = {
  slug: string
  title: string
  excerpt: string
  coverImage: string
  topic: string
  readingTime: string
  date: string
  author: {
    name: string
    image: string
    bio?: string
    linkedIn?: string
    twitter?: string
    instagram?: string
  }
}

interface BlogTopicClientPageProps {
  slug: string
  initialPosts: BlogPost[]
}

export default function BlogTopicClientPage({ slug, initialPosts }: BlogTopicClientPageProps) {
  const [topic, setTopic] = useState<BlogTopic | null>(null)

  useEffect(() => {
    const currentTopic = blogTopics.find((t) => t.slug === slug)
    if (currentTopic) {
      setTopic(currentTopic)
    }
    window.scrollTo(0, 0)
  }, [slug])

  if (!topic) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold text-[#405862] mb-4">Topic not found</h1>
        <p className="text-[#405862]/70 mb-6">The topic you're looking for doesn't exist or has been moved.</p>
        <Button asChild>
          <Link href="/publications">Back to Publications</Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <ScrollToTop />

      {/* Hero Section */}
      <section className="hero-section bg-[#f5f1eb] py-12">
        <div className="container">
          <div className="flex items-center gap-2 mb-6">
            <Link href="/publications" className="text-[#405862] hover:text-[#4ecdc4] transition-colors flex items-center">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to All Publications
            </Link>
          </div>

          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-[#405862] mb-4">{topic.name}</h1>
            <p className="text-[#405862]/80 mb-6">{topic.description}</p>
          </div>
        </div>
      </section>

      {/* Topic Posts */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8 text-[#405862]">
            All Articles in {topic.name}
            <div className="w-24 h-1 bg-[#4ecdc4] mt-2"></div>
          </h2>

          {initialPosts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-[#405862] mb-2">No articles found</h3>
              <p className="text-[#405862]/70 mb-6">We're working on adding content to this topic</p>
              <Button asChild>
                <Link href="/publications">View All Publications</Link>
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {initialPosts.map((post, index) => (
                <Card
                  key={index}
                  className="overflow-hidden border-[#405862]/20 hover:shadow-lg transition-all duration-300 hover:border-[#405862] flex flex-col h-full group"
                >
                  <div className="relative h-48">
                    <Image
                      src={post.coverImage || "/placeholder.svg"}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-6 flex flex-col flex-grow">
                    <div>
                      <div className="text-sm text-[#405862]/70 mb-2 flex items-center flex-wrap">
                        <span className="bg-[#f5f1eb] px-2 py-1 rounded-full text-xs">{post.topic}</span>
                        <span className="mx-2">•</span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {post.readingTime}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold mb-2 text-[#405862] group-hover:text-[#4ecdc4] transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-[#405862]/80 mb-4 text-sm line-clamp-3">{post.excerpt}</p>
                    </div>
                    <div className="mt-auto">
                      <div className="flex items-center justify-between pt-4 border-t border-[#405862]/10">
                        <div className="flex items-center">
                          <div className="relative h-8 w-8 rounded-full overflow-hidden mr-2">
                            <Image
                              src={post.author.image || "/placeholder.svg"}
                              alt={post.author.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <span className="text-xs font-medium text-[#405862] block">{post.author.name}</span>
                            <span className="text-xs text-[#405862]/70">{post.date}</span>
                          </div>
                        </div>
                        <Link
                          href={`/publications/${post.slug}`}
                          className="text-[#4ecdc4] hover:text-[#405862] transition-colors text-sm font-medium flex items-center"
                        >
                          Read
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Other Topics */}
      <section className="py-16 bg-[#f5f1eb]">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8 text-[#405862]">
            Explore Other Topics
            <div className="w-24 h-1 bg-[#4ecdc4] mt-2"></div>
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {blogTopics
              .filter((t) => t.slug !== slug)
              .map((otherTopic, index) => (
                <Card
                  key={index}
                  className="overflow-hidden border-[#405862]/20 hover:shadow-lg transition-all duration-300 hover:border-[#405862] group"
                >
                  <div className="relative h-40">
                    <Image
                      src={otherTopic.image || "/placeholder.svg"}
                      alt={otherTopic.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-[#405862]/40 flex items-center justify-center">
                      <h3 className="text-xl font-bold text-white">{otherTopic.name}</h3>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-[#405862]/80 text-sm mb-4 line-clamp-2">{otherTopic.description}</p>
                    <Link
                      href={`/blog/topic/${otherTopic.slug}`}
                      className="text-[#4ecdc4] hover:text-[#405862] transition-colors text-sm font-medium flex items-center"
                    >
                      View articles
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </section>

      {/* Back to Publications */}
      <section className="py-12 bg-white">
        <div className="container text-center">
          <Button asChild className="bg-[#405862] hover:bg-[#334852]">
            <Link href="/publications">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to All Publications
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
