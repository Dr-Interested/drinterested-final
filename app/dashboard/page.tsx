"use client"

import { useEffect, useState, useRef } from "react"
import { supabase } from "@/lib/supabase-client"
import { Loader2, X, Clock, Play, Square, Award, FileText, CheckCircle2, User, HelpCircle, ExternalLink, Trash, Edit, Check } from "lucide-react"
import Link from "next/link"
import EventsAdmin from "./EventsAdmin"
import WebinarsAdmin from "./WebinarsAdmin"
import ReactMarkdown from "react-markdown"
import ImageUploadField from "@/components/admin/image-upload-field"

type Member = {
  id: string
  name: string
  email?: string
  discord_username?: string
  role: string
  department: string
  bio: string
  image: string
  approved: boolean
  created_at: string
  socials: {
    website?: string
    linkedin?: string
    instagram?: string
  }
}

type Blog = {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  cover_image: string
  topic: string
  reading_time: string
  featured: boolean
  author_id: string
  author_name?: string
  content_type?: string
  policy_type?: string | null
  created_at: string
}

type Timecard = {
  id: string
  member_id: string
  clock_in: string
  clock_out: string | null
  duration_minutes: number | null
  description: string
  approved: boolean
  archived: boolean
  created_at: string
  member?: {
    name: string
    role: string
    department: string
  }
}

type Task = {
  id: string
  title: string
  description: string
  assigned_to: string
  assigned_by: string
  due_date: string
  status: string
  created_at: string
}

