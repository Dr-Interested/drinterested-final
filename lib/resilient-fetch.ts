/**
 * Fetch used by the browser Supabase client (lib/supabase-client.ts, via `global.fetch`) for
 * every request it makes — data, auth (login/OTP/password reset), and storage alike, since
 * supabase-js routes all of those through this one hook.
 *
 * Normal path (the vast majority of requests, on any ordinary network): a direct fetch to
 * Supabase, identical to not having this wrapper at all.
 *
 * Fallback path: some networks (notably school/workplace wifi with DNS-level content
 * filtering) block *.supabase.co outright, so the direct request never completes — the site
 * itself loads (its own domain resolves fine) but the dashboard/members pages hang or come back
 * empty. When that happens here, the request is retried through our own server
 * (/api/supabase-relay), which makes the call from Vercel's network instead of the visitor's,
 * sidestepping whatever the visitor's network blocked. A browser can't do this bypass itself —
 * there's no API to hand fetch() a custom DNS resolver or a pre-resolved IP (Host-header
 * override is blocked, and TLS SNI/cert validation would fail against a bare IP anyway) — so
 * routing through a server we control is the only way to actually route around the block.
 */

const RELAY_ENDPOINT = "/api/supabase-relay"
const DIRECT_TIMEOUT_MS = 8000

async function bodyToBase64(body: BodyInit): Promise<string> {
  const blob = body instanceof Blob ? body : new Blob([body as BlobPart])
  const bytes = new Uint8Array(await blob.arrayBuffer())
  let binary = ""
  const CHUNK = 0x8000
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK))
  }
  return btoa(binary)
}

function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

async function relayFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const req = input instanceof Request ? input : null
  const url = req ? req.url : input.toString()
  const method = init?.method ?? req?.method ?? "GET"

  const headers: Record<string, string> = {}
  new Headers(init?.headers ?? req?.headers).forEach((v, k) => {
    headers[k] = v
  })

  let bodyBase64: string | null = null
  const rawBody = init?.body ?? (req?.body ? await req.clone().arrayBuffer() : null)
  if (rawBody != null) bodyBase64 = await bodyToBase64(rawBody as BodyInit)

  const relayRes = await fetch(RELAY_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, method, headers, bodyBase64 }),
  })

  const payload = await relayRes.json().catch(() => null)
  if (!relayRes.ok || !payload || typeof payload.status !== "number") {
    // The relay itself couldn't complete the request either (server can't reach Supabase —
    // a real outage, not a network block) — surface as a network error like the direct
    // attempt would have, rather than a confusing 200 wrapping a failure.
    throw new TypeError(payload?.error || "Supabase relay failed.")
  }

  let body: ArrayBuffer | null = null
  if (payload.bodyBase64) {
    const bytes = base64ToBytes(payload.bodyBase64)
    body = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer
  }
  return new Response(body, { status: payload.status, headers: payload.headers })
}

export function resilientFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  return (async () => {
    const controller = new AbortController()
    let timedOut = false
    const timer = setTimeout(() => {
      timedOut = true
      controller.abort()
    }, DIRECT_TIMEOUT_MS)

    const externalSignal = init?.signal
    const onExternalAbort = () => controller.abort()
    if (externalSignal) {
      if (externalSignal.aborted) controller.abort()
      else externalSignal.addEventListener("abort", onExternalAbort)
    }

    try {
      return await fetch(input, { ...init, signal: controller.signal })
    } catch (err) {
      clearTimeout(timer)
      externalSignal?.removeEventListener("abort", onExternalAbort)

      const isOurTimeout = err instanceof DOMException && err.name === "AbortError" && timedOut
      const isNetworkError = err instanceof TypeError
      if (!isOurTimeout && !isNetworkError) throw err
      if (externalSignal?.aborted && !timedOut) throw err // caller cancelled on purpose — don't retry

      console.warn("Direct Supabase request failed (possibly blocked by the current network) — retrying via server relay.")
      return await relayFetch(input, init)
    } finally {
      clearTimeout(timer)
      externalSignal?.removeEventListener("abort", onExternalAbort)
    }
  })()
}
