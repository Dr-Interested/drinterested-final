"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, ChevronRight, FileText, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase-client"
import { errorMessage } from "@/lib/errors"
import { formatDateOnly, isPastDue } from "@/lib/dates"
import TaskFileUploadField from "@/components/dashboard/TaskFileUploadField"
import LinkifyText from "@/components/linkify-text"

export type Task = {
  id: string
  title: string
  description: string
  assigned_to: string
  assigned_by: string
  due_date: string
  status: string
  created_at: string
  submission_url?: string | null
  submission_note?: string | null
  submission_file_url?: string | null
  time_spent_minutes?: number | null
  completed_at?: string | null
}

/**
 * The signed-in member's own task list ("My Tasks") plus the "Mark as Complete" modal that
 * captures their submission and triggers the reviewer email (/api/tasks/on-complete).
 * deepLinkedTaskId comes from a task email's ?task=<id> link: that card is scrolled to and
 * highlighted once the list loads.
 */
export default function MyTasksTab({ userEmail, deepLinkedTaskId }: { userEmail: string; deepLinkedTaskId: string | null }) {
  const [myTasks, setMyTasks] = useState<Task[]>([])
  const [myTasksShowDone, setMyTasksShowDone] = useState(false)
  const [loadingTasks, setLoadingTasks] = useState(true)
  // Marking a task Completed opens this modal to capture the submitted work (link / notes / file).
  const [completingTask, setCompletingTask] = useState<Task | null>(null)
  const [completionForm, setCompletionForm] = useState({ submission_url: "", submission_note: "", submission_file_url: "" })
  const [uploadingCompletionFile, setUploadingCompletionFile] = useState(false)
  const [savingCompletion, setSavingCompletion] = useState(false)

  const fetchMemberTasks = async () => {
    if (!userEmail) return
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("assigned_to", userEmail)
        .eq("archived", false)
        .order("created_at", { ascending: false })

      if (error) throw error
      setMyTasks(data || [])
      if (deepLinkedTaskId) {
        const target = (data || []).find((t: Task) => t.id === deepLinkedTaskId)
        if (target && ["Completed", "Incomplete"].includes(target.status)) setMyTasksShowDone(true)
        // Deferred so the card has actually painted (and the "Completed" section, if just
        // expanded above, has re-rendered) before we scroll to it.
        setTimeout(() => {
          document.getElementById(`task-${deepLinkedTaskId}`)?.scrollIntoView({ behavior: "smooth", block: "center" })
        }, 100)
      }
    } catch (err) {
      console.error("Error fetching member tasks:", err)
    } finally {
      setLoadingTasks(false)
    }
  }

  const handleUpdateTaskStatus = async (taskId: string, currentStatus: string, task?: Task) => {
    // "Incomplete" is a terminal state an assigner set — members can't cycle out of it.
    if (currentStatus === "Incomplete") return
    const nextStatusMap: Record<string, string> = {
      "Pending": "In Progress",
      "In Progress": "Completed",
      "Completed": "Pending"
    }
    const nextStatus = nextStatusMap[currentStatus] || "Pending"

    // Marking something Completed captures the actual work (link / note / file) first, rather than
    // just flipping a status — see handleSubmitTaskCompletion, which does the status update.
    if (nextStatus === "Completed" && task) {
      setCompletingTask(task)
      setCompletionForm({ submission_url: "", submission_note: "", submission_file_url: "" })
      return
    }

    try {
      const { error } = await supabase
        .from("tasks")
        .update({ status: nextStatus, completed_at: nextStatus === "Pending" ? null : undefined })
        .eq("id", taskId)

      if (error) throw error
      fetchMemberTasks()
    } catch (err) {
      console.error(err)
      alert(`Failed to update task status: ${errorMessage(err)}`)
    }
  }

  const handleSubmitTaskCompletion = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!completingTask) return

    if (uploadingCompletionFile) {
      alert("Please wait for your file to finish uploading.")
      return
    }

    setSavingCompletion(true)
    try {
      const nowIso = new Date().toISOString()

      const { error: taskError } = await supabase
        .from("tasks")
        .update({
          status: "Completed",
          submission_url: completionForm.submission_url.trim() || null,
          submission_note: completionForm.submission_note.trim() || null,
          submission_file_url: completionForm.submission_file_url || null,
          completed_at: nowIso,
        })
        .eq("id", completingTask.id)
      if (taskError) throw taskError

      // Fire-and-forget: emails the reviewer(s) what was submitted, CC'ing the completer.
      // The route checks the caller's session, so pass the access token along.
      const completedId = completingTask.id
      supabase.auth
        .getSession()
        .then(({ data: { session } }) =>
          fetch("/api/tasks/on-complete", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
            },
            body: JSON.stringify({ taskId: completedId }),
          }),
        )
        .catch((err) => console.error("Completion email failed:", err))

      setCompletingTask(null)
      fetchMemberTasks()
    } catch (err) {
      console.error(err)
      alert(`Failed to submit completion: ${errorMessage(err)}`)
    } finally {
      setSavingCompletion(false)
    }
  }

  useEffect(() => {
    fetchMemberTasks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userEmail])

  const content = (() => {
        const FINISHED = ["Completed", "Incomplete"]
        const activeTasks = myTasks.filter((t) => !FINISHED.includes(t.status))
        const doneTasks = myTasks.filter((t) => FINISHED.includes(t.status))
        const renderCard = (task: Task) => {
          const isDone = FINISHED.includes(task.status)
          const isDeepLinked = task.id === deepLinkedTaskId
          return (
            <div
              key={task.id}
              id={`task-${task.id}`}
              className={`p-3 sm:p-4 border rounded-xl transition-colors flex items-start gap-3 ${
                isDeepLinked ? "border-[#4ecdc4] ring-2 ring-[#4ecdc4]/40" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <button
                  onClick={() => handleUpdateTaskStatus(task.id, task.status, task)}
                  disabled={task.status === "Incomplete"}
                  aria-label={task.status === "Completed" ? "Reopen task" : task.status === "In Progress" ? "Mark complete" : "Mark in progress"}
                  title={task.status === "Completed" ? "Reopen task" : task.status === "In Progress" ? "Mark complete" : "Mark in progress"}
                  className={`mt-1 flex-shrink-0 p-1 -m-1 transition-transform active:scale-95 ${task.status === "Completed" ? "text-green-500" : task.status === "Incomplete" ? "text-gray-300 cursor-default" : "text-gray-300 hover:text-gray-400"}`}
                >
                  <CheckCircle2 className="w-5 h-5" />
                </button>
                <div className="min-w-0 flex-1">
                  <h3 className={`font-semibold text-[0.95rem] break-words ${isDone ? "line-through text-gray-400" : "text-gray-800"}`}>
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className={`text-sm mt-1 break-words whitespace-pre-line ${isDone ? "text-gray-400" : "text-gray-600"}`}>
                      <LinkifyText text={task.description} />
                    </p>
                  )}
                  {task.status === "Incomplete" && (
                    <p className="text-xs text-gray-400 mt-1 italic">Closed by a director — no longer needs to be done.</p>
                  )}
                  {task.due_date && (
                    <span className={`inline-block text-[0.75rem] font-bold mt-2 px-2 py-0.5 rounded ${isPastDue(task.due_date) && !isDone ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-500"}`}>
                      {isPastDue(task.due_date) && !isDone ? "Overdue · " : ""}Due {formatDateOnly(task.due_date)}, 11:59 PM ET
                    </span>
                  )}
                  {task.status === "Pending" && (
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs bg-amber-50 border border-amber-100 text-amber-800 rounded-lg px-2.5 py-1.5">
                      <span>Ready to start? Mark this In Progress.</span>
                      <button
                        onClick={() => handleUpdateTaskStatus(task.id, task.status, task)}
                        className="font-semibold text-amber-900 underline hover:no-underline"
                      >
                        Mark In Progress
                      </button>
                    </div>
                  )}
                  {task.status === "In Progress" && (
                    <button
                      onClick={() => handleUpdateTaskStatus(task.id, task.status, task)}
                      className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-[#4CAF7D] hover:bg-[#2d8659] px-3 py-1.5 text-xs font-semibold text-white"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Submit &amp; Mark Complete
                    </button>
                  )}
                  {task.status === "Completed" && (task.submission_url || task.submission_file_url || task.submission_note || task.time_spent_minutes) && (
                    <div className="text-xs text-gray-500 mt-2 space-y-1">
                      {task.submission_note && <p className="whitespace-pre-wrap break-words">{task.submission_note}</p>}
                      <p className="flex flex-wrap gap-x-3 gap-y-1">
                        {task.time_spent_minutes ? <span>{Math.round(task.time_spent_minutes / 6) / 10} hrs logged</span> : null}
                        {task.submission_url && (
                          <a href={task.submission_url} target="_blank" rel="noopener noreferrer" className="text-[#4CAF7D] hover:underline">
                            View submitted work
                          </a>
                        )}
                        {task.submission_file_url && (
                          <a href={task.submission_file_url} target="_blank" rel="noopener noreferrer" className="text-[#4CAF7D] hover:underline">
                            View attached file
                          </a>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="shrink-0">
                <span className={`inline-block px-2.5 py-1 rounded-full text-[0.7rem] sm:text-[0.75rem] font-bold uppercase tracking-wider whitespace-nowrap ${
                  task.status === "Completed" ? "bg-green-100 text-green-800" : task.status === "Incomplete" ? "bg-gray-200 text-gray-600" : task.status === "In Progress" ? "bg-blue-100 text-blue-800" : "bg-amber-100 text-amber-800"
                }`}>
                  {task.status}
                </span>
              </div>
            </div>
          )
        }
        return (
        <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm">
          <h2 className="text-xl font-bold font-bricolage mb-4 sm:mb-6 text-[#1a1a1a] flex items-center gap-2">
            <FileText className="text-[#4CAF7D] w-5 h-5" /> My Tasks
          </h2>

          {loadingTasks ? (
            <div className="flex items-center justify-center gap-2 py-10 text-gray-400 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading your tasks…
            </div>
          ) : myTasks.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-sm">No tasks currently assigned to you! Check back later.</div>
          ) : (
            <div className="space-y-4">
              {activeTasks.length === 0 ? (
                <div className="text-center py-6 text-gray-400 text-sm">All caught up — nothing active right now.</div>
              ) : (
                activeTasks.map(renderCard)
              )}

              {doneTasks.length > 0 && (
                <div className="border-t border-gray-100 pt-3">
                  <button
                    onClick={() => setMyTasksShowDone((v) => !v)}
                    className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-700"
                  >
                    <ChevronRight className={`w-4 h-4 transition-transform ${myTasksShowDone ? "rotate-90" : ""}`} />
                    Completed ({doneTasks.length})
                  </button>
                  {myTasksShowDone && <div className="space-y-3 mt-3">{doneTasks.map(renderCard)}</div>}
                </div>
              )}
            </div>
          )}
        </div>
        )
      })()

  return (
    <>
      {content}

      {/* Task Completion Modal — captures the actual work (link / note / file). */}
      {completingTask && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-5 sm:p-8 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
            <h2 className="text-xl font-bold font-bricolage mb-1 text-[#1a1a1a]">Mark as Complete</h2>
            <p className="text-sm text-gray-500 mb-6">{completingTask.title}</p>
            <form onSubmit={handleSubmitTaskCompletion} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Link to your work <span className="text-gray-400 font-normal">(optional — e.g. a Canva link)</span>
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={completionForm.submission_url}
                  onChange={(e) => setCompletionForm({ ...completionForm, submission_url: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF7D]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Notes <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Anything your director should know about this work"
                  value={completionForm.submission_note}
                  onChange={(e) => setCompletionForm({ ...completionForm, submission_note: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF7D]"
                />
              </div>
              <TaskFileUploadField
                pathPrefix={completingTask.id}
                value={completionForm.submission_file_url}
                onChange={(url) => setCompletionForm((f) => ({ ...f, submission_file_url: url }))}
                onUploadingChange={setUploadingCompletionFile}
              />
              <p className="text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-lg p-2.5">
                Don&apos;t forget to also reply to this task on Discord and log your hours on VolunTime.
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCompletingTask(null)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-lg transition-colors"
                  disabled={savingCompletion}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingCompletion || uploadingCompletionFile}
                  className="flex-1 py-2.5 bg-[#4CAF7D] hover:bg-[#2d8659] text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {savingCompletion && <Loader2 className="w-4 h-4 animate-spin" />}
                  Submit & Complete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