export default function DbAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [authError, setAuthError] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const [googleDriveUrl, setGoogleDriveUrl] = useState("https://drive.google.com")
  const [isSavingUrl, setIsSavingUrl] = useState(false)

  // Current Logged-in User Data
  const [currentUser, setCurrentUser] = useState<any | null>(null)
  const [currentMemberProfile, setCurrentMemberProfile] = useState<Member | null>(null)
  const [isHrOrAdmin, setIsHrOrAdmin] = useState(false)

  // Active Main Tabs
  // Admins see: members, blogs, events, webinars, timesheets, tasks
  // Members see: punchcard, mytasks, shared, profile
  const [activeMainTab, setActiveMainTab] = useState<string>("punchcard")

  // Members State
  const [members, setMembers] = useState<Member[]>([])
  const [activeTab, setActiveTab] = useState<"pending" | "approved">("pending")
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [editForm, setEditForm] = useState<Partial<Member>>({})
  const [savingEdit, setSavingEdit] = useState(false)

  // Blogs State
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null)
  const [isCreatingBlog, setIsCreatingBlog] = useState(false)
  const [blogForm, setBlogForm] = useState<Partial<Blog>>({})
  const [savingBlog, setSavingBlog] = useState(false)

  // Stats State
  const [stats, setStats] = useState({
    approvedMembers: 0,
    pendingMembers: 0,
    publishedBlogs: 0,
    totalEvents: 0
  })

  // Timecard (Punch Card) State
  const [activeTimecard, setActiveTimecard] = useState<Timecard | null>(null)
  const [clockInInput, setClockInInput] = useState("")
  const [elapsedTime, setElapsedTime] = useState("00:00:00")
  const [timecardsList, setTimecardsList] = useState<Timecard[]>([])
  const [allTimecards, setAllTimecards] = useState<Timecard[]>([]) // for HR approvals
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Tasks State
  const [myTasks, setMyTasks] = useState<Task[]>([])
  const [allTasks, setAllTasks] = useState<Task[]>([])
  const [isCreatingTask, setIsCreatingTask] = useState(false)
  const [taskForm, setTaskForm] = useState<Partial<Task>>({ status: "Pending" })
  const [savingTask, setSavingTask] = useState(false)

  // Auth Effect
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  // User Profile Effect
  useEffect(() => {
    if (!isAuthenticated) {
      setCurrentUser(null)
      setCurrentMemberProfile(null)
      setIsHrOrAdmin(false)
      return
    }

    const getProfile = async () => {
      setLoading(true)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          setCurrentUser(user)
          
          // Query matching member profile by email
          const { data: profile } = await supabase
            .from("members")
            .select("*")
            .eq("email", user.email?.toLowerCase())
            .maybeSingle()

          if (profile) {
            setCurrentMemberProfile(profile)
            const role = profile.role || ""
            const dept = profile.department || ""
            const isHR = dept === "Human Resources" || dept === "HR"
            const isExec = role.includes("Executive Director") || role.includes("President") || role.includes("Director") || role.includes("Lead")
            
            const adminLevel = isHR || isExec
            setIsHrOrAdmin(adminLevel)
            
            // Default tabs
            setActiveMainTab(adminLevel ? "members" : "punchcard")
          } else {
            // Default to admin-level view if no matching profile is found (owner/developer fallback)
            setIsHrOrAdmin(true)
            setActiveMainTab("members")
          }
        }
      } catch (err) {
        console.error("Error loading user profile:", err)
      } finally {
        setLoading(false)
      }
    }
    getProfile()
  }, [isAuthenticated])

  const fetchGoogleDriveUrl = async () => {
    try {
      const { data } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "google_drive_url")
        .maybeSingle()
      if (data?.value) {
        setGoogleDriveUrl(data.value)
      }
    } catch (err) {
      console.error("Error fetching Google Drive URL:", err)
    }
  }

  const handleUpdateDriveUrl = async (newUrl: string) => {
    setIsSavingUrl(true)
    try {
      const { error } = await supabase
        .from("settings")
        .upsert({ key: "google_drive_url", value: newUrl })
      if (error) throw error
      alert("Google Drive URL updated successfully!")
    } catch (err: any) {
      console.error(err)
      alert("Failed to update Google Drive URL: " + err.message)
    } finally {
      setIsSavingUrl(false)
    }
  }


  // Data Fetching Effect for Admins and Members
  useEffect(() => {
    if (!isAuthenticated) return

    fetchGoogleDriveUrl()

    if (isHrOrAdmin) {
      if (activeMainTab === "members") {
        fetchMembers()
      } else if (activeMainTab === "blogs") {
        fetchBlogs()
        fetchMembers() // Author options
      } else if (activeMainTab === "timesheets") {
        fetchAdminTimesheets()
      } else if (activeMainTab === "tasks") {
        fetchAdminTasks()
        fetchMembers() // Assignee options
      }
      fetchStats()
    } else {
      // Member specific fetches
      if (activeMainTab === "punchcard") {
        checkActiveTimecard()
        fetchMemberTimecardHistory()
      } else if (activeMainTab === "mytasks") {
        fetchMemberTasks()
      }
    }
  }, [isAuthenticated, isHrOrAdmin, activeMainTab])

  // Pulse Timer for Active Shift
  useEffect(() => {
    if (activeTimecard) {
      const startTime = new Date(activeTimecard.clock_in).getTime()
      
      const updateTimer = () => {
        const diffMs = Date.now() - startTime
        const diffSecs = Math.floor(diffMs / 1000)
        const hrs = Math.floor(diffSecs / 3600).toString().padStart(2, "0")
        const mins = Math.floor((diffSecs % 3600) / 60).toString().padStart(2, "0")
        const secs = (diffSecs % 60).toString().padStart(2, "0")
        setElapsedTime(`${hrs}:${mins}:${secs}`)
      }
      
      updateTimer()
      timerRef.current = setInterval(updateTimer, 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
      setElapsedTime("00:00:00")
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [activeTimecard])

  const fetchStats = async () => {
    try {
      const [membersApproved, membersPending, blogsCount, eventsCount] = await Promise.all([
        supabase.from("members").select("*", { count: "exact", head: true }).eq("approved", true),
        supabase.from("members").select("*", { count: "exact", head: true }).eq("approved", false),
        supabase.from("blogs").select("*", { count: "exact", head: true }),
        supabase.from("events").select("*", { count: "exact", head: true }),
      ])
      
      setStats({
        approvedMembers: membersApproved.count || 0,
        pendingMembers: membersPending.count || 0,
        publishedBlogs: blogsCount.count || 0,
        totalEvents: eventsCount.count || 0
      })
    } catch (err) {
      console.error("Error fetching stats:", err)
    }
  }

  // --- TIMECARD / PUNCH CARD OPERATIONS ---

  const checkActiveTimecard = async () => {
    if (!currentUser) return
    try {
      const { data, error } = await supabase
        .from("timecards")
        .select("*")
        .eq("member_id", currentUser.id)
        .is("clock_out", null)
        .maybeSingle()

      if (error) throw error
      setActiveTimecard(data)
    } catch (err) {
      console.error("Error checking active timecard:", err)
    }
  }

  const fetchMemberTimecardHistory = async () => {
    if (!currentUser) return
    try {
      const { data, error } = await supabase
        .from("timecards")
        .select("*")
        .eq("member_id", currentUser.id)
        .not("clock_out", "is", null)
        .order("clock_in", { ascending: false })
        .limit(20)

      if (error) throw error
      setTimecardsList(data || [])
    } catch (err) {
      console.error("Error fetching timecard history:", err)
    }
  }

  const handleClockIn = async () => {
    if (!currentUser) return
    try {
      const { data, error } = await supabase
        .from("timecards")
        .insert([
          {
            member_id: currentUser.id,
            clock_in: new Date().toISOString(),
            approved: false,
            archived: false,
            description: ""
          }
        ])
        .select()
        .single()

      if (error) throw error
      setActiveTimecard(data)

      // Securely trigger the Discord notification via our API route
      try {
        await fetch("/api/members/timecard/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            member_name: currentUser.name,
            action: "in",
            description: clockInInput.trim() || undefined
          })
        })
      } catch (notifyErr) {
        console.error("Failed to send clock-in notification:", notifyErr)
      }

      setClockInInput("")
    } catch (err: any) {
      console.error(err)
      alert(`Clock In failed: ${err.message}`)
    }
  }

  const handleClockOut = async () => {
    if (!activeTimecard) return
    try {
      const now = new Date()
      const startTime = new Date(activeTimecard.clock_in)
      const durationMin = Math.max(1, Math.round((now.getTime() - startTime.getTime()) / 60000))

      const { error } = await supabase
        .from("timecards")
        .update({
          clock_out: now.toISOString(),
          duration_minutes: durationMin,
          description: clockInInput
        })
        .eq("id", activeTimecard.id)

      if (error) throw error

      // Securely trigger the Discord notification via our API route
      try {
        await fetch("/api/members/timecard/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            member_name: currentUser.name,
            action: "out",
            description: clockInInput.trim() || undefined,
            duration_minutes: durationMin
          })
        })
      } catch (notifyErr) {
        console.error("Failed to send clock-out notification:", notifyErr)
      }

      setActiveTimecard(null)
      setClockInInput("")
      fetchMemberTimecardHistory()
    } catch (err: any) {
      console.error(err)
      alert(`Clock Out failed: ${err.message}`)
    }
  }

  // --- TASK OPERATIONS ---

  const fetchMemberTasks = async () => {
    if (!currentUser) return
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("assigned_to", currentUser.email?.toLowerCase())
        .order("created_at", { ascending: false })

      if (error) throw error
      setMyTasks(data || [])
    } catch (err) {
      console.error("Error fetching member tasks:", err)
    }
  }

  const handleUpdateTaskStatus = async (taskId: string, currentStatus: string) => {
    const nextStatusMap: Record<string, string> = {
      "Pending": "In Progress",
      "In Progress": "Completed",
      "Completed": "Pending"
    }
    const nextStatus = nextStatusMap[currentStatus] || "Pending"
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ status: nextStatus })
        .eq("id", taskId)

      if (error) throw error
      fetchMemberTasks()
      if (isHrOrAdmin) fetchAdminTasks()
    } catch (err: any) {
      console.error(err)
      alert(`Failed to update task status: ${err.message}`)
    }
  }

  // --- HR / ADMIN TIMECARD & TASK OPERATIONS ---

  const fetchAdminTimesheets = async () => {
    try {
      // First fetch timecards
      const { data: timecards, error } = await supabase
        .from("timecards")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error

      // Join with member profiles manually using Auth User mapping
      const { data: memberProfiles } = await supabase.from("members").select("id, name, role, department")
      
      const hydrated = (timecards || []).map((card: any) => {
        // Fallback matching if profiles map keys differ
        const m = memberProfiles?.find(p => p.id === card.member_id)
        return {
          ...card,
          member: m ? { name: m.name, role: m.role, department: m.department } : { name: "System Admin/Owner", role: "Administrator", department: "HR" }
        }
      })
      setAllTimecards(hydrated)
    } catch (err) {
      console.error("Error loading admin timesheets:", err)
    }
  }

  const handleApproveTimecard = async (id: string, currentApprovalState: boolean) => {
    try {
      const { error } = await supabase
        .from("timecards")
        .update({ approved: !currentApprovalState })
        .eq("id", id)

      if (error) throw error
      fetchAdminTimesheets()
    } catch (err: any) {
      console.error(err)
      alert(`Approval operation failed: ${err.message}`)
    }
  }

  const fetchAdminTasks = async () => {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setAllTasks(data || [])
    } catch (err) {
      console.error("Error loading admin tasks:", err)
    }
  }

  const handleSaveTask = async () => {
    if (!taskForm.title || !taskForm.assigned_to) {
      alert("Please enter a title and select a member to assign the task to.")
      return
    }
    setSavingTask(true)
    try {
      const newTask = {
        title: taskForm.title,
        description: taskForm.description || "",
        assigned_to: taskForm.assigned_to.toLowerCase(),
        assigned_by: currentUser?.id,
        due_date: taskForm.due_date || null,
        status: taskForm.status || "Pending"
      }

      const { error } = await supabase.from("tasks").insert([newTask])
      if (error) throw error
      setIsCreatingTask(false)
      setTaskForm({ status: "Pending" })
      fetchAdminTasks()
    } catch (err: any) {
      console.error(err)
      alert(`Failed to save task: ${err.message}`)
    } finally {
      setSavingTask(false)
    }
  }

  const handleDeleteTask = async (id: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return
    try {
      const { error } = await supabase.from("tasks").delete().eq("id", id)
      if (error) throw error
      fetchAdminTasks()
    } catch (err: any) {
      console.error(err)
      alert(`Failed to delete task: ${err.message}`)
    }
  }

  // --- ORIGINAL ADMIN PORTAL HANDLERS ---

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoggingIn(true)
    setAuthError(false)
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setIsLoggingIn(false)

    if (error) {
      setAuthError(true)
    } else {
      document.cookie = "portal-session=authenticated; path=/; SameSite=Strict; Secure"
      setEmail("")
      setPassword("")
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    document.cookie = "portal-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; Secure"
    setIsAuthenticated(false)
  }

  const fetchMembers = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setMembers(data || [])
    } catch (err: any) {
      console.error(err)
      alert("Error loading members")
    } finally {
      setLoading(false)
    }
  }

  const fetchBlogs = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setBlogs(data || [])
    } catch (err: any) {
      console.error(err)
      alert("Error loading blogs")
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase.from("members").update({ approved: true }).eq("id", id)
      if (error) throw error
      fetchMembers()
    } catch (error) {
      console.error(error)
      alert("Failed to approve.")
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

  const handleRejectOrRemove = async (id: string, isRemove = false) => {
    if (!confirm(isRemove ? "Are you sure you want to remove this approved member?" : "Are you sure you want to reject this pending application?")) return

    try {
      const { data: memberData } = await supabase.from("members").select("image").eq("id", id).maybeSingle()

      const { error } = await supabase.from("members").delete().eq("id", id)
      if (error) throw error

      const avatarPath = extractStoragePath(memberData?.image, "avatar")
      if (avatarPath) {
        supabase.storage.from("avatar").remove([avatarPath]).catch(console.warn)
      }

      fetchMembers()
    } catch (error) {
      console.error(error)
      alert("Failed to process request.")
    }
  }

  const handleEditClick = (member: Member) => {
    setEditingMember(member)
    setEditForm(member)
  }

  const handleSaveEdit = async () => {
    if (!editingMember) return
    setSavingEdit(true)
    try {
      const { error } = await supabase
        .from("members")
        .update({
          name: editForm.name,
          email: editForm.email?.trim().toLowerCase() || null,
          discord_username: editForm.discord_username?.trim() || null,
          role: editForm.role,
          department: editForm.department,
          bio: editForm.bio,
          image: editForm.image,
          socials: editForm.socials
        })
        .eq("id", editingMember.id)

      if (error) throw error
      setEditingMember(null)
      fetchMembers()
    } catch (err) {
      console.error(err)
      alert("Failed to save changes.")
    } finally {
      setSavingEdit(false)
    }
  }

  const handleSaveBlog = async () => {
    setSavingBlog(true)
    try {
      const finalSlug = blogForm.slug || blogForm.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-')

      // Snapshot the linked member's current name into author_name even when author_id is set.
      // Previously author_name was nulled out whenever a member was linked, which meant that if
      // that member was later removed from the members table, the post permanently lost any
      // record of who wrote it (the FK just dangled). Keeping a denormalized text copy means the
      // credit survives regardless of what happens to the members table later.
      const linkedMemberName = blogForm.author_id ? members.find((m) => m.id === blogForm.author_id)?.name : undefined

      const blogData = {
        title: blogForm.title,
        slug: finalSlug,
        excerpt: blogForm.excerpt,
        content: blogForm.content,
        cover_image: blogForm.cover_image,
        topic: blogForm.topic,
        reading_time: blogForm.reading_time,
        // author_id links to a member for a live avatar/bio when they're still a member;
        // author_name is always kept in sync as a permanent text credit either way.
        author_id: blogForm.author_id || null,
        author_name: linkedMemberName || blogForm.author_name || null,
        featured: blogForm.featured || false,
        content_type: (blogForm as any).content_type || "blog",
        policy_type: (blogForm as any).policy_type || null
      }

      let error;
      if (isCreatingBlog) {
        const res = await supabase.from("blogs").insert([blogData])
        error = res.error
      } else if (editingBlog) {
        const res = await supabase.from("blogs").update(blogData).eq("id", editingBlog.id)
        error = res.error
      }

      if (error) throw error
      setEditingBlog(null)
      setIsCreatingBlog(false)
      fetchBlogs()
    } catch (err) {
      console.error(err)
      alert("Failed to save blog.")
    } finally {
      setSavingBlog(false)
    }
  }

  const handleDeleteBlog = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog? This will also delete any uploaded cover image.")) return
    try {
      const { data: blogData } = await supabase.from("blogs").select("cover_image").eq("id", id).maybeSingle()
      const { error } = await supabase.from("blogs").delete().eq("id", id)
      if (error) throw error

      const coverPath = extractStoragePath(blogData?.cover_image, "blog-images")
      if (coverPath) {
        await supabase.storage.from("blog-images").remove([coverPath])
      }

      fetchBlogs()
    } catch (error) {
      console.error(error)
      alert("Failed to delete blog.")
    }
  }

  // Render Login Modal if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 w-full max-w-sm shadow-[0_10px_40px_rgba(0,0,0,0.1)] relative">
          <Link
            href="/"
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </Link>
          <h2 className="text-2xl font-bold font-bricolage mb-6 text-[#1a1a1a]">Portal Login</h2>
          
          {authError && (
            <p className="text-[#c62828] text-sm mb-4">Invalid email or password.</p>
          )}

          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setAuthError(false)
              }}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF7D] mb-4"
              autoFocus
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setAuthError(false)
              }}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF7D] mb-4"
              required
            />
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 bg-[#4CAF7D] hover:bg-[#2d8659] text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoggingIn && <Loader2 className="w-4 h-4 animate-spin" />}
              Login
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-4 text-center">
            Log in with your individual member profile account.
          </p>
        </div>
      </div>
    )
  }

  const pendingMembers = members.filter((m) => !m.approved)
  const approvedMembers = members.filter((m) => m.approved)
  const displayMembers = activeTab === "pending" ? pendingMembers : approvedMembers

  return (
    <div className="container max-w-6xl mx-auto py-12 px-4 relative">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-3xl font-bold font-bricolage text-[#1a1a1a]">
            {isHrOrAdmin ? "HR & Admin Control Center" : "Member Portal"}
          </h1>
          {currentMemberProfile ? (
            <p className="text-sm text-gray-500 mt-1">
              Logged in as <span className="font-semibold text-gray-700">{currentMemberProfile.name}</span> ({currentMemberProfile.role})
            </p>
          ) : (
            <p className="text-sm text-gray-500 mt-1">Logged in as System Admin</p>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="text-[#c62828] hover:text-[#a01a1a] font-semibold border border-red-200 hover:border-red-400 bg-red-50/50 hover:bg-red-50 px-4 py-2 rounded-lg transition-all text-sm"
        >
          Sign Out Portal
        </button>
      </div>

      {/* ADMIN NAVIGATION TABS */}
      {isHrOrAdmin ? (
        <>
          {/* Dashboard Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center transition-all hover:shadow-md">
              <p className="text-gray-500 text-sm font-medium mb-1">Approved Members</p>
              <p className="text-3xl font-bold text-[#1a1a1a]">{stats.approvedMembers}</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center transition-all hover:shadow-md">
              <p className="text-gray-500 text-sm font-medium mb-1">Pending Applications</p>
              <p className="text-3xl font-bold text-[#c62828]">{stats.pendingMembers}</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center transition-all hover:shadow-md">
              <p className="text-gray-500 text-sm font-medium mb-1">Published Blogs</p>
              <p className="text-3xl font-bold text-[#4CAF7D]">{stats.publishedBlogs}</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center transition-all hover:shadow-md">
              <p className="text-gray-500 text-sm font-medium mb-1">Total Events</p>
              <p className="text-3xl font-bold text-blue-600">{stats.totalEvents}</p>
            </div>
          </div>

          <div className="flex gap-4 mb-8 bg-gray-100 p-1 rounded-lg w-fit overflow-x-auto">
            {["members", "blogs", "events", "webinars", "timesheets", "tasks"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveMainTab(tab)}
                className={`px-5 py-2 rounded-md font-semibold text-sm transition-all whitespace-nowrap capitalize ${
                  activeMainTab === tab ? "bg-white text-[#4CAF7D] shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab === "timesheets" ? "Timesheets (Shifts)" : tab === "tasks" ? "Assign Tasks" : `Manage ${tab}`}
              </button>
            ))}
          </div>
        </>
      ) : (
        /* MEMBER NAVIGATION TABS */
        <div className="flex gap-4 mb-8 bg-gray-100 p-1 rounded-lg w-fit overflow-x-auto">
          {[
            { id: "punchcard", label: "Punch Card" },
            { id: "mytasks", label: "My Tasks" },
            { id: "shared", label: "Google Drive & Tools" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveMainTab(tab.id)}
              className={`px-6 py-2 rounded-md font-semibold text-sm transition-all whitespace-nowrap ${
                activeMainTab === tab.id ? "bg-white text-[#4CAF7D] shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* --- RENDER MEMBER VIEWS --- */}

      {/* 1. Punch Card (Clock In/Out) */}
      {!isHrOrAdmin && activeMainTab === "punchcard" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Card Control */}
          <div className="lg:col-span-1 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 relative ${activeTimecard ? "bg-green-50 text-green-500" : "bg-gray-100 text-gray-400"}`}>
              {activeTimecard && (
                <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-25"></span>
              )}
              <Clock className="w-10 h-10" />
            </div>

            {activeTimecard ? (
              <>
                <span className="inline-block bg-green-100 text-green-800 font-bold px-3 py-1 rounded-full text-xs mb-2">CLOCKED IN</span>
                <div className="text-4xl font-mono font-bold text-gray-800 mb-6">{elapsedTime}</div>
                
                <div className="w-full mb-6">
                  <label className="block text-xs font-semibold text-gray-500 text-left mb-1">What did you accomplish?</label>
                  <input
                    type="text"
                    value={clockInInput}
                    onChange={(e) => setClockInInput(e.target.value)}
                    placeholder="E.g., Designed Instagram posters"
                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF7D]"
                  />
                </div>

                <button
                  onClick={handleClockOut}
                  className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Square className="w-4 h-4 fill-white" />
                  Clock Out
                </button>
              </>
            ) : (
              <>
                <span className="inline-block bg-gray-100 text-gray-600 font-semibold px-3 py-1 rounded-full text-xs mb-2">CLOCKED OUT</span>
                <div className="text-4xl font-mono font-bold text-gray-300 mb-6">00:00:00</div>
                
                <button
                  onClick={handleClockIn}
                  className="w-full py-3 bg-[#4CAF7D] hover:bg-[#2d8659] text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Clock In Shift
                </button>
              </>
            )}
          </div>

          {/* Shift History */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold font-bricolage mb-4 text-[#1a1a1a] flex items-center gap-2">
              <Award className="text-[#4CAF7D] w-5 h-5" /> Recent Shifts History
            </h2>
            
            {loading ? (
              <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-[#4CAF7D]" /></div>
            ) : timecardsList.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-sm">No shifts recorded yet. Clock in to log your volunteer hours.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 font-medium">
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Work Log</th>
                      <th className="pb-3 text-right">Duration</th>
                      <th className="pb-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-gray-600">
                    {timecardsList.map((card) => (
                      <tr key={card.id}>
                        <td className="py-3 font-medium text-gray-800">
                          {new Date(card.clock_in).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </td>
                        <td className="py-3 max-w-[200px] truncate" title={card.description || "N/A"}>
                          {card.description || <span className="text-gray-300 italic">No description</span>}
                        </td>
                        <td className="py-3 text-right font-semibold text-gray-700">
                          {Math.round((card.duration_minutes || 0) / 6) / 10} hrs
                        </td>
                        <td className="py-3 text-right">
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${card.approved ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                            {card.approved ? "Approved" : "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. Member Tasks */}
      {!isHrOrAdmin && activeMainTab === "mytasks" && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold font-bricolage mb-6 text-[#1a1a1a] flex items-center gap-2">
            <FileText className="text-[#4CAF7D] w-5 h-5" /> Assigned Tasks Checklist
          </h2>

          {myTasks.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-sm">No tasks currently assigned to you! Check back later.</div>
          ) : (
            <div className="space-y-4">
              {myTasks.map((task) => (
                <div key={task.id} className="p-4 border border-gray-150 rounded-xl hover:border-gray-300 transition-colors flex items-start gap-4 justify-between">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleUpdateTaskStatus(task.id, task.status)}
                      className={`mt-1 flex-shrink-0 transition-transform active:scale-95 ${task.status === "Completed" ? "text-green-500" : "text-gray-300 hover:text-gray-400"}`}
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                    <div>
                      <h3 className={`font-semibold text-[0.95rem] ${task.status === "Completed" ? "line-through text-gray-400" : "text-gray-800"}`}>
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className={`text-sm mt-1 ${task.status === "Completed" ? "text-gray-300" : "text-gray-500"}`}>
                          {task.description}
                        </p>
                      )}
                      {task.due_date && (
                        <span className={`inline-block text-[0.75rem] font-bold mt-2 px-2 py-0.5 rounded ${new Date(task.due_date) < new Date() && task.status !== "Completed" ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-500"}`}>
                          Due {new Date(task.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[0.75rem] font-bold uppercase tracking-wider ${
                      task.status === "Completed" ? "bg-green-100 text-green-800" : task.status === "In Progress" ? "bg-blue-100 text-blue-800" : "bg-amber-100 text-amber-800"
                    }`}>
                      {task.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. Resources Tab */}
      {!isHrOrAdmin && activeMainTab === "shared" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center mb-4">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Team Google Drive</h3>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">Access all community documentation, design templates, and shared folders directly via the central Google Drive workspace link.</p>
            </div>
            <Link
              href={googleDriveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg text-center transition-all flex items-center justify-center gap-2 text-sm"
            >
              Open Google Drive <ExternalLink className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Official Operations Calendar</h3>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">Check deadlines, events schedule, and upcoming department webinars in our central Operations Calendar.</p>
            </div>
            <Link
              href="/events"
              className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-lg text-center transition-all flex items-center justify-center gap-2 text-sm"
            >
              View Events Schedule <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* --- RENDER HR & ADMIN CONTROL VIEWS --- */}

      {/* 4. Timesheets Log Approval */}
      {isHrOrAdmin && activeMainTab === "timesheets" && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center pb-4 mb-6 border-b border-gray-100">
            <h2 className="text-xl font-bold font-bricolage text-[#1a1a1a]">Timesheet Shift Approvals</h2>
          </div>

          {allTimecards.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-sm">No timecard logs submitted for approval.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-250 text-gray-400 font-medium">
                    <th className="pb-3">Member</th>
                    <th className="pb-3">Department/Role</th>
                    <th className="pb-3">Clock In</th>
                    <th className="pb-3 text-right">Hours</th>
                    <th className="pb-3">Work Description</th>
                    <th className="pb-3 text-right">Approve</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-gray-600">
                  {allTimecards.map((card) => (
                    <tr key={card.id}>
                      <td className="py-3">
                        <div className="font-semibold text-gray-800">{card.member?.name}</div>
                      </td>
                      <td className="py-3 text-xs">
                        <div className="text-gray-700">{card.member?.department}</div>
                        <div className="text-gray-400">{card.member?.role}</div>
                      </td>
                      <td className="py-3 text-xs">
                        {card.clock_in ? new Date(card.clock_in).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "N/A"}
                      </td>
                      <td className="py-3 text-right font-semibold">
                        {Math.round((card.duration_minutes || 0) / 6) / 10} hrs
                      </td>
                      <td className="py-3 max-w-[200px] truncate" title={card.description}>
                        {card.description || <span className="text-gray-300 italic">No details</span>}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleApproveTimecard(card.id, card.approved)}
                          className={`px-3 py-1 rounded font-bold text-xs ${card.approved ? "bg-green-150 text-green-700 hover:bg-green-200" : "bg-amber-150 text-amber-700 hover:bg-amber-200"}`}
                        >
                          {card.approved ? "✓ Approved" : "Approve"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 5. Admin Task Assigner */}
      {isHrOrAdmin && activeMainTab === "tasks" && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center pb-4 mb-6 border-b border-gray-100">
            <h2 className="text-xl font-bold font-bricolage text-[#1a1a1a]">Assign Tasks Panel</h2>
            <button
              onClick={() => {
                setTaskForm({ status: "Pending" })
                setIsCreatingTask(true)
              }}
              className="px-4 py-2 bg-[#4CAF7D] hover:bg-[#2d8659] text-white font-semibold rounded-lg transition-colors text-sm"
            >
              + Assign New Task
            </button>
          </div>

          {allTasks.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-sm">No tasks assigned yet. Click Assign New Task to begin.</div>
          ) : (
            <div className="space-y-4">
              {allTasks.map((task) => (
                <div key={task.id} className="p-4 border border-gray-150 rounded-xl flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleUpdateTaskStatus(task.id, task.status)}
                      className={`mt-1 flex-shrink-0 transition-transform active:scale-95 ${task.status === "Completed" ? "text-green-500" : "text-gray-300 hover:text-gray-400"}`}
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                    <div>
                      <h3 className="font-semibold text-gray-800">{task.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <span className="text-xs font-semibold text-gray-400">Assigned To: <span className="text-[#4CAF7D]">{task.assigned_to}</span></span>
                        {task.due_date && (
                          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-medium">Due {new Date(task.due_date).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-[0.7rem] font-bold uppercase tracking-wider ${
                      task.status === "Completed" ? "bg-green-100 text-green-800" : task.status === "In Progress" ? "bg-blue-100 text-blue-800" : "bg-amber-100 text-amber-800"
                    }`}>
                      {task.status}
                    </span>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-red-500 hover:text-red-700 transition-colors p-1"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* --- RENDER ORIGINAL ADMIN TAB CONTENTS (STILL FULLY SUPPORTED) --- */}

      {/* 6. Original Members Tab */}
      {isHrOrAdmin && activeMainTab === "members" && (
        <>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-8">
            <h3 className="text-lg font-bold font-bricolage mb-1.5 text-[#1a1a1a]">Configure Portal Links</h3>
            <p className="text-xs text-gray-500 mb-4">Update the central Google Drive URL accessed by all coordinators.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="url"
                value={googleDriveUrl}
                onChange={(e) => setGoogleDriveUrl(e.target.value)}
                className="flex-1 p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF7D]"
                placeholder="https://drive.google.com/..."
              />
              <button
                onClick={() => handleUpdateDriveUrl(googleDriveUrl)}
                disabled={isSavingUrl}
                className="px-5 py-2.5 bg-[#4CAF7D] hover:bg-[#2d8659] text-white font-semibold rounded-lg text-sm transition-colors disabled:opacity-75"
              >
                {isSavingUrl ? "Saving..." : "Update Link"}
              </button>
            </div>
          </div>

          <div className="flex gap-4 border-b-2 border-gray-200 mb-8">
            <button
              onClick={() => setActiveTab("pending")}
              className={`flex items-center gap-2 px-6 py-3 font-medium text-[0.95rem] border-b-4 transition-colors -mb-[2px] ${
                activeTab === "pending"
                  ? "text-[#4CAF7D] border-[#4CAF7D]"
                  : "text-gray-500 border-transparent hover:text-[#4CAF7D]"
              }`}
            >
              Pending
              <span className="bg-[#4CAF7D] text-white px-2 py-0.5 rounded-full text-xs font-bold">
                {pendingMembers.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("approved")}
              className={`flex items-center gap-2 px-6 py-3 font-medium text-[0.95rem] border-b-4 transition-colors -mb-[2px] ${
                activeTab === "approved"
                  ? "text-[#4CAF7D] border-[#4CAF7D]"
                  : "text-gray-500 border-transparent hover:text-[#4CAF7D]"
              }`}
            >
              Approved
              <span className="bg-[#4CAF7D] text-white px-2 py-0.5 rounded-full text-xs font-bold">
                {approvedMembers.length}
              </span>
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#4CAF7D]" />
              <p>Loading members...</p>
            </div>
          ) : displayMembers.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              No {activeTab} members
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayMembers.map((member) => (
                <div key={member.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col">
                  <img
                    src={member.image || "data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22280%22 height=%22200%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22280%22 height=%22200%22/%3E%3C/svg%3E"}
                    alt={member.name}
                    className="w-full h-[200px] object-cover bg-gray-100"
                  />
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="mb-3">
                      {member.approved ? (
                        <span className="inline-block bg-[#d4edda] text-[#155724] px-2 py-1 rounded text-xs font-bold">
                          APPROVED
                        </span>
                      ) : (
                        <span className="inline-block bg-[#fff3cd] text-[#856404] px-2 py-1 rounded text-xs font-bold">
                          PENDING
                        </span>
                      )}
                    </div>

                    <h3 className="font-bricolage text-[1.1rem] font-semibold text-[#1a1a1a] mb-1">{member.name}</h3>
                    <p className="text-[#4CAF7D] font-medium text-sm mb-1">{member.role}</p>
                    <p className="text-gray-400 text-xs mb-3">{member.department}</p>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">{member.bio}</p>

                    <div className="text-xs text-gray-400 mb-4">
                      Applied {new Date(member.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </div>

                    <div className="mt-auto flex flex-col gap-2 pt-4 border-t border-gray-50">
                      <div className="flex gap-2">
                        {!member.approved ? (
                          <>
                            <button
                              onClick={() => handleApprove(member.id)}
                              className="flex-1 py-2 bg-[#4CAF7D] hover:bg-[#2d8659] text-white text-sm font-semibold rounded transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectOrRemove(member.id, false)}
                              className="flex-1 py-2 bg-[#f5f5f5] hover:bg-[#ffebee] text-[#c62828] border border-gray-200 text-sm font-semibold rounded transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleRejectOrRemove(member.id, true)}
                            className="flex-1 py-2 bg-[#f5f5f5] hover:bg-[#ffebee] text-[#c62828] border border-gray-200 text-sm font-semibold rounded transition-colors"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <button
                        onClick={() => handleEditClick(member)}
                        className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-transparent text-sm font-semibold rounded transition-colors"
                      >
                        Edit Info
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* 7. Original Blogs Tab */}
      {isHrOrAdmin && activeMainTab === "blogs" && (
        <>
          <div className="flex justify-between items-center border-b-2 border-gray-200 pb-4 mb-8">
            <h2 className="text-xl font-semibold text-gray-800">Published Blogs</h2>
            <button
              onClick={() => {
                setBlogForm({})
                setIsCreatingBlog(true)
              }}
              className="px-4 py-2 bg-[#4CAF7D] hover:bg-[#2d8659] text-white font-semibold rounded-lg transition-colors"
            >
              + Create New Blog
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#4CAF7D]" />
              <p>Loading blogs...</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              No blogs found
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <div key={blog.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col">
                  <div className="relative h-[200px] w-full bg-gray-100">
                    <img src={blog.cover_image || "/placeholder.svg"} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="text-xs text-gray-500 mb-2">{new Date(blog.created_at).toLocaleDateString()} • {blog.reading_time}</div>
                    <h3 className="font-bricolage text-[1.1rem] font-semibold text-[#1a1a1a] mb-2">{blog.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">{blog.excerpt}</p>
                    
                    <div className="mt-auto flex gap-2 border-t pt-4 border-gray-50">
                      <button
                        onClick={() => {
                          setEditingBlog(blog)
                          setBlogForm(blog)
                        }}
                        className="flex-1 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-sm rounded transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteBlog(blog.id)}
                        className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-sm rounded transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* 8. Original Events Tab */}
      {isHrOrAdmin && activeMainTab === "events" && <EventsAdmin />}

      {/* 9. Original Webinars Tab */}
      {isHrOrAdmin && activeMainTab === "webinars" && <WebinarsAdmin />}

      {/* --- MODAL POPUPS --- */}

      {/* Edit Member Modal */}
      {editingMember && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <h2 className="text-2xl font-bold font-bricolage mb-6 text-[#1a1a1a]">Edit Member</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={editForm.name || ""}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4CAF7D]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={editForm.email || ""}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4CAF7D]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Discord Username</label>
                  <input
                    type="text"
                    value={editForm.discord_username || ""}
                    onChange={(e) => setEditForm({ ...editForm, discord_username: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4CAF7D]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={editForm.department || ""}
                    onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4CAF7D]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
                  <input
                    type="text"
                    value={editForm.role || ""}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4CAF7D]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Image Path</label>
                <input
                  type="text"
                  value={editForm.image || ""}
                  onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                  placeholder="/logo.png"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4CAF7D]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Bio</label>
                <textarea
                  value={editForm.bio || ""}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4CAF7D]"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">LinkedIn</label>
                  <input
                    type="text"
                    value={editForm.socials?.linkedin || ""}
                    onChange={(e) => setEditForm({ ...editForm, socials: { ...editForm.socials, linkedin: e.target.value } })}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4CAF7D]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Instagram</label>
                  <input
                    type="text"
                    value={editForm.socials?.instagram || ""}
                    onChange={(e) => setEditForm({ ...editForm, socials: { ...editForm.socials, instagram: e.target.value } })}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4CAF7D]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Website</label>
                  <input
                    type="text"
                    value={editForm.socials?.website || ""}
                    onChange={(e) => setEditForm({ ...editForm, socials: { ...editForm.socials, website: e.target.value } })}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4CAF7D]"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setEditingMember(null)}
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded transition-colors"
                disabled={savingEdit}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-6 py-2 bg-[#4CAF7D] hover:bg-[#2d8659] text-white font-semibold rounded transition-colors flex items-center gap-2"
                disabled={savingEdit}
              >
                {savingEdit && <Loader2 className="w-4 h-4 animate-spin" />}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Create Blog Modal */}
      {(isCreatingBlog || editingBlog) && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <h2 className="text-2xl font-bold font-bricolage mb-6 text-[#1a1a1a]">
              {isCreatingBlog ? "Write New Blog" : "Edit Blog"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={blogForm.title || ""}
                  onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4CAF7D]"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Topic</label>
                  <input
                    type="text"
                    value={blogForm.topic || ""}
                    onChange={(e) => setBlogForm({ ...blogForm, topic: e.target.value })}
                    placeholder="Health, Medicine, etc."
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4CAF7D]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Author</label>
                  <select
                    value={blogForm.author_id || ""}
                    onChange={(e) => setBlogForm({ ...blogForm, author_id: e.target.value, author_name: e.target.value ? "" : blogForm.author_name })}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4CAF7D]"
                  >
                    <option value="">— No member selected (use name below) —</option>
                    {members.map(m => (
                      <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
                    ))}
                  </select>
                  {/* Manual author name — for guest authors / non-members (meeting decision) */}
                  {!blogForm.author_id && (
                    <div className="mt-2">
                      <input
                        type="text"
                        value={(blogForm as any).author_name || ""}
                        onChange={(e) => setBlogForm({ ...blogForm, author_name: e.target.value } as any)}
                        placeholder="Or type author name manually (e.g. guest writer)"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4CAF7D] text-sm"
                      />
                      <p className="text-xs text-gray-400 mt-1">Leave blank to show \"Unknown Author\"</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Content Type</label>
                  <select
                    value={(blogForm as any).content_type || "blog"}
                    onChange={(e) => setBlogForm({ ...blogForm, content_type: e.target.value } as any)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4CAF7D]"
                  >
                    <option value="blog">Blog Post</option>
                    <option value="op-ed">Op-Ed</option>
                    <option value="policy">Policy Work</option>
                  </select>
                </div>
                {(blogForm as any).content_type === "policy" && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Policy Type</label>
                    <select
                      value={(blogForm as any).policy_type || "report"}
                      onChange={(e) => setBlogForm({ ...blogForm, policy_type: e.target.value } as any)}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4CAF7D]"
                    >
                      <option value="report">Report</option>
                      <option value="joint-statement">Joint Statement</option>
                      <option value="input">Input / Submission</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ImageUploadField
                  label="Cover Image"
                  bucket="blog-images"
                  pathPrefix="covers"
                  value={blogForm.cover_image || ""}
                  onChange={(url) => setBlogForm({ ...blogForm, cover_image: url })}
                />
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Reading Time</label>
                  <input
                    type="text"
                    value={blogForm.reading_time || ""}
                    onChange={(e) => setBlogForm({ ...blogForm, reading_time: e.target.value })}
                    placeholder="5 min read"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4CAF7D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Excerpt (Short Summary)</label>
                <textarea
                  value={blogForm.excerpt || ""}
                  onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4CAF7D]"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Content (Markdown Supported)</label>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <textarea
                    value={blogForm.content || ""}
                    onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF7D] font-mono text-sm h-[400px] resize-y"
                    placeholder="## Heading\n\nWrite your markdown content here..."
                  />
                  <div className="w-full p-4 border border-gray-200 rounded-lg bg-gray-50 h-[400px] overflow-y-auto prose prose-sm max-w-none prose-green">
                    <ReactMarkdown>{blogForm.content || "*Preview will appear here...*"}</ReactMarkdown>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="featured"
                  checked={!!blogForm.featured}
                  onChange={(e) => setBlogForm({ ...blogForm, featured: e.target.checked })}
                />
                <label htmlFor="featured" className="text-sm font-semibold text-gray-700">Feature this post on the main page</label>
              </div>

            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => {
                  setEditingBlog(null)
                  setIsCreatingBlog(false)
                }}
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded transition-colors"
                disabled={savingBlog}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveBlog}
                className="px-6 py-2 bg-[#4CAF7D] hover:bg-[#2d8659] text-white font-semibold rounded transition-colors flex items-center gap-2"
                disabled={savingBlog}
              >
                {savingBlog && <Loader2 className="w-4 h-4 animate-spin" />}
                {isCreatingBlog ? "Publish Blog" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {isCreatingTask && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold font-bricolage mb-6 text-[#1a1a1a]">Assign Member Task</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Task Title *</label>
                <input
                  type="text"
                  value={taskForm.title || ""}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  placeholder="Task title"
                  className="w-full p-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4CAF7D]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  value={taskForm.description || ""}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  placeholder="Task details and instructions..."
                  className="w-full p-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4CAF7D]"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Assign to Member *</label>
                <select
                  value={taskForm.assigned_to || ""}
                  onChange={(e) => setTaskForm({ ...taskForm, assigned_to: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4CAF7D] bg-white"
                  required
                >
                  <option value="" disabled>Select Member</option>
                  {members.map(m => (
                    <option key={m.id} value={m.email || ""}>{m.name} ({m.email || "No Email"})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={taskForm.due_date || ""}
                  onChange={(e) => setTaskForm({ ...taskForm, due_date: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4CAF7D]"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setIsCreatingTask(false)}
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded transition-colors"
                disabled={savingTask}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTask}
                className="px-6 py-2 bg-[#4CAF7D] hover:bg-[#2d8659] text-white font-semibold rounded transition-colors flex items-center gap-2"
                disabled={savingTask}
              >
                {savingTask && <Loader2 className="w-4 h-4 animate-spin" />}
                Assign Task
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
