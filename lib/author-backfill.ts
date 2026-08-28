import { getAllMembers, type MemberType } from "@/data/members"
import { blogPosts, type Author as LegacyPostAuthor } from "@/data/blog"

export type ResolvedAuthor = {
  name: string
  image: string
  bio: string
  linkedIn?: string
  instagram?: string
  website?: string
  /** True only when we had no name to go on at all (fully orphaned legacy post). */
  isGenericFallback: boolean
}

// Shown only when a post has neither a live member link nor any author name text at all —
// i.e. the author_id pointed at a member who has since been removed from the members table,
// and (for posts saved before the author_name snapshot fix) no text name was ever stored.
export const GENERIC_TEAM_AUTHOR: ResolvedAuthor = {
  name: "Dr. Interested Publications Team",
  image: "/circle-logo.png",
  bio: "Written collaboratively by the Dr. Interested Publications Team. See our current team at drinterested.org/members.",
  isGenericFallback: true,
}

let backupIndex: Map<string, MemberType> | null = null

/** Lazily-built, memoized lookup of every member (past and present) in the static roster backup. */
function getBackupIndex(): Map<string, MemberType> {
  if (!backupIndex) {
    backupIndex = new Map()
    for (const member of getAllMembers()) {
      const key = member.name.trim().toLowerCase()
      if (key && !backupIndex.has(key)) backupIndex.set(key, member)
    }
  }
  return backupIndex
}

let postAuthorBySlug: Map<string, LegacyPostAuthor> | null = null

/**
 * Lazily-built lookup from the static data/blog.ts posts (the pre-Supabase source of truth) —
 * each entry there keeps the correct author tied to that exact post by slug, which is a far
 * more precise signal than matching on a name string that may not even exist on the live row.
 */
function getPostAuthorIndex(): Map<string, LegacyPostAuthor> {
  if (!postAuthorBySlug) {
    postAuthorBySlug = new Map()
    for (const post of blogPosts) {
      if (post.slug && post.author) postAuthorBySlug.set(post.slug, post.author)
    }
  }
  return postAuthorBySlug
}

type LiveMemberLike = {
  name?: string | null
  image?: string | null
  bio?: string | null
  socials?: { linkedin?: string; instagram?: string; website?: string } | null
} | null | undefined

/**
 * Resolves the byline for a publication (blog/op-ed/policy post), so a departed team member
 * still gets credited for work they actually wrote instead of showing "Unknown Author":
 *   1. Live `members` row (via the Supabase join) — freshest photo/bio when they're still a member.
 *   2. The post's `slug`, matched against data/blog.ts — the pre-Supabase static source of truth,
 *      which keeps the correct author tied to that exact post regardless of the members table.
 *   3. The `author_name` text snapshot, matched against the historical roster backup in
 *      data/members.ts, for former members no longer in the live table.
 *   4. The raw `author_name` text on its own, if no roster match is found.
 *   5. A generic "Dr. Interested Publications Team" credit when there's no name at all to go on.
 */
export function resolvePublicationAuthor(params: {
  slug?: string | null
  authorName?: string | null
  liveMember?: LiveMemberLike
}): ResolvedAuthor {
  const { slug, authorName, liveMember } = params

  if (liveMember?.name) {
    return {
      name: liveMember.name,
      image: liveMember.image || "/circle-logo.png",
      bio: liveMember.bio || "",
      linkedIn: liveMember.socials?.linkedin,
      instagram: liveMember.socials?.instagram,
      website: liveMember.socials?.website,
      isGenericFallback: false,
    }
  }

  if (slug) {
    const legacyAuthor = getPostAuthorIndex().get(slug)
    if (legacyAuthor?.name) {
      return {
        name: legacyAuthor.name,
        image: legacyAuthor.image || "/circle-logo.png",
        bio: legacyAuthor.bio || "",
        linkedIn: legacyAuthor.linkedIn,
        instagram: legacyAuthor.instagram,
        isGenericFallback: false,
      }
    }
  }

  const trimmedName = authorName?.trim()
  if (trimmedName) {
    const backup = getBackupIndex().get(trimmedName.toLowerCase())
    if (backup) {
      return {
        name: backup.name,
        image: backup.image || "/circle-logo.png",
        bio: backup.bio || "",
        linkedIn: backup.socialLinks?.linkedin,
        instagram: backup.socialLinks?.instagram,
        website: backup.socialLinks?.website,
        isGenericFallback: false,
      }
    }
    return {
      name: trimmedName,
      image: "/circle-logo.png",
      bio: "",
      isGenericFallback: false,
    }
  }

  return GENERIC_TEAM_AUTHOR
}
