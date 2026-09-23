import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { sendEmail, taskEmailShell, taskPortalUrl } from "@/lib/send-email"
import { isDeputyRole, isDirectorRole, LEADERSHIP_RANK, normalizeDepartmentName } from "@/lib/teams"
import { OWNER_EMAILS } from "@/lib/owner"

export const dynamic = "force-dynamic"

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

// Only http(s) links are rendered as links, so a submitted "javascript:" URL can't end up
// as a clickable href in a reviewer's inbox.
const safeUrl = (u: string | null | undefined) => (u && /^https?:\/\//i.test(u.trim()) ? u.trim() : null)

/**
 * Called by the portal (app/dashboard/page.tsx, handleSubmitTaskCompletion) right after a
 * member marks a task Completed. Emails the people who should review it, CC'ing the
 * completer, with whatever they submitted (link / note / file):
 *   - completer is a Director or Admin Team leadership -> the owner
 *   - completer is a Deputy Director                   -> their department's Director
 *   - anyone else -> their department's Director + their own team's Deputy Director
 *     (falling back to the owner if neither exists, so nothing silently goes nowhere)
 *
 * The caller must be signed in as the task's assignee (Authorization: Bearer <access token>),
 * and the task must actually be Completed, so this can't be used to spam reviewers.
 */
export async function POST(request: Request) {
  const token = (request.headers.get("authorization") || "").replace(/^Bearer\s+/i, "").trim()
  if (!token) return NextResponse.json({ error: "Not signed in." }, { status: 401 })

  const {
    data: { user },
    error: userError,
  } = await supabaseAdmin.auth.getUser(token)
  if (userError || !user?.email) return NextResponse.json({ error: "Not signed in." }, { status: 401 })
  const callerEmail = user.email.toLowerCase()

  let taskId: string | undefined
  try {
    taskId = (await request.json())?.taskId
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }
  if (!taskId) return NextResponse.json({ error: "taskId is required" }, { status: 400 })

  const { data: task } = await supabaseAdmin.from("tasks").select("*").eq("id", taskId).maybeSingle()
  if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 })
  if (String(task.assigned_to || "").toLowerCase() !== callerEmail) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  if (task.status !== "Completed") return NextResponse.json({ skipped: "task not completed" })

  const { data: members } = await supabaseAdmin
    .from("members")
    .select("name, email, role, department, team")
    .eq("approved", true)
    .eq("archived", false)

  const all = members || []
  const completer = all.find((m: any) => String(m.email || "").toLowerCase() === callerEmail)
  const role = (completer?.role || "").trim()
  // Same resolution as TasksAdminTab's `resolved` memo: task column first, then the member row.
  const dept = normalizeDepartmentName(task.department || completer?.department || "")
  const team = task.team || completer?.team || null

  const emailOf = (m: any) => String(m?.email || "").toLowerCase()
  const director = all.find(
    (m: any) =>
      normalizeDepartmentName(m.department) === dept && isDirectorRole(m.role) && !isDeputyRole(m.role),
  )
  const deputy = team
    ? all.find(
        (m: any) => normalizeDepartmentName(m.department) === dept && (m.team || "") === team && isDeputyRole(m.role),
      )
    : undefined

  let to: string[]
  if (LEADERSHIP_RANK.includes(role) || (isDirectorRole(role) && !isDeputyRole(role))) {
    to = [...OWNER_EMAILS]
  } else if (isDeputyRole(role)) {
    to = director ? [emailOf(director)] : []
  } else {
    to = [director, deputy].filter(Boolean).map(emailOf)
  }
  to = Array.from(new Set(to.filter((e) => e && e !== callerEmail)))
  if (to.length === 0) to = OWNER_EMAILS.filter((e) => e !== callerEmail)
  if (to.length === 0) return NextResponse.json({ skipped: "no recipients" })

  const completerName = completer?.name || callerEmail
  const link = safeUrl(task.submission_url)
  const file = safeUrl(task.submission_file_url)
  const note = (task.submission_note || "").trim()
  const dueLine = task.due_date
    ? `<p><strong>Due:</strong> ${new Date(task.due_date).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })}</p>`
    : ""

  const { sent, reason } = await sendEmail({
    to,
    cc: callerEmail,
    subject: `Task completed: ${task.title}`,
    html: taskEmailShell(
      `${esc(completerName)} completed a task`,
      `
        <p><strong>${esc(task.title)}</strong></p>
        ${task.description ? `<p>${esc(task.description)}</p>` : ""}
        ${dueLine}
        <p><strong>Completed by:</strong> ${esc(completerName)}${dept ? ` (${esc(dept)}${team ? ` / ${esc(team)}` : ""})` : ""}</p>
        ${link ? `<p><strong>Link:</strong> <a href="${esc(link)}" style="color:#4ecdc4;">${esc(link)}</a></p>` : ""}
        ${note ? `<p><strong>Notes:</strong><br/>${esc(note).replace(/\n/g, "<br/>")}</p>` : ""}
        ${file ? `<p><strong>File:</strong> <a href="${esc(file)}" style="color:#4ecdc4;">Download the attached file</a></p>` : ""}
        ${!link && !note && !file ? `<p style="color:#888;">Nothing was attached to this submission.</p>` : ""}
        <p style="color:#888;font-size:13px;">Review it in the portal. Whoever assigned the task marks it Received there, which starts its archive clock.</p>
      `,
      taskPortalUrl(task.id, "tasks"),
    ),
  })

  return NextResponse.json({ sent, reason })
}
