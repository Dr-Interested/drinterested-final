import { permanentRedirect } from "next/navigation"

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  // 308 permanent redirect so search engines consolidate ranking signals onto /publications/[slug].
  permanentRedirect(`/publications/${slug}`)
}
