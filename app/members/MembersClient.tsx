"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Instagram, Linkedin, Globe, ChevronDown, ChevronUp, Loader2, Sparkles, Clock, Award, FileText, CheckCircle2 } from "lucide-react"
import { departments as staticDepartments } from "@/data/members"
import ScrollToTop from "@/components/scroll-to-top"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/lib/supabase-client"
import { generateSlug } from "@/lib/members-data"

type MemberType = {
  id: string
  slug?: string
  name: string
  role: string
  image: string
  bio: string
  socialLinks?: {
    linkedin?: string
    instagram?: string
    website?: string
    other?: string
  }
}

type PreviousMemberType = {
  id: string
  slug?: string
  name: string
  role: string
  year: number
}

type DepartmentType = {
  id: string
  name: string
  description: string
  director: MemberType[]
  members: MemberType[]
}

export default function MembersClient() {
  const [dbMembers, setDbMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedBios, setExpandedBios] = useState<Record<string, boolean>>({})

  const params = useParams() // { tab: 'leadership' | 'departments' | 'advisors' | 'join' }
  const router = useRouter()

  // Ensure URL tab is valid, fallback to 'leadership'
  const validTabs = ["leadership", "departments", "advisors", "join"]
  const tabParam = Array.isArray(params?.tab) ? params.tab[0] : params?.tab
  const initialTab = validTabs.includes(tabParam || "") ? tabParam! : "leadership"

  const [activeTab, setActiveTab] = useState(initialTab)

  // Fetch approved members from database
  useEffect(() => {
    async function fetchMembers() {
      try {
        const { data, error } = await supabase
          .from("members")
          .select("id, name, role, department, team, bio, image, socials, archived, archived_at")
          .eq("approved", true)
          .order("created_at", { ascending: true })

        if (error) throw error
        // Filter out members with the deprecated "Blog Author" role (meeting decision: remove Blog Author as a distinct tag in the directory)
        const filtered = (data || []).filter(
          (m) => (m.role || "").toLowerCase() !== "blog author"
        )
        setDbMembers(filtered)
      } catch (err) {
        console.error("Error loading database members:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchMembers()
  }, [])

  // Sync tab with URL
  useEffect(() => {
    if (activeTab !== initialTab) {
      router.replace(`/members/${activeTab}`)
    }
  }, [activeTab, initialTab, router])

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [activeTab])

  const toggleBio = (id: string) => {
    setExpandedBios((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const truncateBio = (bio: string, maxLength = 150) => {
    if (!bio) return ""
    if (bio.length <= maxLength) return bio
    return bio.substring(0, maxLength) + "..."
  }

  // Helper to map DB image path to standard web URLs
  const formatImagePath = (img: string | undefined | null) => {
    if (!img) return "/circle-logo.png"
    const clean = img.trim()
    if (!clean || clean === "logo.png" || clean === "/logo.png") return "/circle-logo.png"
    if (clean.startsWith("http")) return clean
    if (clean.startsWith("/")) return clean
    return `/${clean}`
  }

  // Slugs must be generated over the SAME member set used by getAllMembersCombined() in
  // lib/members-data.ts (approved, blog-author excluded, archived included) — that set is
  // what generateSlug's disambiguation ("second person with this exact name") is computed
  // against on the /team/[slug] side, so a duplicate-name member would get a different slug
  // here than there if this used a narrower list. Do NOT swap in activeMembers below.
  const getMemberSlug = (m: MemberType | null | undefined) => {
    if (!m) return ""
    return m.slug || generateSlug(m, dbMembers)
  }

  // The live team roster (leadership/departments/advisors tabs) only ever shows active
  // members; archived ones move down into the "Previous Members" section instead.
  const activeMembers = dbMembers.filter((m) => !m.archived)

  const archivedMembers: PreviousMemberType[] = dbMembers
    .filter((m) => m.archived)
    .map((m) => ({
      id: m.id,
      slug: getMemberSlug(m),
      name: m.name,
      role: m.role,
      year: m.archived_at ? new Date(m.archived_at).getFullYear() : new Date().getFullYear(),
    }))
    .sort((a, b) => a.name.localeCompare(b.name))

  const archivedByYear = archivedMembers.reduce<Record<number, PreviousMemberType[]>>((acc, m) => {
    (acc[m.year] ||= []).push(m)
    return acc
  }, {})
  const archivedYearsDesc = Object.keys(archivedByYear)
    .map(Number)
    .sort((a, b) => b - a)

  // Sub-teams (members.team) are internal-only and never shown here, BUT they're used to keep
  // the two historically-separate public groupings intact after the roster was folded into
  // departments: Ambassadors (now team "Ambassadors Team" under Human Resources) still render
  // as a sub-section inside HR; Podcast (team "Podcast Production Team" under Publications)
  // still fold into Publications like before.
  const isAmbassador = (m: any) =>
    (m.team || "").toLowerCase().includes("ambassador") ||
    (m.department || "").toLowerCase().includes("ambassador") ||
    (m.role || "").toLowerCase().includes("organizational ambassador")

  // Dynamic distribution of members
  // NOTE: Podcast members are routed into Publications (no separate sub-section per meeting decision)
  // NOTE: Ambassadors are excluded from the generic dept match — rendered as a sub-section inside HR
  const getDepartmentMatch = (deptId: string, memberDept: string) => {
    const id = deptId.toLowerCase()
    const mDept = (memberDept || "").toLowerCase()
    if (id === "tech") return mDept.includes("tech")
    if (id === "outreach") return mDept.includes("outreach")
    if (id === "research") return mDept.includes("research")
    if (id === "marketing") return mDept.includes("marketing")
    // Podcast members show under Publications (meeting decision: no separate sub-section)
    if (id === "publications") return mDept.includes("publication") || mDept.includes("podcast")
    // Ambassadors are handled separately inside HR — exclude them from the generic HR match
    if (id === "hr") return (mDept.includes("human resources") || mDept.includes("hr")) && !mDept.includes("ambassador")
    if (id === "events") return mDept.includes("event")
    if (id === "grants") return mDept.includes("grant") || mDept.includes("finance")
    return false
  }

  // Ambassadors — shown as a sub-section inside the HR department card
  const rawAmbassadors = activeMembers.filter(isAmbassador)
  const ambassadorsList: MemberType[] = rawAmbassadors.map((a) => ({
    id: a.id,
    name: a.name,
    role: a.role,
    image: formatImagePath(a.image),
    bio: a.bio || "",
    socialLinks: a.socials || {},
  }))

  // 1. Executive Director / President
  const rawEd = activeMembers.find((m) => m.role === "Executive Director" || m.role === "President")
  const executiveDirector: MemberType | null = rawEd
    ? {
      id: rawEd.id,
      name: rawEd.name,
      role: rawEd.role,
      image: formatImagePath(rawEd.image),
      bio: rawEd.bio || "",
      socialLinks: rawEd.socials || {},
    }
    : null

  // 2. Deputy Executive Directors
  const rawVps = activeMembers.filter((m) => m.role === "Deputy Executive Director")
  const deputyexecdir: MemberType[] = rawVps.map((vp) => ({
    id: vp.id,
    name: vp.name,
    role: vp.role,
    image: formatImagePath(vp.image),
    bio: vp.bio || "",
    socialLinks: vp.socials || {},
  }))

  // 2b. Executive Assistants
  const rawExecAssistants = activeMembers.filter((m) => m.role === "Executive Assistant")
  const executiveAssistantsList: MemberType[] = rawExecAssistants.map((ea) => ({
    id: ea.id,
    name: ea.name,
    role: ea.role,
    image: formatImagePath(ea.image),
    bio: ea.bio || "",
    socialLinks: ea.socials || {},
  }))

  // 3. Advisors
  const rawAdvisors = activeMembers.filter(
    (m) =>
      m.department === "Advisory Board" ||
      m.department === "Advisors" ||
      (m.role || "").toLowerCase().includes("advisor"),
  )
  const advisorsList: MemberType[] = rawAdvisors.map((adv) => ({
    id: adv.id,
    name: adv.name,
    role: adv.role,
    image: formatImagePath(adv.image),
    bio: adv.bio || "",
    socialLinks: adv.socials || {},
  }))

  // 4. Departments
  const departmentsList: DepartmentType[] = staticDepartments.map((staticDept) => {
    const deptMembers = activeMembers.filter(
      (m) => getDepartmentMatch(staticDept.id, m.department) && !(staticDept.id === "hr" && isAmbassador(m))
    )

    // Directors (role contains director or lead)
    const rawDirs = deptMembers.filter((m) => (m.role || "").toLowerCase().includes("director"))
    const directors: MemberType[] = rawDirs.map((dir) => ({
      id: dir.id,
      name: dir.name,
      role: dir.role,
      image: formatImagePath(dir.image),
      bio: dir.bio || "",
      socialLinks: dir.socials || {},
    }))

    // General members (excluding directors)
    const rawMems = deptMembers.filter((m) => !(m.role || "").toLowerCase().includes("director"))
    const members: MemberType[] = rawMems.map((mem) => ({
      id: mem.id,
      name: mem.name,
      role: mem.role,
      image: formatImagePath(mem.image),
      bio: mem.bio || "",
      socialLinks: mem.socials || {},
    }))

    // Filter out any general members that are already listed as directors
    const finalMembers = members.filter(
      (m) => !directors.some((d) => d.id === m.id || d.name.toLowerCase() === m.name.toLowerCase())
    )

    return {
      id: staticDept.id,
      name: staticDept.name,
      description: staticDept.description,
      director: directors,
      members: finalMembers,
    } as any
  })

  const visibleDepartments = departmentsList.filter(
    (dept) => (dept.director && dept.director.length > 0) || (dept.members && dept.members.length > 0)
  )


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-[#405862]">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#4ecdc4]" />
        <p>Loading members...</p>
      </div>
    )
  }

  return (
    <div>
      <ScrollToTop />

      {/* Title Banner */}
      <section className="bg-[#f5f1eb] py-10">
        <div className="container">
          <h1 className="text-3xl font-bold text-center mb-2 text-[#405862] font-bricolage">Our Team</h1>
          <p className="text-center text-[#405862]/90 mb-6 max-w-2xl mx-auto text-sm">
            Meet the talented team behind Dr. Interested, dedicated to inspiring the next generation of healthcare
            professionals.
          </p>
        </div>
      </section>

      {/* Tabs Layout */}
      <section className="py-8 bg-white">
        <div className="container">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">

            {/* Centered Tab Headers */}
            <div className="flex justify-center mb-8">
              <TabsList className="grid grid-cols-4 gap-2 h-12 p-1 max-w-xl">
                <TabsTrigger value="leadership">Leadership</TabsTrigger>
                <TabsTrigger value="departments">Departments</TabsTrigger>
                <TabsTrigger value="advisors">Advisors</TabsTrigger>
                <TabsTrigger
                  value="join"
                  className="bg-[#EDFAF9] text-[#405862] font-semibold px-6 h-10 border border-[#4ecdc4] hover:bg-[#D0F3F0]"
                >
                  Join Us
                </TabsTrigger>
              </TabsList>
            </div>

            {/* TAB: Leadership */}
            <TabsContent value="leadership" className="space-y-6">
              {executiveDirector && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-center text-[#405862] font-bricolage">Executive Director</h3>
                  <div className="max-w-2xl mx-auto">
                    <Card className="overflow-hidden border-[#405862]/20 shadow-sm hover:shadow-md transition-shadow">
                      <div className="grid md:grid-cols-3">
                        <div className="md:col-span-1 bg-[#f5f1eb] flex items-center justify-center">
                          <Link href={`/team/${getMemberSlug(executiveDirector)}`} className="relative h-full w-full aspect-square block group/img">
                            <Image src={executiveDirector.image} alt={executiveDirector.name} fill sizes="(max-width: 768px) 100vw, 300px" className="object-cover group-hover/img:scale-105 transition-transform" />
                          </Link>
                        </div>
                        <CardContent className="md:col-span-2 p-4">
                          <Link href={`/team/${getMemberSlug(executiveDirector)}`} className="inline-block hover:text-[#4ecdc4] transition-colors">
                            <h4 className="text-lg font-semibold text-[#405862] font-bricolage hover:text-[#4ecdc4]">{executiveDirector.name}</h4>
                          </Link>
                          <p className="text-sm text-[#4ecdc4] font-medium mb-2">{executiveDirector.role}</p>
                          <p className="text-sm text-[#405862]/90 leading-relaxed mb-3">
                            {expandedBios[executiveDirector.id] ? (executiveDirector.bio || "") : truncateBio(executiveDirector.bio)}
                          </p>
                          {(executiveDirector.bio || "").length > 150 && (
                            <button
                              onClick={() => toggleBio(executiveDirector.id)}
                              className="text-[#405862] text-sm font-semibold hover:text-[#4ecdc4] transition-colors mb-3 flex items-center"
                            >
                              {expandedBios[executiveDirector.id] ? (
                                <>
                                  Show Less <ChevronUp className="h-4 w-4 ml-1" />
                                </>
                              ) : (
                                <>
                                  See More <ChevronDown className="h-4 w-4 ml-1" />
                                </>
                              )}
                            </button>
                          )}
                          <div className="flex space-x-3">
                            {executiveDirector.socialLinks?.linkedin && (
                              <Link
                                href={executiveDirector.socialLinks.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#405862] hover:text-[#4ecdc4] transition-colors"
                              >
                                <Linkedin className="h-5 w-5" />
                              </Link>
                            )}
                            {executiveDirector.socialLinks?.instagram && (
                              <Link
                                href={executiveDirector.socialLinks.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#405862] hover:text-[#4ecdc4] transition-colors"
                              >
                                <Instagram className="h-5 w-5" />
                              </Link>
                            )}
                            {executiveDirector.socialLinks?.website && (
                              <Link
                                href={executiveDirector.socialLinks.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#405862] hover:text-[#4ecdc4] transition-colors"
                              >
                                <Globe className="h-5 w-5" />
                              </Link>
                            )}
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {/* Deputy Exec Directors */}
              {deputyexecdir && deputyexecdir.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-center text-[#405862] font-bricolage">Deputy Executive Directors</h3>
                  <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                    {deputyexecdir.map((vp) => {
                      if (!vp) return null;
                      return (
                        <Card key={vp.id} className="overflow-hidden border-[#405862]/20 shadow-sm hover:shadow-md transition-shadow">
                          <div className="grid md:grid-cols-3">
                            <div className="md:col-span-1 bg-[#f5f1eb] flex items-center justify-center">
                              <Link href={`/team/${getMemberSlug(vp)}`} className="relative h-full w-full aspect-square block group/img">
                                <Image src={vp.image} alt={vp.name} fill sizes="(max-width: 768px) 100vw, 300px" className="object-cover group-hover/img:scale-105 transition-transform" />
                              </Link>
                            </div>
                            <CardContent className="md:col-span-2 p-4">
                              <Link href={`/team/${getMemberSlug(vp)}`} className="inline-block hover:text-[#4ecdc4] transition-colors">
                                <h4 className="text-base font-semibold text-[#405862] font-bricolage hover:text-[#4ecdc4]">{vp.name}</h4>
                              </Link>
                              <p className="text-sm text-[#4ecdc4] font-medium mb-2">{vp.role}</p>
                              <p className="text-sm text-[#405862]/90 leading-relaxed mb-3">
                                {expandedBios[vp.id] ? (vp.bio || "") : truncateBio(vp.bio, 120)}
                              </p>
                              {(vp.bio || "").length > 120 && (
                                <button
                                  onClick={() => toggleBio(vp.id)}
                                  className="text-[#405862] text-sm font-semibold hover:text-[#4ecdc4] transition-colors mb-3 flex items-center"
                                >
                                  {expandedBios[vp.id] ? (
                                    <>
                                      Show Less <ChevronUp className="h-4 w-4 ml-1" />
                                    </>
                                  ) : (
                                    <>
                                      See More <ChevronDown className="h-4 w-4 ml-1" />
                                    </>
                                  )}
                                </button>
                              )}
                              <div className="flex space-x-3">
                                {vp.socialLinks?.linkedin && (
                                  <Link href={vp.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                                    <Linkedin className="h-5 w-5" />
                                  </Link>
                                )}
                                {vp.socialLinks?.instagram && (
                                  <Link href={vp.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                                    <Instagram className="h-5 w-5" />
                                  </Link>
                                )}
                                {vp.socialLinks?.website && (
                                  <Link href={vp.socialLinks.website} target="_blank" rel="noopener noreferrer">
                                    <Globe className="h-5 w-5" />
                                  </Link>
                                )}
                              </div>
                            </CardContent>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Executive Assistants */}
              {executiveAssistantsList && executiveAssistantsList.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-center text-[#405862] font-bricolage">Executive Assistants</h3>
                  <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                    {executiveAssistantsList.map((ea) => {
                      if (!ea) return null;
                      return (
                        <Card key={ea.id} className="overflow-hidden border-[#405862]/20 shadow-sm hover:shadow-md transition-shadow">
                          <div className="grid md:grid-cols-3">
                            <div className="md:col-span-1 bg-[#f5f1eb] flex items-center justify-center">
                              <Link href={`/team/${getMemberSlug(ea)}`} className="relative h-full w-full aspect-square block group/img">
                                <Image src={ea.image} alt={ea.name} fill sizes="(max-width: 768px) 100vw, 300px" className="object-cover group-hover/img:scale-105 transition-transform" />
                              </Link>
                            </div>
                            <CardContent className="md:col-span-2 p-4">
                              <Link href={`/team/${getMemberSlug(ea)}`} className="inline-block hover:text-[#4ecdc4] transition-colors">
                                <h4 className="text-base font-semibold text-[#405862] font-bricolage hover:text-[#4ecdc4]">{ea.name}</h4>
                              </Link>
                              <p className="text-sm text-[#4ecdc4] font-medium mb-2">{ea.role}</p>
                              <p className="text-sm text-[#405862]/90 leading-relaxed mb-3">
                                {expandedBios[ea.id] ? (ea.bio || "") : truncateBio(ea.bio, 120)}
                              </p>
                              {(ea.bio || "").length > 120 && (
                                <button
                                  onClick={() => toggleBio(ea.id)}
                                  className="text-[#405862] text-sm font-semibold hover:text-[#4ecdc4] transition-colors mb-3 flex items-center"
                                >
                                  {expandedBios[ea.id] ? (
                                    <>
                                      Show Less <ChevronUp className="h-4 w-4 ml-1" />
                                    </>
                                  ) : (
                                    <>
                                      See More <ChevronDown className="h-4 w-4 ml-1" />
                                    </>
                                  )}
                                </button>
                              )}
                              <div className="flex space-x-3">
                                {ea.socialLinks?.linkedin && (
                                  <Link href={ea.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                                    <Linkedin className="h-5 w-5" />
                                  </Link>
                                )}
                                {ea.socialLinks?.instagram && (
                                  <Link href={ea.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                                    <Instagram className="h-5 w-5" />
                                  </Link>
                                )}
                                {ea.socialLinks?.website && (
                                  <Link href={ea.socialLinks.website} target="_blank" rel="noopener noreferrer">
                                    <Globe className="h-5 w-5" />
                                  </Link>
                                )}
                              </div>
                            </CardContent>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              {!executiveDirector && (!deputyexecdir || deputyexecdir.length === 0) && (!executiveAssistantsList || executiveAssistantsList.length === 0) && (
                <div className="text-center py-12 text-[#405862]/80">
                  <p>No leadership team members currently listed.</p>
                </div>
              )}
            </TabsContent>

            {/* TAB: Departments */}
            <TabsContent value="departments" className="space-y-6">
              {visibleDepartments.length > 0 ? (
                visibleDepartments.map((department) => {
                  if (!department) return null;
                  const hasDirector = department.director && department.director.length > 0;
                  const hasMembers = department.members && department.members.length > 0;

                  return (
                    <div
                      key={department.id}
                      className="border rounded-lg overflow-hidden bg-white border-[#405862]/20 shadow-sm mb-4"
                    >
                      <div className="p-4 border-b bg-[#f5f1eb]/30">
                        <h3 className="text-lg font-semibold text-[#405862] font-bricolage">{department.name}</h3>
                        <p className="text-[#405862]/80 text-sm mt-1">{department.description}</p>
                      </div>

                      {hasDirector && (
                        <div className="p-4 border-b">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-base font-semibold text-[#405862] font-bricolage">Director</h4>
                          </div>
                          <div className="grid gap-4 md:grid-cols-2">
                            {department.director.map((director: MemberType) => {
                              if (!director) return null;
                              return (
                                <Card
                                  key={director.id}
                                  className="overflow-hidden border-[#405862]/20 shadow-sm hover:shadow-md transition-shadow"
                                >
                                  <div className="grid grid-cols-3">
                                    <div className="col-span-1 bg-[#f5f1eb]">
                                      <Link href={`/team/${getMemberSlug(director)}`} className="relative h-full w-full aspect-square block group/img">
                                        <Image
                                          src={director.image}
                                          alt={director.name}
                                          fill
                                          sizes="(max-width: 768px) 33vw, 150px"
                                          className="object-cover group-hover/img:scale-105 transition-transform"
                                        />
                                      </Link>
                                    </div>
                                    <CardContent className="col-span-2 p-3">
                                      <Link href={`/team/${getMemberSlug(director)}`} className="inline-block hover:text-[#4ecdc4] transition-colors">
                                        <h5 className="font-semibold text-sm text-[#405862] font-bricolage hover:text-[#4ecdc4]">{director.name}</h5>
                                      </Link>
                                      <p className="text-xs text-[#4ecdc4] font-medium mb-1">{director.role}</p>
                                      <p className="text-xs text-[#405862]/90 leading-relaxed mb-1">
                                        {expandedBios[director.id] ? (director.bio || "") : truncateBio(director.bio, 80)}
                                      </p>
                                      {(director.bio || "").length > 80 && (
                                        <button
                                          onClick={() => toggleBio(director.id)}
                                          className="text-[#405862] text-xs font-semibold hover:text-[#4ecdc4] transition-colors mb-1 flex items-center"
                                        >
                                          {expandedBios[director.id] ? (
                                            <>
                                              Show Less <ChevronUp className="h-3 w-3 ml-1" />
                                            </>
                                          ) : (
                                            <>
                                              See More <ChevronDown className="h-3 w-3 ml-1" />
                                            </>
                                          )}
                                        </button>
                                      )}
                                      <div className="flex space-x-2">
                                        {director.socialLinks?.linkedin && (
                                          <Link
                                            href={director.socialLinks.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#405862] hover:text-[#4ecdc4] transition-colors"
                                          >
                                            <Linkedin className="h-4 w-4" />
                                          </Link>
                                        )}
                                        {director.socialLinks?.instagram && (
                                          <Link
                                            href={director.socialLinks.instagram}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#405862] hover:text-[#4ecdc4] transition-colors"
                                          >
                                            <Instagram className="h-4 w-4" />
                                          </Link>
                                        )}
                                      </div>
                                    </CardContent>
                                  </div>
                                </Card>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {hasMembers && (
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-base font-semibold text-[#405862] font-bricolage"> Members</h4>
                          </div>

                          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                            {department.members.map((member: MemberType) => {
                              if (!member) return null;
                              return (
                                <Card
                                  key={member.id}
                                  className="overflow-hidden border-[#405862]/20 shadow-sm hover:shadow-md transition-shadow"
                                >
                                  <CardContent className="p-3">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Link href={`/team/${getMemberSlug(member)}`} className="relative h-8 w-8 rounded-full overflow-hidden flex-shrink-0 group/img">
                                        <Image
                                          src={member.image}
                                          alt={member.name}
                                          fill
                                          sizes="32px"
                                          className="object-cover group-hover/img:scale-110 transition-transform"
                                        />
                                      </Link>
                                      <div>
                                        <Link href={`/team/${getMemberSlug(member)}`} className="inline-block hover:text-[#4ecdc4] transition-colors">
                                          <h5 className="font-semibold text-sm text-[#405862] font-bricolage hover:text-[#4ecdc4]">{member.name}</h5>
                                        </Link>
                                        <p className="text-xs text-[#405862]/75">{member.role}</p>
                                      </div>
                                    </div>
                                    <p className="text-xs text-[#405862]/90 leading-relaxed mb-1">
                                      {expandedBios[member.id] ? (member.bio || "") : truncateBio(member.bio, 60)}
                                    </p>
                                    {(member.bio || "").length > 60 && (
                                      <button
                                        onClick={() => toggleBio(member.id)}
                                        className="text-[#405862] text-xs font-semibold hover:text-[#4ecdc4] transition-colors mb-1 flex items-center"
                                      >
                                        {expandedBios[member.id] ? (
                                          <>
                                            Show Less <ChevronUp className="h-3 w-3 ml-1" />
                                          </>
                                        ) : (
                                          <>
                                            See More <ChevronDown className="h-3 w-3 ml-1" />
                                          </>
                                        )}
                                      </button>
                                    )}
                                    <div className="flex space-x-2 mt-1">
                                      {member.socialLinks?.linkedin && (
                                        <Link
                                          href={member.socialLinks.linkedin}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-[#405862] hover:text-[#4ecdc4] transition-colors"
                                        >
                                          <Linkedin className="h-4 w-4" />
                                        </Link>
                                      )}
                                      {member.socialLinks?.instagram && (
                                        <Link
                                          href={member.socialLinks.instagram}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-[#405862] hover:text-[#4ecdc4] transition-colors"
                                        >
                                          <Instagram className="h-4 w-4" />
                                        </Link>
                                      )}
                                    </div>
                                  </CardContent>
                                </Card>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Ambassadors sub-section — shown inside HR department only (meeting decision) */}
                      {department.id === "hr" && ambassadorsList.length > 0 && (
                        <div className="p-4 border-t border-[#405862]/10">
                          <div className="flex items-center gap-2 mb-3">
                            <h4 className="text-sm font-semibold text-[#405862]/80 font-bricolage">Organizational Ambassadors</h4>
                            <span className="text-[10px] bg-[#4ecdc4]/15 text-[#405862] px-1.5 py-0.5 rounded-full font-medium border border-[#4ecdc4]/25">
                              Sub-team
                            </span>
                          </div>
                          <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
                            {ambassadorsList.map((ambassador) => {
                              if (!ambassador) return null;
                              return (
                                <div
                                  key={ambassador.id}
                                  className="flex items-center gap-2 p-2 rounded-lg bg-[#f5f1eb]/40 border border-[#405862]/10 hover:border-[#4ecdc4]/40 transition-colors"
                                >
                                  <Link href={`/team/${getMemberSlug(ambassador)}`} className="relative h-7 w-7 rounded-full overflow-hidden flex-shrink-0 group/img">
                                    <Image
                                      src={ambassador.image}
                                      alt={ambassador.name}
                                      fill
                                      sizes="28px"
                                      className="object-cover group-hover/img:scale-110 transition-transform"
                                    />
                                  </Link>
                                  <div className="min-w-0">
                                    <Link href={`/team/${getMemberSlug(ambassador)}`} className="block hover:text-[#4ecdc4] transition-colors">
                                      <p className="font-medium text-xs text-[#405862] hover:text-[#4ecdc4] truncate font-bricolage">{ambassador.name}</p>
                                    </Link>
                                    <p className="text-[10px] text-[#405862]/60 truncate">{ambassador.role}</p>
                                  </div>
                                  {(ambassador.socialLinks?.linkedin || ambassador.socialLinks?.instagram) && (
                                    <div className="flex gap-1 ml-auto shrink-0">
                                      {ambassador.socialLinks?.linkedin && (
                                        <Link href={ambassador.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-[#405862]/50 hover:text-[#4ecdc4] transition-colors">
                                          <Linkedin className="h-3 w-3" />
                                        </Link>
                                      )}
                                      {ambassador.socialLinks?.instagram && (
                                        <Link href={ambassador.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-[#405862]/50 hover:text-[#4ecdc4] transition-colors">
                                          <Instagram className="h-3 w-3" />
                                        </Link>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 text-[#405862]/80">
                  <p>No department members currently listed.</p>
                </div>
              )}

              <div className="mt-8 p-6 bg-[#4ecdc4]/10 border border-[#4ecdc4]/30 rounded-lg text-center">
                <h3 className="text-lg font-semibold text-[#405862] mb-2 font-bricolage">Interested in Joining Our Team?</h3>
                <p className="text-[#405862]/80 mb-3">
                  Check out the <span className="font-semibold text-[#4ecdc4]">Join Us</span> tab above to learn about
                  executive opportunities and apply to join our leadership team!
                </p>
                <p className="text-sm text-[#405862]/70">
                  Applications are open year-round and reviewed on an ongoing basis.
                </p>
              </div>
            </TabsContent>

            {/* TAB: Advisors */}
            <TabsContent value="advisors" className="space-y-6">
              {advisorsList && advisorsList.length > 0 ? (
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-center text-[#405862] font-bricolage">Medical Student Advisors</h3>
                  <p className="text-center text-[#405862]/80 mb-6 max-w-2xl mx-auto text-sm">
                    Our medical student advisors provide valuable guidance and mentorship, helping bridge the gap between
                    high school and medical education.
                  </p>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {advisorsList.map((advisor) => {
                      if (!advisor) return null;
                      return (
                        <Card
                          key={advisor.id}
                          className="overflow-hidden border-[#405862]/20 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="bg-[#f5f1eb] flex items-center justify-center p-4">
                            <Link href={`/team/${getMemberSlug(advisor)}`} className="relative h-32 w-32 rounded-full overflow-hidden block group/img">
                              <Image
                                src={advisor.image}
                                alt={advisor.name}
                                fill
                                sizes="128px"
                                className="object-cover group-hover/img:scale-105 transition-transform"
                              />
                            </Link>
                          </div>
                          <CardContent className="p-4">
                            <Link href={`/team/${getMemberSlug(advisor)}`} className="inline-block hover:text-[#4ecdc4] transition-colors">
                              <h4 className="text-base font-semibold text-[#405862] font-bricolage hover:text-[#4ecdc4]">{advisor.name}</h4>
                            </Link>
                            <p className="text-sm text-[#4ecdc4] font-medium mb-2">{advisor.role}</p>
                            <p className="text-sm text-[#405862]/90 leading-relaxed mb-3">
                              {expandedBios[advisor.id] ? (advisor.bio || "") : truncateBio(advisor.bio, 120)}
                            </p>
                            {(advisor.bio || "").length > 120 && (
                              <button
                                onClick={() => toggleBio(advisor.id)}
                                className="text-[#405862] text-sm font-semibold hover:text-[#4ecdc4] transition-colors mb-3 flex items-center"
                              >
                                {expandedBios[advisor.id] ? (
                                  <>
                                    Show Less <ChevronUp className="h-4 w-4 ml-1" />
                                  </>
                                ) : (
                                  <>
                                    See More <ChevronDown className="h-4 w-4 ml-1" />
                                  </>
                                )}
                              </button>
                            )}
                            <div className="flex space-x-3">
                              {advisor.socialLinks?.linkedin && (
                                <Link
                                  href={advisor.socialLinks.linkedin}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#405862] hover:text-[#4ecdc4] transition-colors"
                                >
                                  <Linkedin className="h-5 w-5" />
                                </Link>
                              )}
                              {advisor.socialLinks?.instagram && (
                                <Link
                                  href={advisor.socialLinks.instagram}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#405862] hover:text-[#4ecdc4] transition-colors"
                                >
                                  <Instagram className="h-5 w-5" />
                                </Link>
                              )}
                              {advisor.socialLinks?.website && (
                                <Link
                                  href={advisor.socialLinks.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#405862] hover:text-[#4ecdc4] transition-colors"
                                >
                                  <Globe className="h-5 w-5" />
                                </Link>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-[#405862]/80">
                  <p>No advisors currently listed.</p>
                </div>
              )}
              <div className="mt-8 p-6 bg-[#4ecdc4]/10 border border-[#4ecdc4]/30 rounded-lg text-center">
                <h3 className="text-lg font-semibold text-[#405862] mb-2 font-bricolage">Interested in Joining Our Team?</h3>
                <p className="text-[#405862]/80 mb-3">
                  Check out the <span className="font-semibold text-[#4ecdc4]">Join Us</span> tab above to learn about
                  executive opportunities and apply to join our leadership team!
                </p>
                <p className="text-sm text-[#405862]/70">
                  Applications are open year-round and reviewed on an ongoing basis.
                </p>
              </div>
            </TabsContent>

            {/* TAB: Join Us */}
            <TabsContent value="join" className="space-y-6">

              {/* Detailed Recruitment Intro */}
              <div className="bg-[#f5f1eb]/40 border border-[#405862]/10 rounded-xl p-6 md:p-8 space-y-4 max-w-4xl mx-auto text-sm md:text-base text-[#405862]/90 leading-relaxed">
                <h3 className="text-xl md:text-2xl font-bold text-[#405862] font-bricolage text-center mb-4">
                  Join Our Executive Team
                </h3>
                <p>
                  Dr. Interested is a global youth organization active in <strong>106 countries</strong>,
                  reaching <strong>160,000+ students</strong> worldwide. We operate fully online through Discord,
                  with optional in-person opportunities depending on your city.
                </p>
                <p>
                  We’re recruiting across nearly every field right now — Finance, Tech, Coding, Design,
                  Outreach, Events, and Healthcare Careers Education. If you like building things that matter,
                  there’s a seat for you.
                </p>
                <p className="font-semibold text-[#405862]">
                  This isn’t busywork. You’ll be part of a global team that moves fast,
                  leads real projects, and creates impact you can point to proudly.
                </p>
              </div>

              {/* Grid: What You Get & UN / Canada Opportunities */}
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto pt-4">

                {/* Benefits */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-base md:text-lg font-bold text-[#405862] font-bricolage mb-4 flex items-center gap-2">
                      <Sparkles className="h-4.5 w-4.5 text-[#4ecdc4]" />
                      What You Get
                    </h4>
                    <ul className="space-y-3.5">
                      {[
                        "Experience working with an international organization that strengthens your résumé",
                        "Letters of recommendation from medical students",
                        "Free tickets to represent us at conferences (merit-based)",
                        "Verified volunteer hours",
                        "Real skill growth in leadership, collaboration, and execution"
                      ].map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <CheckCircle2 className="h-4.5 w-4.5 text-[#4ecdc4] shrink-0 mt-0.5" />
                          <span className="text-xs md:text-sm text-[#405862]/95 font-medium">
                            {benefit}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Canada Opportunities */}
                  <div className="p-5 bg-[#f5f1eb]/30 rounded-xl border border-[#405862]/10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <h4 className="font-bold text-[#405862] font-bricolage text-sm md:text-base">
                        Extra Opportunities <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-[#405862]/10 rounded text-[#405862] ml-1">Worldwide · Under 30</span>
                      </h4>
                      <div className="relative w-20 h-6 shrink-0">
                        <Image src="/glocal.webp" alt="GLOCAL Foundation Logo" fill sizes="80px" className="object-contain" />
                      </div>
                    </div>
                    <p className="text-[11px] text-[#405862]/70 mb-3 italic">
                      Global youth opportunities with support from the GLOCAL Foundation.
                    </p>
                    <ul className="space-y-2.5">
                      {[
                        "Apply for microgrants or travel grants to grow your ideas and showcase your work",
                        "Access 100+ virtual workshops and in-person events every year with civic leaders and mentors across Canada",
                        "After 120 service hours, earn a National Service Recognition Certificate signed by the Honourable Patty Hajdu, Minister of Employment, Workforce Development and Official Languages of Canada"
                      ].map((opp, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Award className="h-4 w-4 text-[#4ecdc4] shrink-0 mt-0.5" />
                          <span className="text-xs text-[#405862]/95 leading-relaxed">
                            {opp}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* UN & Commitment */}
                <div className="space-y-6">
                  <Card className="border-[#4ecdc4]/35 bg-[#EDFAF9]/20 overflow-hidden shadow-sm">
                    <div className="h-1 bg-[#4ecdc4] w-full" />
                    <CardContent className="p-5 space-y-3">
                      <span className="bg-[#4ecdc4]/20 text-[#405862] font-bold text-[10px] uppercase px-1.5 py-0.5 rounded tracking-wide inline-block">
                        New Opportunity
                      </span>
                      <h4 className="text-base font-bold text-[#405862] font-bricolage flex items-center gap-2">
                        <FileText className="h-4.5 w-4.5 text-[#4ecdc4]" />
                        Policy & Global Research
                      </h4>
                      <p className="text-xs md:text-sm text-[#405862]/95 leading-relaxed">
                        As an executive, you’ll have the opportunity to contribute directly to our policy and research reports. One of our current projects is a report for the <strong>United Nations High Commissioner on Human Rights</strong>.
                      </p>
                      <p className="text-xs md:text-sm text-[#405862]/95 leading-relaxed">
                        Executives who contribute will be credited by name, and the final report will be published on the official United Nations Human Rights website.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-[#405862]/10 bg-[#f5f1eb]/20 shadow-sm">
                    <CardContent className="p-4 flex items-start gap-3">
                      <Clock className="h-6 w-6 text-[#405862] shrink-0 mt-0.5" />
                      <div>
                        <h5 className="font-bold text-[#405862] text-xs md:text-sm font-bricolage">
                          Time Commitment
                        </h5>
                        <p className="text-xs md:text-sm text-[#405862]/90 font-medium mt-0.5">
                          6 months &bull; ~2 hours/week
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

              </div>

              {/* Grid: 3 Open Application Role Cards */}
              <div className="max-w-4xl mx-auto pt-6">
                <div className="grid md:grid-cols-3 gap-4">

                  {/* General Executive */}
                  <Card className="border-[#405862]/20 hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full bg-white">
                    <CardContent className="p-5 text-center flex flex-col flex-1 justify-between gap-5">
                      <div>
                        <h5 className="font-bold text-sm text-[#405862] font-bricolage">
                          General Executive
                        </h5>
                        <p className="text-xs text-[#405862]/75 leading-relaxed mt-2">
                          Join our core leadership team and help shape the future of Dr. Interested at a global scale.
                        </p>
                      </div>
                      <Link
                        href="https://forms.gle/UMyitptfyXvdSCtz7"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full"
                      >
                        <Button className="w-full bg-[#405862] hover:bg-[#334852] text-white py-3.5 text-xs font-semibold transition-colors">
                          Apply Now
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  {/* Org Ambassador */}
                  <Card className="border-[#405862]/20 hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full bg-white">
                    <CardContent className="p-5 text-center flex flex-col flex-1 justify-between gap-5">
                      <div>
                        <h5 className="font-bold text-sm text-[#405862] font-bricolage">
                          Org Ambassador
                        </h5>
                        <p className="text-xs text-[#405862]/75 leading-relaxed mt-2">
                          Represent Dr. Interested in your community and help expand our impact worldwide.
                        </p>
                      </div>
                      <Link
                        href="https://forms.gle/UMyitptfyXvdSCtz7"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full"
                      >
                        <Button className="w-full bg-[#405862] hover:bg-[#334852] text-white py-3.5 text-xs font-semibold transition-colors">
                          Apply Now
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  {/* Podcast Team */}
                  <Card className="border-[#405862]/20 hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full bg-white">
                    <CardContent className="p-5 text-center flex flex-col flex-1 justify-between gap-5">
                      <div>
                        <h5 className="font-bold text-sm text-[#405862] font-bricolage">
                          Podcast Team
                        </h5>
                        <p className="text-xs text-[#405862]/75 leading-relaxed mt-2">
                          Create engaging podcast content and amplify healthcare stories from around the world.
                        </p>
                      </div>
                      <Link
                        href="https://forms.gle/UMyitptfyXvdSCtz7"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full"
                      >
                        <Button className="w-full bg-[#405862] hover:bg-[#334852] text-white py-3.5 text-xs font-semibold transition-colors">
                          Apply Now
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                </div>
              </div>

              {/* Questions Support footer */}
              <div className="text-center pt-8">
                <p className="text-xs md:text-sm text-[#405862]/80">
                  Have questions about joining our team?{" "}
                  <Link
                    href="mailto:hr@drinterested.org"
                    className="text-[#4ecdc4] hover:text-[#405862] font-semibold transition-colors underline underline-offset-4"
                  >
                    Contact us at hr@drinterested.org
                  </Link>
                </p>
              </div>

            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Previous Members — archived members (completed their term), grouped by the year they
          left. Text-only: no photo, just a clickable name so their /team/[slug] page (bio +
          publication credit) stays reachable. Only shown on the Departments tab. */}
      {activeTab === "departments" && archivedMembers.length > 0 && (
        <section className="py-10 bg-[#f5f1eb]/30 border-t border-[#405862]/10">
          <div className="container">
            <h2 className="text-xl font-bold text-center mb-6 text-[#405862] font-bricolage">Previous Members</h2>
            <div className="max-w-3xl mx-auto space-y-4">
              {archivedYearsDesc.map((year) => (
                <div key={year}>
                  <h3 className="text-sm font-semibold text-[#405862]/70 mb-1">{year}</h3>
                  <p className="text-sm text-[#405862]/90 leading-relaxed">
                    {archivedByYear[year].map((m, i) => (
                      <span key={m.id}>
                        <Link
                          href={`/team/${m.slug}`}
                          className="text-[#405862] hover:text-[#4ecdc4] font-medium transition-colors"
                        >
                          {m.name}
                        </Link>
                        {" - "}
                        {m.role}
                        {i < archivedByYear[year].length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
