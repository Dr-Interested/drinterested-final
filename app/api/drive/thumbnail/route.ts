import { NextResponse } from "next/server"
import { requireApprovedMember } from "@/lib/portal-auth"
import { DriveApiError, getFileThumbnail } from "@/lib/google-drive"

export async function GET(request: Request) {
  try {
    await requireApprovedMember(request)

    const { searchParams } = new URL(request.url)
    const fileId = searchParams.get("fileId")
    if (!fileId) return NextResponse.json({ error: "fileId is required." }, { status: 400 })

    const thumb = await getFileThumbnail(fileId)
    if (!thumb) return NextResponse.json({ error: "No thumbnail available." }, { status: 404 })

    return new NextResponse(thumb.buffer, {
      headers: {
        "Content-Type": thumb.contentType,
        // Private: this proxy is auth-gated per request, so don't let a shared/CDN cache serve
        // one member's fetch to another; the browser itself can still cache it for the hour.
        "Cache-Control": "private, max-age=3600",
      },
    })
  } catch (err) {
    if (err instanceof DriveApiError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    console.error("GET /api/drive/thumbnail error:", err)
    return NextResponse.json({ error: "Something went wrong loading the thumbnail." }, { status: 500 })
  }
}
