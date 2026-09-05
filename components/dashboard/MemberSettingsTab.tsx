"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { supabase } from "@/lib/supabase-client"
import ImageUploadField from "@/components/admin/image-upload-field"
import { Loader2, Moon, Sun, Bell, BellOff, BellRing } from "lucide-react"

type MemberProfile = {
  id: string
  name: string
  role: string
  department: string
  email: string
  bio: string
  image: string
  discord_username: string
  timezone: string | null
  socials: { linkedin?: string; instagram?: string; website?: string } | null
}

// A curated, reasonably global list rather than depending on Intl.supportedValuesOf("timeZone")
// (not supported in every runtime yet).
const TIMEZONES = [
  "UTC",
  "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
  "America/Toronto", "America/Vancouver", "America/Sao_Paulo", "America/Mexico_City",
  "Europe/London", "Europe/Paris", "Europe/Berlin", "Europe/Madrid", "Europe/Moscow",
  "Africa/Cairo", "Africa/Lagos", "Africa/Johannesburg",
  "Asia/Dubai", "Asia/Karachi", "Asia/Kolkata", "Asia/Dhaka", "Asia/Bangkok",
  "Asia/Shanghai", "Asia/Tokyo", "Asia/Seoul", "Asia/Singapore", "Asia/Manila",
  "Australia/Sydney", "Australia/Perth", "Pacific/Auckland",
]

type NotifState = NotificationPermission | "unsupported"

/**
 * Every member's own profile/preferences tab — separate from the admin-only "Edit Info" in
 * the Members list, this is self-service (bio, photo, socials, Discord, timezone, dark mode,
 * and browser notifications). Notifications here are foreground-only: a Supabase Realtime
 * subscription that fires a browser Notification when a task is assigned while this tab is
 * open, not a true always-on push subscription (that would need a service worker + VAPID keys
 * + a stored push-subscription table — ask if you want that upgraded later).
 */
