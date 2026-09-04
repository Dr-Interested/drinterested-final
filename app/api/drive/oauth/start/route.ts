import { NextResponse } from "next/server"
import { OAuth2Client } from "google-auth-library"
import { DriveApiError, getOAuthClientCredentials, DRIVE_SCOPE } from "@/lib/google-drive"

/**
 * One-time bootstrapping step (see the comment at the top of lib/google-drive.ts for why this
 * exists instead of a service account): sends whoever visits this URL to Google's consent
 * screen. They should sign in as the SAME Google account that owns the shared Drive folder —
 * that avoids needing to re-share anything, and gives the portal a real account with real
 * storage quota to create/copy/upload as. Not gated to a specific role here: the only thing
 * that matters is which Google account completes the consent screen, and the resulting token
 * is only ever shown back to whoever does that (see the callback route).
 */
export async function GET(request: Request) {
  try {
    const { clientId, clientSecret } = getOAuthClientCredentials()
    const redirectUri = new URL("/api/drive/oauth/callback", request.url).toString()

    const client = new OAuth2Client({ clientId, clientSecret, redirectUri })
    const url = client.generateAuthUrl({
      access_type: "offline",
      // Forces Google to hand back a refresh_token even if this account has connected before —
      // without this, a second connect attempt can silently return no refresh_token at all.
      prompt: "consent",
      scope: [DRIVE_SCOPE],
    })

    return NextResponse.redirect(url)
  } catch (err) {
    if (err instanceof DriveApiError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    console.error("GET /api/drive/oauth/start error:", err)
    return NextResponse.json({ error: "Could not start the Google Drive connection." }, { status: 500 })
  }
}
