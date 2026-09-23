"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff, Loader2, X } from "lucide-react"
import { supabase } from "@/lib/supabase-client"
import { errorMessage } from "@/lib/errors"

// Supabase Auth's raw error strings are terse ("Signups not allowed for otp", "For security
// purposes, you can only request this after 42 seconds") — map the common ones to plain help.
function friendlyAuthError(message: string | undefined, fallback: string): string {
  const m = (message || "").toLowerCase()
  if (!m) return fallback
  if (m.includes("rate limit") || m.includes("for security purposes") || m.includes("too many"))
    return "Too many attempts. Please wait a minute and try again."
  if (m.includes("signups not allowed") || m.includes("user not found"))
    return "We couldn't find a portal account for that email. Use the email you applied with."
  if (m.includes("token has expired") || (m.includes("invalid") && m.includes("token")) || m.includes("otp"))
    return "That code is incorrect or has expired. Request a new code and try again."
  if (m.includes("email not confirmed"))
    return "Your email hasn't been confirmed yet. Check your inbox (and spam folder) for the confirmation link, or contact an admin."
  if (m.includes("failed to fetch") || m.includes("network"))
    return "Couldn't reach the server. Check your connection and try again."
  return message || fallback
}

/**
 * The portal's sign-in screen: password, one-time email code, Google/Discord SSO and
 * "forgot password". It only starts a Supabase session; app/dashboard/page.tsx's auth
 * listener notices the session, sets the portal-session cookie and shows the portal.
 */
