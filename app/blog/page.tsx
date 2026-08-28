import { permanentRedirect } from "next/navigation"

export default function BlogPage() {
  // 308 permanent redirect (not the default 307) so search engines consolidate ranking
  // signals onto the canonical /publications URL instead of treating this as temporary.
  permanentRedirect("/publications")
}
