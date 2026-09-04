import { NextResponse } from "next/server"
import { requireApprovedMember } from "@/lib/portal-auth"
import { DriveApiError, uploadDriveFile, MAX_UPLOAD_BYTES } from "@/lib/google-drive"

export async function POST(request: Request) {
  try {
    await requireApprovedMember(request)

    const formData = await request.formData()
    const parentId = formData.get("parentId")
    const file = formData.get("file")

    if (typeof parentId !== "string" || !parentId) {
      return NextResponse.json({ error: "parentId is required." }, { status: 400 })
    }
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "file is required." }, { status: 400 })
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { error: `File is too large — the portal accepts files up to ${Math.floor(MAX_UPLOAD_BYTES / (1024 * 1024))}MB.` },
        { status: 413 }
      )
    }

    const bytes = Buffer.from(await file.arrayBuffer())
    const uploaded = await uploadDriveFile(parentId, file.name, file.type, bytes)
    return NextResponse.json(uploaded)
  } catch (err) {
    if (err instanceof DriveApiError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    console.error("POST /api/drive/upload error:", err)
    return NextResponse.json({ error: "Something went wrong uploading that file." }, { status: 500 })
  }
}
