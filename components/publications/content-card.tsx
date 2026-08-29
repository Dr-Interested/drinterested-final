import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Clock } from "lucide-react"
import SafeImage from "@/components/safe-image"

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

export default function ContentCard({ post, index }: { post: Publication; index: number }) {
  return (
    <Card className="overflow-hidden border-[#405862]/20 hover:shadow-lg transition-all duration-300 hover:border-[#405862] flex flex-col h-full group">
      <div className="relative h-48 w-full bg-[#f5f1eb]">
        <SafeImage
          src={post.coverImage || "/websitebanner.jpg"}
          fallbackSrc="/websitebanner.jpg"
          alt={post.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          priority={index < 6}
        />
      </div>
      <CardContent className="p-6 flex flex-col flex-grow">
        <div>
          <div className="text-sm text-[#405862]/70 mb-2 flex items-center flex-wrap gap-2">
            <span className="bg-[#f5f1eb] px-2 py-1 rounded-full text-xs font-medium">{post.topic}</span>
            {post.policyType && (
              <span className="bg-[#e3f2fd] px-2 py-1 rounded-full text-xs font-medium text-[#1976d2]">
                {post.policyType.replace("-", " ")}
              </span>
            )}
            <span className="mx-1">•</span>
            <span className="flex items-center text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {post.readingTime}
            </span>
          </div>
          <Link href={`/publications/${post.slug}`} className="block group-hover:text-[#4ecdc4] transition-colors">
            <h3 className="text-lg font-bold mb-2 text-[#405862] group-hover:text-[#4ecdc4] transition-colors">
              {post.title}
            </h3>
          </Link>
          <p className="text-[#405862]/80 mb-4 text-sm leading-relaxed line-clamp-3">{post.excerpt}</p>
        </div>
        <div className="mt-auto">
          <div className="flex items-center justify-between pt-4 border-t border-[#405862]/10">
            <div className="flex items-center">
              <div className="relative h-8 w-8 rounded-full overflow-hidden mr-2 bg-[#f5f1eb] flex-shrink-0">
                <SafeImage src={post.author.image || "/circle-logo.png"} alt={post.author.name} fill className="object-cover" />
              </div>
              <div>
                <span className="text-xs font-medium text-[#405862] block">{post.author.name}</span>
                <span className="text-xs text-[#405862]/70">{post.date}</span>
              </div>
            </div>
            <Link
              href={`/publications/${post.slug}`}
              className="text-[#4ecdc4] hover:text-[#405862] transition-colors text-sm font-medium"
            >
              Read
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
