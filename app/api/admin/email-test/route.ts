import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { OWNER_EMAILS } from "@/lib/owner"
import { sendEmail, taskEmailShell } from "@/lib/send-email"
import { sendTaskEmails } from "@/lib/task-emails"

export const dynamic = "force-dynamic"
// Room for retries when Resend is rate limiting, and for bulk sends.
export const maxDuration = 60

/**
 * Owner-only email diagnostic (Admin tab → "Send test email"). Reports which email-related
 * settings are present (never their values) and sends a test email to the signed-in owner,
 * returning Resend's own error text if it's rejected, so a misconfiguration is visible
 * instead of emails silently not arriving.
 */
export async function POST(request: Request) {
  const token = (request.headers.get("authorization") || "").replace(/^Bearer\s+/i, "").trim()
  const {
    data: { user },
  } = token ? await supabaseAdmin.auth.getUser(token) : { data: { user: null } }
  const email = user?.email?.toLowerCase()
  if (!email || !OWNER_EMAILS.includes(email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  // "Send missed task emails": assignment emails for open tasks from the last 14 days that
  // never got one (same thing the daily cron does each morning, on demand).
  const body = await request.json().catch(() => ({}))
  if (body?.action === "backfill") {
    const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
    const { data: tasks, error } = await supabaseAdmin
      .from("tasks")
      .select("*")
      .not("status", "in", "(Completed,Incomplete)")
      .eq("archived", false)
      .is("assigned_email_sent_at", null)
      .gte("created_at", since)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    const r = await sendTaskEmails("assigned", tasks || [])
    return NextResponse.json({ backfill: true, found: (tasks || []).length, ...r })
  }

  const from = process.env.RESEND_FROM_EMAIL || ""
  const settings = {
    RESEND_API_KEY: !!process.env.RESEND_API_KEY,
    RESEND_FROM_EMAIL: from || null,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    CRON_SECRET: !!process.env.CRON_SECRET,
    TASK_WEBHOOK_SECRET: !!process.env.TASK_WEBHOOK_SECRET,
  }

  const problems: string[] = []
  if (!settings.RESEND_API_KEY) problems.push("RESEND_API_KEY is missing, so no app emails can be sent.")
  if (!from) problems.push("RESEND_FROM_EMAIL is missing, so emails only reach the Resend account owner.")
  else if (/resend\.dev/i.test(from)) problems.push("RESEND_FROM_EMAIL uses resend.dev, which only delivers to the Resend account owner.")
  if (!settings.SUPABASE_SERVICE_ROLE_KEY)
    problems.push("SUPABASE_SERVICE_ROLE_KEY is missing, so the server can't read tasks to email them.")

  const result = await sendEmail({
    to: email,
    subject: "Dr. Interested portal: test email",
    html: taskEmailShell(
      "Your portal emails are working",
      `<p style="margin:0;">This test was sent from the Admin tab at ${new Date().toLocaleString("en-US", {
        timeZone: "America/Toronto",
      })} ET. If you received it, task, reminder and approval emails can be delivered.</p>`,
    ),
  })
  if (!result.sent && result.detail) problems.push(`Resend rejected the test email: ${result.detail}`)

  const { count: unsent } = await supabaseAdmin
    .from("tasks")
    .select("id", { count: "exact", head: true })
    .not("status", "in", "(Completed,Incomplete)")
    .eq("archived", false)
    .is("assigned_email_sent_at", null)
    .gte("created_at", new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString())

  return NextResponse.json({ sent: result.sent, reason: result.reason, settings, problems, unsentAssignments: unsent ?? 0 })
}
