"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { supabase } from "@/lib/supabase-client"
import {
  Folder,
  File as FileIcon,
  FileText,
  FileSpreadsheet,
  Presentation,
  ClipboardList,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  Link2,
  ChevronRight,
  ChevronDown,
  Loader2,
  AlertCircle,
  ExternalLink,
  Plus,
  FolderPlus,
  Upload,
  Copy,
  Scissors,
  ClipboardPaste,
  X,
  List,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react"

type DriveItem = {
  id: string
  name: string
  mimeType: string
  isFolder: boolean
  webViewLink?: string
  hasThumbnail: boolean
}

type Crumb = { id: string | null; name: string }
type CreatableType = "document" | "spreadsheet" | "presentation" | "form"
type ClipboardEntry = { id: string; name: string; isFolder: boolean }
type ClipboardState = { mode: "copy" | "move"; items: ClipboardEntry[]; sourceFolderId: string | null } | null

// Distinct icon + color per type so a Form doesn't look like a Doc doesn't look like a Sheet —
// roughly matching each type's own Google branding color for quick recognition.
const MIME_STYLES: Record<string, { icon: LucideIcon; color: string }> = {
  "application/vnd.google-apps.document": { icon: FileText, color: "text-blue-500" },
  "application/vnd.google-apps.spreadsheet": { icon: FileSpreadsheet, color: "text-green-600" },
  "application/vnd.google-apps.presentation": { icon: Presentation, color: "text-amber-500" },
  "application/vnd.google-apps.form": { icon: ClipboardList, color: "text-purple-600" },
  "application/vnd.google-apps.drawing": { icon: FileImage, color: "text-red-400" },
  "application/vnd.google-apps.shortcut": { icon: Link2, color: "text-gray-400" },
  "application/pdf": { icon: FileText, color: "text-red-500" },
  "text/plain": { icon: FileText, color: "text-gray-400" },
}
const PREFIX_STYLES: [string, { icon: LucideIcon; color: string }][] = [
  ["image/", { icon: FileImage, color: "text-pink-500" }],
  ["video/", { icon: FileVideo, color: "text-indigo-500" }],
  ["audio/", { icon: FileAudio, color: "text-teal-500" }],
  ["application/zip", { icon: FileArchive, color: "text-gray-500" }],
]

const NEW_FILE_TYPES: { type: CreatableType; label: string; icon: LucideIcon; color: string }[] = [
  { type: "document", label: "Google Doc", icon: FileText, color: "text-blue-500" },
  { type: "spreadsheet", label: "Google Sheet", icon: FileSpreadsheet, color: "text-green-600" },
  { type: "presentation", label: "Google Slides", icon: Presentation, color: "text-amber-500" },
  { type: "form", label: "Google Form", icon: ClipboardList, color: "text-purple-600" },
]

function styleFor(item: DriveItem): { icon: LucideIcon; color: string } {
  if (item.isFolder) return { icon: Folder, color: "text-blue-500" }
  if (MIME_STYLES[item.mimeType]) return MIME_STYLES[item.mimeType]
  const prefixMatch = PREFIX_STYLES.find(([prefix]) => item.mimeType.startsWith(prefix))
  if (prefixMatch) return prefixMatch[1]
  return { icon: FileIcon, color: "text-gray-400" }
}

/** Renders a file's real preview (fetched through the auth-gated /api/drive/thumbnail proxy,
 *  never Google's raw thumbnailLink) once it loads, falling back to the type icon until then
 *  or if Google has no thumbnail for this file. */
function DriveThumbnail({ item }: { item: DriveItem }) {
  const [src, setSrc] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)
  const { icon: Icon, color } = styleFor(item)

  useEffect(() => {
    let objectUrl: string | null = null
    let cancelled = false

    async function load() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return
        const res = await fetch(`/api/drive/thumbnail?fileId=${encodeURIComponent(item.id)}`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        })
        if (!res.ok) throw new Error("no thumbnail")
        const blob = await res.blob()
        if (cancelled) return
        objectUrl = URL.createObjectURL(blob)
        setSrc(objectUrl)
      } catch {
        if (!cancelled) setFailed(true)
      }
    }
    load()

    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [item.id])

  if (failed || !src) return <Icon className={`w-5 h-5 shrink-0 ${color}`} />

  // eslint-disable-next-line @next/next/no-img-element -- src is a blob: URL, next/image can't handle those
  return <img src={src} alt="" className="w-8 h-8 rounded object-cover shrink-0 border border-gray-100" />
}

