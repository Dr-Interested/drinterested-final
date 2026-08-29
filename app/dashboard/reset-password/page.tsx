"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase-client"

type Status = "checking" | "ready" | "invalid" | "success"

export default function ResetPasswordPage() {
  const [status, setStatus] = useState<Status>("checking")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | false>(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // The recovery link's tokens (hash fragment or ?code=) are consumed automatically by
    // the Supabase client on load (detectSessionInUrl, on by default) — we just need to
    // wait for the resulting session to show up.
    let cancelled = false

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
    }, 6000)

    return () => {
      cancelled = true
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(false)

    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
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
      setStatus("success")
    } catch (err: any) {
      setError(err.message || "Couldn't update your password. Try requesting a new link.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-8 w-full max-w-sm shadow-[0_10px_40px_rgba(0,0,0,0.1)] text-center">
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
              This reset link is invalid or has expired. Request a new one from the login screen.
            </p>
            <Link
              href="/dashboard?login=true"
              className="w-full py-3 bg-[#4CAF7D] hover:bg-[#2d8659] text-white font-semibold rounded-lg transition-colors inline-block"
            >
              Back to Login
            </Link>
          </>
        )}

        {status === "ready" && (
          <div className="text-left">
            <h2 className="text-2xl font-bold font-bricolage mb-2 text-[#1a1a1a] text-center">Set New Password</h2>
            <p className="text-sm text-gray-500 mb-6 text-center">Choose a new password for your portal account.</p>
            <form onSubmit={handleSubmit}>
              {error && <p className="text-[#c62828] text-sm mb-4">{error}</p>}
              <input
                type="password"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF7D] mb-4"
                autoFocus
                required
              />
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF7D] mb-4"
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
            <p className="text-sm text-gray-500 mb-6">You're signed in with your new password.</p>
            <Link
              href="/dashboard"
              className="w-full py-3 bg-[#4CAF7D] hover:bg-[#2d8659] text-white font-semibold rounded-lg transition-colors inline-block"
            >
              Go to Dashboard
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
