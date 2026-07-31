import { supabase } from "@/lib/supabase-client"

export type UnifiedMember = {
  id: string
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
  if (!img) return "/logo.png"
  if (img.startsWith("http")) return img
  if (img.startsWith("/")) return img
  return `/${img}`
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

    return (dbMembers || [])
      .filter((m) => (m.role || "").toLowerCase() !== "blog author")
      .map((dbm) => ({
        id: dbm.id,
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
 * Find a specific member by ID directly from Supabase database.
 */
export async function getUnifiedMemberById(id: string): Promise<UnifiedMember | null> {
  try {
    const { data, error } = await supabase
      .from("members")
      .select("id, name, role, department, bio, image, socials")
      .eq("id", id)
      .single()

    if (!error && data) {
      return {
        id: data.id,
        name: data.name,
        role: data.role,
        department: data.department || undefined,
        bio: data.bio || "",
        image: formatImagePath(data.image),
        socials: data.socials || {},
      }
    }
  } catch (err) {
    console.error(`Error fetching member with id ${id} from Supabase:`, err)
  }

  return null
}
