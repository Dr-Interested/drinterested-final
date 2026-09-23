/**
 * Minimal Resend email sender — calls Resend's plain HTTP API directly (no SDK dependency).
 * Requires RESEND_API_KEY and RESEND_FROM_EMAIL in the environment. If the API key is
 * missing it logs a warning and no-ops rather than throwing, so task actions never fail
 * just because email isn't set up yet.
 *
 * RESEND_FROM_EMAIL must be an address on a domain verified in Resend (e.g.
 * "Dr. Interested <portal@drinterested.org>"). The fallback onboarding@resend.dev sender only
 * delivers to the Resend account owner's own inbox, so every other member would silently
 * get nothing.
 */
export type EmailMessage = {
  to: string | string[]
  cc?: string | string[]
  subject: string
  html: string
}

const RESEND_API = "https://api.resend.com"
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

function fromAddress(): string {
  if (!process.env.RESEND_FROM_EMAIL) {
    console.warn("RESEND_FROM_EMAIL is not set — onboarding@resend.dev only delivers to the Resend account owner.")
  }
  return process.env.RESEND_FROM_EMAIL || "Dr. Interested Portal <onboarding@resend.dev>"
}

function toPayload(m: EmailMessage, from: string) {
  return {
    from,
    to: m.to,
    ...(m.cc && m.cc.length ? { cc: m.cc } : {}),
    subject: m.subject,
    html: m.html,
    // A plain-text alternative alongside the HTML noticeably helps inbox placement.
    text: htmlToText(m.html),
  }
}

