import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { escapeHtml as esc, safeHttpUrl as safeUrl, sendEmail, taskDetailsHtml, taskEmailShell, taskPortalUrl } from "@/lib/send-email"
import { completionReviewers } from "@/lib/completion-reviewers"

export const dynamic = "force-dynamic"
// Room for retries when Resend is rate limiting, and for bulk sends.
export const maxDuration = 60

/**
 * Called by the portal (components/dashboard/MyTasksTab.tsx) right after a member marks a
 * task Completed. Emails the completer, CC'ing the people who review their work, with
 * whatever they submitted (link / note / file):
 *   - completer is a Director or above -> CC the owner
 *   - completer is a Deputy Director   -> CC their department's Director
 *   - anyone else                      -> CC their team's Deputy Director + department Director
 *   See lib/completion-reviewers.ts.
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
  const { dept, team, cc } = completionReviewers(completer, task, all, callerEmail)

  const completerName = completer?.name || callerEmail
  const link = safeUrl(task.submission_url)
  const file = safeUrl(task.submission_file_url)
  const note = (task.submission_note || "").trim()
  const row = (label: string, value: string) =>
    `<p style="margin:0 0 8px;"><strong>${label}:</strong> ${value}</p>`
  const submission = [
    link ? row("Link", `<a href="${esc(link)}" style="color:#4ecdc4;word-break:break-all;">${esc(link)}</a>`) : "",
    file ? row("File", `<a href="${esc(file)}" style="color:#4ecdc4;">Download the attached file</a>`) : "",
    note ? `<p style="margin:0 0 4px;"><strong>Notes:</strong></p><p style="margin:0;white-space:pre-line;">${esc(note)}</p>` : "",
  ].join("")

  const { sent, reason } = await sendEmail({
    to: callerEmail,
    cc: cc.length ? cc : undefined,
    subject: `Task completed: ${task.title}`,
    html: taskEmailShell(
      `${esc(completerName)} completed a task`,
      `
        ${taskDetailsHtml(task)}
        ${row("Completed by", `${esc(completerName)}${dept ? ` (${esc(dept)}${team ? ` / ${esc(team)}` : ""})` : ""}`)}
        <div style="margin:16px 0 0;padding:14px 16px;background:#f0fbfa;border:1px solid #c8efec;border-radius:8px;">
          <p style="margin:0 0 8px;font-weight:600;">What they submitted</p>
          ${submission || `<p style="margin:0;color:#888;">Nothing was attached to this submission.</p>`}
        </div>
        <p style="color:#888;font-size:13px;margin:16px 0 0;">Review it in the portal. Whoever assigned the task marks it Received there, which starts its archive clock.</p>
      `,
      taskPortalUrl(task.id, "tasks"),
    ),
  })

  return NextResponse.json({ sent, reason })
}
