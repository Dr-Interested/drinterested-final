/**
 * Server-side check for a Cloudflare Turnstile token (the CAPTCHA on the public apply and
 * contact forms, see components/turnstile-widget.tsx). Turnstile is optional: when
 * TURNSTILE_SECRET_KEY isn't set this always passes, so the forms keep working before the
 * keys are added.
 */
export function turnstileEnabled(): boolean {
  return !!process.env.TURNSTILE_SECRET_KEY
}

export async function verifyTurnstile(token: string | null | undefined, ip?: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true
  if (!token) return false
  try {
    const form = new URLSearchParams({ secret, response: token })
    if (ip && ip !== "unknown") form.set("remoteip", ip)
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: form,
    })
    const data = (await res.json()) as { success?: boolean }
    return !!data.success
  } catch (err) {
    console.error("Turnstile verification failed:", err)
    return false
  }
}
