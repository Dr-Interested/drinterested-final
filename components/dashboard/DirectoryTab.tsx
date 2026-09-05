"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabase-client"
import {
  LEADERSHIP_RANK,
  normalizeDepartmentName,
  subteamsFor,
  isDeputyRole,
  isDirectorRole,
} from "@/lib/teams"
import { Loader2, Plus, X } from "lucide-react"

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
  created_at: string
}

type Props = {
  accessLevel: string
  department: string
  team: string | null
  isHr: boolean
  canAssignSubteam: boolean
  myEmail: string
}

const DEPT_ORDER = ["Events", "Finance", "Human Resources", "Marketing", "Publications", "Technology"]

export default function DirectoryTab({ accessLevel, department, team, isHr, canAssignSubteam, myEmail }: Props) {
  const [members, setMembers] = useState<MemberRow[]>([])
  const [strikes, setStrikes] = useState<StrikeRow[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [{ data: mem }, { data: str }] = await Promise.all([
        supabase
          .from("members")
          .select("id, name, role, department, team, email, discord_username")
          .eq("approved", true)
          .eq("archived", false)
          .order("name", { ascending: true }),
        supabase
          .from("strikes")
          .select("id, member_id, reason, source, issued_by, voided, created_at")
          .eq("voided", false),
      ])
      setMembers((mem || []) as MemberRow[])
      setStrikes((str || []) as StrikeRow[])
    } catch (err) {
      console.error("Error loading directory:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const strikeCount = useCallback(
    (id: string) => strikes.filter((s) => s.member_id === id).length,
    [strikes],
  )

  // --- scope ---
  const myDept = normalizeDepartmentName(department)
  const scoped = useMemo(() => {
    if (accessLevel === "owner" || isHr) return members
    if (accessLevel === "director") return members.filter((m) => normalizeDepartmentName(m.department) === myDept)
    if (accessLevel === "deputy")
      return members.filter(
        (m) => normalizeDepartmentName(m.department) === myDept && (m.team || "") === (team || ""),
      )
    return members
  }, [members, accessLevel, isHr, myDept, team])

  const showAllDepartments = accessLevel === "owner" || isHr

  async function addStrike(m: MemberRow) {
    const reason = window.prompt(`Reason for the strike for ${m.name}:`)
    if (!reason || !reason.trim()) return
    setBusyId(m.id)
    try {
      const { error } = await supabase.from("strikes").insert({
        member_id: m.id,
        reason: reason.trim(),
        source: "manual",
        issued_by: myEmail,
      })
      if (error) throw error
      await load()
    } catch (err: any) {
      alert("Failed to add strike: " + err.message)
    } finally {
      setBusyId(null)
    }
  }

  async function voidStrike(s: StrikeRow) {
    const note = window.prompt("Reason for voiding this strike:")
    if (note === null) return
    try {
      const { error } = await supabase
        .from("strikes")
        .update({ voided: true, voided_by: myEmail, voided_reason: note || "(no note)", voided_at: new Date().toISOString() })
        .eq("id", s.id)
      if (error) throw error
      await load()
    } catch (err: any) {
      alert("Failed to void: " + err.message)
    }
  }

  async function assignTeam(m: MemberRow, newTeam: string) {
    setBusyId(m.id)
    try {
      const { error } = await supabase
        .from("members")
        .update({ team: newTeam || null })
        .eq("id", m.id)
      if (error) throw error
      setMembers((prev) => prev.map((x) => (x.id === m.id ? { ...x, team: newTeam || null } : x)))
    } catch (err: any) {
      alert("Failed to change sub-team: " + err.message)
    } finally {
      setBusyId(null)
    }
  }

  const MemberLine = ({ m, canEditTeam }: { m: MemberRow; canEditTeam: boolean }) => {
    const count = strikeCount(m.id)
    const mine = strikes.filter((s) => s.member_id === m.id)
    const deptSubteams = subteamsFor(m.department)
    return (
      <div className="py-2.5">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="font-medium text-gray-900 text-sm truncate">
              {m.name}
              <span className="text-gray-400 font-normal"> · {m.role}</span>
            </p>
            <p className="text-xs text-gray-400 truncate break-all">
              {m.email || "no email"}
              {m.discord_username ? ` · @${m.discord_username}` : ""}
            </p>
          </div>

          {count > 0 && (
            <button
              onClick={() => setExpanded(expanded === m.id ? null : m.id)}
              className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${
                count >= 2 ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"
              }`}
            >
              {count} {count === 1 ? "strike" : "strikes"}
            </button>
          )}

          {canEditTeam && deptSubteams.length > 0 && (
            <select
              value={m.team || ""}
              disabled={busyId === m.id}
              onChange={(e) => assignTeam(m, e.target.value)}
              className="shrink-0 text-xs p-1 border border-gray-300 rounded bg-white max-w-[9rem]"
            >
              <option value="">No sub-team</option>
              {Array.from(new Set([...deptSubteams, ...(m.team ? [m.team] : [])])).map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={() => addStrike(m)}
            disabled={busyId === m.id}
            className="shrink-0 inline-flex items-center gap-0.5 text-xs font-semibold text-[#c62828] border border-red-200 hover:bg-red-50 px-2 py-1 rounded transition-colors disabled:opacity-50"
          >
            <Plus className="w-3 h-3" /> Strike
          </button>
        </div>

        {expanded === m.id && count > 0 && (
          <ul className="mt-2 space-y-1.5 pl-2">
            {mine.map((s) => {
              const canVoid = accessLevel === "owner" || isHr || s.issued_by === myEmail
              return (
                <li key={s.id} className="flex items-start gap-2 text-xs">
                  <span className="flex-1 text-gray-600">
                    {s.reason}
                    <span className="text-gray-400">
                      {" "}· {new Date(s.created_at).toLocaleDateString()}
                      {s.source === "meeting" ? " · missed meeting" : ""}
                      {s.issued_by ? ` · ${s.issued_by}` : ""}
                    </span>
                  </span>
                  {canVoid && (
                    <button onClick={() => voidStrike(s)} className="text-red-600 hover:underline inline-flex items-center gap-0.5 shrink-0">
                      <X className="w-3 h-3" /> Void
                    </button>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    )
  }

  const DepartmentBlock = ({ deptName, list }: { deptName: string; list: MemberRow[] }) => {
    if (list.length === 0) return null
    const directors = list.filter((m) => isDirectorRole(m.role))
    const rest = list.filter((m) => !isDirectorRole(m.role))
    const orderedTeams = [...subteamsFor(deptName)]
    const usedTeams = Array.from(new Set(rest.map((m) => m.team).filter(Boolean))) as string[]
    for (const t of usedTeams) if (!orderedTeams.includes(t)) orderedTeams.push(t)
    const groups: { label: string; members: MemberRow[] }[] = []
    for (const t of orderedTeams) {
      const g = rest.filter((m) => (m.team || "") === t)
      if (g.length) groups.push({ label: t, members: g })
    }
    const noTeam = rest.filter((m) => !m.team)
    if (noTeam.length) groups.push({ label: "No sub-team", members: noTeam })

    return (
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">{deptName}</h3>
        </div>
        <div className="px-4">
          {directors.length > 0 && (
            <div className="border-b border-gray-100 py-1">
              <p className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold pt-1">Director</p>
              {directors.map((m) => (
                <MemberLine key={m.id} m={m} canEditTeam={canAssignSubteam} />
              ))}
            </div>
          )}
          {groups.map((g) => {
            const deputy = g.members.filter((m) => isDeputyRole(m.role))
            const coords = g.members.filter((m) => !isDeputyRole(m.role))
            return (
              <div key={g.label} className="border-b border-gray-100 last:border-0 py-1">
                <p className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold pt-1">
                  {g.label}
                  {deputy[0] ? ` · Deputy: ${deputy[0].name}` : ""}
                </p>
                {[...deputy, ...coords].map((m) => (
                  <MemberLine key={m.id} m={m} canEditTeam={canAssignSubteam} />
                ))}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-gray-400 py-16 justify-center">
        <Loader2 className="w-6 h-6 animate-spin" /> Loading directory…
      </div>
    )
  }

  // Admin-by-rank (owner / HR view only)
  const admins = showAllDepartments
    ? scoped
        .filter((m) => normalizeDepartmentName(m.department) === "Admin Team" || LEADERSHIP_RANK.includes(m.role))
        .sort((a, b) => {
          const ia = LEADERSHIP_RANK.indexOf(a.role)
          const ib = LEADERSHIP_RANK.indexOf(b.role)
          return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib) || a.name.localeCompare(b.name)
        })
    : []

  const deptNames = showAllDepartments
    ? (() => {
        const seen = new Set(DEPT_ORDER)
        const extras = scoped
          .map((m) => normalizeDepartmentName(m.department))
          .filter((d) => d && d !== "Admin Team" && !seen.has(d))
        return [...DEPT_ORDER, ...Array.from(new Set(extras))]
      })()
    : [myDept]

  return (
    <div className="space-y-4">
      <div className="flex items-baseline gap-2">
        <h2 className="text-xl font-bold">Member Directory</h2>
        <span className="text-sm text-gray-400">
          {showAllDepartments
            ? `${scoped.length} members`
            : accessLevel === "deputy"
              ? `${myDept} · ${team || "your sub-team"}`
              : myDept}
        </span>
      </div>

      {accessLevel === "deputy" ? (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-4">
          {scoped.length === 0 ? (
            <p className="text-gray-500 py-8 text-center text-sm">No one is in your sub-team yet.</p>
          ) : (
            scoped
              .sort((a, b) => Number(isDeputyRole(b.role)) - Number(isDeputyRole(a.role)) || a.name.localeCompare(b.name))
              .map((m) => <MemberLine key={m.id} m={m} canEditTeam={false} />)
          )}
        </div>
      ) : (
        <>
          {admins.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">Admin Team</h3>
              </div>
              <div className="px-4">
                {admins.map((m) => (
                  <MemberLine key={m.id} m={m} canEditTeam={false} />
                ))}
              </div>
            </div>
          )}
          {deptNames.map((d) => (
            <DepartmentBlock
              key={d}
              deptName={d}
              list={scoped.filter((m) => normalizeDepartmentName(m.department) === d)}
            />
          ))}
        </>
      )}
    </div>
  )
}
