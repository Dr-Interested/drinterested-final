import { NextResponse } from "next/server"
import { OAuth2Client } from "google-auth-library"
import { DriveApiError, getOAuthClientCredentials } from "@/lib/google-drive"

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function htmlPage(bodyHtml: string, status = 200) {
  return new NextResponse(
    `<!doctype html><html><body style="font-family: sans-serif; max-width: 640px; margin: 40px auto; line-height: 1.5;">${bodyHtml}</body></html>`,
    { status, headers: { "Content-Type": "text/html; charset=utf-8" } }
  )
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const error = searchParams.get("error")

  if (error) {
    return htmlPage(`<h2>Google Drive connection cancelled</h2><p>Google returned: ${escapeHtml(error)}</p>`, 400)
  }
  if (!code) {
    return htmlPage("<h2>Missing authorization code</h2><p>Try connecting again from /api/drive/oauth/start.</p>", 400)
  }

  try {
    const { clientId, clientSecret } = getOAuthClientCredentials()
    const redirectUri = new URL("/api/drive/oauth/callback", request.url).toString()
    const client = new OAuth2Client({ clientId, clientSecret, redirectUri })

    const { tokens } = await client.getToken(code)

    if (!tokens.refresh_token) {
      return htmlPage(`
        <h2>No refresh token returned</h2>
        <p>Google only issues one when this account hasn't already granted this app access (or when it's forced to re-prompt). Revoke this app's access at
        <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer">myaccount.google.com/permissions</a> and try connecting again from
        <a href="/api/drive/oauth/start">/api/drive/oauth/start</a>.</p>
      `)
    }

    return htmlPage(`
      <h2>Google Drive connected</h2>
      <p>Copy this value into the <code>GOOGLE_DRIVE_REFRESH_TOKEN</code> environment variable
      (<code>.env.local</code> for local dev, and Vercel → Settings → Environment Variables for
      production), then restart the dev server / redeploy. This page will not show it again —
      if you lose it, just run this connection flow once more.</p>
      <textarea readonly style="width:100%;height:90px;font-family:monospace;font-size:13px;padding:8px;" onclick="this.select()">${escapeHtml(tokens.refresh_token)}</textarea>
      <p style="color:#b45309;"><strong>Treat this like a password</strong> — anyone who has it can read and write this Google account's Drive.</p>
    `)
  } catch (err) {
    if (err instanceof DriveApiError) {
      return htmlPage(`<h2>Could not connect</h2><p>${escapeHtml(err.message)}</p>`, err.status)
    }
    console.error("GET /api/drive/oauth/callback error:", err)
    return htmlPage("<h2>Could not connect</h2><p>Failed to exchange the authorization code for tokens.</p>", 500)
  }
}
