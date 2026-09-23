/**
 * Small in-memory fixed-window rate limiter for public, unauthenticated API routes (apply,
 * contact). State lives per server instance, so on serverless it is a speed bump against
 * scripted spam rather than a hard global limit, which is all these routes need.
 */
const buckets = new Map<string, { count: number; resetAt: number }>()

export function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for")
  return (fwd?.split(",")[0] || request.headers.get("x-real-ip") || "unknown").trim()
}

/** Returns true if this call is allowed, false once `limit` calls happened within `windowMs`. */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  if (buckets.size > 5000) {
    for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k)
  }
  const b = buckets.get(key)
  if (!b || b.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }
  b.count++
  return b.count <= limit
}
