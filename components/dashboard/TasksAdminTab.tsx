"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabase-client"
import { normalizeDepartmentName, subteamsFor } from "@/lib/teams"
import { Loader2, CheckCircle2, Trash, ChevronRight, Users } from "lucide-react"

type TaskRow = {
  id: string
  title: string
  description: string | null
  assigned_to: string
  assigned_by: string | null
  due_date: string | null
  status: string
  department: string | null
  team: string | null
  assignment_batch: string | null
  created_at: string
}

type MemberRow = {
  id: string
  name: string
  role: string
  department: string | null
  team: string | null
  email: string | null
}

type Props = {
  accessLevel: string // "owner" | "director" | "deputy"
  isTrueOwner: boolean
  department: string
  team: string | null
  myEmail: string
  myUserId: string
}

const FOR_DEPARTMENTS = ["Admin", "Events", "Finance", "Human Resources", "Marketing", "Publications", "Technology"]
const ROLE_ORDER = [
  "Executive Director",
  "Deputy Executive Director",
  "Executive Assistant",
  "Director",
  "Deputy Director",
  "Coordinator",
  "Ambassador",
]
const STATUS_NEXT: Record<string, string> = { Pending: "In Progress", "In Progress": "Completed", Completed: "Pending" }

export default function TasksAdminTab({ accessLevel, isTrueOwner, department, team, myEmail, myUserId }: Props) {
  const myDept = normalizeDepartmentName(department)
  const isAdminLevel = accessLevel === "owner" // true owner + Admin Team leadership
  const isDirector = accessLevel === "director"
  const isDeputy = accessLevel === "deputy"

  const [tasks, setTasks] = useState<TaskRow[]>([])
  const [members, setMembers] = useState<MemberRow[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [open, setOpen] = useState<Record<string, boolean>>({})

  const [form, setForm] = useState({
    title: "",
    description: "",
    due_date: "",
    forDept: isAdminLevel ? "Admin" : myDept,
    target: "individual" as "individual" | "everyone" | "every_director" | "every_deputy" | "department" | "team",
    team: isDeputy ? team || "" : "",
    assigned_to: "",
  })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [{ data: t }, { data: m }] = await Promise.all([
        supabase.from("tasks").select("*").order("created_at", { ascending: false }),
        supabase
          .from("members")
          .select("id, name, role, department, team, email")
          .eq("approved", true)
          .eq("archived", false)
          .order("name", { ascending: true }),
      ])
      setTasks((t || []) as TaskRow[])
      setMembers((m || []) as MemberRow[])
    } catch (err) {
      console.error("Error loading tasks:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const memberByEmail = useMemo(() => {
    const map = new Map<string, MemberRow>()
    for (const m of members) if (m.email) map.set(m.email.toLowerCase(), m)
    return map
  }, [members])

  // Resolve each task's dept/team (task columns first, then the assignee's member record).
  const resolved = useMemo(
    () =>
      tasks.map((t) => {
        const m = memberByEmail.get((t.assigned_to || "").toLowerCase())
        const dept = normalizeDepartmentName(t.department || m?.department || "") || "Unassigned"
        const tm = t.team || m?.team || null
        return { ...t, _dept: dept, _team: tm, _name: m?.name || t.assigned_to }
      }),
    [tasks, memberByEmail],
  )

  const scoped = useMemo(() => {
    if (isAdminLevel) return resolved
    if (isDirector) return resolved.filter((t) => t._dept === myDept)
    if (isDeputy) return resolved.filter((t) => t._dept === myDept && (t._team || "") === (team || ""))
    return resolved
  }, [resolved, isAdminLevel, isDirector, isDeputy, myDept, team])

  // Group identical tasks (title + description + due date).
  type Group = { key: string; title: string; description: string | null; due_date: string | null; rows: typeof scoped }
  const groupsByDeptTeam = useMemo(() => {
    const out = new Map<string, Map<string, Group[]>>() // dept -> team -> groups
    const byKey = new Map<string, Group>()
    for (const t of scoped) {
      const gkey = `${t._dept}|||${t._team || ""}|||${t.title}|||${t.description || ""}|||${t.due_date || ""}`
      let g = byKey.get(gkey)
      if (!g) {
        g = { key: gkey, title: t.title, description: t.description, due_date: t.due_date, rows: [] }
        byKey.set(gkey, g)
        const deptMap = out.get(t._dept) || new Map<string, Group[]>()
        const arr = deptMap.get(t._team || "") || []
        arr.push(g)
        deptMap.set(t._team || "", arr)
        out.set(t._dept, deptMap)
      }
      g.rows.push(t)
    }
    return out
  }, [scoped])

  const memberOptions = useMemo(() => {
    // grouped by role, like the directory
    const groups: { role: string; members: MemberRow[] }[] = []
    for (const role of ROLE_ORDER) {
      const list = members.filter((m) => (m.role || "").trim() === role || (m.role || "").trim().startsWith(role))
      if (list.length) groups.push({ role, members: list })
    }
    const covered = new Set(groups.flatMap((g) => g.members.map((m) => m.id)))
    const rest = members.filter((m) => !covered.has(m.id))
    if (rest.length) groups.push({ role: "Other", members: rest })
    return groups
  }, [members])

  async function toggleStatus(id: string, status: string) {
    const next = STATUS_NEXT[status] || "Pending"
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: next } : t)))
    const { error } = await supabase.from("tasks").update({ status: next }).eq("id", id)
    if (error) {
      alert("Failed to update status: " + error.message)
      load()
    }
  }

  async function deleteRows(ids: string[], label: string) {
    if (!window.confirm(`Delete ${ids.length === 1 ? "this task" : `${ids.length} task(s) for "${label}"`}?`)) return
    const { error } = await supabase.from("tasks").delete().in("id", ids)
    if (error) return alert("Failed to delete: " + error.message)
    load()
  }

  function resolveRecipients(): string[] {
    const norm = (d: string | null) => normalizeDepartmentName(d || "")
    const forDept = isAdminLevel ? form.forDept : myDept
    const emailsOf = (list: MemberRow[]) => list.map((m) => (m.email || "").toLowerCase()).filter(Boolean)
    switch (form.target) {
      case "individual":
        return form.assigned_to ? [form.assigned_to.toLowerCase()] : []
      case "everyone":
        return emailsOf(members)
      case "every_director":
        return emailsOf(members.filter((m) => (m.role || "").trim() === "Director"))
      case "every_deputy":
        return emailsOf(members.filter((m) => (m.role || "").trim().startsWith("Deputy Director")))
      case "department":
        return emailsOf(
          members.filter((m) => (forDept === "Admin" ? norm(m.department) === "Admin Team" : norm(m.department) === forDept)),
        )
      case "team": {
        const tm = isDeputy ? team : form.team
        return emailsOf(members.filter((m) => norm(m.department) === forDept && (m.team || "") === (tm || "")))
      }
      default:
        return []
    }
  }

  async function submit() {
    if (!form.title.trim()) return alert("Give the task a title.")
    const recipients = Array.from(new Set(resolveRecipients()))
    if (recipients.length === 0) return alert("No one matches that assignment target.")
    if (
      recipients.length > 1 &&
      !window.confirm(`Assign "${form.title.trim()}" to ${recipients.length} people?`)
    )
      return
    setSaving(true)
    try {
      const batch = recipients.length > 1 ? crypto.randomUUID() : null
      const forDept = isAdminLevel ? form.forDept : myDept
      const forTeam = form.target === "team" ? (isDeputy ? team : form.team) || null : isDeputy ? team : null
      const rows = recipients.map((email) => ({
        title: form.title.trim(),
        description: form.description.trim() || "",
        assigned_to: email,
        assigned_by: myUserId || myEmail,
        due_date: form.due_date || null,
        status: "Pending",
        department: forDept === "Admin" ? "Admin" : forDept,
        team: forTeam,
        assignment_batch: batch,
      }))
      const { error } = await supabase.from("tasks").insert(rows)
      if (error) throw error
      setCreating(false)
      setForm((f) => ({ ...f, title: "", description: "", due_date: "", assigned_to: "" }))
      load()
    } catch (err: any) {
      alert("Failed to assign task: " + err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-gray-400 py-16 justify-center">
        <Loader2 className="w-6 h-6 animate-spin" /> Loading tasks…
      </div>
    )
  }

  // Which departments to show as top-level sections.
  const deptSections = isAdminLevel
    ? ["Admin", "Events", "Finance", "Human Resources", "Marketing", "Publications", "Technology", "Unassigned"].filter(
        (d) => groupsByDeptTeam.has(d),
      )
    : [myDept]

  const GroupCard = ({ g }: { g: Group }) => {
    const done = g.rows.filter((r) => r.status === "Completed").length
    const gk = "g:" + g.key
    return (
      <div className="border border-gray-200 rounded-xl">
        <button
          onClick={() => setOpen((o) => ({ ...o, [gk]: !o[gk] }))}
          className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50"
        >
          <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${open[gk] ? "rotate-90" : ""}`} />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-gray-800 text-sm truncate">{g.title}</p>
            {g.description && <p className="text-xs text-gray-500 truncate">{g.description}</p>}
          </div>
          {g.due_date && (
            <span className="text-[11px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-medium shrink-0">
              Due {new Date(g.due_date).toLocaleDateString()}
            </span>
          )}
          <span className="text-xs text-gray-400 shrink-0 flex items-center gap-1">
            <Users className="w-3 h-3" />
            {done}/{g.rows.length}
          </span>
        </button>

        {open[gk] && (
          <div className="border-t border-gray-100 divide-y divide-gray-50">
            <div className="flex justify-end px-3 py-1.5">
              <button
                onClick={() => deleteRows(g.rows.map((r) => r.id), g.title)}
                className="text-xs text-red-500 hover:text-red-700 inline-flex items-center gap-1"
              >
                <Trash className="w-3 h-3" /> Delete for everyone ({g.rows.length})
              </button>
            </div>
            {g.rows
              .slice()
              .sort((a, b) => a._name.localeCompare(b._name))
              .map((r) => (
                <div key={r.id} className="flex items-center gap-3 px-3 py-2">
                  <button
                    onClick={() => toggleStatus(r.id, r.status)}
                    className={r.status === "Completed" ? "text-green-500" : "text-gray-300 hover:text-gray-400"}
                    title={r.status}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-gray-700 flex-1 truncate">{r._name}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      r.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : r.status === "In Progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {r.status}
                  </span>
                  <button onClick={() => deleteRows([r.id], r._name)} className="text-red-400 hover:text-red-600">
                    <Trash className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center pb-4 mb-4 border-b border-gray-100">
        <h2 className="text-xl font-bold font-bricolage text-[#1a1a1a]">Assign Tasks</h2>
        <button
          onClick={() => setCreating((v) => !v)}
          className="px-4 py-2 bg-[#4CAF7D] hover:bg-[#2d8659] text-white font-semibold rounded-lg text-sm"
        >
          {creating ? "Cancel" : "+ Assign New Task"}
        </button>
      </div>

      {creating && (
        <div className="border border-gray-200 rounded-xl p-4 mb-6 space-y-3 bg-gray-50/50">
          <input
            type="text"
            placeholder="Task title *"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full p-2.5 border border-gray-300 rounded"
          />
          <textarea
            placeholder="Description / instructions"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
            className="w-full p-2.5 border border-gray-300 rounded"
          />
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">For</label>
              <select
                value={isAdminLevel ? form.forDept : myDept}
                disabled={!isAdminLevel}
                onChange={(e) => setForm({ ...form, forDept: e.target.value, team: "" })}
                className="w-full p-2.5 border border-gray-300 rounded bg-white disabled:bg-gray-100 disabled:text-gray-500"
              >
                {(isAdminLevel ? FOR_DEPARTMENTS : [myDept]).map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Due date</label>
              <input
                type="date"
                value={form.due_date}
                onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Assign to</label>
            <select
              value={form.target}
              onChange={(e) => setForm({ ...form, target: e.target.value as typeof form.target })}
              className="w-full p-2.5 border border-gray-300 rounded bg-white"
            >
              <option value="individual">A specific person</option>
              {isTrueOwner && <option value="everyone">Everyone in the organization</option>}
              {isTrueOwner && <option value="every_director">Every director</option>}
              {isTrueOwner && <option value="every_deputy">Every deputy director</option>}
              {(isAdminLevel || isDirector) && (
                <option value="department">Everyone in {isAdminLevel ? form.forDept : myDept}</option>
              )}
              {(isAdminLevel || isDirector) && <option value="team">Everyone in a specific team</option>}
              {isDeputy && <option value="team">Everyone in my team ({team || "—"})</option>}
            </select>
          </div>

          {form.target === "individual" && (
            <select
              value={form.assigned_to}
              onChange={(e) => setForm({ ...form, assigned_to: e.target.value })}
              className="w-full p-2.5 border border-gray-300 rounded bg-white"
            >
              <option value="">Select a person…</option>
              {memberOptions.map((grp) => (
                <optgroup key={grp.role} label={grp.role}>
                  {grp.members.map((m) => (
                    <option key={m.id} value={m.email || ""}>
                      {m.name}
                      {m.department ? ` — ${normalizeDepartmentName(m.department)}` : ""}
                      {m.team ? ` / ${m.team}` : ""}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          )}

          {form.target === "team" && !isDeputy && (
            <select
              value={form.team}
              onChange={(e) => setForm({ ...form, team: e.target.value })}
              className="w-full p-2.5 border border-gray-300 rounded bg-white"
            >
              <option value="">Select a team…</option>
              {subteamsFor(isAdminLevel ? form.forDept : myDept).map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          )}

          <button
            onClick={submit}
            disabled={saving}
            className="px-5 py-2 bg-[#405862] hover:bg-[#334852] text-white font-semibold rounded text-sm disabled:opacity-60"
          >
            {saving ? "Assigning…" : "Assign"}
          </button>
        </div>
      )}

      {scoped.length === 0 ? (
        <p className="text-center py-10 text-gray-400 text-sm">No tasks yet.</p>
      ) : (
        <div className="space-y-3">
          {deptSections.map((dept) => {
            const teamMap = groupsByDeptTeam.get(dept)
            if (!teamMap) return null
            const dk = "d:" + dept
            const totalGroups = Array.from(teamMap.values()).reduce((n, a) => n + a.length, 0)
            const orderedTeams = [
              ...subteamsFor(dept).filter((t) => teamMap.has(t)),
              ...Array.from(teamMap.keys()).filter((t) => t && !subteamsFor(dept).includes(t)),
              ...(teamMap.has("") ? [""] : []),
            ]
            return (
              <div key={dept} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpen((o) => ({ ...o, [dk]: !o[dk] }))}
                  className="w-full flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 text-left"
                >
                  <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${open[dk] ? "rotate-90" : ""}`} />
                  <span className="font-bold text-gray-900">{dept}</span>
                  <span className="text-xs text-gray-400">{totalGroups} task{totalGroups === 1 ? "" : "s"}</span>
                </button>
                {open[dk] && (
                  <div className="p-3 space-y-3">
                    {orderedTeams.map((tm) => {
                      const groups = teamMap.get(tm) || []
                      if (!groups.length) return null
                      if (tm === "") {
                        return groups.map((g) => <GroupCard key={g.key} g={g} />)
                      }
                      const tk = "t:" + dept + ":" + tm
                      return (
                        <div key={tm} className="border border-gray-100 rounded-lg">
                          <button
                            onClick={() => setOpen((o) => ({ ...o, [tk]: !o[tk] }))}
                            className="w-full flex items-center gap-2 p-2.5 text-left hover:bg-gray-50"
                          >
                            <ChevronRight
                              className={`w-3.5 h-3.5 text-gray-400 transition-transform ${open[tk] ? "rotate-90" : ""}`}
                            />
                            <span className="text-sm font-semibold text-gray-700">{tm}</span>
                            <span className="text-[11px] text-gray-400">{groups.length}</span>
                          </button>
                          {open[tk] && (
                            <div className="p-2.5 pt-0 space-y-2">
                              {groups.map((g) => (
                                <GroupCard key={g.key} g={g} />
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
