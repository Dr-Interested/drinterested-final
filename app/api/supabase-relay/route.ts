import { NextResponse } from "next/server"

/**
 * Fallback-only relay for Supabase requests. lib/resilient-fetch.ts calls this ONLY after a
 * direct browser -> Supabase request has already failed at the network level (typically a
 * wifi network's DNS/firewall blocking *.supabase.co outright, e.g. school content filters).
 * It re-issues the exact same request from our own server — whose network isn't subject to
 * whatever blocked the visitor's browser — and hands the response straight back byte-for-byte.
 *
 * This is a dumb transparent relay: it forwards the caller's own apikey/Authorization headers
 * as-is rather than using any elevated credentials, so it grants no more access than the
 * visitor already had — Supabase's normal RLS still applies. The origin check below is the
 * only thing keeping this from being an open proxy to anywhere.
 *
 * Bodies travel base64-encoded both ways so binary payloads (Storage uploads/downloads) round-
 * trip correctly, not just JSON.
 */

const SUPABASE_ORIGIN = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).origin

// Hop-by-hop or auto-derived headers. Forwarding the caller's copies verbatim would corrupt
// the outgoing request (a stale Content-Length once the body is re-encoded here) or leak this
// server's own request context (its own Cookie/Origin have nothing to do with the visitor's).
const STRIP_REQUEST_HEADERS = new Set(["host", "connection", "content-length", "cookie", "origin", "referer"])
const STRIP_RESPONSE_HEADERS = new Set(["content-encoding", "content-length", "connection", "transfer-encoding"])

type RelayPayload = {
  url?: string
  method?: string
  headers?: Record<string, string>
  bodyBase64?: string | null
}

export async function POST(request: Request) {
  let payload: RelayPayload
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  const { url, method = "GET", headers = {}, bodyBase64 = null } = payload
  let target: URL
  try {
    target = new URL(url ?? "")
  } catch {
    return NextResponse.json({ error: "Missing or invalid url." }, { status: 400 })
  }
  if (target.origin !== SUPABASE_ORIGIN) {
    return NextResponse.json({ error: "URL must target this project's Supabase instance." }, { status: 400 })
  }

  const outHeaders: Record<string, string> = {}
  for (const [k, v] of Object.entries(headers)) {
    if (!STRIP_REQUEST_HEADERS.has(k.toLowerCase())) outHeaders[k] = v
  }

  const hasBody = bodyBase64 != null && method !== "GET" && method !== "HEAD"

  try {
    const upstream = await fetch(target, {
      method,
      headers: outHeaders,
      body: hasBody ? Buffer.from(bodyBase64!, "base64") : undefined,
    })

    const resHeaders: Record<string, string> = {}
    upstream.headers.forEach((v, k) => {
      if (!STRIP_RESPONSE_HEADERS.has(k.toLowerCase())) resHeaders[k] = v
    })

    const buf = Buffer.from(await upstream.arrayBuffer())
    return NextResponse.json({
      status: upstream.status,
      headers: resHeaders,
      bodyBase64: buf.toString("base64"),
    })
  } catch (err) {
    console.error("Supabase relay fetch failed:", err)
    return NextResponse.json({ error: "Relay could not reach Supabase either." }, { status: 502 })
  }
}
