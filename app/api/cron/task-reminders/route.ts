import { NextResponse } from "next/server"
import { supabaseAdmin as supabase } from "@/lib/supabase-admin"
import { sendEmail, taskEmailShell } from "@/lib/send-email"

export const dynamic = "force-dynamic"

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })

/**
 * Runs once daily (see vercel.json). Uses the service-role client so it can see every task
 * regardless of RLS. Three passes, each stamping its own *_sent_at column so re-runs don't
 * double-send:
 *   1. assignment email  — any open task whose assigned_email_sent_at is still null (covers
 *      tasks created in bulk / via SQL that never went through the portal's notify call)
 *   2. "due tomorrow" reminder
 *   3. "due today" reminder
 */
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

  const toDateStr = (d: Date) => d.toISOString().slice(0, 10)
  const today = toDateStr(new Date())
  const tomorrow = toDateStr(new Date(Date.now() + 24 * 60 * 60 * 1000))

  const results = { newAssignments: 0, dayBefore: 0, dueToday: 0, errors: [] as string[] }

  try {
    const { data: members } = await supabase.from("members").select("email, name")
    const nameByEmail = new Map((members || []).map((m: any) => [String(m.email).toLowerCase(), m.name]))

    // Pass 1 — assignment emails for tasks that never got one (bulk / SQL-created). Limited to
    // tasks created in the last 4 days so a first run after deploy doesn't email the assignee
    // of every historical task (all of which have a null assigned_email_sent_at).
    const assignCutoff = toDateStr(new Date(Date.now() - 4 * 24 * 60 * 60 * 1000))
    const sendNewAssignments = async () => {
      const { data: tasks, error } = await supabase
        .from("tasks")
        .select("*")
        .neq("status", "Completed")
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
            `Hi ${assigneeName || "there"}, you've been assigned a task`,
            `
              <p><strong>${task.title}</strong></p>
              ${task.description ? `<p>${task.description}</p>` : ""}
              ${task.due_date ? `<p><strong>Due:</strong> ${fmtDate(task.due_date)}</p>` : ""}
            `
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
        .neq("status", "Completed")
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
            `Hi ${assigneeName || "there"}, ${isToday ? "a task is due today" : "a task is due tomorrow"}`,
            `
              <p><strong>${task.title}</strong></p>
              ${task.description ? `<p>${task.description}</p>` : ""}
              <p><strong>Due:</strong> ${new Date(task.due_date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p>
            `
          ),
        })

        if (sent) {
          await supabase.from("tasks").update({ [column]: new Date().toISOString() }).eq("id", task.id)
          isToday ? results.dueToday++ : results.dayBefore++
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
