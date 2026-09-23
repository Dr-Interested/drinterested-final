"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase-client"

type Status = "checking" | "ready" | "invalid" | "success"

// Same cookie the dashboard's auth listener sets (read by proxy.ts). This page lives outside
// that listener, so without it the "Go to the Portal" link after a reset bounced people back
// to the homepage even though they were signed in.
function setPortalCookie() {
  document.cookie = "portal-session=authenticated; path=/; SameSite=Strict; Secure"
}

export default function ResetPasswordPage() {
  const [status, setStatus] = useState<Status>("checking")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | false>(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // The recovery link's tokens (hash fragment or ?code=) are consumed automatically by
    // the Supabase client on load (detectSessionInUrl, on by default) — we just need to
    // wait for the resulting session to show up.
    let cancelled = false

    // An expired or already-used link comes back with the error in the URL (e.g.
    // #error=access_denied&error_code=otp_expired) — show that straight away instead of
    // making the visitor wait for the timeout below.
    const params = new URLSearchParams(window.location.hash.replace(/^#/, "") || window.location.search)
    if (params.get("error") || params.get("error_code")) {
      setStatus("invalid")
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!cancelled && session) setStatus("ready")
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (cancelled) return
      if (event === "PASSWORD_RECOVERY" || (event === "SIGNED_IN" && session)) {
        setStatus("ready")
      }
    })

    // If nothing shows up after a few seconds, the link was invalid, expired, or already used.
    const timeout = setTimeout(() => {
      if (!cancelled) setStatus((s) => (s === "checking" ? "invalid" : s))
    }, 8000)

    return () => {
      cancelled = true
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(false)

    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setSaving(true)
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) throw updateError
      setPortalCookie()
      setStatus("success")
    } catch (err: any) {
      const msg = String(err?.message || "")
      setError(
        /different from the old/i.test(msg)
          ? "Your new password must be different from your old one."
          : /weak|pwned|leaked/i.test(msg)
            ? "That password is too easy to guess. Please choose a stronger one."
            : msg || "Couldn't update your password. Try requesting a new link.",
      )
    } finally {
      setSaving(false)
    }
  }

  const inputClass =
    "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF7D] mb-4"

  return (
    <div className="fixed inset-0 z-50 bg-black/50 overflow-y-auto">
      <div className="min-h-full flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-6 sm:p-8 w-full max-w-sm shadow-[0_10px_40px_rgba(0,0,0,0.1)] text-center">
          <Image src="/circle-logo.png" alt="Dr. Interested" width={44} height={44} className="rounded-full mx-auto mb-4" priority />

          {status === "checking" && (
            <>
              <Loader2 className="w-6 h-6 animate-spin text-[#4CAF7D] mx-auto mb-4" />
              <p className="text-sm text-gray-500">Verifying your reset link...</p>
            </>
          )}

          {status === "invalid" && (
            <>
              <h2 className="text-xl font-bold font-bricolage mb-2 text-[#1a1a1a]">Link Expired</h2>
              <p className="text-sm text-gray-500 mb-6">
                This reset link is invalid, has expired, or was already used. Reset links only work once, so request a
                new one from the sign-in screen.
              </p>
              <Link
                href="/dashboard?login=true"
                className="w-full py-3 bg-[#4CAF7D] hover:bg-[#2d8659] text-white font-semibold rounded-lg transition-colors inline-block"
              >
                Back to Sign In
              </Link>
            </>
          )}

          {status === "ready" && (
            <div className="text-left">
              <h2 className="text-2xl font-bold font-bricolage mb-2 text-[#1a1a1a] text-center">Set New Password</h2>
              <p className="text-sm text-gray-500 mb-6 text-center">Choose a new password for your portal account.</p>
              <form onSubmit={handleSubmit}>
                {error && (
                  <p role="alert" className="text-[#c62828] text-sm mb-4">
                    {error}
                  </p>
                )}
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="New password (8+ characters)"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={8}
                    className={`${inputClass} pr-11`}
                    autoFocus
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute top-0 right-0 h-[50px] px-3 text-gray-400 hover:text-gray-600"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputClass}
                  required
                />
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-3 bg-[#4CAF7D] hover:bg-[#2d8659] text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  Update Password
                </button>
              </form>
            </div>
          )}

          {status === "success" && (
            <>
              <h2 className="text-xl font-bold font-bricolage mb-2 text-[#1a1a1a]">Password Updated</h2>
              <p className="text-sm text-gray-500 mb-6">You&apos;re signed in with your new password.</p>
              <Link
                href="/dashboard?login=true"
                className="w-full py-3 bg-[#4CAF7D] hover:bg-[#2d8659] text-white font-semibold rounded-lg transition-colors inline-block"
              >
                Go to the Portal
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
