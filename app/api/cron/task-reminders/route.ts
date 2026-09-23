import { NextResponse } from "next/server"
import { supabaseAdmin as supabase } from "@/lib/supabase-admin"
import { todayET } from "@/lib/dates"
import { sendTaskEmails } from "@/lib/task-emails"

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

    // Pass 1 — assignment emails for tasks that never got one (e.g. the portal's own send and
    // the INSERT webhook both failed, or rows added by SQL). Limited to tasks created in the
    // last 4 days so a first run after deploy doesn't email every historical task.
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
      const { sent, failed } = await sendTaskEmails("assigned", tasks || [])
      results.newAssignments += sent
      if (failed) results.errors.push(`${failed} assignment email(s) failed`)
    }

    const remind = async (dueDate: string, kind: "due_tomorrow" | "due_today") => {
      const column = kind === "due_today" ? "reminder_due_sent_at" : "reminder_day_before_sent_at"
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
      const { sent, failed } = await sendTaskEmails(kind, tasks || [])
      if (kind === "due_today") results.dueToday += sent
      else results.dayBefore += sent
      if (failed) results.errors.push(`${failed} ${kind.replace("_", " ")} reminder(s) failed`)
    }

    await sendNewAssignments()
    await remind(tomorrow, "due_tomorrow")
    await remind(today, "due_today")

    return NextResponse.json({ success: true, ...results, timestamp: new Date().toISOString() })
  } catch (err: any) {
    console.error("task-reminders cron error:", err)
    return NextResponse.json({ success: false, error: err.message, ...results }, { status: 500 })
  }
}
