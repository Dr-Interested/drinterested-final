import { NextResponse } from "next/server"
import { requireApprovedMember } from "@/lib/portal-auth"
import { DriveApiError, createDriveFolder } from "@/lib/google-drive"

export async function POST(request: Request) {
  try {
    await requireApprovedMember(request)

    const { name, parentId } = await request.json()
    if (!parentId) return NextResponse.json({ error: "parentId is required." }, { status: 400 })

    const folder = await createDriveFolder(name || "", parentId)
    return NextResponse.json(folder)
  } catch (err) {
    if (err instanceof DriveApiError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    console.error("POST /api/drive/folder error:", err)
    return NextResponse.json({ error: "Something went wrong creating the folder." }, { status: 500 })
  }
}
