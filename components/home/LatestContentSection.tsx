"use client"

import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, ArrowRight, Youtube, Music, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { LiteYouTube, LiteSpotify } from "@/components/lite-embed"
import { fadeIn } from "./animations"

export default function LatestContentSection({ featuredPosts, recentPost }: { featuredPosts: any[]; recentPost: any }) {
  return (
    <>
      {/* Latest Content Section */}
      <section className="py-10 bg-white">
        <div className="container">
          <motion.div
            className="text-center mb-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <h2 className="text-2xl font-bold text-[#405862] inline-flex flex-col items-center">
              Latest Content
              <div className="w-16 h-1 bg-[#4ecdc4] mt-2"></div>
            </h2>
            <p className="text-[#405862]/70 max-w-2xl mx-auto mt-2 text-sm">
              Explore our latest blog posts and podcast episodes
            </p>
          </motion.div>

          {/* Blog Section */}
          {recentPost && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="mb-10"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#405862]">Latest from Our Publications</h3>
                <Link href="/publications" className="text-[#405862] hover:text-[#4ecdc4] text-sm flex items-center group">
                  <span>View all posts</span>
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              <Card className="overflow-hidden border-[#405862]/10 shadow-md hover:shadow-lg transition-all duration-300 group">
                <div className="grid md:grid-cols-2">
                  <div className="relative h-48 md:h-auto overflow-hidden">
                    <Image
                      src={recentPost.coverImage || "/logo.png"}
                      alt={`Dr. Interested Blog: ${recentPost.title} - Healthcare education for high school students`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:hidden"></div>
                  </div>
                  <CardContent className="p-5 flex flex-col">
                    <div>
                      <div className="flex items-center text-xs text-[#405862]/70 mb-2 flex-wrap gap-2">
                        <span className="bg-[#405862]/10 px-2.5 py-0.5 rounded-full">{recentPost.topic}</span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {recentPost.readingTime}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {recentPost.date}
                        </span>
                      </div>
                      <Link href={`/publications/${recentPost.slug}`}>
                        <h3 className="text-lg font-bold mb-2 text-[#405862] group-hover:text-[#4ecdc4] transition-colors">
                          {recentPost.title}
                        </h3>
                      </Link>
                      <p className="text-[#405862]/80 mb-4 text-sm line-clamp-2">{recentPost.excerpt}</p>
                    </div>
                    <div className="mt-auto">
                      <div className="flex items-center mb-3">
                        <div className="relative h-8 w-8 rounded-full overflow-hidden mr-2">
                          <Image
                            src={recentPost.author.image || "/logo.png"}
                            alt={`${recentPost.author.name} - Dr. Interested Team Member`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="font-medium text-[#405862] text-sm">{recentPost.author.name}</span>
                      </div>
                      <Button className="w-full bg-[#405862] hover:bg-[#334852] group" asChild>
                        <Link href={`/publications/${recentPost.slug}`}>
                          Read Full Article
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Podcast Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#405862]">Dr. Interested Podcast</h3>
              <div className="flex items-center gap-2">
                <Link
                  href="https://open.spotify.com/show/6SLlRUL6co6fPxckAdrigf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1DB954] hover:text-[#1ed760] text-sm flex items-center group"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="mr-1"
                  >
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                  </svg>
                  <span>Spotify</span>
                </Link>
                <Link
                  href="https://www.youtube.com/playlist?list=PLhgtIQtU24W2axj8qIfCS-j1idk6LbCF4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FF0000] hover:text-[#ff3333] text-sm flex items-center group"
                >
                  <Youtube className="h-4 w-4 mr-1" />
                  <span>YouTube</span>
                </Link>
                <Link
                  href="https://music.youtube.com/playlist?list=PLhgtIQtU24W2axj8qIfCS-j1idk6LbCF4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#4285F4] hover:text-[#5a95f5] text-sm flex items-center group"
                >
                  <Music className="h-4 w-4 mr-1" />
                  <span>YouTube Music</span>
                </Link>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-4 border border-[#405862]/10">
                <h4 className="text-base font-semibold text-[#405862] mb-3">Listen on Spotify</h4>
                <LiteSpotify
                  episodeId="03vIYvBFFgNplGlVCKUmLm"
                  title="Eye Health and Vision Care — Dr. Interested Podcast"
                  watchHref="/listen/eye-health-and-vision-care"
                />
              </div>

              <div className="bg-white rounded-lg shadow-md p-4 border border-[#405862]/10">
                <h4 className="text-base font-semibold text-[#405862] mb-3 flex justify-between items-center">
                  <span>Watch on YouTube</span>
                  <Link
                    href="https://music.youtube.com/playlist?list=PLhgtIQtU24W2axj8qIfCS-j1idk6LbCF4"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#4285F4] hover:text-[#5a95f5] text-xs flex items-center"
                  >
                    <Music className="h-3 w-3 mr-1" />
                    <span>YouTube Music</span>
                  </Link>
                </h4>
                <LiteYouTube
                  id="dQiELtTYjQs"
                  title="Eye Health and Vision Care — Dr. Interested Podcast"
                  watchHref="/listen/eye-health-and-vision-care"
                />
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-[#405862]/80 mb-3">
                Our podcast features interviews with healthcare professionals, discussions about medical careers, and
                insights into the healthcare industry.
              </p>
              <div className="flex justify-center items-center gap-4 flex-wrap">
                <Link
                  href="https://open.spotify.com/show/6SLlRUL6co6fPxckAdrigf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-[#1DB954] hover:text-[#1ed760] text-sm font-medium"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="mr-1"
                  >
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                  </svg>
                  <span>Follow on Spotify</span>
                </Link>
                <Link
                  href="https://www.youtube.com/playlist?list=PLhgtIQtU24W2axj8qIfCS-j1idk6LbCF4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-[#FF0000] hover:text-[#ff3333] text-sm font-medium"
                >
                  <Play className="h-4 w-4 mr-1 fill-current" />
                  <span>Watch on YouTube</span>
                </Link>
                <Link
                  href="https://music.youtube.com/playlist?list=PLhgtIQtU24W2axj8qIfCS-j1idk6LbCF4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-[#4285F4] hover:text-[#5a95f5] text-sm font-medium"
                >
                  <Music className="h-4 w-4 mr-1" />
                  <span>Listen on YouTube Music</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
