"use client"

import { useEffect, useRef } from "react"

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string
      reset: (id?: string) => void
      remove: (id?: string) => void
    }
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"

/** True when the Turnstile CAPTCHA is configured (NEXT_PUBLIC_TURNSTILE_SITE_KEY is set). */
export const turnstileConfigured = !!SITE_KEY

let scriptPromise: Promise<void> | null = null
function loadScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve()
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const s = document.createElement("script")
      s.src = SCRIPT_SRC
      s.async = true
      s.onload = () => resolve()
      s.onerror = () => {
        scriptPromise = null
        reject(new Error("Couldn't load the verification check."))
      }
      document.head.appendChild(s)
    })
  }
  return scriptPromise
}

/**
 * Cloudflare Turnstile CAPTCHA (task.md A11) for the public apply and contact forms. Renders
 * nothing until NEXT_PUBLIC_TURNSTILE_SITE_KEY (and TURNSTILE_SECRET_KEY on the server) are
 * set, so the forms work unchanged until then. Pass a changing `resetKey` to get a fresh
 * token after a submit (each token can be verified only once).
 */
export default function TurnstileWidget({ onToken, resetKey }: { onToken: (token: string | null) => void; resetKey?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | null>(null)
  const onTokenRef = useRef(onToken)
  onTokenRef.current = onToken

  useEffect(() => {
    if (!SITE_KEY || !ref.current) return
    let cancelled = false
    loadScript()
      .then(() => {
        if (cancelled || !ref.current || !window.turnstile) return
        widgetId.current = window.turnstile.render(ref.current, {
          sitekey: SITE_KEY,
          theme: "light",
          size: "flexible",
          callback: (t: string) => onTokenRef.current(t),
          "expired-callback": () => onTokenRef.current(null),
          "error-callback": () => onTokenRef.current(null),
        })
      })
      .catch((err) => console.error(err))
    return () => {
      cancelled = true
      if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current)
      widgetId.current = null
    }
  }, [])

  useEffect(() => {
    if (resetKey && widgetId.current && window.turnstile) {
      window.turnstile.reset(widgetId.current)
      onTokenRef.current(null)
    }
  }, [resetKey])

  if (!SITE_KEY) return null
  return <div ref={ref} className="min-h-[65px] w-full" />
}
