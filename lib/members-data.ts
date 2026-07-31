import { supabase } from "@/lib/supabase-client"

export type UnifiedMember = {
  id: string
  slug: string
  name: string
  role: string
  department?: string
  bio: string
  image: string
  socials?: {
    linkedin?: string
    instagram?: string
    website?: string
    other?: string
  }
}

export const formatImagePath = (img: string | undefined | null): string => {
  if (!img) return "/circle-logo.png"
  const clean = img.trim()
  if (!clean || clean === "logo.png" || clean === "/logo.png") return "/circle-logo.png"
  if (clean.startsWith("http")) return clean
  if (clean.startsWith("/")) return clean
  return `/${clean}`
}

export function generateSlug(member: { name: string, role: string }, allMembers: { name: string, role: string }[]): string {
  const baseSlug = member.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "_")
  
  // Check if there are other members with the exact same name
  const sameNameCount = allMembers.filter(m => m.name.toLowerCase().trim() === member.name.toLowerCase().trim()).length
  
  if (sameNameCount > 1) {
    const roleSlug = member.role.toLowerCase().trim().replace(/[^a-z0-9]+/g, "_")
    return `${baseSlug}_${roleSlug}`
  }
  
  return baseSlug
}

/**
 * Fetch all approved members directly from Supabase database.
 */
export async function getAllMembersCombined(): Promise<UnifiedMember[]> {
  try {
    const { data: dbMembers, error } = await supabase
      .from("members")
      .select("id, name, role, department, bio, image, socials")
      .eq("approved", true)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Error fetching members from Supabase:", error)
      return []
    }

    const filtered = (dbMembers || [])
      .filter((m) => (m.role || "").toLowerCase() !== "blog author")
      
    return filtered.map((dbm) => ({
      id: dbm.id,
      slug: generateSlug(dbm, filtered),
      name: dbm.name,
      role: dbm.role,
      department: dbm.department || undefined,
      bio: dbm.bio || "",
      image: formatImagePath(dbm.image),
      socials: dbm.socials || {},
    }))
  } catch (err) {
    console.error("Error in getAllMembersCombined:", err)
    return []
  }
}

/**
 * Find a specific member by ID or Slug directly from Supabase database.
 */
export async function getUnifiedMemberById(idOrSlug: string): Promise<UnifiedMember | null> {
  try {
    const allMembers = await getAllMembersCombined()
    const member = allMembers.find(m => m.id === idOrSlug || m.slug === idOrSlug)
    return member || null
  } catch (err) {
    console.error(`Error fetching member with id/slug ${idOrSlug}:`, err)
    return null
  }
}
