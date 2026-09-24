import { supabaseAdmin } from "@/lib/supabase-admin"
import { escapeHtml, formatDueDate, sendEmail, taskDetailsHtml, taskEmailShell, taskPortalUrl, type EmailMessage } from "@/lib/send-email"
import { completionReviewers } from "@/lib/completion-reviewers"

// Server-only. Task assignment / reminder emails, sent exactly once per task even though two
// things can try to send the assignment email (the Supabase INSERT webhook and the daily
// cron's backfill, which can overlap): each first "claims" the task by
// stamping its *_sent_at column only where it's still null, and only the caller whose claim
// succeeded sends. If the send fails, the stamp is cleared again so the cron retries it.

type TaskRow = {
  id: string
  title: string
  description?: string | null
  due_date?: string | null
  assigned_to?: string | null
  department?: string | null
  team?: string | null
}

type SentColumn =
  | "assigned_email_sent_at"
  | "reminder_day_before_sent_at"
  | "reminder_due_sent_at"
  | "overdue_email_sent_at"
export type TaskEmailKind = "assigned" | "due_tomorrow" | "due_today" | "overdue"

const COLUMN: Record<TaskEmailKind, SentColumn> = {
  assigned: "assigned_email_sent_at",
  due_tomorrow: "reminder_day_before_sent_at",
  due_today: "reminder_due_sent_at",
  overdue: "overdue_email_sent_at",
}

type MemberRow = { email: string; name: string; role: string | null; department: string | null; team: string | null }

function buildMessage(kind: TaskEmailKind, task: TaskRow, name: string | undefined, cc?: string[]): EmailMessage {
  const hi = `Hi ${escapeHtml(name || "there")}`
  if (kind === "overdue") {
    // Sent once, just after midnight ET the day after the due date, CC'ing the same reviewers
    // as the "Task completed" email (see lib/completion-reviewers.ts).
    return {
      to: String(task.assigned_to),
      ...(cc && cc.length ? { cc } : {}),
      subject: `Overdue: ${task.title}`,
      html: taskEmailShell(
        `${hi}, a task is now overdue`,
        `${taskDetailsHtml(task)}
        <p style="margin:12px 0 0;">This task was due by 11:59 PM ET on ${
          task.due_date ? formatDueDate(task.due_date) : "its due date"
        } and hasn't been marked complete yet. Please finish it and submit it in the portal as soon as you can, or reach out to your director if you need more time.</p>`,
        taskPortalUrl(task.id),
      ),
    }
  }
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
    html: taskEmailShell(title, taskDetailsHtml(task), taskPortalUrl(task.id)),
  }
}

async function namesByEmail(emails: string[]): Promise<Map<string, string>> {
  const unique = Array.from(new Set(emails.map((e) => e.toLowerCase())))
  if (!unique.length) return new Map()
  const { data } = await supabaseAdmin.from("members").select("email, name").in("email", unique)
  return new Map((data || []).map((m: { email: string; name: string }) => [String(m.email).toLowerCase(), m.name]))
}

async function activeMembers(): Promise<MemberRow[]> {
  const { data } = await supabaseAdmin
    .from("members")
    .select("email, name, role, department, team")
    .eq("approved", true)
    .eq("archived", false)
  return (data || []) as MemberRow[]
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
  const members = kind === "overdue" ? await activeMembers() : []
  const ccFor = (t: TaskRow) => {
    if (kind !== "overdue") return undefined
    const email = String(t.assigned_to).toLowerCase()
    const member = members.find((m) => String(m.email || "").toLowerCase() === email)
    return completionReviewers(member, t, members, email).cc
  }
  // One email per task, one after another (sendEmail retries if Resend says it's busy).
  const results: boolean[] = []
  for (const t of toSend) {
    const { sent } = await sendEmail(buildMessage(kind, t, names.get(String(t.assigned_to).toLowerCase()), ccFor(t)))
    results.push(sent)
  }

  const failedIds = toSend.filter((_, i) => !results[i]).map((t) => t.id)
  if (failedIds.length) {
    await supabaseAdmin.from("tasks").update({ [column]: null }).in("id", failedIds).eq(column, stamp)
  }
  return { sent: toSend.length - failedIds.length, failed: failedIds.length }
}