export default function MemberSettingsTab() {
  const { resolvedTheme, setTheme } = useTheme()
  const [profile, setProfile] = useState<MemberProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notifState, setNotifState] = useState<NotifState>("default")

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user?.email) return
        const { data } = await supabase
          .from("members")
          .select("*")
          .eq("email", user.email.toLowerCase())
          .maybeSingle()
        if (data) setProfile(data)
      } catch (err) {
        console.error("Error loading profile:", err)
      } finally {
        setLoading(false)
      }
    }
    load()

    if (typeof window !== "undefined" && "Notification" in window) {
      setNotifState(Notification.permission)
    } else {
      setNotifState("unsupported")
    }
  }, [])

  // Foreground task-assignment notifications — see the file doc comment above for the scope.
  useEffect(() => {
    if (!profile?.email || notifState !== "granted") return
    const channel = supabase
      .channel(`portal-tasks-${profile.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "tasks", filter: `assigned_to=eq.${profile.email.toLowerCase()}` },
        (payload: any) => {
          new Notification("New task assigned", {
            body: payload.new?.title || "You have a new task in the Dr. Interested portal.",
          })
        }
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [profile, notifState])

  const requestNotifications = async () => {
    if (!("Notification" in window)) return
    const result = await Notification.requestPermission()
    setNotifState(result)
  }

  const handleSave = async () => {
    if (!profile) return
    setSaving(true)
    try {
      const { error } = await supabase
        .from("members")
        .update({
          bio: profile.bio,
          image: profile.image,
          discord_username: profile.discord_username,
          timezone: profile.timezone,
          socials: profile.socials || {},
        })
        .eq("id", profile.id)
      if (error) throw error
      alert("Settings saved!")
    } catch (err: any) {
      console.error(err)
      alert("Failed to save: " + err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin mb-3" />
        <p>Loading your settings...</p>
      </div>
    )
  }

  if (!profile) {
    return <div className="text-center py-20 text-gray-500">We couldn&apos;t find your member profile.</div>
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Appearance */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-lg mb-4">Appearance</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {resolvedTheme === "dark" ? <Moon className="w-5 h-5 text-gray-500" /> : <Sun className="w-5 h-5 text-amber-500" />}
            <div>
              <p className="font-semibold text-sm text-gray-800">Dark Mode</p>
              <p className="text-xs text-gray-500">Applies across the whole site, not just the portal.</p>
            </div>
          </div>
          <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className={`relative w-12 h-7 rounded-full transition-colors ${resolvedTheme === "dark" ? "bg-[#4CAF7D]" : "bg-gray-300"}`}
            aria-label="Toggle dark mode"
          >
            <span
              className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                resolvedTheme === "dark" ? "translate-x-5" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-lg mb-4">Notifications</h3>
        {notifState === "unsupported" ? (
          <p className="text-sm text-gray-500">Your browser doesn&apos;t support notifications.</p>
        ) : notifState === "granted" ? (
          <div className="flex items-center gap-3 text-sm text-green-700">
            <BellRing className="w-5 h-5" />
            <span>Enabled — you&apos;ll get a browser notification here when a task is assigned to you while the portal is open.</span>
          </div>
        ) : notifState === "denied" ? (
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <BellOff className="w-5 h-5" />
            <span>Blocked — you&apos;ll need to allow notifications for this site in your browser&apos;s address bar settings.</span>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Bell className="w-5 h-5 text-gray-400" />
              <span>Get notified here when a task is assigned to you.</span>
            </div>
            <button
              onClick={requestNotifications}
              className="px-4 py-2 bg-[#4CAF7D] hover:bg-[#2d8659] text-white text-sm font-semibold rounded-lg transition-colors flex-shrink-0"
            >
              Enable
            </button>
          </div>
        )}
      </div>

      {/* Profile */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-lg mb-1.5">Your Profile</h3>
        <p className="text-xs text-gray-500 mb-4">
          {profile.name} &middot; {profile.role}{profile.department ? ` · ${profile.department}` : ""}
        </p>

        <div className="space-y-4">
          <ImageUploadField
            label="Photo"
            bucket="avatar"
            pathPrefix="members"
            value={profile.image}
            onChange={(url) => setProfile((p) => (p ? { ...p, image: url } : p))}
          />

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Bio</label>
            <textarea
              value={profile.bio || ""}
              onChange={(e) => setProfile((p) => (p ? { ...p, bio: e.target.value } : p))}
              rows={4}
              className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF7D]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Discord Username</label>
            <input
              type="text"
              value={profile.discord_username || ""}
              onChange={(e) => setProfile((p) => (p ? { ...p, discord_username: e.target.value } : p))}
              className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF7D]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Timezone</label>
            <select
              value={profile.timezone || ""}
              onChange={(e) => setProfile((p) => (p ? { ...p, timezone: e.target.value || null } : p))}
              className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF7D] bg-white"
            >
              <option value="">Not set</option>
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>{tz.replace(/_/g, " ")}</option>
              ))}
            </select>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">LinkedIn</label>
              <input
                type="url"
                value={profile.socials?.linkedin || ""}
                onChange={(e) => setProfile((p) => (p ? { ...p, socials: { ...p.socials, linkedin: e.target.value } } : p))}
                placeholder="https://linkedin.com/in/..."
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF7D]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Instagram</label>
              <input
                type="url"
                value={profile.socials?.instagram || ""}
                onChange={(e) => setProfile((p) => (p ? { ...p, socials: { ...p.socials, instagram: e.target.value } } : p))}
                placeholder="https://instagram.com/..."
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF7D]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Website</label>
              <input
                type="url"
                value={profile.socials?.website || ""}
                onChange={(e) => setProfile((p) => (p ? { ...p, socials: { ...p.socials, website: e.target.value } } : p))}
                placeholder="https://..."
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF7D]"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#4CAF7D] hover:bg-[#2d8659] text-white font-semibold rounded-lg text-sm transition-colors disabled:opacity-75"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  )
}
