// Helpers for date-only values stored as "YYYY-MM-DD" (task due dates, meeting dates).
// new Date("2026-09-24") is parsed as UTC midnight, which in any timezone west of UTC (all of
// North America) is the previous evening, so due dates rendered a day early and tasks turned
// "overdue" the evening before they were due. These read the value as a local calendar date.

/** Local-midnight Date for a "YYYY-MM-DD" string (falls back to Date parsing for anything else). */
export function parseDateOnly(value: string): Date {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value)
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : new Date(value)
}

export function formatDateOnly(
  value: string,
  opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" },
): string {
  return parseDateOnly(value).toLocaleDateString("en-US", opts)
}

/** True once the whole due day has passed in the viewer's timezone. */
export function isPastDue(value: string): boolean {
  const end = parseDateOnly(value)
  end.setDate(end.getDate() + 1)
  return end.getTime() <= Date.now()
}

/** Today's date as "YYYY-MM-DD" in the viewer's timezone (for <input type="date"> defaults). */
export function todayLocalISO(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}
