"use client"

import { useEffect, useState } from "react"

const COOKIE_NOTICE_KEY = "portal_cookie_notice_ack"
const NOTIF_PROMPT_KEY = "portal_notification_prompt_seen"

/**
 * One-time prompts shown the first time a signed-in member opens the portal: a cookie notice,
 * then (if the browser supports it and hasn't already been asked) a notification permission
 * request. There's no "allow popups" browser permission a website can request — popup blocking
 * is a browser heuristic based on whether a window.open() call happens directly inside a user
 * click, not something a site can pre-authorize — so that part of the ask isn't a real API;
 * every window.open() in this portal (Drive files, the Drive OAuth connect link) already fires
 * synchronously from a click handler, which is what actually keeps browsers from blocking them.
 */
export default function PortalFirstVisitPrompts() {
  const [step, setStep] = useState<"cookies" | "notifications" | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    let cookieAck = true
    let notifSeen = true
    try {
      cookieAck = localStorage.getItem(COOKIE_NOTICE_KEY) === "true"
      notifSeen = localStorage.getItem(NOTIF_PROMPT_KEY) === "true"
    } catch {
      // localStorage unavailable (private browsing, etc.) — just skip the prompts.
      return
    }

    if (!cookieAck) {
      setStep("cookies")
    } else if (!notifSeen && "Notification" in window && Notification.permission === "default") {
      setStep("notifications")
    }
  }, [])

  const acceptCookies = () => {
    try { localStorage.setItem(COOKIE_NOTICE_KEY, "true") } catch {}

    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      let notifSeen = false
      try { notifSeen = localStorage.getItem(NOTIF_PROMPT_KEY) === "true" } catch {}
      if (!notifSeen) {
        setStep("notifications")
        return
      }
    }
    setStep(null)
  }

  const decideNotifications = async (enable: boolean) => {
    try { localStorage.setItem(NOTIF_PROMPT_KEY, "true") } catch {}
    if (enable && typeof window !== "undefined" && "Notification" in window) {
      await Notification.requestPermission()
    }
    setStep(null)
  }

  if (!step) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
        {step === "cookies" ? (
          <>
            <h3 className="font-bold text-lg mb-2 text-[#1a1a1a]">Before you continue</h3>
            <p className="text-sm text-gray-600 mb-4">
              The member portal uses cookies to keep you signed in and remember preferences like
              dark mode. By continuing, you&apos;re okay with that.
            </p>
            <button
              onClick={acceptCookies}
              className="w-full py-2.5 bg-[#4CAF7D] hover:bg-[#2d8659] text-white font-semibold rounded-lg transition-colors"
            >
              Got it
            </button>
          </>
        ) : (
          <>
            <h3 className="font-bold text-lg mb-2 text-[#1a1a1a]">Stay in the loop</h3>
            <p className="text-sm text-gray-600 mb-4">
              Turn on browser notifications to hear about it the moment a task is assigned to
              you. You can change this anytime from the Settings tab.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => decideNotifications(false)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
              >
                Not now
              </button>
              <button
                onClick={() => decideNotifications(true)}
                className="flex-1 py-2.5 bg-[#4CAF7D] hover:bg-[#2d8659] text-white font-semibold rounded-lg transition-colors"
              >
                Enable
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