export default function PortalLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [authError, setAuthError] = useState<string | false>(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [authView, setAuthView] = useState<"login" | "forgot" | "otp">("login")
  const [resetSent, setResetSent] = useState(false)
  const [resetError, setResetError] = useState<string | false>(false)
  const [isSendingReset, setIsSendingReset] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otpCode, setOtpCode] = useState("")
  const [otpError, setOtpError] = useState<string | false>(false)
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)
  const [isSsoLoading, setIsSsoLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoggingIn(true)
    setAuthError(false)
    
    // Phones often autocomplete a trailing space or a capital letter into the email field.
    const { error } = await supabase.auth
      .signInWithPassword({ email: email.trim().toLowerCase(), password })
      .catch((err) => ({ error: err as Error }))

    setIsLoggingIn(false)

    if (error) {
      // Surface the real reason instead of a generic message — "Email not confirmed" (the
      // confirmation email never arrived/was clicked) looks identical to a typo'd password
      // otherwise, and sends people into a forgot-password loop that can't fix an unconfirmed
      // account either.
      const m = error.message.toLowerCase()
      setAuthError(
        m.includes("invalid login credentials")
          ? "Invalid email or password."
          : friendlyAuthError(error.message, "Invalid email or password."),
      )
    } else {
      // portal-session cookie is set by the auth-state-change listener above once the
      // session lands — no need to duplicate that here.
      setEmail("")
      setPassword("")
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSendingReset(true)
    setResetError(false)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/dashboard/reset-password`,
      })
      if (error) throw error
      setResetSent(true)
    } catch (err) {
      setResetError(friendlyAuthError(errorMessage(err), "Couldn't send the reset email. Try again."))
    } finally {
      setIsSendingReset(false)
    }
  }

  // Passwordless login uses a manually-typed 6-digit code rather than a clickable link —
  // Supabase's client auto-consumes a link's token the instant ANYTHING loads that URL
  // (detectSessionInUrl), including automated link-scanners some email providers run against
  // inbound mail before a human ever clicks, which silently burns the token. A code the user
  // has to type can't be pre-fetched that way. See the Magic Link template in Supabase →
  // Authentication → Email Templates, which must show {{ .Token }} as plain text (no href).
  // shouldCreateUser: false so this can never create a brand new auth account — only log in
  // to one that already exists.
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSendingOtp(true)
    setOtpError(false)
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: { shouldCreateUser: false },
      })
      if (error) throw error
      setOtpSent(true)
      setOtpCode("")
    } catch (err) {
      setOtpError(friendlyAuthError(errorMessage(err), "Couldn't send the code. Try again."))
    } finally {
      setIsSendingOtp(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsVerifyingOtp(true)
    setOtpError(false)
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: otpCode.replace(/\D/g, ""),
        type: "email",
      })
      if (error) throw error
      // Success signs the user in — same auto-unmount-via-listener as above.
    } catch (err) {
      setOtpError(friendlyAuthError(errorMessage(err), "Invalid or expired code."))
    } finally {
      setIsVerifyingOtp(false)
    }
  }

  const handleOAuthSignIn = async (provider: "google" | "discord") => {
    setIsSsoLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        // "login=true" lets the proxy.ts middleware through on the redirect back, before
        // the client-side auth listener has had a chance to set the portal-session cookie.
        options: { redirectTo: `${window.location.origin}/dashboard?login=true` },
      })
      if (error) {
        alert(`${provider === "google" ? "Google" : "Discord"} sign-in failed: ${error.message}`)
        setIsSsoLoading(false)
      }
      // On success the browser navigates away to the provider, so no further state update
      // is needed here — isSsoLoading resets naturally on the next page load.
    } catch (err) {
      alert(errorMessage(err) || "Sign-in failed.")
      setIsSsoLoading(false)
    }
  }

  return (
      <div className="fixed inset-0 z-50 bg-black/50 overflow-y-auto">
        <div className="min-h-full flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-6 sm:p-8 w-full max-w-sm shadow-[0_10px_40px_rgba(0,0,0,0.1)] relative">
          <Image src="/circle-logo.png" alt="Dr. Interested" width={44} height={44} className="rounded-full mb-4" priority />
          <Link
            href="/"
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </Link>

          {authView === "forgot" ? (
            <>
              <h2 className="text-2xl font-bold font-bricolage mb-2 text-[#1a1a1a]">Reset Password</h2>
              <p className="text-sm text-gray-500 mb-6">
                Enter the email you applied with — we&apos;ll send a link to set a new password.
              </p>

              {resetSent ? (
                <div role="status" className="bg-[#e8f5e9] text-[#2e7d32] border border-[#81c784] rounded-lg p-4 text-sm space-y-2">
                  <p>
                    If <strong className="break-all">{email.trim()}</strong> has a portal account, a reset link is on its way.
                    It can take a few minutes, so check your spam folder too.
                  </p>
                  <button
                    type="button"
                    onClick={() => setResetSent(false)}
                    className="text-xs font-semibold underline hover:no-underline"
                  >
                    Didn&apos;t get it? Send again
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword}>
                  {resetError && <p role="alert" className="text-[#c62828] text-sm mb-4">{resetError}</p>}
                  <input
                    type="email"
                    placeholder="Email address"
                    autoComplete="email"
                    autoCapitalize="none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF7D] mb-4"
                    autoFocus
                    required
                  />
                  <button
                    type="submit"
                    disabled={isSendingReset}
                    className="w-full py-3 bg-[#4CAF7D] hover:bg-[#2d8659] text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isSendingReset && <Loader2 className="w-4 h-4 animate-spin" />}
                    Send Reset Link
                  </button>
                </form>
              )}

              <button
                onClick={() => {
                  setAuthView("login")
                  setResetSent(false)
                  setResetError(false)
                }}
                className="text-xs text-gray-500 hover:text-[#4CAF7D] mt-4 block mx-auto"
              >
                ← Back to login
              </button>
            </>
          ) : authView === "otp" ? (
            <>
              <h2 className="text-2xl font-bold font-bricolage mb-2 text-[#1a1a1a]">Sign In With a Code</h2>

              {!otpSent ? (
                <>
                  <p className="text-sm text-gray-500 mb-6">
                    Enter your email — we&apos;ll send you a 6-digit one-time code instead of using your password.
                  </p>
                  <form onSubmit={handleSendOtp}>
                    {otpError && <p role="alert" className="text-[#c62828] text-sm mb-4">{otpError}</p>}
                    <input
                      type="email"
                      placeholder="Email address"
                      autoComplete="email"
                      autoCapitalize="none"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF7D] mb-4"
                      autoFocus
                      required
                    />
                    <button
                      type="submit"
                      disabled={isSendingOtp}
                      className="w-full py-3 bg-[#4CAF7D] hover:bg-[#2d8659] text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {isSendingOtp && <Loader2 className="w-4 h-4 animate-spin" />}
                      Send Code
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-500 mb-6">
                    Enter the code we emailed to <strong className="break-all text-gray-700">{email.trim()}</strong>. It can take a
                    minute to arrive, so check your spam folder too.
                  </p>
                  <form onSubmit={handleVerifyOtp}>
                    {otpError && <p role="alert" className="text-[#c62828] text-sm mb-4">{otpError}</p>}
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      pattern="[0-9]*"
                      maxLength={10}
                      placeholder="6-digit code"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF7D] mb-4 tracking-[0.4em] text-center text-lg"
                      autoFocus
                      required
                    />
                    <button
                      type="submit"
                      disabled={isVerifyingOtp}
                      className="w-full py-3 bg-[#4CAF7D] hover:bg-[#2d8659] text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {isVerifyingOtp && <Loader2 className="w-4 h-4 animate-spin" />}
                      Verify & Sign In
                    </button>
                  </form>
                  <div className="flex items-center justify-between mt-3 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false)
                        setOtpError(false)
                        setOtpCode("")
                      }}
                      className="text-gray-500 hover:text-[#4CAF7D]"
                    >
                      Use a different email
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleSendOtp(e as unknown as React.FormEvent)}
                      disabled={isSendingOtp}
                      className="text-gray-500 hover:text-[#4CAF7D] disabled:opacity-60"
                    >
                      {isSendingOtp ? "Sending…" : "Resend code"}
                    </button>
                  </div>
                </>
              )}

              <button
                onClick={() => {
                  setAuthView("login")
                  setOtpSent(false)
                  setOtpError(false)
                  setOtpCode("")
                }}
                className="text-xs text-gray-500 hover:text-[#4CAF7D] mt-4 block mx-auto"
              >
                ← Back to login
              </button>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold font-bricolage mb-6 text-[#1a1a1a]">Portal Login</h2>

              {authError && (
                <p role="alert" className="text-[#c62828] text-sm mb-4">{authError}</p>
              )}

              <form onSubmit={handleLogin}>
                <input
                  type="email"
                  placeholder="Email address"
                  autoComplete="username"
                  autoCapitalize="none"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setAuthError(false)
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF7D] mb-4"
                  autoFocus
                  required
                />
                <div className="relative mb-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setAuthError(false)
                    }}
                    className="w-full p-3 pr-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF7D]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-0 px-3 text-gray-400 hover:text-gray-600"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 mb-4">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthView("forgot")
                      setAuthError(false)
                    }}
                    className="text-xs text-gray-500 hover:text-[#4CAF7D] py-1"
                  >
                    Forgot password?
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthView("otp")
                      setAuthError(false)
                    }}
                    className="text-xs text-gray-500 hover:text-[#4CAF7D] py-1"
                  >
                    Sign in with a code instead
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-3 bg-[#4CAF7D] hover:bg-[#2d8659] text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isLoggingIn && <Loader2 className="w-4 h-4 animate-spin" />}
                  Sign In
                </button>
              </form>

              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 uppercase tracking-wide">or</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => handleOAuthSignIn("google")}
                  disabled={isSsoLoading}
                  className="w-full py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2.5 disabled:opacity-70"
                >
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.87c2.27-2.09 3.58-5.17 3.58-8.82Z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.94-2.9l-3.87-3.02c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.12-6.73-4.96H1.27v3.12A12 12 0 0 0 12 24Z" />
                    <path fill="#FBBC05" d="M5.27 14.27a7.2 7.2 0 0 1 0-4.54V6.61H1.27a12 12 0 0 0 0 10.78l4-3.12Z" />
                    <path fill="#EA4335" d="M12 4.77c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.94 1.19 15.24 0 12 0A12 12 0 0 0 1.27 6.61l4 3.12C6.22 6.89 8.87 4.77 12 4.77Z" />
                  </svg>
                  Continue with Google
                </button>

                <button
                  type="button"
                  onClick={() => handleOAuthSignIn("discord")}
                  disabled={isSsoLoading}
                  className="w-full py-3 bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2.5 disabled:opacity-70"
                >
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.32 4.37a19.8 19.8 0 0 0-4.89-1.52.07.07 0 0 0-.08.04c-.21.38-.45.87-.61 1.26a18.3 18.3 0 0 0-5.48 0 12.6 12.6 0 0 0-.62-1.26.08.08 0 0 0-.08-.04c-1.7.29-3.36.8-4.89 1.52a.07.07 0 0 0-.03.03C.53 8.6-.32 12.72.1 16.78a.08.08 0 0 0 .03.06 19.9 19.9 0 0 0 6 3.03.08.08 0 0 0 .08-.03c.46-.63.87-1.3 1.23-2a.08.08 0 0 0-.04-.11 13.1 13.1 0 0 1-1.87-.9.08.08 0 0 1 0-.13c.13-.09.25-.19.37-.28a.07.07 0 0 1 .08 0c3.93 1.79 8.18 1.79 12.06 0a.07.07 0 0 1 .08 0c.12.1.24.19.37.28a.08.08 0 0 1 0 .13c-.6.35-1.22.65-1.87.9a.08.08 0 0 0-.04.11c.36.7.78 1.37 1.23 2a.08.08 0 0 0 .08.03 19.8 19.8 0 0 0 6.01-3.03.08.08 0 0 0 .03-.06c.5-4.7-.83-8.79-3.51-12.38a.06.06 0 0 0-.03-.03ZM8.02 14.35c-1.18 0-2.15-1.08-2.15-2.41 0-1.33.95-2.41 2.15-2.41 1.21 0 2.17 1.09 2.15 2.41 0 1.33-.95 2.41-2.15 2.41Zm7.97 0c-1.18 0-2.15-1.08-2.15-2.41 0-1.33.95-2.41 2.15-2.41 1.21 0 2.17 1.09 2.15 2.41 0 1.33-.94 2.41-2.15 2.41Z" />
                  </svg>
                  Continue with Discord
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-4 text-center">
                Log in with your individual member profile account.
              </p>
            </>
          )}
        </div>
        </div>
      </div>
)
}
