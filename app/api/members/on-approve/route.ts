import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { escapeHtml, sendEmail, taskEmailShell } from "@/lib/send-email"
import { OWNER_EMAILS } from "@/lib/owner"
import { isDeputyRole, isDirectorRole, LEADERSHIP_RANK } from "@/lib/teams"

export const dynamic = "force-dynamic"
// Room for retries when Resend is rate limiting, and for bulk sends.
export const maxDuration = 60

/**
 * Called by the portal's Members tab right after an application is approved. Emails the new
 * member that they can now sign in. The caller must be signed in as someone who can approve
 * members (the owner, Admin Team leadership, or an HR director/deputy), and the target row
 * must actually be approved.
 */
export async function POST(request: Request) {
  const token = (request.headers.get("authorization") || "").replace(/^Bearer\s+/i, "").trim()
  if (!token) return NextResponse.json({ error: "Not signed in." }, { status: 401 })
  const {
    data: { user },
  } = await supabaseAdmin.auth.getUser(token)
  const callerEmail = user?.email?.toLowerCase()
  if (!callerEmail) return NextResponse.json({ error: "Not signed in." }, { status: 401 })

  if (!OWNER_EMAILS.includes(callerEmail)) {
    const { data: caller } = await supabaseAdmin
      .from("members")
      .select("approved, role, department")
      .eq("email", callerEmail)
      .maybeSingle()
    const role = (caller?.role || "").trim()
    const dept = (caller?.department || "").trim()
    const allowed =
      !!caller?.approved &&
      ((dept === "Admin Team" && LEADERSHIP_RANK.some((r) => role.includes(r))) ||
        (/^(hr|human resources)$/i.test(dept) && (isDirectorRole(role) || isDeputyRole(role))))
    if (!allowed) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  let memberId: string | undefined
  try {
    memberId = (await request.json())?.memberId
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }
  if (!memberId) return NextResponse.json({ error: "memberId is required" }, { status: 400 })

  const { data: member } = await supabaseAdmin
    .from("members")
    .select("name, email, role, department, approved")
    .eq("id", memberId)
    .maybeSingle()
  if (!member?.approved || !member.email) return NextResponse.json({ skipped: "not approved" })

  const firstName = String(member.name || "").trim().split(/\s+/)[0] || "there"
  const { sent, reason } = await sendEmail({
    to: member.email,
    subject: "Welcome to Dr. Interested: your application is approved",
    html: taskEmailShell(
      `Welcome aboard, ${escapeHtml(firstName)}!`,
      `
        <p style="margin:0 0 12px;">Your application to join Dr. Interested${
          member.role ? ` as <strong>${escapeHtml(member.role)}</strong>` : ""
        }${member.department ? ` (${escapeHtml(member.department)})` : ""} has been approved.</p>
        <p style="margin:0 0 12px;">You can now sign in to the member portal with <strong>${escapeHtml(member.email)}</strong> and the password you chose when you applied. There you'll find your tasks, the shared Drive and calendar, and your profile settings.</p>
        <p style="margin:0;color:#888;font-size:13px;">Forgot your password? Use "Forgot password?" on the sign-in screen, or sign in with a one-time code instead.</p>
      `,
      "https://www.drinterested.org/dashboard?login=true",
      "Sign In to the Portal",
    ),
  })
  return NextResponse.json({ sent, reason })
}
