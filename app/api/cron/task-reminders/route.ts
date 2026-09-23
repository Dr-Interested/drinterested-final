import { NextResponse } from "next/server"
import { supabaseAdmin as supabase } from "@/lib/supabase-admin"
import { todayET } from "@/lib/dates"
import { escapeHtml, sendEmail, taskDetailsHtml, taskEmailShell, taskPortalUrl } from "@/lib/send-email"

export const dynamic = "force-dynamic"

/**
 * Runs once daily (see vercel.json). Uses the service-role client so it can see every task
 * regardless of RLS. Three passes, each stamping its own *_sent_at column so re-runs don't
 * double-send:
 *   1. assignment email  — any open task whose assigned_email_sent_at is still null (covers
 *      tasks created in bulk / via SQL that never went through the portal's notify call)
 *   2. "due tomorrow" reminder
 *   3. "due today" reminder
 * Plus a pass 0, keyed off received_at (stamped when the assigner marks a task Received, or
 * marks it Incomplete — that's also when it's archived, so nothing archives on a timer):
 *   0a. 30+ days after received_at -> promote to the owner-only Permanent Archive
 *   0b. 90+ days after received_at -> delete the row
 */
const FINISHED = ["Completed", "Incomplete"]
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    // Accept either an external scheduler's "x-cron-secret: <secret>" header OR Vercel Cron's
    // automatic "Authorization: Bearer <CRON_SECRET>" header (Vercel does NOT send x-cron-secret).
    const headerSecret = request.headers.get("x-cron-secret")
    const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "")
    if (headerSecret !== cronSecret && bearer !== cronSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  // Due dates are Eastern Time calendar dates (see lib/dates.ts).
  const today = todayET()
  const tomorrow = todayET(1)

  const results = { permanentlyArchived: 0, deleted: 0, newAssignments: 0, dayBefore: 0, dueToday: 0, errors: [] as string[] }

  try {
    const daysAgo = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString()

    // Pass 0a — promote to the Permanent Archive 30 days after the task was marked Received.
    const { data: promotedRows, error: promoteErr } = await supabase
      .from("tasks")
      .update({ permanently_archived: true, permanently_archived_at: new Date().toISOString() })
      .eq("archived", true)
      .eq("permanently_archived", false)
      .lte("received_at", daysAgo(30))
      .select("id")
    if (promoteErr) results.errors.push(promoteErr.message)
    else results.permanentlyArchived = promotedRows?.length || 0

    // Pass 0b — hard delete 90 days after received_at. Runs after 0a, and requires the row to
    // already be permanently archived, so nothing skips the Permanent Archive tier.
    const { data: deletedRows, error: deleteErr } = await supabase
      .from("tasks")
      .delete()
      .eq("permanently_archived", true)
      .lte("received_at", daysAgo(90))
      .select("id")
    if (deleteErr) results.errors.push(deleteErr.message)
    else results.deleted = deletedRows?.length || 0

    const { data: members } = await supabase.from("members").select("email, name")
    const nameByEmail = new Map((members || []).map((m: any) => [String(m.email).toLowerCase(), m.name]))

    // Pass 1 — assignment emails for tasks that never got one (bulk / SQL-created). Limited to
    // tasks created in the last 4 days so a first run after deploy doesn't email the assignee
    // of every historical task (all of which have a null assigned_email_sent_at).
    const assignCutoff = todayET(-4)
    const sendNewAssignments = async () => {
      const { data: tasks, error } = await supabase
        .from("tasks")
        .select("*")
        .not("status", "in", `(${FINISHED.join(",")})`)
        .eq("archived", false)
        .is("assigned_email_sent_at", null)
        .gte("created_at", assignCutoff)

      if (error) {
        results.errors.push(error.message)
        return
      }

      for (const task of tasks || []) {
        const assigneeEmail = task.assigned_to
        if (!assigneeEmail) continue
        const assigneeName = nameByEmail.get(String(assigneeEmail).toLowerCase())

        const { sent } = await sendEmail({
          to: assigneeEmail,
          subject: `New task assigned: ${task.title}`,
          html: taskEmailShell(
            `Hi ${escapeHtml(assigneeName || "there")}, you've been assigned a task`,
            taskDetailsHtml(task),
            taskPortalUrl(task.id),
            "View the Task"
          ),
        })

        if (sent) {
          await supabase.from("tasks").update({ assigned_email_sent_at: new Date().toISOString() }).eq("id", task.id)
          results.newAssignments++
        }
      }
    }

    const remind = async (dueDate: string, column: "reminder_day_before_sent_at" | "reminder_due_sent_at", isToday: boolean) => {
      const { data: tasks, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("due_date", dueDate)
        .not("status", "in", `(${FINISHED.join(",")})`)
        .eq("archived", false)
        .is(column, null)

      if (error) {
        results.errors.push(error.message)
        return
      }

      for (const task of tasks || []) {
        const assigneeEmail = task.assigned_to
        if (!assigneeEmail) continue
        const assigneeName = nameByEmail.get(String(assigneeEmail).toLowerCase())

        const { sent } = await sendEmail({
          to: assigneeEmail,
          subject: isToday ? `Due today: ${task.title}` : `Due tomorrow: ${task.title}`,
          html: taskEmailShell(
            `Hi ${escapeHtml(assigneeName || "there")}, ${isToday ? "a task is due today" : "a task is due tomorrow"}`,
            taskDetailsHtml(task),
            taskPortalUrl(task.id),
            "View the Task"
          ),
        })

        if (sent) {
          await supabase.from("tasks").update({ [column]: new Date().toISOString() }).eq("id", task.id)
          if (isToday) results.dueToday++
          else results.dayBefore++
        }
      }
    }

    await sendNewAssignments()
    await remind(tomorrow, "reminder_day_before_sent_at", false)
    await remind(today, "reminder_due_sent_at", true)

    return NextResponse.json({ success: true, ...results, timestamp: new Date().toISOString() })
  } catch (err: any) {
    console.error("task-reminders cron error:", err)
    return NextResponse.json({ success: false, error: err.message, ...results }, { status: 500 })
  }
}
