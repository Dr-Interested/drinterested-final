import { NextResponse } from "next/server"
import { supabaseAdmin as supabase } from "@/lib/supabase-admin"
import { todayET } from "@/lib/dates"
import { sendTaskEmails } from "@/lib/task-emails"

export const dynamic = "force-dynamic"
// Room for retries when Resend is rate limiting.
export const maxDuration = 60

/**
 * Runs daily just after midnight Eastern Time (see vercel.json: 05:01 UTC, which is 12:01 AM
 * EST / 1:01 AM EDT, so it's always after ET midnight). Sends ONE "Overdue" email per task,
 * to the assignee with the same reviewers CC'd as the "Task completed" email, for open tasks
 * whose due date has passed. overdue_email_sent_at makes it once only; changing a task's due
 * date clears it. Only tasks due in the last 3 days are considered, so the first run doesn't
 * email every old overdue task at once.
 */
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const headerSecret = request.headers.get("x-cron-secret")
    const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "")
    if (headerSecret !== cronSecret && bearer !== cronSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  const today = todayET()
  const { data: tasks, error } = await supabase
    .from("tasks")
    .select("*")
    .lt("due_date", today)
    .gte("due_date", todayET(-3))
    .not("status", "in", "(Completed,Incomplete)")
    .eq("archived", false)
    .is("overdue_email_sent_at", null)

  if (error) {
    console.error("task-overdue cron error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  const { sent, failed } = await sendTaskEmails("overdue", tasks || [])
  return NextResponse.json({ success: true, found: (tasks || []).length, sent, failed, today })
}
