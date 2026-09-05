"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase-client"
import { Loader2, ShieldCheck, AlertTriangle } from "lucide-react"

type Strike = {
  id: string
  reason: string
  source: string
  created_at: string
  voided: boolean
}

/**
 * "Your Standing" — the member-facing view of their own strikes, shown at the top of the
 * Settings tab for everyone. Strikes are added by HR (missed meetings, auto on finalize) or
 * a director/deputy (missed tasks, etc.). RLS lets a member read only their own rows.
 */
export default function YourStandingCard() {
  const [strikes, setStrikes] = useState<Strike[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user?.email) return
        const { data: me } = await supabase
          .from("members")
          .select("id")
          .eq("email", user.email.toLowerCase())
          .maybeSingle()
        if (!me?.id) return
        const { data } = await supabase
          .from("strikes")
          .select("id, reason, source, created_at, voided")
          .eq("member_id", me.id)
          .order("created_at", { ascending: false })
        setStrikes((data || []) as Strike[])
      } catch (err) {
        console.error("Error loading standing:", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center gap-3 text-gray-400 max-w-2xl">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading your standing…
      </div>
    )
  }

  const active = (strikes || []).filter((s) => !s.voided)
  const count = active.length

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm max-w-2xl">
      <div className="flex items-center gap-3 mb-3">
        {count === 0 ? (
          <ShieldCheck className="w-5 h-5 text-[#4CAF7D]" />
        ) : (
          <AlertTriangle className={`w-5 h-5 ${count >= 2 ? "text-red-600" : "text-amber-500"}`} />
        )}
        <h3 className="font-bold text-lg">Your Standing</h3>
        <span
          className={`ml-auto text-sm font-bold px-2.5 py-0.5 rounded-full ${
            count === 0
              ? "bg-green-100 text-green-800"
              : count >= 2
                ? "bg-red-100 text-red-800"
                : "bg-amber-100 text-amber-800"
          }`}
        >
          {count} {count === 1 ? "strike" : "strikes"}
        </span>
      </div>

      {count === 0 ? (
        <p className="text-sm text-gray-600">
          You have no strikes. Keep it up — thanks for showing up and staying on top of your tasks.
        </p>
      ) : (
        <>
          <ul className="space-y-2 mb-3">
            {active.map((s) => (
              <li key={s.id} className="text-sm text-gray-700 border-l-2 border-amber-400 pl-3">
                <span className="font-medium">{s.reason}</span>
                <span className="text-gray-400">
                  {" "}· {new Date(s.created_at).toLocaleDateString()}
                  {s.source === "meeting" ? " · missed meeting" : ""}
                </span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-gray-500">
            Reminder: at <span className="font-semibold">3 strikes</span> your position may be
            reviewed. If you think a strike is a mistake, reach out to HR.
          </p>
        </>
      )}

      {strikes && strikes.some((s) => s.voided) && (
        <p className="text-[11px] text-gray-400 mt-3">
          {strikes.filter((s) => s.voided).length} previously-issued strike(s) were voided and don&apos;t count.
        </p>
      )}
    </div>
  )
}
