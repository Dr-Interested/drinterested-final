"use client"

import { useCallback, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase-client"
import {
  Folder,
  File as FileIcon,
  FileText,
  FileSpreadsheet,
  Presentation,
  Image as ImageIcon,
  ChevronRight,
  Loader2,
  AlertCircle,
  ExternalLink,
  type LucideIcon,
} from "lucide-react"

type DriveItem = {
  id: string
  name: string
  mimeType: string
  isFolder: boolean
  webViewLink?: string
}

type Crumb = { id: string | null; name: string }

const MIME_ICONS: Record<string, LucideIcon> = {
  "application/vnd.google-apps.document": FileText,
  "application/vnd.google-apps.spreadsheet": FileSpreadsheet,
  "application/vnd.google-apps.presentation": Presentation,
  "application/pdf": FileText,
  "image/jpeg": ImageIcon,
  "image/png": ImageIcon,
  "image/gif": ImageIcon,
  "image/webp": ImageIcon,
}

function iconFor(item: DriveItem): LucideIcon {
  if (item.isFolder) return Folder
  return MIME_ICONS[item.mimeType] || FileIcon
}

/**
 * Browses the org's shared Google Drive folder from inside the portal, using the server's
 * service-account connection (app/api/drive/list) rather than the signed-in member's own
 * Drive permissions — that's what lets everyone see the folder structure regardless of what's
 * individually shared with them. Opening a file still hands off to Google's own webViewLink,
 * so Google's normal per-file sharing still governs whether it actually opens for them.
 */
export default function DriveBrowser() {
  const [crumbs, setCrumbs] = useState<Crumb[]>([{ id: null, name: "Drive" }])
  const [items, setItems] = useState<DriveItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  const openFolder = (item: DriveItem) => {
    setCrumbs((prev) => [...prev, { id: item.id, name: item.name }])
    loadFolder(item.id, false)
  }

  const goToCrumb = (index: number) => {
    const target = crumbs[index]
    setCrumbs((prev) => prev.slice(0, index + 1))
    loadFolder(target.id, false)
  }

  const openFile = (item: DriveItem) => {
    if (item.webViewLink) window.open(item.webViewLink, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
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
      ) : (
        <div className="divide-y divide-gray-100">
          {items.map((item) => {
            const Icon = iconFor(item)
            return (
              <button
                key={item.id}
                onClick={() => (item.isFolder ? openFolder(item) : openFile(item))}
                className="w-full flex items-center gap-3 py-2.5 px-2 hover:bg-gray-50 rounded-lg text-left transition-colors group"
              >
                <Icon className={`w-5 h-5 shrink-0 ${item.isFolder ? "text-blue-500" : "text-gray-400"}`} />
                <span className="flex-1 text-sm text-gray-700 truncate">{item.name}</span>
                {!item.isFolder && (
                  <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 shrink-0" />
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
