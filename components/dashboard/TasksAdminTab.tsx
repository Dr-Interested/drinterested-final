"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabase-client"
import { normalizeDepartmentName, subteamsFor } from "@/lib/teams"
import { Loader2, CheckCircle2, Trash, ChevronRight, Users, XCircle, Pencil, Inbox, Link2, Paperclip, StickyNote } from "lucide-react"

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
  archived: boolean
  archived_at: string | null
  completed_at: string | null
  created_at: string
  submission_url: string | null
  submission_note: string | null
  submission_file_url: string | null
  received_at: string | null
  received_by: string | null
  permanently_archived: boolean
  permanently_archived_at: string | null
}

// A task is "finished" once it's Completed or Incomplete. A group is finished (moves to the
// Completed section) only when every row in it is finished.
const FINISHED = ["Completed", "Incomplete"]
const isFinished = (s: string) => FINISHED.includes(s)

// Labeled button for a completed row's submitted link / file / notes.
const PILL_BASE = "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold"
const SUBMISSION_PILL = `${PILL_BASE} border-[#4CAF7D]/40 bg-[#4CAF7D]/10 text-[#2d8659] hover:bg-[#4CAF7D]/20`
const SUBMISSION_PILL_ACTIVE = `${PILL_BASE} border-[#4CAF7D] bg-[#4CAF7D] text-white hover:bg-[#2d8659]`

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
const STATUS_NEXT: Record<string, string> = {
  Pending: "In Progress",
  "In Progress": "Completed",
  Completed: "Pending",
  Incomplete: "Pending",
}

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
  const [editingGroup, setEditingGroup] = useState<Group | null>(null)
  const [editForm, setEditForm] = useState({ title: "", description: "", due_date: "" })
  const [savingEdit, setSavingEdit] = useState(false)

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
      let taskQuery = supabase.from("tasks").select("*").order("created_at", { ascending: false })
      // Directors/deputies see their scope's Archive; only the owner sees the Permanent Archive.
      if (!isTrueOwner) taskQuery = taskQuery.eq("permanently_archived", false)
      const [{ data: t }, { data: m }] = await Promise.all([
        taskQuery,
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
  }, [isTrueOwner])

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

  const inScope = useCallback(
    (t: (typeof resolved)[number]) => {
      if (isAdminLevel) return true
      if (isDirector) return t._dept === myDept
      if (isDeputy) return t._dept === myDept && (t._team || "") === (team || "")
      return true
    },
    [isAdminLevel, isDirector, isDeputy, myDept, team],
  )

  // Main view = non-archived, in-scope. Archive = archived (Received / Incomplete) but not yet
  // promoted, in-scope. Permanent Archive (owner only, every scope) = 30+ days after Received.
  const scoped = useMemo(() => resolved.filter((t) => !t.archived && inScope(t)), [resolved, inScope])
  const archivedTasks = useMemo(
    () =>
      resolved
        .filter((t) => t.archived && !t.permanently_archived && inScope(t))
        .sort((a, b) => (b.archived_at || "").localeCompare(a.archived_at || "")),
    [resolved, inScope],
  )
  const permanentTasks = useMemo(
    () =>
      isTrueOwner
        ? resolved
            .filter((t) => t.permanently_archived)
            .sort((a, b) => (b.permanently_archived_at || "").localeCompare(a.permanently_archived_at || ""))
        : [],
    [resolved, isTrueOwner],
  )

  // assigned_by is set to `myUserId || myEmail` at creation, so match either.
  const isMine = useCallback(
    (t: TaskRow) => {
      const by = (t.assigned_by || "").toLowerCase()
      return !!by && (by === (myUserId || "").toLowerCase() || by === (myEmail || "").toLowerCase())
    },
    [myUserId, myEmail],
  )

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

  async function setStatus(id: string, next: string, extra: Record<string, any> = {}) {
    const patch: Record<string, any> = { status: next, ...extra }
    // completed_at records when a task was finished — set it on any finished state, clear it
    // when a task is reopened.
    patch.completed_at = isFinished(next) ? new Date().toISOString() : null
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)))
    const { error } = await supabase.from("tasks").update(patch).eq("id", id)
    if (error) {
      alert("Failed to update status: " + error.message)
      load()
    }
  }
  const toggleStatus = (id: string, status: string) => setStatus(id, STATUS_NEXT[status] || "Pending")
  const markIncomplete = (id: string) => {
    if (window.confirm("Mark this Incomplete? It's archived right away as \"not done / no longer needed\".")) {
      // Nothing to review, so it skips the "Received" step and goes straight to the Archive.
      // received_at is still stamped because it anchors the 30-day / 90-day cron clock.
      const now = new Date().toISOString()
      setStatus(id, "Incomplete", {
        archived: true,
        archived_at: now,
        received_at: now,
        received_by: myUserId || myEmail,
      })
    }
  }

  // Assigner-only: acknowledges the submitted work. Archives the Completed rows now and starts
  // the clock (see app/api/cron/task-reminders) that promotes them to the Permanent Archive
  // 30 days after received_at and deletes them 90 days after.
  async function markReceived(ids: string[]) {
    if (!ids.length) return
    const now = new Date().toISOString()
    const { error } = await supabase
      .from("tasks")
      .update({ received_at: now, received_by: myUserId || myEmail, archived: true, archived_at: now })
      .in("id", ids)
    if (error) return alert("Failed to mark received: " + error.message)
    load()
  }

  async function restore(id: string) {
    const { error } = await supabase
      .from("tasks")
      .update({ archived: false, archived_at: null, received_at: null, received_by: null })
      .eq("id", id)
    if (error) return alert("Failed to restore: " + error.message)
    load()
  }

  function openEditGroup(g: Group) {
    setEditingGroup(g)
    setEditForm({ title: g.title, description: g.description || "", due_date: g.due_date || "" })
  }

  // Edits (title/description/due_date) apply to every row in the group — that's how identical
  // tasks were grouped in the first place, so this is also the fix for "no way to change the
  // due date without deleting and recreating the task."
  async function saveEditGroup() {
    if (!editingGroup) return
    if (!editForm.title.trim()) return alert("Give the task a title.")
    setSavingEdit(true)
    try {
      const patch: Record<string, any> = {
        title: editForm.title.trim(),
        description: editForm.description.trim() || "",
        due_date: editForm.due_date || null,
      }
      // If the due date moved, clear the "reminder already sent" stamps — otherwise the
      // daily cron sees them already set (from the old date) and silently skips the
      // day-before/due-today reminder for the new date.
      if (patch.due_date !== editingGroup.due_date) {
        patch.reminder_day_before_sent_at = null
        patch.reminder_due_sent_at = null
      }
      const { error } = await supabase
        .from("tasks")
        .update(patch)
        .in("id", editingGroup.rows.map((r) => r.id))
      if (error) throw error
      setEditingGroup(null)
      load()
    } catch (err: any) {
      alert("Failed to save changes: " + err.message)
    } finally {
      setSavingEdit(false)
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
    const done = g.rows.filter((r) => isFinished(r.status)).length
    const gk = "g:" + g.key
    // "Mark Received" is shown only to the assigner, and only once everyone is finished.
    const receivable = isGroupFinished(g) ? g.rows.filter((r) => r.status === "Completed" && isMine(r)) : []
    return (
      <div className="border border-gray-200 rounded-xl">
        <div
          role="button"
          tabIndex={0}
          onClick={() => setOpen((o) => ({ ...o, [gk]: !o[gk] }))}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              setOpen((o) => ({ ...o, [gk]: !o[gk] }))
            }
          }}
          className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 cursor-pointer"
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
          <button
            onClick={(e) => {
              e.stopPropagation()
              openEditGroup(g)
            }}
            className="shrink-0 inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-gray-600 hover:border-gray-300 hover:text-gray-800"
            title="Edit title, description or due date"
          >
            <Pencil className="w-3 h-3" /> Edit
          </button>
          <span className="text-xs text-gray-400 shrink-0 flex items-center gap-1">
            <Users className="w-3 h-3" />
            {done}/{g.rows.length}
          </span>
        </div>

        {receivable.length > 0 && (
          <div className="mx-3 mb-3 flex flex-wrap items-center gap-2 rounded-lg border border-[#4ecdc4]/40 bg-[#4ecdc4]/10 px-3 py-2 text-xs text-[#405862]">
            <span className="flex-1 min-w-[12rem]">All done! Mark Received to start the archive clock.</span>
            <button
              onClick={() => markReceived(receivable.map((r) => r.id))}
              className="inline-flex items-center gap-1 rounded-md bg-[#405862] px-3 py-1.5 font-semibold text-white hover:bg-[#334852]"
            >
              <Inbox className="w-3.5 h-3.5" /> Mark Received
            </button>
          </div>
        )}

        {open[gk] && (
          <div className="border-t border-gray-100 divide-y divide-gray-50">
            <div className="flex justify-end gap-3 px-3 py-1.5">
              <button
                onClick={() => openEditGroup(g)}
                className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-0.5 text-xs font-semibold text-gray-600 hover:border-gray-300 hover:text-gray-800"
              >
                <Pencil className="w-3 h-3" /> Edit
              </button>
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
                <div key={r.id}>
                  <div className="flex items-center gap-3 px-3 py-2">
                    <button
                      onClick={() => toggleStatus(r.id, r.status)}
                      className={r.status === "Completed" ? "text-green-500" : "text-gray-300 hover:text-gray-400"}
                      title={r.status === "Completed" || r.status === "Incomplete" ? "Reopen" : "Mark complete"}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-gray-700 flex-1 truncate">{r._name}</span>
                    {r.status === "Completed" && (
                      <span className="flex flex-wrap items-center justify-end gap-1.5 shrink-0">
                        {r.submission_url && (
                          <a href={r.submission_url} target="_blank" rel="noopener noreferrer" className={SUBMISSION_PILL}>
                            <Link2 className="w-3.5 h-3.5" /> Link
                          </a>
                        )}
                        {r.submission_file_url && (
                          <a href={r.submission_file_url} target="_blank" rel="noopener noreferrer" className={SUBMISSION_PILL}>
                            <Paperclip className="w-3.5 h-3.5" /> File
                          </a>
                        )}
                        {r.submission_note && (
                          <button
                            onClick={() => setOpen((o) => ({ ...o, ["n:" + r.id]: !o["n:" + r.id] }))}
                            className={open["n:" + r.id] ? SUBMISSION_PILL_ACTIVE : SUBMISSION_PILL}
                          >
                            <StickyNote className="w-3.5 h-3.5" /> {open["n:" + r.id] ? "Hide notes" : "Notes"}
                          </button>
                        )}
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        r.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : r.status === "Incomplete"
                            ? "bg-gray-200 text-gray-600"
                            : r.status === "In Progress"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {r.status}
                    </span>
                    {!isFinished(r.status) && (
                      <button
                        onClick={() => markIncomplete(r.id)}
                        className="text-gray-400 hover:text-gray-700"
                        title="Mark incomplete (won't be done)"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button onClick={() => deleteRows([r.id], r._name)} className="text-red-400 hover:text-red-600" title="Delete">
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {r.submission_note && open["n:" + r.id] && (
                    <div className="mx-3 mb-2 ml-10 rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm text-gray-700 whitespace-pre-wrap break-words">
                      {r.submission_note}
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    )
  }

  const isGroupFinished = (g: Group) => g.rows.every((r) => isFinished(r.status))

  // Renders a team's groups: active ones first, then a collapsible "Completed" pile for
  // groups where everyone is finished (Completed or Incomplete).
  const GroupList = ({ groups, ckey }: { groups: Group[]; ckey: string }) => {
    const active = groups.filter((g) => !isGroupFinished(g))
    const done = groups.filter(isGroupFinished)
    const ck = "c:" + ckey
    return (
      <>
        {active.map((g) => (
          <GroupCard key={g.key} g={g} />
        ))}
        {active.length === 0 && done.length > 0 && (
          <p className="text-xs text-gray-400 px-1 py-1">No active tasks here.</p>
        )}
        {done.length > 0 && (
          <div className="border border-gray-100 rounded-lg bg-gray-50/60">
            <button
              onClick={() => setOpen((o) => ({ ...o, [ck]: !o[ck] }))}
              className="w-full flex items-center gap-2 p-2 text-left text-xs font-semibold text-gray-500 hover:text-gray-700"
            >
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${open[ck] ? "rotate-90" : ""}`} />
              Completed ({done.length})
            </button>
            {open[ck] && <div className="p-2 pt-0 space-y-2">{done.map((g) => <GroupCard key={g.key} g={g} />)}</div>}
          </div>
        )}
      </>
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
        archivedTasks.length === 0 && permanentTasks.length === 0 ? <p className="text-center py-10 text-gray-400 text-sm">No tasks yet.</p> : null
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
                        return <GroupList key="noteam" groups={groups} ckey={dept + "|noteam"} />
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
                              <GroupList groups={groups} ckey={dept + ":" + tm} />
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

      {/* Archive — everyone sees their own scope. Tasks land here when the assigner marks them
          Received (or marks them Incomplete); 30 days after that they move to the Permanent Archive. */}
      {archivedTasks.length > 0 && (
        <div className="mt-4 border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setOpen((o) => ({ ...o, archive: !o.archive }))}
            className="w-full flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 text-left"
          >
            <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${open.archive ? "rotate-90" : ""}`} />
            <span className="font-bold text-gray-900">Archive</span>
            <span className="text-xs text-gray-400">
              {archivedTasks.length} task{archivedTasks.length === 1 ? "" : "s"}
            </span>
          </button>
          {open.archive && (
            <div className="divide-y divide-gray-100">
              {archivedTasks.map((r) => (
                <div key={r.id} className="flex items-center gap-3 px-3 py-2 text-sm">
                  <span className="flex-1 min-w-0 truncate text-gray-600">
                    {r.title} <span className="text-gray-400">· {r._name}</span>
                    {r._dept !== "Unassigned" && (
                      <span className="text-gray-400">
                        {" "}· {r._dept}
                        {r._team ? ` / ${r._team}` : ""}
                      </span>
                    )}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase shrink-0 ${
                      r.status === "Completed" ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {r.status}
                  </span>
                  <span className="text-[11px] text-gray-400 shrink-0">
                    {r.archived_at ? new Date(r.archived_at).toLocaleDateString() : ""}
                  </span>
                  <button onClick={() => restore(r.id)} className="text-xs text-[#4CAF7D] hover:underline shrink-0">
                    Restore
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Permanent Archive — owner only, read-only. Rows are deleted 90 days after Received. */}
      {isTrueOwner && permanentTasks.length > 0 && (
        <div className="mt-4 border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setOpen((o) => ({ ...o, permArchive: !o.permArchive }))}
            className="w-full flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 text-left"
          >
            <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${open.permArchive ? "rotate-90" : ""}`} />
            <span className="font-bold text-gray-900">Permanent Archive</span>
            <span className="text-xs text-gray-400">
              {permanentTasks.length} task{permanentTasks.length === 1 ? "" : "s"}
            </span>
          </button>
          {open.permArchive && (
            <div className="divide-y divide-gray-100">
              {permanentTasks.map((r) => (
                <div key={r.id} className="flex items-center gap-3 px-3 py-2 text-sm">
                  <span className="flex-1 min-w-0 truncate text-gray-600">
                    {r.title} <span className="text-gray-400">· {r._name}</span>
                    {r._dept !== "Unassigned" && (
                      <span className="text-gray-400">
                        {" "}· {r._dept}
                        {r._team ? ` / ${r._team}` : ""}
                      </span>
                    )}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase shrink-0 ${
                      r.status === "Completed" ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {r.status}
                  </span>
                  <span className="text-[11px] text-gray-400 shrink-0" title="Received">
                    {r.received_at ? new Date(r.received_at).toLocaleDateString() : ""}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {editingGroup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setEditingGroup(null)}>
          <div
            className="bg-white rounded-xl p-5 w-full max-w-md space-y-3 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-gray-800">Edit task{editingGroup.rows.length > 1 ? ` (${editingGroup.rows.length} people)` : ""}</h3>
            <input
              type="text"
              placeholder="Task title *"
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              className="w-full p-2.5 border border-gray-300 rounded"
            />
            <textarea
              placeholder="Description / instructions"
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              rows={2}
              className="w-full p-2.5 border border-gray-300 rounded"
            />
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Due date</label>
              <input
                type="date"
                value={editForm.due_date}
                onChange={(e) => setEditForm({ ...editForm, due_date: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setEditingGroup(null)}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={saveEditGroup}
                disabled={savingEdit}
                className="px-4 py-2 bg-[#4CAF7D] hover:bg-[#2d8659] text-white font-semibold rounded text-sm disabled:opacity-60"
              >
                {savingEdit ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
