"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase-client"
import { Loader2 } from "lucide-react"
import ImageUploadField from "@/components/admin/image-upload-field"

type Webinar = {
  id: string
  title: string
  date: string
  time: string
  speaker: string
  speaker_title: string
  description: string
  image: string
  video_url: string
  status: string
  registration_link: string
  featured: boolean
  created_at: string
}

export default function WebinarsAdmin() {
  const [webinars, setWebinars] = useState<Webinar[]>([])
  const [loading, setLoading] = useState(true)
  const [editingWebinar, setEditingWebinar] = useState<Webinar | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [form, setForm] = useState<Partial<Webinar>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchWebinars()
  }, [])

  const fetchWebinars = async () => {
    setLoading(true)
    const { data, error } = await supabase.from("webinars").select("*").order("created_at", { ascending: false })
    if (error) {
      console.error(error)
      alert("Failed to load webinars")
    } else {
      setWebinars(data || [])
    }
    setLoading(false)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        title: form.title,
        date: form.date,
        time: form.time || "",
        speaker: form.speaker || "",
        speaker_title: form.speaker_title || "",
        description: form.description,
        image: form.image || "/logo.png",
        video_url: form.video_url || "",
        status: form.status || "upcoming",
        registration_link: form.registration_link || "",
        featured: form.featured || false,
      }

      if (isCreating) {
        const { error } = await supabase.from("webinars").insert([payload])
        if (error) throw error
      } else if (editingWebinar) {
        const { error } = await supabase.from("webinars").update(payload).eq("id", editingWebinar.id)
        if (error) throw error
      }

      setIsCreating(false)
      setEditingWebinar(null)
      fetchWebinars()
    } catch (err) {
      console.error(err)
      alert("Failed to save webinar.")
    } finally {
      setSaving(false)
    }
  }

  const extractStoragePath = (url: string | null | undefined, bucket: string): string | null => {
    if (!url) return null
    try {
      const marker = `/storage/v1/object/public/${bucket}/`
      const idx = url.indexOf(marker)
      if (idx === -1) return null
      return decodeURIComponent(url.slice(idx + marker.length))
    } catch {
      return null
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this webinar?")) return
    try {
      const { data: webinarData } = await supabase.from("webinars").select("image").eq("id", id).single()
      const { error } = await supabase.from("webinars").delete().eq("id", id)
      if (error) throw error

      // Cascade: delete thumbnail from Supabase Storage if it was an uploaded file
      const imgPath = extractStoragePath(webinarData?.image, "webinar-images")
      if (imgPath) {
        await supabase.storage.from("webinar-images").remove([imgPath])
      }

      fetchWebinars()
    } catch (err) {
      console.error(err)
      alert("Failed to delete webinar.")
    }
  }

  if (isCreating || editingWebinar) {
    return (
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-xl font-bold mb-4">{isCreating ? "Create Webinar" : "Edit Webinar"}</h3>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input required type="text" className="w-full p-2 border rounded" value={form.title || ""} onChange={(e) => setForm({...form, title: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input required type="text" className="w-full p-2 border rounded" value={form.date || ""} onChange={(e) => setForm({...form, date: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Time/Duration</label>
              <input type="text" className="w-full p-2 border rounded" value={form.time || ""} onChange={(e) => setForm({...form, time: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Speaker</label>
              <input type="text" className="w-full p-2 border rounded" value={form.speaker || ""} onChange={(e) => setForm({...form, speaker: e.target.value})} />
            </div>
            <ImageUploadField
              label="Thumbnail"
              bucket="webinar-images"
              pathPrefix="thumbnails"
              value={form.image || ""}
              onChange={(url) => setForm({ ...form, image: url })}
            />
            <div>
              <label className="block text-sm font-medium mb-1">Video URL (optional)</label>
              <input type="text" className="w-full p-2 border rounded" value={form.video_url || ""} onChange={(e) => setForm({...form, video_url: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select className="w-full p-2 border rounded" value={form.status || "upcoming"} onChange={(e) => setForm({...form, status: e.target.value})}>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Registration Link (optional)</label>
              <input type="text" className="w-full p-2 border rounded" value={form.registration_link || ""} onChange={(e) => setForm({...form, registration_link: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea required className="w-full p-2 border rounded h-32" value={form.description || ""} onChange={(e) => setForm({...form, description: e.target.value})} />
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.featured || false} onChange={(e) => setForm({...form, featured: e.target.checked})} />
              Featured
            </label>
          </div>
          <div className="flex gap-4 pt-4">
            <button disabled={saving} type="submit" className="px-6 py-2 bg-[#4CAF7D] text-white rounded font-medium disabled:opacity-70">
              {saving ? "Saving..." : "Save Webinar"}
            </button>
            <button type="button" onClick={() => { setIsCreating(false); setEditingWebinar(null); }} className="px-6 py-2 bg-gray-200 text-gray-700 rounded font-medium">
              Cancel
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <>
      <div className="flex justify-between items-center border-b-2 border-gray-200 pb-4 mb-8">
        <h2 className="text-xl font-semibold text-gray-800">Manage Webinars</h2>
        <button onClick={() => { setForm({}); setIsCreating(true); }} className="px-4 py-2 bg-[#4CAF7D] text-white font-semibold rounded-lg">
          + Create New Webinar
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-[#4CAF7D]" /></div>
      ) : webinars.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No webinars found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {webinars.map((webinar) => (
            <div key={webinar.id} className="bg-white border rounded-xl overflow-hidden flex flex-col">
              <div className="h-40 bg-gray-100 relative">
                <img src={webinar.image} className="w-full h-full object-cover" alt={webinar.title} />
                <span className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded capitalize">{webinar.status}</span>
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-bold text-lg mb-1">{webinar.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{webinar.date} • {webinar.speaker}</p>
                <div className="mt-auto flex gap-2 pt-4 border-t">
                  <button onClick={() => { setEditingWebinar(webinar); setForm(webinar); }} className="flex-1 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded">Edit</button>
                  <button onClick={() => handleDelete(webinar.id)} className="flex-1 py-1.5 bg-red-50 text-red-700 text-sm font-medium rounded">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
