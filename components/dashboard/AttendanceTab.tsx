"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabase-client"
import { normalizeDepartmentName, subteamsFor } from "@/lib/teams"
import { Loader2, ChevronLeft, Lock, Unlock } from "lucide-react"

type MemberRow = {
  id: string
  name: string
  role: string
  department: string | null
  team: string | null
}

type Meeting = {
  id: string
  title: string
  meeting_date: string
  scope: "org" | "department" | "team"
  department: string | null
  team: string | null
  finalized: boolean
  finalized_at: string | null
  finalized_by: string | null
}

type AttendanceRow = { member_id: string; status: "present" | "excused" }

type Props = {
  accessLevel: string
  department: string
  team: string | null
  isHr: boolean
  isOwner: boolean
  myEmail: string
}

const DEPT_ORDER = ["Events", "Finance", "Human Resources", "Marketing", "Publications", "Technology"]

export default function AttendanceTab({ accessLevel, department, team, isHr, isOwner, myEmail }: Props) {
  const myDept = normalizeDepartmentName(department)
  const isDirector = accessLevel === "director"
  const isDeputy = accessLevel === "deputy"
  // "Full group" — owner + all HR: every department/team + org-wide meetings.
  const fullGroup = isOwner || isHr
  // HR leadership can also run org-wide meetings; HR coordinators only fill.
  const canOrgWide = isOwner || (isHr && (isDirector || isDeputy))
  // Anyone who can create/finalize meetings at all (scope enforced per-meeting below).
  const canManage = isOwner || isDirector || isDeputy || (isHr && (isDirector || isDeputy))

  const allowedScopes: ("org" | "department" | "team")[] = canOrgWide
    ? ["org", "department", "team"]
    : canManage
      ? ["department", "team"]
      : []

  // Once a meeting exists, any director / deputy / leadership / HR member can mark people
  // present or excused on it — regardless of the meeting's department.
  const canMarkAttendance = isOwner || isDirector || isDeputy || isHr

  /** Can this user START (create) and CLOSE (finalize) a given meeting? Scoped: owner + HR
   *  leadership for anything; a department's own director/deputy for their own dept meetings. */
  const canManageMeeting = (mt: Meeting) => {
    if (isOwner || (isHr && (isDirector || isDeputy))) return true
    if (!(isDirector || isDeputy)) return false
    if (mt.scope === "org") return false
    if (normalizeDepartmentName(mt.department) !== myDept) return false
    if (isDeputy && mt.scope === "team") return (mt.team || "") === (team || "")
    return true
  }

  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [members, setMembers] = useState<MemberRow[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Meeting | null>(null)
  const [attendance, setAttendance] = useState<AttendanceRow[]>([])
  const [busy, setBusy] = useState(false)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({
    title: "",
    date: new Date().toISOString().slice(0, 10),
    scope: (allowedScopes[0] || "team") as string,
    department: fullGroup ? "Events" : myDept,
    team: !fullGroup && isDeputy ? team || "" : "",
  })

  const loadLists = useCallback(async () => {
    setLoading(true)
    try {
      const [{ data: mtg }, { data: mem }] = await Promise.all([
        supabase.from("meetings").select("*").order("meeting_date", { ascending: false }),
        supabase
          .from("members")
          .select("id, name, role, department, team")
          .eq("approved", true)
          .eq("archived", false)
          .order("name", { ascending: true }),
      ])
      setMeetings((mtg || []) as Meeting[])
      setMembers((mem || []) as MemberRow[])
    } catch (err) {
      console.error("Error loading attendance:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadLists()
  }, [loadLists])

  const openMeeting = useCallback(async (m: Meeting) => {
    setSelected(m)
    setAttendance([])
    const { data } = await supabase
      .from("meeting_attendance")
      .select("member_id, status")
      .eq("meeting_id", m.id)
    setAttendance((data || []) as AttendanceRow[])
  }, [])

  const roster = useMemo(() => {
    if (!selected) return []
    if (selected.scope === "org") return members
    const dept = normalizeDepartmentName(selected.department)
    if (selected.scope === "department")
      return members.filter((m) => normalizeDepartmentName(m.department) === dept)
    return members.filter(
      (m) => normalizeDepartmentName(m.department) === dept && (m.team || "") === (selected.team || ""),
    )
  }, [selected, members])

  const statusOf = (memberId: string) => attendance.find((a) => a.member_id === memberId)?.status || null

  async function setStatus(memberId: string, status: "present" | "excused") {
    if (!selected || selected.finalized) return
    const current = statusOf(memberId)
    setBusy(true)
    try {
      if (current === status) {
        await supabase.from("meeting_attendance").delete().eq("meeting_id", selected.id).eq("member_id", memberId)
        setAttendance((prev) => prev.filter((a) => a.member_id !== memberId))
      } else {
        await supabase
          .from("meeting_attendance")
          .upsert(
            { meeting_id: selected.id, member_id: memberId, status, marked_by: myEmail, updated_at: new Date().toISOString() },
            { onConflict: "meeting_id,member_id" },
          )
        setAttendance((prev) => [...prev.filter((a) => a.member_id !== memberId), { member_id: memberId, status }])
      }
    } catch (err: any) {
      alert("Failed to save: " + err.message)
    } finally {
      setBusy(false)
    }
  }

  async function createMeeting() {
    if (!form.title.trim()) return
    if (!allowedScopes.includes(form.scope as any)) return
    // Non-full-group leaders are locked to their own department (and deputies to their team).
    const dept = form.scope === "org" ? null : fullGroup ? form.department : myDept
    let teamVal: string | null = null
    if (form.scope === "team") {
      teamVal = !fullGroup && isDeputy ? team || null : form.team || null
      if (!teamVal) {
        setBusy(false)
        alert("Pick a team for this meeting.")
        return
      }
    }
    setBusy(true)
    try {
      const payload = {
        title: form.title.trim(),
        meeting_date: form.date,
        scope: form.scope,
        department: dept,
        team: teamVal,
        created_by: myEmail,
      }
      const { data, error } = await supabase.from("meetings").insert(payload).select().single()
      if (error) throw error
      setCreating(false)
      setForm({ ...form, title: "" })
      await loadLists()
      if (data) openMeeting(data as Meeting)
    } catch (err: any) {
      alert("Failed to create meeting: " + err.message)
    } finally {
      setBusy(false)
    }
  }

  async function finalize() {
    if (!selected) return
    const missing = roster.filter((m) => !statusOf(m.id))
    if (
      !window.confirm(
        `Finalize "${selected.title}"?\n\n${missing.length} member(s) marked neither present nor excused will each get a strike. You can un-finalize later to reverse it.`,
      )
    )
      return
    setBusy(true)
    try {
      if (missing.length > 0) {
        const rows = missing.map((m) => ({
          member_id: m.id,
          reason: `Missed meeting: ${selected.title} (${selected.meeting_date})`,
          source: "meeting",
          meeting_id: selected.id,
          issued_by: myEmail,
        }))
        const { error: sErr } = await supabase.from("strikes").insert(rows)
        if (sErr) throw sErr
      }
      const { error } = await supabase
        .from("meetings")
        .update({ finalized: true, finalized_at: new Date().toISOString(), finalized_by: myEmail })
        .eq("id", selected.id)
      if (error) throw error
      setSelected({ ...selected, finalized: true })
      await loadLists()
    } catch (err: any) {
      alert("Failed to finalize: " + err.message)
    } finally {
      setBusy(false)
    }
  }

  async function unfinalize() {
    if (!selected) return
    if (!window.confirm(`Un-finalize "${selected.title}"? Auto-strikes from this meeting will be voided and the roster re-opened.`)) return
    setBusy(true)
    try {
      const { error: sErr } = await supabase
        .from("strikes")
        .update({ voided: true, voided_by: myEmail, voided_reason: "Meeting un-finalized", voided_at: new Date().toISOString() })
        .eq("meeting_id", selected.id)
        .eq("source", "meeting")
        .eq("voided", false)
      if (sErr) throw sErr
      const { error } = await supabase
        .from("meetings")
        .update({ finalized: false, finalized_at: null, finalized_by: null })
        .eq("id", selected.id)
      if (error) throw error
      setSelected({ ...selected, finalized: false })
      await loadLists()
    } catch (err: any) {
      alert("Failed to un-finalize: " + err.message)
    } finally {
      setBusy(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-gray-400 py-16 justify-center">
        <Loader2 className="w-6 h-6 animate-spin" /> Loading meetings…
      </div>
    )
  }

  // ---- meeting detail ----
  if (selected) {
    const present = roster.filter((m) => statusOf(m.id) === "present").length
    const excused = roster.filter((m) => statusOf(m.id) === "excused").length
    const missed = roster.length - present - excused
    return (
      <div className="space-y-4">
        <button onClick={() => setSelected(null)} className="inline-flex items-center gap-1 text-sm text-[#4CAF7D] font-semibold hover:underline">
          <ChevronLeft className="w-4 h-4" /> All meetings
        </button>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">{selected.title}</h2>
              <p className="text-sm text-gray-500">
                {selected.meeting_date} ·{" "}
                {selected.scope === "org"
                  ? "Whole org"
                  : selected.scope === "department"
                    ? selected.department
                    : `${selected.department} · ${selected.team}`}
              </p>
            </div>
            {selected.finalized ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                <Lock className="w-3 h-3" /> Finalized
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-semibold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full">
                <Unlock className="w-3 h-3" /> Open
              </span>
            )}
          </div>

          <p className="text-xs text-gray-500 mt-2">
            {present} present · {excused} excused · <span className="text-red-600 font-medium">{missed} missed</span>
            {selected.finalized ? " — missed members were struck." : ""}
          </p>

          {canManageMeeting(selected) && (
            <div className="mt-3">
              {selected.finalized ? (
                <button onClick={unfinalize} disabled={busy} className="px-4 py-2 text-sm font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50">
                  Un-finalize
                </button>
              ) : (
                <button onClick={finalize} disabled={busy} className="px-4 py-2 text-sm font-semibold rounded-lg bg-[#4CAF7D] hover:bg-[#2d8659] text-white disabled:opacity-50">
                  Finalize & strike absentees
                </button>
              )}
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm divide-y divide-gray-100">
          {roster.map((m) => {
            const st = statusOf(m.id)
            return (
              <div key={m.id} className="flex items-center gap-3 p-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{m.name}</p>
                  <p className="text-xs text-gray-400 truncate">
                    {m.role}
                    {m.team ? ` · ${m.team}` : ""}
                  </p>
                </div>
                {!st && !selected.finalized && <span className="text-xs text-red-500 mr-1">missed</span>}
                {(["present", "excused"] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setStatus(m.id, opt)}
                    disabled={busy || selected.finalized || !canMarkAttendance}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize transition-colors disabled:opacity-60 ${
                      st === opt
                        ? opt === "present"
                          ? "bg-green-600 text-white"
                          : "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // ---- meeting list ----
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Meeting Attendance</h2>
        {canManage && allowedScopes.length > 0 && (
          <button
            onClick={() => setCreating((v) => !v)}
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-[#4CAF7D] hover:bg-[#2d8659] text-white"
          >
            {creating ? "Cancel" : "New meeting"}
          </button>
        )}
      </div>

      {creating && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 space-y-3">
          <input
            type="text"
            placeholder="Meeting title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="p-2 border border-gray-300 rounded"
            />
            <select
              value={form.scope}
              onChange={(e) => setForm({ ...form, scope: e.target.value })}
              className="p-2 border border-gray-300 rounded bg-white"
            >
              {allowedScopes.map((s) => (
                <option key={s} value={s}>
                  {s === "org" ? "Whole org" : s === "department" ? "One department" : "One team"}
                </option>
              ))}
            </select>
            {form.scope !== "org" && (
              <select
                value={fullGroup ? form.department : myDept}
                disabled={!fullGroup}
                onChange={(e) => setForm({ ...form, department: e.target.value, team: "" })}
                className="p-2 border border-gray-300 rounded bg-white disabled:bg-gray-50 disabled:text-gray-500"
              >
                {(fullGroup ? DEPT_ORDER : [myDept]).map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            )}
            {form.scope === "team" && (
              <select
                value={!fullGroup && isDeputy ? team || "" : form.team}
                disabled={!fullGroup && isDeputy}
                onChange={(e) => setForm({ ...form, team: e.target.value })}
                className="p-2 border border-gray-300 rounded bg-white disabled:bg-gray-50 disabled:text-gray-500"
              >
                <option value="">Select team</option>
                {subteamsFor(fullGroup ? form.department : myDept).map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            )}
          </div>
          <button onClick={createMeeting} disabled={busy || !form.title.trim()} className="px-4 py-2 text-sm font-semibold rounded-lg bg-[#405862] hover:bg-[#334852] text-white disabled:opacity-50">
            Create
          </button>
        </div>
      )}

      {(() => {
        // Everyone with the Attendance tab (owner / HR / any director / any deputy) sees every
        // meeting so they can help mark attendance; only canManageMeeting() can create/close.
        const visibleMeetings = meetings
        return visibleMeetings.length === 0 ? (
        <p className="text-gray-500 py-10 text-center">No meetings yet.</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm divide-y divide-gray-100">
          {visibleMeetings.map((m) => (
            <button key={m.id} onClick={() => openMeeting(m)} className="w-full text-left p-4 hover:bg-gray-50 flex items-center justify-between gap-3">
              <div>
                <p className="font-medium text-gray-900">{m.title}</p>
                <p className="text-xs text-gray-400">
                  {m.meeting_date} ·{" "}
                  {m.scope === "org" ? "Whole org" : m.scope === "department" ? m.department : `${m.department} · ${m.team}`}
                </p>
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${m.finalized ? "bg-gray-100 text-gray-500" : "bg-amber-100 text-amber-800"}`}>
                {m.finalized ? "Finalized" : "Open"}
              </span>
            </button>
          ))}
        </div>
      )
      })()}
    </div>
  )
}
