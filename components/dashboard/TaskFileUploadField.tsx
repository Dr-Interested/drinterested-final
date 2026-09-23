"use client"

import { useRef, useState } from "react"
import { supabase } from "@/lib/supabase-client"
import { Loader2, Paperclip, Upload, X } from "lucide-react"

// Upload goes straight to Supabase Storage (public-read "task-submissions" bucket), same
// pattern as components/admin/image-upload-field.tsx but for any file type.
const BUCKET = "task-submissions"
const MAX_BYTES = 25 * 1024 * 1024

/** File attachment for a task completion. Hands the uploaded file's public URL back via onChange. */
export default function TaskFileUploadField({
  pathPrefix,
  value,
  onChange,
  onUploadingChange,
}: {
  pathPrefix: string
  value: string
  onChange: (url: string) => void
  onUploadingChange?: (uploading: boolean) => void
}) {
  const [uploading, setUploading] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const setBusy = (b: boolean) => {
    setUploading(b)
    onUploadingChange?.(b)
  }

  const handleFile = async (file: File | undefined) => {
    if (!file) return
    if (file.size > MAX_BYTES) {
      setError("That file is too large (25 MB max). Share a link to it instead.")
      return
    }
    setError(null)
    setBusy(true)
    try {
      const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "bin"
      const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
      const path = `${pathPrefix}/${safeName}`

      const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
        cacheControl: "31536000",
        upsert: false,
        contentType: file.type || undefined,
      })
      if (uploadError) throw uploadError

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
      setFileName(file.name)
      onChange(data.publicUrl)
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Upload failed.")
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        Attach a file <span className="text-gray-400 font-normal">(optional)</span>
      </label>
      {value ? (
        <div className="flex items-center gap-2 p-2.5 border border-gray-200 rounded-lg bg-gray-50 text-sm">
          <Paperclip className="w-4 h-4 text-gray-400 shrink-0" />
          <a href={value} target="_blank" rel="noopener noreferrer" className="flex-1 truncate text-[#4CAF7D] hover:underline">
            {fileName || "Uploaded file"}
          </a>
          <button
            type="button"
            onClick={() => {
              setFileName(null)
              onChange("")
            }}
            className="text-gray-400 hover:text-gray-600"
            title="Remove file"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full p-2.5 border border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? "Uploading..." : "Choose a file"}
        </button>
      )}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      <input ref={inputRef} type="file" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
    </div>
  )
}
