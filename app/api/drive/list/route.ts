import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { DriveApiError, listDriveFolder, resolveRootFolderId } from "@/lib/google-drive"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

/** Same trust boundary as the rest of the member portal (app/dashboard/page.tsx): the caller
 *  must be a signed-in Supabase user with an approved row in `members`. Scoping the Supabase
 *  client to the caller's own access token (rather than using the shared anon client) means
 *  any RLS policies on `members`/`settings` see the real authenticated request. */
async function requireApprovedMember(request: Request) {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new DriveApiError(500, "Server is missing Supabase configuration.")
  }

  const authHeader = request.headers.get("authorization") || ""
  const token = authHeader.replace(/^Bearer\s+/i, "").trim()
  if (!token) throw new DriveApiError(401, "Not signed in.")

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  })

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user?.email) throw new DriveApiError(401, "Not signed in.")

  const { data: member } = await supabase
    .from("members")
    .select("approved")
    .eq("email", user.email.toLowerCase())
    .maybeSingle()

  if (!member?.approved) throw new DriveApiError(403, "You must be an approved member to browse the Drive.")

  return supabase
}

export async function GET(request: Request) {
  try {
    const supabase = await requireApprovedMember(request)

    const { searchParams } = new URL(request.url)
    const requestedFolderId = searchParams.get("folderId")
    const folderId = requestedFolderId || (await resolveRootFolderId(supabase))

    const listing = await listDriveFolder(folderId)
    return NextResponse.json(listing)
  } catch (err) {
    if (err instanceof DriveApiError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    console.error("GET /api/drive/list error:", err)
    return NextResponse.json({ error: "Something went wrong loading the Drive folder." }, { status: 500 })
  }
}
