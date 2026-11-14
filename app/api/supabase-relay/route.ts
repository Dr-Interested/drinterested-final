import { NextResponse } from "next/server"
import { clientIp, rateLimit } from "@/lib/rate-limit"

/**
 * Fallback-only relay for Supabase requests. lib/resilient-fetch.ts calls this ONLY after a
 * direct browser -> Supabase request has already failed at the network level (typically a
 * wifi network's DNS/firewall blocking *.supabase.co outright, e.g. school content filters).
 * It re-issues the exact same request from our own server — whose network isn't subject to
 * whatever blocked the visitor's browser — and hands the response straight back byte-for-byte.
 *
 * This is a dumb transparent relay: it forwards the caller's own apikey/Authorization headers
 * as-is rather than using any elevated credentials, so it grants no more access than the
 * visitor already had — Supabase's normal RLS still applies. It only reaches this project's
 * Supabase data/auth/storage APIs, with this site's public key, a fixed set of methods and
 * headers, no redirect following, size limits, a timeout and a per-IP rate limit.
 *
 * Bodies travel base64-encoded both ways so binary payloads (Storage uploads/downloads) round-
 * trip correctly, not just JSON.
 */

const SUPABASE_ORIGIN = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).origin

// Only the headers supabase-js actually sends are forwarded (an allowlist, not a blocklist),
// so nothing else a caller adds reaches Supabase.
const FORWARD_REQUEST_HEADERS = new Set([
  "apikey",
  "authorization",
  "content-type",
  "accept",
  "accept-profile",
  "content-profile",
  "prefer",
  "range",
  "x-client-info",
  "x-upsert",
  "x-supabase-api-version",
  "cache-control",
])
const STRIP_RESPONSE_HEADERS = new Set(["content-encoding", "content-length", "connection", "transfer-encoding", "set-cookie"])
const ALLOWED_METHODS = new Set(["GET", "HEAD", "POST", "PATCH", "PUT", "DELETE"])
// Data (PostgREST), sign-in, and file storage: the only Supabase APIs the site uses.
const ALLOWED_PATH = /^\/(rest|auth|storage)\/v1\//
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const MAX_BODY_BYTES = 4 * 1024 * 1024 // Vercel caps request bodies at 4.5 MB anyway
const MAX_RESPONSE_BYTES = 8 * 1024 * 1024
const UPSTREAM_TIMEOUT_MS = 20_000

type RelayPayload = {
  url?: string
  method?: string
  headers?: Record<string, string>
  bodyBase64?: string | null
}

export async function POST(request: Request) {
  if (!rateLimit(`relay:${clientIp(request)}`, 300, 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 })
  }

  let payload: RelayPayload
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  const { url, headers = {}, bodyBase64 = null } = payload
  const method = String(payload.method || "GET").toUpperCase()
  if (!ALLOWED_METHODS.has(method)) {
    return NextResponse.json({ error: "Method not allowed." }, { status: 400 })
  }

  let target: URL
  try {
    target = new URL(url ?? "")
  } catch {
    return NextResponse.json({ error: "Missing or invalid url." }, { status: 400 })
  }
  if (target.origin !== SUPABASE_ORIGIN || target.username || target.password || !ALLOWED_PATH.test(target.pathname)) {
    return NextResponse.json({ error: "URL must target this project's Supabase API." }, { status: 400 })
  }

  const outHeaders: Record<string, string> = {}
  for (const [k, v] of Object.entries(headers || {})) {
    if (FORWARD_REQUEST_HEADERS.has(k.toLowerCase()) && typeof v === "string") outHeaders[k] = v
  }
  // Only this site's own public (anon) key is relayed: the relay can never be used to send a
  // privileged key someone else holds, and it only ever acts with the visitor's own access.
  const apikey = Object.entries(outHeaders).find(([k]) => k.toLowerCase() === "apikey")?.[1]
  if (!ANON_KEY || apikey !== ANON_KEY) {
    return NextResponse.json({ error: "Missing or unexpected API key." }, { status: 400 })
  }

  const hasBody = bodyBase64 != null && method !== "GET" && method !== "HEAD"
  const body = hasBody ? Buffer.from(String(bodyBase64), "base64") : undefined
  if (body && body.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Request body too large." }, { status: 413 })
  }

  try {
    const upstream = await fetch(target, {
      method,
      headers: outHeaders,
      body,
      redirect: "manual",
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    })

    const declared = Number(upstream.headers.get("content-length") || 0)
    if (declared > MAX_RESPONSE_BYTES) {
      return NextResponse.json({ error: "Response too large to relay." }, { status: 502 })
    }

    const resHeaders: Record<string, string> = {}
    upstream.headers.forEach((v, k) => {
      if (!STRIP_RESPONSE_HEADERS.has(k.toLowerCase())) resHeaders[k] = v
    })

    const buf = Buffer.from(await upstream.arrayBuffer())
    if (buf.length > MAX_RESPONSE_BYTES) {
      return NextResponse.json({ error: "Response too large to relay." }, { status: 502 })
    }
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
