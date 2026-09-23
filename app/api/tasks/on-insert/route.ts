import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { escapeHtml, sendEmail, taskDetailsHtml, taskEmailShell, taskPortalUrl } from "@/lib/send-email"

export const dynamic = "force-dynamic"

/**
 * Supabase Database Webhook target — fires on every INSERT into public.tasks, so a task
 * gets its "you've been assigned" email instantly no matter how the row was created
 * (portal UI, a bulk SQL script, a Node script). The DB itself can't send email, so this
 * HTTP endpoint is what turns a new row into an email.
 *
 * Set up (once):  Supabase Dashboard -> Database -> Webhooks -> Create a new hook
 *   Table: public.tasks   Events: Insert   Type: HTTP Request   Method: POST
 *   URL:  https://www.drinterested.org/api/tasks/on-insert
 *   HTTP header:  x-webhook-secret = <same value as TASK_WEBHOOK_SECRET>
 *
 * Idempotent: skips completed tasks and anything already stamped, so the daily cron's
 * backfill pass and this webhook can't double-send.
 */
export async function POST(request: Request) {
  const secret = process.env.TASK_WEBHOOK_SECRET
  if (secret && request.headers.get("x-webhook-secret") !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let payload: any
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  // Only the id is taken from the payload; the task itself is re-read from the database. That
  // way a forged request (e.g. if TASK_WEBHOOK_SECRET isn't set) can't choose the recipient
  // or the email's content, only re-trigger a real task's own assignment email once.
  const taskId = payload?.record?.id
  if (!taskId) {
    return NextResponse.json({ skipped: "no task record" })
  }
  const { data: task } = await supabaseAdmin.from("tasks").select("*").eq("id", taskId).maybeSingle()
  if (!task?.assigned_to) {
    return NextResponse.json({ skipped: "task not found" })
  }
  if (["Completed", "Incomplete"].includes(task.status) || task.archived || task.assigned_email_sent_at) {
    return NextResponse.json({ skipped: "already handled" })
  }

  const { data: member } = await supabaseAdmin
    .from("members")
    .select("name")
    .eq("email", String(task.assigned_to).toLowerCase())
    .maybeSingle()

  const { sent, reason } = await sendEmail({
    to: task.assigned_to,
    subject: `New task assigned: ${task.title}`,
    html: taskEmailShell(
      `Hi ${escapeHtml(member?.name || "there")}, you've been assigned a task`,
      taskDetailsHtml(task),
      taskPortalUrl(task.id),
      "View the Task"
    ),
  })

  if (sent) {
    await supabaseAdmin
      .from("tasks")
      .update({ assigned_email_sent_at: new Date().toISOString() })
      .eq("id", task.id)
  }

  return NextResponse.json({ sent, reason })
}