// POST to Resend, retrying when it answers 429 (or a 5xx). Resend allows only a few requests
// per second per account, so a burst (a task assigned to a whole department fires one webhook
// per person at the same moment) used to get most of its emails rejected and silently dropped.
async function resendPost(path: string, body: unknown): Promise<{ ok: boolean; status: number; text: string }> {
  const apiKey = process.env.RESEND_API_KEY!
  let last = { ok: false, status: 0, text: "" }
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const res = await fetch(`${RESEND_API}${path}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const text = await res.text().catch(() => "")
      last = { ok: res.ok, status: res.status, text }
      if (res.status !== 429 && res.status < 500) return last
      const retryAfter = Number(res.headers.get("retry-after"))
      await sleep(retryAfter > 0 ? retryAfter * 1000 : 600 * (attempt + 1) + Math.random() * 400)
    } catch (err) {
      last = { ok: false, status: 0, text: String(err) }
      await sleep(600 * (attempt + 1))
    }
  }
  return last
}

/**
 * Minimal Resend email sender — calls Resend's plain HTTP API directly (no SDK dependency).
 * Requires RESEND_API_KEY and RESEND_FROM_EMAIL in the environment. If the API key is
 * missing it logs a warning and no-ops rather than throwing, so task actions never fail
 * just because email isn't set up yet.
 *
 * RESEND_FROM_EMAIL must be an address on a domain verified in Resend (e.g.
 * "Dr. Interested <portal@drinterested.org>"). The fallback onboarding@resend.dev sender only
 * delivers to the Resend account owner's own inbox, so every other member would silently
 * get nothing.
 */
export async function sendEmail(message: EmailMessage): Promise<{ sent: boolean; reason?: string; detail?: string }> {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is not configured — skipping email:", message.subject)
    return { sent: false, reason: "not_configured" }
  }
  const res = await resendPost("/emails", toPayload(message, fromAddress()))
  if (!res.ok) {
    console.error("Resend send failed:", res.status, res.text)
    return { sent: false, reason: `resend_${res.status}`, detail: res.text }
  }
  return { sent: true }
}

/** Escape user-controlled text (task titles, notes, names) before it goes into email HTML. */
export function escapeHtml(s: string | null | undefined): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

/** Only http(s) links are ever rendered as links, so a "javascript:" URL can't become an href. */
export function safeHttpUrl(u: string | null | undefined): string | null {
  const v = (u || "").trim()
  return /^https?:\/\//i.test(v) ? v : null
}

/** "Wednesday, September 24, 2026" for a YYYY-MM-DD due date, read as a calendar date (no timezone shift). */
export function formatDueDate(d: string): string {
  const [y, m, day] = d.slice(0, 10).split("-").map(Number)
  const date = y && m && day ? new Date(Date.UTC(y, m - 1, day)) : new Date(d)
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })
}

/** The task summary block every task email shares: bold title, description, due date. */
export function taskDetailsHtml(task: { title: string; description?: string | null; due_date?: string | null }): string {
  return `
    <p style="margin:0 0 8px;"><strong>${escapeHtml(task.title)}</strong></p>
    ${task.description ? `<p style="margin:0 0 8px;white-space:pre-line;">${escapeHtml(task.description)}</p>` : ""}
    ${task.due_date ? `<p style="margin:0 0 8px;"><strong>Due:</strong> ${formatDueDate(task.due_date)} (by 11:59 PM ET)</p>` : ""}
  `
}

function htmlToText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<a [^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, "$2 ($1)")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|h[1-6]|li)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&middot;/g, "·")
    .replace(/&copy;/g, "©")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n\s*\n+/g, "\n\n")
    .trim()
}

// Shared brand shell for every transactional email sent through this app (task assignment,
// reminder and completion emails). Kept visually in sync with the Supabase Auth email templates
// in docs/email-templates/ — same logo, colors (#405862 / #4ecdc4), card layout, and legal
// footer — so all outgoing mail reads as one consistent, trustworthy sender rather than a mix
// of styles, which also helps avoid spam/phishing heuristics on bare-link emails.
// `title` is inserted as-is: escape any user-controlled text in it with escapeHtml().
export function taskEmailShell(title: string, bodyHtml: string, portalUrl?: string, buttonLabel = "Open the Portal"): string {
  const year = new Date().getFullYear()
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Dr. Interested</title>
  </head>
  <body style="margin:0;padding:16px 8px;background:#f5f1eb;">
    <div style="font-family: -apple-system, Helvetica, Arial, sans-serif; max-width: 480px; width: 100%; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden;">
      <div style="background: #f5f1eb; padding: 24px; text-align: center;">
        <img src="https://www.drinterested.org/circle-logo.png" alt="Dr. Interested" width="48" height="48" style="border-radius: 50%;" />
      </div>
      <div style="padding: 32px 24px; border: 1px solid #eee; border-top: none; border-radius: 0 0 12px 12px;">
        <h2 style="color: #405862; margin: 0 0 16px; font-size: 20px; line-height: 1.3;">${title}</h2>
        <div style="color: #405862; line-height: 1.6; font-size: 14px;">
          ${bodyHtml}
        </div>
        <p style="margin: 28px 0 0; text-align: center;">
          <a href="${portalUrl || "https://www.drinterested.org/dashboard?login=true"}" style="background: #4ecdc4; color: #fff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
            ${buttonLabel}
          </a>
        </p>
        <div style="border-top: 1px solid #eee; margin-top: 32px; padding-top: 16px; text-align: center;">
          <p style="color: #aaa; font-size: 11px; margin: 0 0 6px;">Dr. Interested Member Portal</p>
          <p style="color: #aaa; font-size: 11px; margin: 0 0 6px;">
            <a href="https://www.drinterested.org/privacy-policy" style="color: #4ecdc4; text-decoration: none;">Privacy Policy</a>
            &nbsp;&middot;&nbsp;
            <a href="https://www.drinterested.org/terms" style="color: #4ecdc4; text-decoration: none;">Terms of Service</a>
          </p>
          <p style="color: #bbb; font-size: 10px; margin: 0;">&copy; ${year} Dr. Interested. All rights reserved.</p>
        </div>
      </div>
    </div>
  </body>
</html>`
}

// Deep link into a member's My Tasks tab (default), or with tab = "tasks" into the Assign
// Tasks admin tab, which is where a director/deputy/owner reviews a completed task
// (and, once there, straight to the task itself —
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
