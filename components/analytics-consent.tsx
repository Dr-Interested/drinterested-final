"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Script from "next/script"
import { usePathname } from "next/navigation"

const GA_ID = "G-6MYCRFPPGE"
const META_PIXEL_ID = "1742833623581972"
const STORAGE_KEY = "analytics-consent" // "granted" | "denied"
const CONSENT_EVENT = "analytics-consent-change"

// The member portal (sign in, password reset, everything signed-in) and portal-only pages never
// load marketing/analytics scripts: third-party code on an authentication surface is needless
// supply-chain and privacy exposure (security review F-02).
const PORTAL_PREFIXES = ["/dashboard", "/volunteer-agreement"]
export const isPortalPath = (path: string | null) => !!path && PORTAL_PREFIXES.some((p) => path.startsWith(p))

type Consent = "granted" | "denied" | null

function readConsent(): Consent {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    return v === "granted" || v === "denied" ? v : null
  } catch {
    return null
  }
}

/** Lets other components (e.g. the privacy policy page) reopen the choice. */
export function resetAnalyticsConsent() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {}
  window.dispatchEvent(new Event(CONSENT_EVENT))
}

/**
 * Google Analytics and the Meta Pixel load only after a visitor chooses "Allow" in the banner,
 * and never on portal pages. If a visitor who allowed tracking navigates into the portal
 * without a full page load, the already-loaded scripts are told to stop sending (GA's
 * disable flag, Meta's consent revoke).
 */
export default function AnalyticsConsent() {
  const pathname = usePathname()
  const [consent, setConsent] = useState<Consent>(null)
  const [ready, setReady] = useState(false)
  const portal = isPortalPath(pathname)

  useEffect(() => {
    const sync = () => setConsent(readConsent())
    sync()
    setReady(true)
    window.addEventListener(CONSENT_EVENT, sync)
    return () => window.removeEventListener(CONSENT_EVENT, sync)
  }, [])

  // Pause/resume already-loaded trackers when moving between public pages and the portal.
  useEffect(() => {
    const w = window as unknown as Record<string, unknown> & { fbq?: (...a: unknown[]) => void }
    const off = portal || consent !== "granted"
    w[`ga-disable-${GA_ID}`] = off
    if (typeof w.fbq === "function") w.fbq("consent", off ? "revoke" : "grant")
  }, [portal, consent])

  const choose = (value: "granted" | "denied") => {
    try {
      localStorage.setItem(STORAGE_KEY, value)
    } catch {}
    setConsent(value)
    window.dispatchEvent(new Event(CONSENT_EVENT))
  }

  if (!ready || portal) return null

  return (
    <>
      {consent === "granted" && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { anonymize_ip: true });
            `}
          </Script>
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
              n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
              document,'script','https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${META_PIXEL_ID}');
              fbq('track', 'PageView');
            `}
          </Script>
        </>
      )}

      {consent === null && (
        <div
          role="dialog"
          aria-live="polite"
          aria-label="Cookie preferences"
          className="fixed inset-x-0 bottom-0 z-[90] p-3 sm:p-4"
        >
          <div className="mx-auto max-w-3xl rounded-xl border border-gray-200 bg-white p-4 shadow-xl sm:flex sm:items-center sm:gap-4">
            <p className="text-sm text-gray-700 flex-1">
              We&apos;d like to use Google Analytics and the Meta Pixel to understand how people find and use our site.
              They only load if you allow them.{" "}
              <Link href="/privacy-policy#cookies" className="text-[#2d8659] underline underline-offset-2">
                Privacy Policy
              </Link>
            </p>
            <div className="mt-3 flex gap-2 sm:mt-0 shrink-0">
              <button
                onClick={() => choose("denied")}
                className="flex-1 sm:flex-none rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Decline
              </button>
              <button
                onClick={() => choose("granted")}
                className="flex-1 sm:flex-none rounded-lg bg-[#405862] px-4 py-2 text-sm font-semibold text-white hover:bg-[#334852]"
              >
                Allow
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
