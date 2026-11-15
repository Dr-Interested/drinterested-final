"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, ChevronLeft, Share2, Linkedin, Twitter, Facebook, Link2 } from "lucide-react"
import ScrollToTop from "@/components/scroll-to-top"
import Markdown from "react-markdown"

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

export default function BlogPostClient({ post, relatedPosts }: { post: BlogPost, relatedPosts: any[] }) {
  const [copied, setCopied] = useState(false)
  const [tableOfContents, setTableOfContents] = useState<{ id: string; text: string; level: number }[]>([])
  const [readingProgress, setReadingProgress] = useState(0)

  useEffect(() => {
    if (post) {
      // More efficient table of contents generation
      const headings = post.content
        .split("\n")
        .filter((line) => /^#{1,3}\s.+$/.test(line))
        .map((line) => {
          const match = line.match(/^(#{1,3})\s(.+)$/)
          if (match) {
            const level = match[1].length
            const text = match[2]
            const id = text
              .toLowerCase()
              .replace(/[^\w\s]/g, "")
              .replace(/\s+/g, "-")
            return { id, text, level }
          }
          return null
        })
        .filter(Boolean)

      setTableOfContents(headings as any)
    }

    window.scrollTo(0, 0)
  }, [post])

  useEffect(() => {
    const updateReadingProgress = () => {
      const scrollHeight = document.body.scrollHeight - window.innerHeight
      if (scrollHeight) {
        setReadingProgress(Number((window.scrollY / scrollHeight).toFixed(2)) * 100)
      }
    }

    // Debounce scroll event for better performance
    let timeoutId: NodeJS.Timeout
    const handleScroll = () => {
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(updateReadingProgress, 10)
    }

    window.addEventListener("scroll", handleScroll)
    updateReadingProgress() // Initial calculation

    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!post) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold text-[#405862] mb-4">Article not found</h1>
        <p className="text-[#405862]/85 mb-6">The article you're looking for doesn't exist or has been moved.</p>
        <Button asChild>
          <Link href="/publications">Back to Publications</Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div
        className="fixed top-0 left-0 h-1 bg-[#4ecdc4] z-50 transition-all duration-300 ease-out"
        style={{ width: `${readingProgress}%` }}
      />
      <ScrollToTop />

      {/* Hero Section */}
      <section className="hero-section bg-[#f5f1eb] py-12">
        <div className="container">
          <div className="flex items-center gap-2 mb-6">
            <Link href="/publications" className="text-[#405862] hover:text-teal-deep transition-colors flex items-center">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to All Publications
            </Link>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="text-sm text-[#405862]/85 mb-3 flex items-center flex-wrap">
              <Link
                href={`/blog?topic=${encodeURIComponent(post.topic)}`}
                className="bg-[#405862]/10 hover:bg-[#405862]/20 px-3 py-1 rounded-full transition-colors"
              >
                {post.topic}
              </Link>
              <span className="mx-2">•</span>
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {post.date}
              </span>
              <span className="mx-2">•</span>
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {post.readingTime}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-[#405862] mb-6">{post.title}</h1>

            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="relative h-12 w-12 rounded-full overflow-hidden mr-3">
                  <Image
                    src={post.author.image || "/placeholder.svg"}
                    alt={post.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <span className="font-medium text-[#405862] block">{post.author.name}</span>
                  <div className="flex items-center gap-2">
                    {post.author.linkedIn && (
                      <Link
                        href={post.author.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#405862]/85 hover:text-teal-deep"
                      >
                        <Linkedin className="h-4 w-4" />
                      </Link>
                    )}
                    {post.author.twitter && (
                      <Link
                        href={post.author.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#405862]/85 hover:text-teal-deep"
                      >
                        <Twitter className="h-4 w-4" />
                      </Link>
                    )}
                    {post.author.instagram && (
                      <Link
                        href={post.author.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#405862]/85 hover:text-teal-deep"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-instagram"
                        >
                          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                        </svg>
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#405862]/20 text-[#405862]/85 hover:bg-[#405862]/10 hover:text-[#405862]"
                  onClick={copyToClipboard}
                >
                  {copied ? "Copied!" : "Share"}
                  <Share2 className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <div className="relative h-[300px] md:h-[400px] lg:h-[500px] w-full">
        <Image src={post.coverImage || "/placeholder.svg"} alt={post.title} fill className="object-cover" priority />
      </div>

      {/* Add this before the content section */}
      {tableOfContents.length > 2 && (
        <div className="mb-6 p-5 bg-[#f5f1eb] rounded-lg border border-[#405862]/10">
          <h3 className="text-lg font-bold text-[#405862] mb-3 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <line x1="21" y1="10" x2="7" y2="10"></line>
              <line x1="21" y1="6" x2="3" y2="6"></line>
              <line x1="21" y1="14" x2="3" y2="14"></line>
              <line x1="21" y1="18" x2="7" y2="18"></line>
            </svg>
            Table of Contents
          </h3>
          <ul className="space-y-1.5 max-h-[300px] overflow-y-auto pr-2">
            {tableOfContents.map((heading, index) => (
              <li key={index} className={`${heading.level === 1 ? "" : heading.level === 2 ? "ml-3" : "ml-6"}`}>
                <a
                  href={`#${heading.id}`}
                  className="text-teal-deep hover:text-[#405862] transition-colors flex items-center"
                >
                  {heading.level > 1 && (
                    <span className="mr-1.5 text-[#405862]/40">{heading.level === 2 ? "○" : "•"}</span>
                  )}
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg max-w-none prose-headings:text-[#405862] prose-h1:text-3xl prose-h2:text-2xl prose-h2:mt-8 prose-p:text-[#405862]/90 prose-a:text-teal-deep prose-a:no-underline hover:prose-a:text-[#405862] prose-strong:text-[#405862] prose-ul:text-[#405862]/90 prose-ol:text-[#405862]/90 prose-li:my-1">
              {post.content && (
                <Markdown
                  components={{
                    h1: ({ children }) => {
                      const id = children
                        ?.toString()
                        .toLowerCase()
                        .replace(/[^\w\s]/g, "")
                        .replace(/\s+/g, "-")
                      return (
                        <h1 id={id} className="text-3xl font-bold mb-5 mt-8 text-[#405862]">
                          {children}
                        </h1>
                      )
                    },
                    h2: ({ children }) => {
                      const id = children
                        ?.toString()
                        .toLowerCase()
                        .replace(/[^\w\s]/g, "")
                        .replace(/\s+/g, "-")
                      return (
                        <h2 id={id} className="text-2xl font-bold mb-4 mt-7 text-[#405862]">
                          {children}
                        </h2>
                      )
                    },
                    h3: ({ children }) => {
                      const id = children
                        ?.toString()
                        .toLowerCase()
                        .replace(/[^\w\s]/g, "")
                        .replace(/\s+/g, "-")
                      return (
                        <h3 id={id} className="text-xl font-bold mb-3 mt-6 text-[#405862]">
                          {children}
                        </h3>
                      )
                    },
                    ul: ({ children }) => <ul className="list-disc pl-6 my-4 space-y-2">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal pl-6 my-4 space-y-2">{children}</ol>,
                    li: ({ children }) => <li className="text-[#405862]/90">{children}</li>,
                    p: ({ children }) => <p className="my-4 text-[#405862]/90 leading-relaxed">{children}</p>,
                    a: ({ href, children }) => {
                      const isSafe = href && (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("/") || href.startsWith("#"));
                      return (
                        <a 
                          href={isSafe ? href : undefined} 
                          className="text-teal-deep hover:text-[#405862] transition-colors font-medium"
                          target={isSafe && href.startsWith("http") ? "_blank" : undefined}
                          rel={isSafe && href.startsWith("http") ? "noopener noreferrer" : undefined}
                        >
                          {children}
                        </a>
                      )
                    },
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-[#4ecdc4] pl-4 italic my-4 text-[#405862]/90">
                        {children}
                      </blockquote>
                    ),
                    code: ({ node, inline, className, children, ...props }: any) => {
                      const match = /language-(\w+)/.exec(className || "")
                      return !inline && match ? (
                        <div className="rounded-md bg-[#f5f1eb] p-4 my-4">
                          <pre className="overflow-x-auto text-sm text-[#405862]">
                            <code className={className} {...props}>
                              {children}
                            </code>
                          </pre>
                        </div>
                      ) : (
                        <code className="bg-[#f5f1eb] px-1.5 py-0.5 rounded text-[#405862] text-sm" {...props}>
                          {children}
                        </code>
                      )
                    },
                  }}
                >
                  {post.content}
                </Markdown>
              )}
            </div>

            {/* Author Bio */}
            <div className="mt-12 pt-8 border-t border-[#405862]/10">
              <h3 className="text-lg font-bold text-[#405862] mb-4">About the Author</h3>
              <div className="flex items-start gap-4">
                <div className="relative h-16 w-16 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={post.author.image || "/placeholder.svg"}
                    alt={post.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-[#405862]">{post.author.name}</h4>
                  <p className="text-[#405862]/90 text-sm mt-1">{post.author.bio}</p>
                  <div className="flex items-center gap-3 mt-2">
                    {post.author.linkedIn && (
                      <Link
                        href={post.author.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#405862]/85 hover:text-teal-deep"
                      >
                        <Linkedin className="h-5 w-5" />
                      </Link>
                    )}
                    {post.author.twitter && (
                      <Link
                        href={post.author.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#405862]/85 hover:text-teal-deep"
                      >
                        <Twitter className="h-5 w-5" />
                      </Link>
                    )}
                    {post.author.instagram && (
                      <Link
                        href={post.author.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#405862]/85 hover:text-teal-deep"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-instagram"
                        >
                          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                        </svg>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Share */}
            <div className="mt-12 pt-8 border-t border-[#405862]/10">
              <h3 className="text-lg font-bold text-[#405862] mb-4">Share this article</h3>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#405862]/20 text-[#405862]/85 hover:bg-[#405862]/10 hover:text-[#405862]"
                  onClick={() =>
                    window.open(
                      `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`,
                      "_blank",
                    )
                  }
                >
                  <Twitter className="h-4 w-4 mr-2" />
                  Twitter
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#405862]/20 text-[#405862]/85 hover:bg-[#405862]/10 hover:text-[#405862]"
                  onClick={() =>
                    window.open(
                      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
                      "_blank",
                    )
                  }
                >
                  <Facebook className="h-4 w-4 mr-2" />
                  Facebook
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#405862]/20 text-[#405862]/85 hover:bg-[#405862]/10 hover:text-[#405862]"
                  onClick={() =>
                    window.open(
                      `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(post.title)}`,
                      "_blank",
                    )
                  }
                >
                  <Linkedin className="h-4 w-4 mr-2" />
                  LinkedIn
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#405862]/20 text-[#405862]/85 hover:bg-[#405862]/10 hover:text-[#405862]"
                  onClick={copyToClipboard}
                >
                  <Link2 className="h-4 w-4 mr-2" />
                  {copied ? "Copied!" : "Copy Link"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-12 bg-[#f5f1eb]">
          <div className="container">
            <h2 className="text-2xl font-bold mb-6 text-[#405862] flex items-center">
              Related Articles
              <div className="w-16 h-1 bg-[#4ecdc4] ml-3"></div>
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost, index) => (
                <Card
                  key={index}
                  className="overflow-hidden border-[#405862]/20 hover:shadow-lg transition-all duration-300 hover:border-[#405862] flex flex-col h-full group"
                >
                  <div className="relative h-40">
                    <Image
                      src={relatedPost.coverImage || "/placeholder.svg"}
                      alt={relatedPost.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <CardContent className="p-4 flex flex-col flex-grow">
                    <div>
                      <div className="text-xs text-[#405862]/85 mb-1.5 flex items-center">
                        <span className="bg-[#405862]/10 px-2 py-0.5 rounded-full">{relatedPost.topic}</span>
                        <span className="mx-1.5">•</span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {relatedPost.readingTime}
                        </span>
                      </div>
                      <h3 className="text-base font-bold mb-1.5 text-[#405862] group-hover:text-teal-deep transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-[#405862]/90 mb-3 text-sm line-clamp-2">{relatedPost.excerpt}</p>
                    </div>
                    <div className="mt-auto">
                      <Link
                        href={`/blog/${relatedPost.slug}`}
                        className="text-teal-deep hover:text-[#405862] transition-colors text-sm font-medium flex items-center"
                      >
                        Read article
                        <ChevronLeft className="h-4 w-4 ml-1 rotate-180" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

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
