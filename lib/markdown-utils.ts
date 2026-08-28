/**
 * Normalizes admin-authored markdown so a plain line break typed in the admin's <textarea>
 * always renders as a visible line break.
 *
 * Without this, ReactMarkdown follows standard CommonMark rules: a single newline inside a
 * paragraph is collapsed into a space, and only a *blank* line starts a new paragraph. Authors
 * typing in a plain textarea (no live preview, no markdown guidance) reasonably expect "what I
 * typed is what appears" instead — which is the dominant cause of blog posts reading as one
 * run-on wall of text. This converts every authored line break into a markdown hard break
 * (trailing two spaces) so line breaks are preserved exactly as typed, without touching
 * paragraph grouping, list/heading syntax, or the literal contents of fenced code blocks.
 */
export function normalizeMarkdown(raw: string | null | undefined): string {
  if (!raw) return ""

  const lines = raw.replace(/\r\n/g, "\n").split("\n")
  let inFence = false
  const out: string[] = []

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].replace(/[ \t]+$/, "")
    const isFenceMarker = /^\s{0,3}(```|~~~)/.test(line)
    if (isFenceMarker) inFence = !inFence

    const nextLine = lines[i + 1]
    const nextIsBlankOrEnd = nextLine === undefined || nextLine.trim() === ""

    if (!inFence && !isFenceMarker && line.trim() !== "" && !nextIsBlankOrEnd) {
      line = `${line}  ` // markdown hard break: force a <br> at this line's end
    }

    out.push(line)
  }

  return out.join("\n")
}
