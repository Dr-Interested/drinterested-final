import { OWNER_EMAILS } from "@/lib/owner"
import { isDeputyRole, isDirectorRole, LEADERSHIP_RANK, normalizeDepartmentName } from "@/lib/teams"

type Member = { email?: string | null; role?: string | null; department?: string | null; team?: string | null }

/**
 * Who gets CC'd on a "Task completed" email (the email itself goes To the completer):
 *   Director or above (Director / Chair / Admin Team leadership) -> the owner
 *   Deputy Director                                            -> their department's Director(s)
 *   anyone else (Coordinator etc.)                             -> their team's Deputy Director(s)
 *                                                                 + their department's Director(s)
 * The owner is only ever CC'd for Directors and above. If a coordinator's or deputy's
 * reviewers can't be found, nobody is CC'd rather than falling back to the owner.
 *
 * Department and team come from the completer's own member profile. The task's columns are
 * only a fallback: tasks assigned from the owner's view are saved with department "Admin",
 * which would otherwise hide the completer's real Director and Deputy.
 */
export function completionReviewers(
  completer: Member | null | undefined,
  task: { department?: string | null; team?: string | null },
  members: Member[],
  completerEmail: string,
): { dept: string; team: string | null; cc: string[] } {
  const role = (completer?.role || "").trim()
  const dept = normalizeDepartmentName(completer?.department || task.department || "")
  const team = completer?.team || task.team || null
  const emailOf = (m: Member) => String(m.email || "").toLowerCase()

  const directors = members.filter(
    (m) => dept && normalizeDepartmentName(m.department) === dept && isDirectorRole(m.role) && !isDeputyRole(m.role),
  )
  const deputies = team
    ? members.filter((m) => normalizeDepartmentName(m.department) === dept && (m.team || "") === team && isDeputyRole(m.role))
    : []

  let cc: string[]
  if (LEADERSHIP_RANK.includes(role) || (isDirectorRole(role) && !isDeputyRole(role))) {
    cc = [...OWNER_EMAILS]
  } else if (isDeputyRole(role)) {
    cc = directors.map(emailOf)
  } else {
    cc = [...deputies, ...directors].map(emailOf)
  }
  const me = completerEmail.toLowerCase()
  cc = Array.from(new Set(cc.filter((e) => e && e !== me)))
  return { dept, team, cc }
}
