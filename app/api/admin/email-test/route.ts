import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { OWNER_EMAILS } from "@/lib/owner"
import { sendEmail, taskEmailShell } from "@/lib/send-email"

export const dynamic = "force-dynamic"

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

  return NextResponse.json({ sent: result.sent, reason: result.reason, settings, problems })
}
