import { supabaseAdmin } from "@/lib/supabase-admin"
import {
  escapeHtml,
  sendEmailBatch,
  taskDetailsHtml,
  taskEmailShell,
  taskPortalUrl,
  type EmailMessage,
} from "@/lib/send-email"

// Server-only. Task assignment / reminder emails, sent exactly once per task even though
// three things can try to send the assignment email (the portal right after assigning, the
// Supabase INSERT webhook, and the daily cron's backfill): each first "claims" the task by
// stamping its *_sent_at column only where it's still null, and only the caller whose claim
// succeeded sends. If the send fails, the stamp is cleared again so the cron retries it.

type TaskRow = {
  id: string
  title: string
  description?: string | null
  due_date?: string | null
  assigned_to?: string | null
}

type SentColumn = "assigned_email_sent_at" | "reminder_day_before_sent_at" | "reminder_due_sent_at"
export type TaskEmailKind = "assigned" | "due_tomorrow" | "due_today"

const COLUMN: Record<TaskEmailKind, SentColumn> = {
  assigned: "assigned_email_sent_at",
  due_tomorrow: "reminder_day_before_sent_at",
  due_today: "reminder_due_sent_at",
}

function buildMessage(kind: TaskEmailKind, task: TaskRow, name: string | undefined): EmailMessage {
  const hi = `Hi ${escapeHtml(name || "there")}`
  const subject =
    kind === "assigned"
      ? `New task assigned: ${task.title}`
      : kind === "due_today"
        ? `Due today: ${task.title}`
        : `Due tomorrow: ${task.title}`
  const title =
    kind === "assigned"
      ? `${hi}, you've been assigned a task`
      : `${hi}, ${kind === "due_today" ? "a task is due today" : "a task is due tomorrow"}`
  return {
    to: String(task.assigned_to),
    subject,
    html: taskEmailShell(title, taskDetailsHtml(task), taskPortalUrl(task.id), "View the Task"),
  }
}

async function namesByEmail(emails: string[]): Promise<Map<string, string>> {
  const unique = Array.from(new Set(emails.map((e) => e.toLowerCase())))
  if (!unique.length) return new Map()
  const { data } = await supabaseAdmin.from("members").select("email, name").in("email", unique)
  return new Map((data || []).map((m: { email: string; name: string }) => [String(m.email).toLowerCase(), m.name]))
}

/** Claims, sends and (on failure) releases the given tasks' emails. Returns how many were sent. */
export async function sendTaskEmails(kind: TaskEmailKind, tasks: TaskRow[]): Promise<{ sent: number; failed: number }> {
  const column = COLUMN[kind]
  const candidates = tasks.filter((t) => t.id && t.assigned_to)
  if (!candidates.length) return { sent: 0, failed: 0 }

  const stamp = new Date().toISOString()
  const { data: claimed, error } = await supabaseAdmin
    .from("tasks")
    .update({ [column]: stamp })
    .in(
      "id",
      candidates.map((t) => t.id),
    )
    .is(column, null)
    .select("id")
  if (error) {
    console.error(`Couldn't claim ${kind} emails:`, error.message)
    return { sent: 0, failed: candidates.length }
  }
  const claimedIds = new Set((claimed || []).map((r: { id: string }) => r.id))
  const toSend = candidates.filter((t) => claimedIds.has(t.id))
  if (!toSend.length) return { sent: 0, failed: 0 }

  const names = await namesByEmail(toSend.map((t) => String(t.assigned_to)))
  const results = await sendEmailBatch(
    toSend.map((t) => buildMessage(kind, t, names.get(String(t.assigned_to).toLowerCase()))),
  )

  const failedIds = toSend.filter((_, i) => !results[i]).map((t) => t.id)
  if (failedIds.length) {
    await supabaseAdmin.from("tasks").update({ [column]: null }).in("id", failedIds).eq(column, stamp)
  }
  return { sent: toSend.length - failedIds.length, failed: failedIds.length }
}
