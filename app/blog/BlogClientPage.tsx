"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, ChevronRight, Search, X } from "lucide-react"
import ScrollToTop from "@/components/scroll-to-top"
import SeoSchema from "@/components/seo-schema"
import NewsletterForm from "@/components/newsletter-form"

type BlogPost = {
  slug: string
  title: string
  excerpt: string
  content: string
  coverImage: string
  topic: string
  readingTime: string
  featured?: boolean
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

export default function BlogClientPage({ initialBlogs }: { initialBlogs: BlogPost[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [filteredPosts, setFilteredPosts] = useState(initialBlogs)
  
  const featuredPosts = initialBlogs.filter(p => p.featured)
  const recentPosts = initialBlogs.slice(0, 4)

  // Extract unique topics from the dynamic data
  const blogTopics = Array.from(new Set(initialBlogs.map(b => b.topic)))
    .map(topicName => ({ name: topicName }))

  useEffect(() => {
    let results = initialBlogs

    if (searchTerm) {
      results = results.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.author.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedTopic) {
      results = results.filter((post) => post.topic === selectedTopic)
    }

    setFilteredPosts(results)
  }, [searchTerm, selectedTopic, initialBlogs])

  // SEO schema for blog listing page
  const blogListingSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Dr. Interested Blog",
    description:
      "Explore the latest insights, research, and information about healthcare careers, medical advancements, and educational opportunities.",
    url: "https://www.drinterested.org/blog",
    isPartOf: {
      "@type": "WebSite",
      name: "Dr. Interested",
      url: "https://www.drinterested.org",
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: filteredPosts.slice(0, 10).map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `https://www.drinterested.org/blog/${post.slug}`,
        name: post.title,
      })),
    },
  }

  return (
    <div>
      <ScrollToTop />
      <SeoSchema id="blog-listing-schema" schema={blogListingSchema} />

      {/* Hero Section */}
      <section className="hero-section bg-[#f5f1eb] py-10 md:py-16">
        <div className="container">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-[#405862] mb-4">
            Dr. Interested Blog
          </h1>
          <p className="text-center text-lg text-[#405862]/80 max-w-2xl mx-auto mb-8">
            Explore the latest insights, research, and information about healthcare careers, medical advancements, and
            educational opportunities.
          </p>

          <div className="max-w-xl mx-auto relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-[#405862]/60" />
            </div>
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-3 rounded-full border border-[#405862]/20 focus:outline-none focus:ring-2 focus:ring-[#4ecdc4] bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Topics */}
      <section className="py-12 bg-[#f5f1eb]">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8 text-[#405862]">
            Browse by Topic
            <div className="w-24 h-1 bg-[#4ecdc4] mt-2"></div>
          </h2>

          <div className="flex flex-wrap gap-4 mb-8">
            <Button
              variant={selectedTopic === null ? "default" : "outline"}
              className={
                selectedTopic === null
                  ? "bg-[#405862] hover:bg-[#334852]"
                  : "border-[#405862] text-[#405862] hover:bg-[#405862] hover:text-white"
              }
              onClick={() => { setSelectedTopic(null); setSearchTerm("") }}
            >
              All Topics
            </Button>

            {blogTopics.map((topic, index) => (
              <Button
                key={index}
                variant={selectedTopic === topic.name ? "default" : "outline"}
                className={
                  selectedTopic === topic.name
                    ? "bg-[#405862] hover:bg-[#334852]"
                    : "border-[#405862] text-[#405862] hover:bg-[#405862] hover:text-white"
                }
                onClick={() => setSelectedTopic(topic.name)}
              >
                {topic.name}
              </Button>
            ))}

            {(searchTerm || selectedTopic) && (
              <Button
                variant="ghost"
                className="text-gray-400 hover:text-[#c62828] gap-1"
                onClick={() => { setSearchTerm(""); setSelectedTopic(null) }}
              >
                <X className="h-3.5 w-3.5" /> Clear filters
              </Button>
            )}
          </div>

          {selectedTopic && (
            <div className="mb-8 p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-2 text-[#405862]">{selectedTopic}</h3>
            </div>
          )}
        </div>
      </section>

      {/* All Posts / Filtered Posts */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8 text-[#405862]">
            {searchTerm ? "Search Results" : selectedTopic ? `Articles on ${selectedTopic}` : "All Articles"}
            <div className="w-24 h-1 bg-[#4ecdc4] mt-2"></div>
          </h2>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-[#405862] mb-2">No articles found</h3>
              <p className="text-[#405862]/70 mb-6">Try adjusting your search or browse all topics</p>
              <Button
                variant="outline"
                className="border-[#405862] text-[#405862] hover:bg-[#405862] hover:text-white bg-transparent"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedTopic(null)
                }}
              >
                View All Articles
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <Card
                  key={index}
                  className="overflow-hidden border-[#405862]/20 hover:shadow-lg transition-all duration-300 hover:border-[#405862] flex flex-col h-full group"
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={post.coverImage || "/placeholder.svg"}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      priority={index < 6} // Prioritize loading for first 6 posts
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
                      <Link href={`/blog/${post.slug}`} className="block group-hover:text-[#4ecdc4] transition-colors">
                        <h3 className="text-lg font-bold mb-2 text-[#405862] group-hover:text-[#4ecdc4] transition-colors">
                          {post.title}
                        </h3>
                      </Link>
                      <p className="text-[#405862]/80 mb-4 text-sm leading-relaxed line-clamp-3">{post.excerpt}</p>
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
                          href={`/blog/${post.slug}`}
                          className="text-[#4ecdc4] hover:text-[#405862] transition-colors text-sm font-medium"
                        >
                          Read
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

      {/* Recent Posts */}
      {!searchTerm && !selectedTopic && (
        <section className="py-16 bg-[#f5f1eb]">
          <div className="container">
            <h2 className="text-2xl font-bold mb-8 text-[#405862]">
              Recent Articles
              <div className="w-24 h-1 bg-[#4ecdc4] mt-2"></div>
            </h2>

            <div className="grid md:grid-cols-4 gap-6">
              {recentPosts.map((post, index) => (
                <Card
                  key={index}
                  className="overflow-hidden border-[#405862]/20 hover:shadow-lg transition-all duration-300 hover:border-[#405862] flex flex-col h-full group"
                >
                  <div className="relative h-40">
                    <Image
                      src={post.coverImage || "/placeholder.svg"}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      priority
                    />
                  </div>
                  <CardContent className="p-4 flex flex-col flex-grow">
                    <div>
                      <div className="text-xs text-[#405862]/70 mb-1">{post.date}</div>
                      <h3 className="text-base font-bold mb-2 text-[#405862] group-hover:text-[#4ecdc4] transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                    </div>
                    <div className="mt-auto">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-[#4ecdc4] hover:text-[#405862] transition-colors text-xs font-medium flex items-center mt-2"
                      >
                        Read article
                        <ChevronRight className="h-3 w-3 ml-1" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="py-16 bg-[#405862] text-white">
        <div className="container max-w-4xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Never Miss an Article</h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Subscribe to get the latest healthcare insights, career guides, and research breakdowns from our team.
          </p>
          <div className="max-w-md mx-auto mb-6">
            <NewsletterForm darkMode={true} showFirstName={false} compact={true} />
          </div>
          <p className="text-white/60 text-sm">
            Or join the conversation on our{" "}
            <Link href="https://discord.gg/pzbGRgsGXY" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">
              Discord server
            </Link>.
          </p>
        </div>
      </section>
    </div>
  )
}
