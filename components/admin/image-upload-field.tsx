"use client"

import { useRef, useState } from "react"
import { supabase } from "@/lib/supabase-client"
import { Loader2, Upload } from "lucide-react"
import SafeImage from "@/components/safe-image"

/**
 * Real file upload (drag-in-a-picker, not just a URL text box) for admin content images.
 * Uploads directly to the given Supabase Storage bucket and hands the resulting public URL
 * back via onChange. The URL field stays editable underneath for pasting an external link
 * instead, so nothing existing breaks.
 */
export default function ImageUploadField({
  label,
  bucket,
  pathPrefix,
  value,
  onChange,
}: {
  label: string
  bucket: string
  pathPrefix: string
  value: string
  onChange: (url: string) => void
}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File | undefined) => {
    if (!file) return
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.")
      return
    }
    setError(null)
    setUploading(true)
    try {
      const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg"
      const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
      const path = `${pathPrefix}/${safeName}`

      const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, {
        cacheControl: "31536000",
        upsert: false,
      })
      if (uploadError) throw uploadError

      const { data } = supabase.storage.from(bucket).getPublicUrl(path)
      onChange(data.publicUrl)
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Upload failed.")
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      <div className="flex items-start gap-3">
        <div className="relative h-16 w-16 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex-shrink-0">
          {value ? (
            <SafeImage src={value} alt="" fill className="object-cover" />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-gray-300">
              <Upload className="w-5 h-5" />
            </div>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Uploaded automatically, or paste an image URL"
              className="flex-1 p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF7D]"
            />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded flex items-center gap-1.5 disabled:opacity-60 whitespace-nowrap"
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  )
}
