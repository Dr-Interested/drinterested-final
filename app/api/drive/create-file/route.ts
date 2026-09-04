import { NextResponse } from "next/server"
import { requireApprovedMember } from "@/lib/portal-auth"
import {
  DriveApiError,
  createDriveFile,
  copyDriveFile,
  resolveTemplateFileId,
  CREATABLE_GOOGLE_TYPES,
  type CreatableGoogleType,
} from "@/lib/google-drive"

export async function POST(request: Request) {
  try {
    const supabase = await requireApprovedMember(request)

    const { name, parentId, type } = await request.json()
    if (!parentId) return NextResponse.json({ error: "parentId is required." }, { status: 400 })
    if (!type || !(type in CREATABLE_GOOGLE_TYPES)) {
      return NextResponse.json({ error: `type must be one of: ${Object.keys(CREATABLE_GOOGLE_TYPES).join(", ")}` }, { status: 400 })
    }

    // If the owner has configured a template for this type (Drive "New" Templates in the
    // dashboard), copy it so the new file follows the house format; otherwise fall back to a
    // blank file of that type.
    const templateId = await resolveTemplateFileId(supabase, type as CreatableGoogleType)
    const file = templateId
      ? await copyDriveFile(templateId, parentId, name || undefined)
      : await createDriveFile(name || "", parentId, type as CreatableGoogleType)

    return NextResponse.json({ ...file, fromTemplate: Boolean(templateId) })
  } catch (err) {
    if (err instanceof DriveApiError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    console.error("POST /api/drive/create-file error:", err)
    return NextResponse.json({ error: "Something went wrong creating that file." }, { status: 500 })
  }
}
