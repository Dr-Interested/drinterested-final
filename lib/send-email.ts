/**
 * Minimal Resend email sender — calls Resend's plain HTTP API directly (no SDK dependency).
 * Requires RESEND_API_KEY (and optionally RESEND_FROM_EMAIL) in the environment. Mirrors the
 * existing Discord-webhook pattern (see app/api/members/apply/notify): if unconfigured, it
 * logs a warning and no-ops rather than throwing, so task actions never fail just
 * because email isn't set up yet.
 */
export async function sendEmail({
  to,
  cc,
  subject,
  html,
}: {
  to: string | string[]
  cc?: string | string[]
  subject: string
  html: string
}): Promise<{ sent: boolean; reason?: string }> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn("RESEND_API_KEY is not configured — skipping email:", subject)
    return { sent: false, reason: "not_configured" }
  }

  const from = process.env.RESEND_FROM_EMAIL || "Dr. Interested Portal <onboarding@resend.dev>"

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, ...(cc && cc.length ? { cc } : {}), subject, html }),
    })

    if (!res.ok) {
      const body = await res.text().catch(() => "")
      console.error("Resend send failed:", res.status, body)
      return { sent: false, reason: `resend_${res.status}` }
    }

    return { sent: true }
  } catch (err) {
    console.error("Resend send threw:", err)
    return { sent: false, reason: "network_error" }
  }
}

// Shared brand shell for every transactional email sent through this app (task assignment/
// reminder emails). Kept visually in sync with the Supabase Auth email templates (Confirm
// Signup / Magic Link / Reset Password) — same logo, colors (#405862 / #4ecdc4), card layout,
// and legal footer — so all outgoing mail reads as one consistent, trustworthy sender rather
// than a mix of styles, which also helps avoid spam/phishing heuristics on bare-link emails.
export function taskEmailShell(title: string, bodyHtml: string, portalUrl?: string): string {
  return `
    <div style="font-family: -apple-system, Helvetica, Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #ffffff;">
      <div style="background: #f5f1eb; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
        <img src="https://www.drinterested.org/circle-logo.png" alt="Dr. Interested" width="48" height="48" style="border-radius: 50%;" />
      </div>
      <div style="padding: 32px 28px; border: 1px solid #eee; border-top: none;">
        <h2 style="color: #405862; margin: 0 0 16px; font-size: 20px;">${title}</h2>
        <div style="color: #405862; line-height: 1.6; font-size: 14px;">
          ${bodyHtml}
        </div>
        <p style="margin: 28px 0 0; text-align: center;">
          <a href="${portalUrl || "https://www.drinterested.org/dashboard?login=true"}" style="background: #4ecdc4; color: #fff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
            Open the Portal
          </a>
        </p>
        <div style="border-top: 1px solid #eee; margin-top: 32px; padding-top: 16px; text-align: center;">
          <p style="color: #aaa; font-size: 11px; margin: 0 0 6px;">Dr. Interested Member Portal</p>
          <p style="color: #aaa; font-size: 11px; margin: 0 0 6px;">
            <a href="https://www.drinterested.org/privacy-policy" style="color: #4ecdc4; text-decoration: none;">Privacy Policy</a>
            &nbsp;&middot;&nbsp;
            <a href="https://www.drinterested.org/terms" style="color: #4ecdc4; text-decoration: none;">Terms of Service</a>
          </p>
          <p style="color: #bbb; font-size: 10px; margin: 0;">© 2026 Dr. Interested. All rights reserved.</p>
        </div>
      </div>
    </div>
  `
}

// Deep link into a member's My Tasks tab (default), or with tab = "tasks" into the Assign
// Tasks admin tab, which is where a director/deputy/owner reviews a completed task (and, once there, straight to the task itself —
// see the "task" query param read in app/dashboard/page.tsx). "login=true" is required even
// when a task id is present: proxy.ts's middleware only lets a signed-out visitor through to
// /dashboard with that flag, otherwise it redirects to "/" and every other param is lost.
export function taskPortalUrl(taskId?: string, tab: "mytasks" | "tasks" = "mytasks"): string {
  const url = new URL("https://www.drinterested.org/dashboard")
  url.searchParams.set("login", "true")
  url.searchParams.set("tab", tab)
  if (taskId) url.searchParams.set("task", taskId)
  return url.toString()
}
