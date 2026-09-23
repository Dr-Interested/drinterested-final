"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase-client"
import { Loader2 } from "lucide-react"

type Event = {
  id: string
  title: string
  date: string
  time: string
  location: string
  description: string
  image: string
  status: string
  link: string
  featured: boolean
  is_past: boolean
  created_at: string
}

export default function EventsAdmin() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [form, setForm] = useState<Partial<Event>>({})
  const [saving, setSaving] = useState(false)
  const [activeSubTab, setActiveSubTab] = useState<"active" | "inactive">("active")

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    setLoading(true)
    const { data, error } = await supabase.from("events").select("*").order("created_at", { ascending: false })
    if (error) {
      console.error(error)
      alert("Failed to load events")
    } else {
      setEvents(data || [])
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
        location: form.location,
        description: form.description,
        image: form.image || "/logo.png",
        status: form.status || "open",
        link: form.link || "",
        featured: form.featured || false,
        is_past: form.is_past || false,
      }

      if (isCreating) {
        const { error } = await supabase.from("events").insert([payload])
        if (error) throw error
      } else if (editingEvent) {
        const { error } = await supabase.from("events").update(payload).eq("id", editingEvent.id)
        if (error) throw error
      }

      setIsCreating(false)
      setEditingEvent(null)
      fetchEvents()
    } catch (err) {
      console.error(err)
      alert("Failed to save event.")
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
    if (!confirm("Are you sure you want to delete this event?")) return
    try {
      const { data: eventData } = await supabase.from("events").select("image").eq("id", id).single()
      const { error } = await supabase.from("events").delete().eq("id", id)
      if (error) throw error

      // Cascade: delete event image from Supabase Storage if it was an uploaded file
      const imgPath = extractStoragePath(eventData?.image, "event-images")
      if (imgPath) {
        await supabase.storage.from("event-images").remove([imgPath])
      }

      fetchEvents()
    } catch (err) {
      console.error(err)
      alert("Failed to delete event.")
    }
  }

  if (isCreating || editingEvent) {
    return (
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-xl font-bold mb-4">{isCreating ? "Create Event" : "Edit Event"}</h3>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input required type="text" className="w-full p-2 border rounded" value={form.title || ""} onChange={(e) => setForm({...form, title: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input required type="text" className="w-full p-2 border rounded" placeholder="e.g. October 15, 2026" value={form.date || ""} onChange={(e) => setForm({...form, date: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Time</label>
              <input type="text" className="w-full p-2 border rounded" value={form.time || ""} onChange={(e) => setForm({...form, time: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input required type="text" className="w-full p-2 border rounded" value={form.location || ""} onChange={(e) => setForm({...form, location: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Image URL</label>
              <input type="text" className="w-full p-2 border rounded" value={form.image || ""} onChange={(e) => setForm({...form, image: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select className="w-full p-2 border rounded" value={form.status || "open"} onChange={(e) => setForm({...form, status: e.target.value})}>
                <option value="open">Open</option>
                <option value="full">Full</option>
                <option value="closed">Closed</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Link</label>
              <input type="text" className="w-full p-2 border rounded" value={form.link || ""} onChange={(e) => setForm({...form, link: e.target.value})} />
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
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.is_past || false} onChange={(e) => setForm({...form, is_past: e.target.checked})} />
              Is Past Event
            </label>
          </div>
          <div className="flex gap-4 pt-4">
            <button disabled={saving} type="submit" className="px-6 py-2 bg-[#4CAF7D] text-white rounded font-medium disabled:opacity-70">
              {saving ? "Saving..." : "Save Event"}
            </button>
            <button type="button" onClick={() => { setIsCreating(false); setEditingEvent(null); }} className="px-6 py-2 bg-gray-200 text-gray-700 rounded font-medium">
              Cancel
            </button>
          </div>
        </form>
      </div>
    )
  }

  const sortEvents = (list: Event[], ascending = true) => {
    return [...list].sort((a, b) => {
      const dateA = new Date(a.date).getTime() || 0
      const dateB = new Date(b.date).getTime() || 0
      return ascending ? dateA - dateB : dateB - dateA
    })
  }

  const activeEvents = sortEvents(events.filter(e => !e.is_past), true)
  const inactiveEvents = sortEvents(events.filter(e => e.is_past), false)
  const displayedEvents = activeSubTab === "active" ? activeEvents : inactiveEvents

  return (
    <>
      <div className="flex flex-wrap gap-3 justify-between items-center border-b-2 border-gray-200 pb-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Manage Events</h2>
        <button onClick={() => { setForm({}); setIsCreating(true); }} className="px-4 py-2 bg-[#4CAF7D] text-white font-semibold rounded-lg">
          + Create New Event
        </button>
      </div>

      <div className="flex gap-4 border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveSubTab("active")}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors -mb-[2px] ${
            activeSubTab === "active"
              ? "text-[#4CAF7D] border-[#4CAF7D] font-bold"
              : "text-gray-500 border-transparent hover:text-gray-700"
          }`}
        >
          Active Events ({activeEvents.length})
        </button>
        <button
          onClick={() => setActiveSubTab("inactive")}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors -mb-[2px] ${
            activeSubTab === "inactive"
              ? "text-[#4CAF7D] border-[#4CAF7D] font-bold"
              : "text-gray-500 border-transparent hover:text-gray-700"
          }`}
        >
          Inactive/Past Events ({inactiveEvents.length})
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-[#4CAF7D]" /></div>
      ) : displayedEvents.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No events found in this category</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedEvents.map((event) => (
            <div key={event.id} className="bg-white border rounded-xl overflow-hidden flex flex-col">
              <div className="h-40 bg-gray-100 relative">
                <img src={event.image} className="w-full h-full object-cover" alt={event.title} />
                {event.is_past && <span className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">Past</span>}
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-bold text-lg mb-1">{event.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{event.date} • {event.location}</p>
                <div className="mt-auto flex gap-2 pt-4 border-t">
                  <button onClick={() => { setEditingEvent(event); setForm(event); }} className="flex-1 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded">Edit</button>
                  <button onClick={() => handleDelete(event.id)} className="flex-1 py-1.5 bg-red-50 text-red-700 text-sm font-medium rounded">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
