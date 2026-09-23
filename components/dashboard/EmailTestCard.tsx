"use client"

import { useState } from "react"
import { CheckCircle2, Loader2, Mail, Send, XCircle } from "lucide-react"
import { supabase } from "@/lib/supabase-client"
import { errorMessage } from "@/lib/errors"

type Result = {
  sent: boolean
  settings: Record<string, boolean | string | null>
  problems: string[]
  unsentAssignments?: number
}

/** Owner-only Admin tab card: sends a test email and lists any email settings problems. */
export default function EmailTestCard() {
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [backfilling, setBackfilling] = useState(false)
  const [backfillMsg, setBackfillMsg] = useState<string | null>(null)

  async function authHeaders(): Promise<Record<string, string>> {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return session?.access_token
      ? { Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json" }
      : { "Content-Type": "application/json" }
  }

  async function sendMissed() {
    setBackfilling(true)
    setBackfillMsg(null)
    try {
      const res = await fetch("/api/admin/email-test", {
        method: "POST",
        headers: await authHeaders(),
        body: JSON.stringify({ action: "backfill" }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body.error || `Request failed (${res.status})`)
      setBackfillMsg(
        body.found === 0
          ? "Every open task from the last 14 days has already been emailed."
          : `Sent ${body.sent} of ${body.found} missed assignment email${body.found === 1 ? "" : "s"}${
              body.failed ? ` (${body.failed} failed, will retry tomorrow morning)` : ""
            }.`,
      )
      setResult((r) => (r ? { ...r, unsentAssignments: body.failed || 0 } : r))
    } catch (err) {
      setBackfillMsg(errorMessage(err) || "Couldn't send the missed emails.")
    } finally {
      setBackfilling(false)
    }
  }

  async function runTest() {
    setBusy(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch("/api/admin/email-test", {
        method: "POST",
        headers: await authHeaders(),
        body: JSON.stringify({ action: "test" }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body.error || `Request failed (${res.status})`)
      setResult(body)
    } catch (err) {
      setError(errorMessage(err) || "Couldn't run the test.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm mb-8">
      <h3 className="text-lg font-bold font-bricolage mb-1.5 text-[#1a1a1a]">Email Delivery</h3>
      <p className="text-xs text-gray-500 mb-4">
        Sends a test email to you, checks the settings task, reminder and approval emails depend on, and
        can send any assignment emails that were missed.
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={runTest}
          disabled={busy}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4CAF7D] hover:bg-[#2d8659] text-white font-semibold rounded-lg text-sm transition-colors disabled:opacity-70"
        >
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
          Send test email
        </button>
        <button
          onClick={sendMissed}
          disabled={backfilling}
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg text-sm transition-colors disabled:opacity-70"
        >
          {backfilling ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Send missed task emails
        </button>
      </div>
      {backfillMsg && <p className="text-sm text-gray-700 mt-3">{backfillMsg}</p>}

      {error && <p className="text-sm text-red-600 mt-3">{error}</p>}

      {result && (
        <div className="mt-4 space-y-3 text-sm">
          <p className={`flex items-center gap-2 font-semibold ${result.sent ? "text-green-700" : "text-red-600"}`}>
            {result.sent ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            {result.sent ? "Test email accepted. Check your inbox (and spam)." : "The test email was not sent."}
          </p>
          {!!result.unsentAssignments && (
            <p className="text-amber-700">
              {result.unsentAssignments} open task{result.unsentAssignments === 1 ? "" : "s"} from the last 14 days never got
              an assignment email. Click &ldquo;Send missed task emails&rdquo; to send them now.
            </p>
          )}
          {result.problems.length > 0 && (
            <ul className="list-disc pl-5 space-y-1 text-red-700">
              {result.problems.map((p) => (
                <li key={p} className="break-words">
                  {p}
                </li>
              ))}
            </ul>
          )}
          <ul className="text-xs text-gray-500 space-y-0.5">
            {Object.entries(result.settings).map(([k, v]) => (
              <li key={k} className="break-all">
                <span className="font-mono">{k}</span>: {v === true ? "set" : v === false || v === null ? "not set" : v}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
