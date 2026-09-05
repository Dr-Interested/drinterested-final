// Fixed team lists per department (the org hierarchy is Department > Team > Sub-team; this
// is the "Team" level — `members.team`). Taken from the 2026-27 roster sheet. Single source
// of truth for the Team <select> in the portal's "Edit Member" modal and Directory tab.
// Teams are internal only — never rendered on the public /members page. Keys match both
// spellings of the HR department name that exist in the data ("HR" and "Human Resources").
// (The only true "Sub-teams" are Ambassadors and Podcast — see MembersClient / DirectoryTab.)

export const DEPARTMENT_SUBTEAMS: Record<string, string[]> = {
  Events: ["Logistics Team", "Planning Team", "Outreach Team", "Support Team"],
  Finance: [
    "Donations & Sponsorships Team",
    "Grants & Reporting Team",
    "Budgeting & Planning Team",
  ],
  "Human Resources": [
    "Ambassadors Team",
    "Volunteer Management Team",
    "Culture & Recognition Team",
    "Onboarding Team",
  ],
  HR: [
    "Ambassadors Team",
    "Volunteer Management Team",
    "Culture & Recognition Team",
    "Onboarding Team",
  ],
  Publications: [
    "Research & Production Team",
    "Review & Editing Team",
    "Podcast Production Team",
  ],
  Technology: [
    "Systems & Automation (Blogs + AI) Team",
    "Website Management Team",
  ],
  Marketing: [],
}

export function subteamsFor(department: string | null | undefined): string[] {
  if (!department) return []
  return DEPARTMENT_SUBTEAMS[department.trim()] || []
}

// Preset roles the "Edit Member" modal offers, so members can't be given a free-text
// role again (the old apply form appended " - <team>" which is what polluted the data).
export const PRESET_ROLES = [
  "Coordinator",
  "Deputy Director",
  "Director",
  "Executive Assistant",
  "Deputy Executive Director",
  "Executive Director",
  "Chair of the Medical Student Advisory Council",
  "Member of the Medical Student Advisory Council",
]

// Leadership ranking for the Directory's "Admin by rank" grouping (highest first).
export const LEADERSHIP_RANK = [
  "Executive Director",
  "Deputy Executive Director",
  "Executive Assistant",
]

export const DIRECTORY_DEPARTMENTS = [
  "Events",
  "Finance",
  "Human Resources",
  "Marketing",
  "Publications",
  "Technology",
]

export function normalizeDepartmentName(dept: string | null | undefined): string {
  if (!dept) return ""
  const d = dept.trim()
  if (d === "HR") return "Human Resources"
  return d
}

/** A member is a Deputy Director if their (normalized) role begins with "Deputy Director". */
export function isDeputyRole(role: string | null | undefined): boolean {
  return /^deputy director/i.test((role || "").trim())
}

/** A member is a Director (not deputy) if their role is exactly "Director"-ish. */
export function isDirectorRole(role: string | null | undefined): boolean {
  const r = (role || "").trim()
  return /^director\b/i.test(r) || /^(chair|head) /i.test(r)
}
