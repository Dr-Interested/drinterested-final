import { NextResponse } from "next/server"
import { requireApprovedMember } from "@/lib/portal-auth"
import { DriveApiError, listDriveFolder, resolveRootFolderId } from "@/lib/google-drive"

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
