import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { sendTaskEmails } from "@/lib/task-emails"

export const dynamic = "force-dynamic"
// Room for retries when Resend is rate limiting, and for bulk sends.
export const maxDuration = 60

/**
 * Called by the portal's Assign Tasks panel right after it creates tasks, so assignment
 * emails go out immediately even if the Supabase INSERT webhook (/api/tasks/on-insert) isn't
 * set up. Safe to run alongside that webhook and the daily cron: each email is claimed before
 * sending, so a person never gets it twice. Only the signed-in person who assigned a task can
 * trigger its email.
 */
export async function POST(request: Request) {
  const token = (request.headers.get("authorization") || "").replace(/^Bearer\s+/i, "").trim()
  if (!token) return NextResponse.json({ error: "Not signed in." }, { status: 401 })
  const {
    data: { user },
  } = await supabaseAdmin.auth.getUser(token)
  if (!user?.email) return NextResponse.json({ error: "Not signed in." }, { status: 401 })

  let taskIds: unknown
  try {
    taskIds = (await request.json())?.taskIds
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }
  if (!Array.isArray(taskIds) || !taskIds.length || taskIds.length > 500 || !taskIds.every((id) => typeof id === "string")) {
    return NextResponse.json({ error: "taskIds must be a non-empty list" }, { status: 400 })
  }

  const assigners = [user.id, user.email.toLowerCase()]
  let sent = 0
  let failed = 0
  for (let i = 0; i < taskIds.length; i += 100) {
    const { data: tasks, error } = await supabaseAdmin
      .from("tasks")
      .select("id, title, description, due_date, assigned_to, assigned_by, status, archived")
      .in("id", taskIds.slice(i, i + 100))
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    const mine = (tasks || []).filter(
      (t) =>
        assigners.includes(String(t.assigned_by || "").toLowerCase()) &&
        !t.archived &&
        !["Completed", "Incomplete"].includes(t.status),
    )
    const r = await sendTaskEmails("assigned", mine)
    sent += r.sent
    failed += r.failed
  }
  return NextResponse.json({ sent, failed })
}
