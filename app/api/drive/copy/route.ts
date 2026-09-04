import { NextResponse } from "next/server"
import { requireApprovedMember } from "@/lib/portal-auth"
import { DriveApiError, copyDriveFile } from "@/lib/google-drive"

/** Copies a file (e.g. a template) into another folder. There is deliberately no corresponding
 *  delete/move-with-remove-from-source route — see the comment at the top of
 *  lib/google-drive.ts for why. */
export async function POST(request: Request) {
  try {
    await requireApprovedMember(request)

    const { fileId, parentId, name } = await request.json()
    if (!fileId || !parentId) {
      return NextResponse.json({ error: "fileId and parentId are required." }, { status: 400 })
    }

    const copy = await copyDriveFile(fileId, parentId, name)
    return NextResponse.json(copy)
  } catch (err) {
    if (err instanceof DriveApiError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    console.error("POST /api/drive/copy error:", err)
    return NextResponse.json({ error: "Something went wrong copying that file." }, { status: 500 })
  }
}
