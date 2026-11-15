/**
 * Turns the free-text dates people type into the events table ("June 7th, 2026",
 * "October 25 - 26, 2026", "October to November 2026", "Summer 2025", "2025-11-22") into a
 * timestamp for sorting and for deciding whether an event is past. Returns null when there is
 * no year to go on ("Details coming soon").
 */
const SEASONS: Record<string, string> = { winter: "January", spring: "April", summer: "July", fall: "October", autumn: "October" }

export function parseEventDate(raw: unknown): number | null {
  if (typeof raw !== "string" || !raw.trim()) return null
  let s = raw.trim()
  const isRange = /[-–—]|\bto\b|\bthrough\b|&/i.test(s.replace(/^\d{4}-\d{2}-\d{2}/, ""))
  const hasSeason = new RegExp(`\\b(${Object.keys(SEASONS).join("|")})\\b`, "i").test(s)
  const direct = Date.parse(s)
  if (!isRange && !hasSeason && !Number.isNaN(direct) && /\d{4}/.test(s)) return direct

  const year = s.match(/\b(19|20)\d{2}\b/)?.[0]
  if (!year) return null
  s = s.replace(/(\d+)(st|nd|rd|th)\b/gi, "$1") // 7th -> 7
  // Keep the first part of a range: "October 25 - 26, 2026", "Oct 25 to Nov 2, 2026".
  const first = s.split(/\s*(?:[-–—]|\bto\b|\bthrough\b|&)\s*/i)[0]
  const season = Object.keys(SEASONS).find((k) => new RegExp(`\\b${k}\\b`, "i").test(first))
  const candidates = [
    season ? `${SEASONS[season]} 1, ${year}` : "",
    first.includes(year) ? first : `${first} ${year}`,
    `January 1, ${year}`,
  ]
  for (const c of candidates) {
    const t = Date.parse(c.replace(/,?\s+(\d{4})$/, ", $1"))
    if (c && !Number.isNaN(t)) return t
  }
  return null
}

/** True for "October to November 2026", "May 2025 to Dec 2026", "Oct 25 - 26": not one day. */
export function isDateRange(raw: unknown): boolean {
  return typeof raw === "string" && /[-–—]|\bto\b|\bthrough\b|&/i.test(raw.replace(/^\d{4}-\d{2}-\d{2}/, ""))
}