/**
 * Browses the org's shared Google Drive folder from inside the portal, using the portal's own
 * connected Google account (app/api/drive/*) rather than the signed-in member's own Drive
 * permissions — that's what lets everyone see (and now organize) the folder structure
 * regardless of what's individually shared with them. Opening a file still hands off to
 * Google's own webViewLink, so Google's normal per-file sharing still governs whether it
 * actually opens for them. There is intentionally no delete action anywhere in this UI — see
 * the comment at the top of lib/google-drive.ts. Moving a file is not deleting it: it's a
 * single atomic re-parent call, so nothing is ever removed from its source without a confirmed
 * successful landing at the destination.
 */
export default function DriveBrowser() {
  const [crumbs, setCrumbs] = useState<Crumb[]>([{ id: null, name: "Drive" }])
  const [items, setItems] = useState<DriveItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [newMenuOpen, setNewMenuOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [clipboard, setClipboard] = useState<ClipboardState>(null)
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const currentFolderId = crumbs[crumbs.length - 1]?.id ?? null
  const currentFolderName = crumbs[crumbs.length - 1]?.name ?? "this folder"

  const loadFolder = useCallback(async (folderId: string | null, isRoot: boolean) => {
    setLoading(true)
    setError(null)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setError("You need to be signed in to browse the Drive.")
        return
      }

      const url = folderId ? `/api/drive/list?folderId=${encodeURIComponent(folderId)}` : "/api/drive/list"
      const res = await fetch(url, { headers: { Authorization: `Bearer ${session.access_token}` } })
      const body = await res.json()

      if (!res.ok) {
        setError(body?.error || "Failed to load this folder.")
        setItems([])
        return
      }

      setItems(body.items || [])
      if (isRoot) setCrumbs([{ id: body.id, name: body.name }])
    } catch (err) {
      console.error("DriveBrowser load error:", err)
      setError("Failed to load this folder.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadFolder(null, true)
  }, [loadFolder])

  const refresh = () => loadFolder(currentFolderId, false)

  const openFolder = (item: DriveItem) => {
    setSelectedIds(new Set())
    setCrumbs((prev) => [...prev, { id: item.id, name: item.name }])
    loadFolder(item.id, false)
  }

  const goToCrumb = (index: number) => {
    const target = crumbs[index]
    setSelectedIds(new Set())
    setCrumbs((prev) => prev.slice(0, index + 1))
    loadFolder(target.id, false)
  }

  const openFile = (item: DriveItem) => {
    if (item.webViewLink) window.open(item.webViewLink, "_blank", "noopener,noreferrer")
  }

  async function getBearer(): Promise<string> {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error("You need to be signed in.")
    return `Bearer ${session.access_token}`
  }

  async function runAction(action: () => Promise<Response>) {
    setBusy(true)
    try {
      const res = await action()
      const body = await res.json().catch(() => null)
      if (!res.ok) throw new Error(body?.error || "That action failed.")
      refresh()
      return body
    } catch (err: any) {
      alert(err?.message || "That action failed.")
      return null
    } finally {
      setBusy(false)
      setNewMenuOpen(false)
    }
  }

  const handleCreateFolder = async () => {
    const name = window.prompt("Folder name:")
    if (!name || !currentFolderId) return
    const bearer = await getBearer().catch((err) => { alert(err.message); return null })
    if (!bearer) return
    await runAction(() =>
      fetch("/api/drive/folder", {
        method: "POST",
        headers: { Authorization: bearer, "Content-Type": "application/json" },
        body: JSON.stringify({ name, parentId: currentFolderId }),
      })
    )
  }

  const handleCreateFile = async (type: CreatableType, label: string) => {
    const name = window.prompt(`${label} name:`)
    if (!name || !currentFolderId) return
    const bearer = await getBearer().catch((err) => { alert(err.message); return null })
    if (!bearer) return
    const created = await runAction(() =>
      fetch("/api/drive/create-file", {
        method: "POST",
        headers: { Authorization: bearer, "Content-Type": "application/json" },
        body: JSON.stringify({ name, parentId: currentFolderId, type }),
      })
    )
    if (created?.webViewLink) window.open(created.webViewLink, "_blank", "noopener,noreferrer")
  }

  const handleUploadClick = () => fileInputRef.current?.click()

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file || !currentFolderId) return
    const bearer = await getBearer().catch((err) => { alert(err.message); return null })
    if (!bearer) return
    const fd = new FormData()
    fd.append("file", file)
    fd.append("parentId", currentFolderId)
    await runAction(() => fetch("/api/drive/upload", { method: "POST", headers: { Authorization: bearer }, body: fd }))
  }

  // --- Selection ---

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectAll = () => {
    if (items.length === 0) return
    setSelectedIds(new Set(items.map((i) => i.id)))
  }

  const clearSelection = () => setSelectedIds(new Set())

  // --- Clipboard (Copy / Cut / Paste) ---

  const copyItems = (ids: string[]) => {
    const chosen = items.filter((i) => ids.includes(i.id) && !i.isFolder)
    if (chosen.length === 0) {
      alert("Folders can't be copied (Drive only makes an empty copy, not the contents) — use Move instead.")
      return
    }
    if (chosen.length < ids.length) {
      alert(`${ids.length - chosen.length} folder(s) in your selection were skipped — only files can be copied.`)
    }
    setClipboard({
      mode: "copy",
      items: chosen.map(({ id, name, isFolder }) => ({ id, name, isFolder })),
      sourceFolderId: currentFolderId,
    })
  }

  const cutItems = (ids: string[]) => {
    const chosen = items.filter((i) => ids.includes(i.id))
    if (chosen.length === 0) return
    setClipboard({
      mode: "move",
      items: chosen.map(({ id, name, isFolder }) => ({ id, name, isFolder })),
      sourceFolderId: currentFolderId,
    })
  }

  const pasteClipboard = async () => {
    if (!clipboard || !currentFolderId) return
    if (clipboard.mode === "move" && clipboard.sourceFolderId === currentFolderId) {
      alert("That's already where these are.")
      return
    }

    const count = clipboard.items.length
    if (count > 1) {
      const verb = clipboard.mode === "copy" ? "Copy" : "Move"
      const ok = window.confirm(`${verb} ${count} items into "${currentFolderName}"?`)
      if (!ok) return
    }

    setBusy(true)
    try {
      const bearer = await getBearer()

      if (clipboard.mode === "copy") {
        const results = await Promise.allSettled(
          clipboard.items.map((item) =>
            fetch("/api/drive/copy", {
              method: "POST",
              headers: { Authorization: bearer, "Content-Type": "application/json" },
              body: JSON.stringify({ fileId: item.id, parentId: currentFolderId }),
            }).then(async (res) => {
              if (!res.ok) throw new Error((await res.json().catch(() => null))?.error || "Copy failed.")
            })
          )
        )
        const failed = results.filter((r) => r.status === "rejected")
        if (failed.length > 0) {
          alert(`${count - failed.length} of ${count} copied. ${failed.length} failed.`)
        }
        // Copy clipboard persists — you can paste the same items into another folder too.
      } else {
        const res = await fetch("/api/drive/move", {
          method: "POST",
          headers: { Authorization: bearer, "Content-Type": "application/json" },
          body: JSON.stringify({
            fileIds: clipboard.items.map((i) => i.id),
            fromParentId: clipboard.sourceFolderId,
            toParentId: currentFolderId,
          }),
        })
        const body = await res.json()
        if (!res.ok) throw new Error(body?.error || "Move failed.")
        if (body.failed?.length > 0) {
          alert(`${body.moved?.length || 0} of ${count} moved. ${body.failed.length} failed — they're untouched in their original folder.`)
        }
        setClipboard(null)
        setSelectedIds(new Set())
      }
      refresh()
    } catch (err: any) {
      alert(err?.message || "That action failed.")
    } finally {
      setBusy(false)
    }
  }

  // --- Keyboard shortcuts (Ctrl/Cmd+A/C/X/V) — ignored while typing in an input elsewhere on
  // the page, and naturally scoped to whenever this component is mounted (i.e. the Drive &
  // Calendar tab is open).
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const active = document.activeElement as HTMLElement | null
      const isTyping = active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.isContentEditable)
      if (isTyping || !(e.ctrlKey || e.metaKey)) return

      const key = e.key.toLowerCase()
      if (key === "a") {
        e.preventDefault()
        selectAll()
      } else if (key === "c" && selectedIds.size > 0) {
        e.preventDefault()
        copyItems([...selectedIds])
      } else if (key === "x" && selectedIds.size > 0) {
        e.preventDefault()
        cutItems([...selectedIds])
      } else if (key === "v" && clipboard) {
        e.preventDefault()
        pasteClipboard()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIds, clipboard, currentFolderId, items])

  return (
    <div ref={containerRef} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <h3 className="font-bold text-lg mb-4">Browse Team Drive</h3>

      <div className="flex items-center gap-1 flex-wrap text-sm mb-4 text-gray-500">
        {crumbs.map((crumb, i) => (
          <span key={crumb.id ?? "root"} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
            <button
              onClick={() => goToCrumb(i)}
              disabled={i === crumbs.length - 1}
              className={
                i === crumbs.length - 1
                  ? "font-semibold text-gray-800"
                  : "hover:text-blue-600 hover:underline"
              }
            >
              {crumb.name}
            </button>
          </span>
        ))}
      </div>

      {!loading && !error && (
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <div className="relative">
            <button
              onClick={() => setNewMenuOpen((o) => !o)}
              disabled={busy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg disabled:opacity-50 transition-colors"
            >
              <Plus className="w-4 h-4" /> New <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {newMenuOpen && (
              <div className="absolute z-10 mt-1 w-52 bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                <button
                  onClick={handleCreateFolder}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
                >
                  <FolderPlus className="w-4 h-4 text-blue-500 shrink-0" /> Folder
                </button>
                <div className="my-1 border-t border-gray-100" />
                {NEW_FILE_TYPES.map(({ type, label, icon: Icon, color }) => (
                  <button
                    key={type}
                    onClick={() => handleCreateFile(type, label)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${color}`} /> {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleUploadClick}
            disabled={busy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg disabled:opacity-50 transition-colors"
          >
            <Upload className="w-4 h-4" /> Upload
          </button>
          <input ref={fileInputRef} type="file" onChange={handleFileSelected} className="hidden" />

          <div className="flex items-center rounded-lg border border-gray-200 overflow-hidden">
            <button
              onClick={() => setViewMode("list")}
              title="List view"
              aria-label="List view"
              className={`p-1.5 ${viewMode === "list" ? "bg-gray-200 text-gray-700" : "bg-white text-gray-400 hover:text-gray-600"}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              title="Tile view"
              aria-label="Tile view"
              className={`p-1.5 ${viewMode === "grid" ? "bg-gray-200 text-gray-700" : "bg-white text-gray-400 hover:text-gray-600"}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2 ml-1 pl-3 border-l border-gray-200">
              <span className="text-xs font-semibold text-gray-500">{selectedIds.size} selected</span>
              <button
                onClick={() => copyItems([...selectedIds])}
                className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-md transition-colors"
              >
                <Copy className="w-3.5 h-3.5" /> Copy
              </button>
              <button
                onClick={() => cutItems([...selectedIds])}
                className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-semibold rounded-md transition-colors"
              >
                <Scissors className="w-3.5 h-3.5" /> Move
              </button>
              <button onClick={clearSelection} className="text-gray-400 hover:text-gray-600" aria-label="Clear selection">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {busy && <Loader2 className="w-4 h-4 animate-spin text-gray-400 ml-1" />}
        </div>
      )}

      {clipboard && (
        <div className="flex items-center justify-between gap-3 mb-4 px-3 py-2 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800">
          <span className="truncate">
            {clipboard.mode === "copy" ? "Copied" : "Cut"}:{" "}
            <strong>
              {clipboard.items.length === 1 ? clipboard.items[0].name : `${clipboard.items.length} items`}
            </strong>{" "}
            — browse to a folder and paste it here
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={pasteClipboard}
              disabled={busy}
              className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold disabled:opacity-50 transition-colors"
            >
              <ClipboardPaste className="w-3.5 h-3.5" /> Paste here
            </button>
            <button onClick={() => setClipboard(null)} className="text-blue-400 hover:text-blue-600" aria-label="Cancel">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin mb-2" />
          <p className="text-sm">Loading…</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
          <AlertCircle className="w-6 h-6 mb-2 text-amber-500" />
          <p className="text-sm max-w-sm">{error}</p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">This folder is empty.</div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {items.map((item) => {
            const { icon: Icon, color } = styleFor(item)
            const selected = selectedIds.has(item.id)
            return (
              <div
                key={item.id}
                className={`relative group rounded-xl border p-3 transition-colors ${
                  selected ? "border-blue-300 bg-blue-50" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => toggleSelect(item.id)}
                  className="absolute top-2 left-2 z-10 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  aria-label={`Select ${item.name}`}
                />
                <div className="absolute top-1.5 right-1.5 z-10 flex opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
                  {!item.isFolder && (
                    <button
                      onClick={() => copyItems([item.id])}
                      title={`Copy "${item.name}"`}
                      aria-label={`Copy ${item.name}`}
                      className="p-1 text-gray-400 hover:text-blue-500 bg-white/80 rounded"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => cutItems([item.id])}
                    title={`Move "${item.name}"`}
                    aria-label={`Move ${item.name}`}
                    className="p-1 text-gray-400 hover:text-amber-500 bg-white/80 rounded"
                  >
                    <Scissors className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button
                  onClick={() => (item.isFolder ? openFolder(item) : openFile(item))}
                  className="w-full flex flex-col items-center gap-2 text-center"
                >
                  <div className="h-16 w-full flex items-center justify-center">
                    {!item.isFolder && item.hasThumbnail ? (
                      <DriveThumbnail item={item} />
                    ) : (
                      <Icon className={`w-9 h-9 ${color}`} />
                    )}
                  </div>
                  <span className="w-full text-xs text-gray-700 line-clamp-2 break-words">{item.name}</span>
                </button>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {items.map((item) => {
            const { icon: Icon, color } = styleFor(item)
            const selected = selectedIds.has(item.id)
            return (
              <div key={item.id} className={`flex items-center gap-1 py-1 group rounded-lg ${selected ? "bg-blue-50" : ""}`}>
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => toggleSelect(item.id)}
                  className={`ml-2 shrink-0 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer ${
                    selected ? "" : "opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                  }`}
                  aria-label={`Select ${item.name}`}
                />
                <button
                  onClick={() => (item.isFolder ? openFolder(item) : openFile(item))}
                  className="flex-1 min-w-0 flex items-center gap-3 py-1.5 px-2 hover:bg-gray-50 rounded-lg text-left transition-colors"
                >
                  {!item.isFolder && item.hasThumbnail ? (
                    <DriveThumbnail item={item} />
                  ) : (
                    <Icon className={`w-5 h-5 shrink-0 ${color}`} />
                  )}
                  <span className="flex-1 min-w-0 text-sm text-gray-700 truncate">{item.name}</span>
                </button>
                <div className="flex items-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 shrink-0">
                  {!item.isFolder && (
                    <button
                      onClick={() => copyItems([item.id])}
                      title={`Copy "${item.name}"`}
                      aria-label={`Copy ${item.name}`}
                      className="p-1.5 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => cutItems([item.id])}
                    title={`Move "${item.name}"`}
                    aria-label={`Move ${item.name}`}
                    className="p-1.5 text-gray-300 hover:text-amber-500 hover:bg-amber-50 rounded-md transition-colors"
                  >
                    <Scissors className="w-3.5 h-3.5" />
                  </button>
                </div>
                {!item.isFolder && <ExternalLink className="w-3.5 h-3.5 text-gray-300 shrink-0 mr-2" />}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
