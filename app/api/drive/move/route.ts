import { NextResponse } from "next/server"
import { requireApprovedMember } from "@/lib/portal-auth"
import { DriveApiError, moveDriveFile } from "@/lib/google-drive"

/** Moves one or more files/folders in a single request. Each file's move is its own atomic
 *  Drive call (see moveDriveFile), so a failure for one item never affects the others — the
 *  response reports both lists rather than failing the whole batch. There is deliberately no
 *  delete route anywhere in this API; see the comment at the top of lib/google-drive.ts. */
export async function POST(request: Request) {
  try {
    await requireApprovedMember(request)

    const { fileIds, fromParentId, toParentId } = await request.json()
    if (!Array.isArray(fileIds) || fileIds.length === 0) {
      return NextResponse.json({ error: "fileIds is required." }, { status: 400 })
    }
    if (!fromParentId || !toParentId) {
      return NextResponse.json({ error: "fromParentId and toParentId are required." }, { status: 400 })
    }
    if (fromParentId === toParentId) {
      return NextResponse.json({ error: "That's already where these are." }, { status: 400 })
    }

    const results = await Promise.allSettled(
      fileIds.map((id: string) => moveDriveFile(id, fromParentId, toParentId))
    )

    const moved = results
      .filter((r): r is PromiseFulfilledResult<Awaited<ReturnType<typeof moveDriveFile>>> => r.status === "fulfilled")
      .map((r) => r.value)
    const failed = results
      .map((r, i) => (r.status === "rejected" ? { id: fileIds[i], error: (r.reason as Error)?.message || "Move failed." } : null))
      .filter((f): f is { id: string; error: string } => f !== null)

    return NextResponse.json({ moved, failed })
  } catch (err) {
    if (err instanceof DriveApiError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    console.error("POST /api/drive/move error:", err)
    return NextResponse.json({ error: "Something went wrong moving those items." }, { status: 500 })
  }
}
