"use client"

import { useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabase-client"
import { normalizeDepartmentName } from "@/lib/teams"
import { Loader2, X } from "lucide-react"

type MemberRow = {
  id: string
  name: string
  role: string
  department: string | null
  team: string | null
  email: string | null
  discord_username: string | null
}

type StrikeRow = {
  id: string
  member_id: string
  reason: string
  source: string
  issued_by: string | null
  voided: boolean
  voided_by: string | null
  voided_reason: string | null
  created_at: string
}

/**
 * HR + owner view: every member ranked by active strike count so HR can reach out to the
 * people sitting on 2 (before they hit 3 and a position review). Voiding a strike here is
 * allowed for HR / owner (see scripts/attendance-strikes.sql RLS).
 */
export default function StrikesTab({ myEmail }: { myEmail: string }) {
  const [members, setMembers] = useState<MemberRow[]>([])
  const [strikes, setStrikes] = useState<StrikeRow[]>([])
  const [loading, setLoading] = useState(true)
  const [minStrikes, setMinStrikes] = useState(1)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const [{ data: mem }, { data: str }] = await Promise.all([
        supabase
          .from("members")
          .select("id, name, role, department, team, email, discord_username")
          .eq("approved", true)
          .eq("archived", false),
        supabase
          .from("strikes")
          .select("id, member_id, reason, source, issued_by, voided, voided_by, voided_reason, created_at")
          .order("created_at", { ascending: false }),
      ])
      setMembers((mem || []) as MemberRow[])
      setStrikes((str || []) as StrikeRow[])
    } catch (err) {
      console.error("Error loading strikes:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const byMember = useMemo(() => {
    const map = new Map<string, StrikeRow[]>()
    for (const s of strikes) {
      if (!map.has(s.member_id)) map.set(s.member_id, [])
      map.get(s.member_id)!.push(s)
    }
    return map
  }, [strikes])

  const rows = useMemo(() => {
    return members
      .map((m) => {
        const all = byMember.get(m.id) || []
        const active = all.filter((s) => !s.voided)
        return { member: m, active, all, count: active.length }
      })
      .filter((r) => r.count >= minStrikes)
      .sort((a, b) => b.count - a.count || a.member.name.localeCompare(b.member.name))
  }, [members, byMember, minStrikes])

  async function voidStrike(s: StrikeRow) {
    const note = window.prompt("Reason for voiding this strike (visible to HR):")
    if (note === null) return
    setBusy(true)
    try {
      const { error } = await supabase
        .from("strikes")
        .update({
          voided: true,
          voided_by: myEmail,
          voided_reason: note || "(no note)",
          voided_at: new Date().toISOString(),
        })
        .eq("id", s.id)
      if (error) throw error
      await load()
    } catch (err: any) {
      alert("Failed to void strike: " + err.message)
    } finally {
      setBusy(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-gray-400 py-16 justify-center">
        <Loader2 className="w-6 h-6 animate-spin" /> Loading strikes…
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-xl font-bold mr-2">Strikes</h2>
        {[
          { v: 0, label: "All" },
          { v: 1, label: "≥ 1" },
          { v: 2, label: "≥ 2" },
          { v: 3, label: "≥ 3" },
        ].map((chip) => (
          <button
            key={chip.v}
            onClick={() => setMinStrikes(chip.v)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              minStrikes === chip.v
                ? "bg-[#4CAF7D] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {rows.length === 0 ? (
        <p className="text-gray-500 py-10 text-center">No members match this filter.</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm divide-y divide-gray-100">
          {rows.map(({ member, active, count }) => {
            const dept = normalizeDepartmentName(member.department)
            return (
              <div key={member.id} className="p-4">
                <div className="flex items-start gap-3">
                  <span
                    className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
                      count >= 3
                        ? "bg-red-600 text-white"
                        : count === 2
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {count}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900">{member.name}</p>
                    <p className="text-xs text-gray-500">
                      {member.role}
                      {dept ? ` · ${dept}` : ""}
                      {member.team ? ` · ${member.team}` : ""}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Most recent: {active[0]?.reason || "—"}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 break-all">
                      {member.email || "no email"}
                      {member.discord_username ? ` · @${member.discord_username}` : ""}
                    </p>
                  </div>
                  <button
                    onClick={() => setExpanded(expanded === member.id ? null : member.id)}
                    className="text-xs text-[#4CAF7D] font-semibold hover:underline shrink-0"
                  >
                    {expanded === member.id ? "Hide" : "Details"}
                  </button>
                </div>

                {expanded === member.id && (
                  <ul className="mt-3 space-y-2 pl-12">
                    {active.map((s) => (
                      <li key={s.id} className="flex items-start gap-2 text-sm">
                        <div className="flex-1">
                          <span className="text-gray-800">{s.reason}</span>
                          <span className="text-gray-400">
                            {" "}· {new Date(s.created_at).toLocaleDateString()}
                            {s.issued_by ? ` · by ${s.issued_by}` : ""}
                            {s.source === "meeting" ? " · auto (missed meeting)" : ""}
                          </span>
                        </div>
                        <button
                          onClick={() => voidStrike(s)}
                          disabled={busy}
                          className="text-xs text-red-600 hover:underline flex items-center gap-0.5 shrink-0 disabled:opacity-50"
                        >
                          <X className="w-3 h-3" /> Void
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
