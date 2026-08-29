/**
 * Minimal Resend email sender — calls Resend's plain HTTP API directly (no SDK dependency).
 * Requires RESEND_API_KEY (and optionally RESEND_FROM_EMAIL) in the environment. Mirrors the
 * existing Discord-webhook pattern (see app/api/members/apply/notify): if unconfigured, it
 * logs a warning and no-ops rather than throwing, so task/timesheet actions never fail just
 * because email isn't set up yet.
 */
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string | string[]
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
      body: JSON.stringify({ from, to, subject, html }),
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

export function taskEmailShell(title: string, bodyHtml: string): string {
  return `
    <div style="font-family: -apple-system, Helvetica, Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #1a1a1a;">
      <h2 style="color: #1a1a1a; margin-bottom: 4px;">${title}</h2>
      ${bodyHtml}
      <p style="margin-top: 24px;">
        <a href="https://www.drinterested.org/dashboard?login=true" style="background: #4CAF7D; color: #fff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 600;">
          Open the Portal
        </a>
      </p>
      <p style="color: #888; font-size: 12px; margin-top: 32px;">Dr. Interested Member Portal</p>
    </div>
  `
}
