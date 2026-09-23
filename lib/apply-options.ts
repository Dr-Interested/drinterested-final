// Departments and preset roles offered on the public /members/apply form. Shared with the
// server-side /api/members/apply route so it can reject anything the form wouldn't offer.
export const APPLY_DEPARTMENTS = [
  "Admin Team",
  "Medical Student Advisory Council",
  "Marketing",
  "Publications",
  "HR",
  "Events",
  "Technology",
  "Finance",
  "Podcast",
  "Ambassadors",
]

export const APPLY_ROLES_BY_DEPARTMENT: Record<string, string[]> = {
  "Admin Team": ["Deputy Executive Director", "Executive Assistant"],
  "Medical Student Advisory Council": [
    "Chair of the Medical Student Advisory Council",
    "Member of the Medical Student Advisory Council",
  ],
  Marketing: ["Director", "Deputy Director", "Coordinator"],
  Publications: ["Director", "Deputy Director", "Coordinator"],
  HR: ["Director", "Deputy Director", "Coordinator"],
  Events: ["Director", "Deputy Director", "Coordinator"],
  Technology: ["Director", "Deputy Director", "Coordinator"],
  Finance: ["Director", "Deputy Director", "Coordinator"],
  Podcast: ["Deputy Director", "Member of Podcast"],
  Ambassadors: ["Deputy Director", "Organizational Ambassador"],
}
