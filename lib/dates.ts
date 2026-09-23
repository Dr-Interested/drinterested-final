// Helpers for date-only values stored as "YYYY-MM-DD" (task due dates, meeting dates).
// All of these run on Eastern Time (America/Toronto), the organization's timezone: a task
// due "2026-09-24" is due until 11:59 PM ET that day, whoever is looking at it and wherever
// the server runs. (new Date("2026-09-24") is UTC midnight, which is why due dates used to
// render a day early and turn "overdue" the evening before.)

export const ORG_TIME_ZONE = "America/Toronto"

function parts(value: string): [number, number, number] | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value)
  return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null
}

/** "Sep 24, 2026" for a "YYYY-MM-DD" date. The calendar date is shown as is, never shifted. */
export function formatDateOnly(
  value: string,
  opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" },
): string {
  const p = parts(value)
  const date = p ? new Date(Date.UTC(p[0], p[1] - 1, p[2], 12)) : new Date(value)
  return date.toLocaleDateString("en-US", { ...opts, timeZone: "UTC" })
}

/** Today's date as "YYYY-MM-DD" in Eastern Time (optionally offset by whole days). */
export function todayET(offsetDays = 0): string {
  const d = new Date(Date.now() + offsetDays * 24 * 60 * 60 * 1000)
  // en-CA formats as YYYY-MM-DD.
  return d.toLocaleDateString("en-CA", { timeZone: ORG_TIME_ZONE })
}

/** True once the whole due day (through 11:59 PM ET) has passed. */
export function isPastDue(value: string): boolean {
  const p = parts(value)
  if (!p) return false
  return value.slice(0, 10) < todayET()
}
