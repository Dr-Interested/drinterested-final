"use client"

import { useState, useCallback } from "react"
import { supabase } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import Cropper from "react-easy-crop"

const DEPARTMENTS = [
  "Admin Team",
  "Medical Student Advisory Council",
  "Marketing",
  "Publications",
  "HR",
  "Events",
  "Technology",
  "Finance",
  "Podcast",
  "Ambassadors"
]

const ROLES_BY_DEPARTMENT: Record<string, string[]> = {
  "Admin Team": [
    "Executive Director",
    "Deputy Executive Director",
    "Executive Assistant"
  ],
  "Medical Student Advisory Council": [
    "Chair of the Medical Student Advisory Council",
    "Member of the Medical Student Advisory Council"
  ],
  "Marketing": ["Director", "Deputy Director", "Coordinator"],
  "Publications": ["Director", "Deputy Director", "Coordinator"],
  "HR": ["Director", "Deputy Director", "Coordinator"],
  "Events": ["Director", "Deputy Director", "Coordinator"],
  "Technology": ["Director", "Deputy Director", "Coordinator"],
  "Finance": ["Director", "Deputy Director", "Coordinator"],
  "Podcast": ["Deputy Director", "Member of Podcast"],
  "Ambassadors": ["Deputy Director", "Organizational Ambassador"],
}

const getCroppedImg = async (imageSrc: string, pixelCrop: any): Promise<File> => {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new globalThis.Image()
    img.src = imageSrc
    img.onload = () => resolve(img)
    img.onerror = (error) => reject(error)
  })
  
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error("No 2d context")

  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  )

  let targetWidth = pixelCrop.width
  let targetHeight = pixelCrop.height
  const MAX_SIZE = 800
  if (targetWidth > MAX_SIZE) {
    targetHeight *= MAX_SIZE / targetWidth
    targetWidth = MAX_SIZE
  }
  
  const resizeCanvas = document.createElement('canvas')
  resizeCanvas.width = targetWidth
  resizeCanvas.height = targetHeight
  const resizeCtx = resizeCanvas.getContext('2d')
  resizeCtx?.drawImage(canvas, 0, 0, targetWidth, targetHeight)

  return new Promise((resolve, reject) => {
    resizeCanvas.toBlob((blob) => {
      if (!blob) reject(new Error("Canvas is empty"))
      else resolve(new File([blob], `avatar-${Date.now()}.webp`, { type: "image/webp" }))
    }, "image/webp", 0.85)
  })
}

export default function DbApplyPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [selectedRole, setSelectedRole] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Cropper State
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [showCropper, setShowCropper] = useState(false)
  const [finalCroppedFile, setFinalCroppedFile] = useState<File | null>(null)

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        setImageSrc(reader.result as string)
        setShowCropper(true)
      }
    }
  }

  const handleSaveCrop = async () => {
    if (!imageSrc || !croppedAreaPixels) return
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels)
      setFinalCroppedFile(croppedImage)
      setShowCropper(false)
    } catch (e) {
      console.error(e)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const formData = new FormData(e.currentTarget)

    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." })
      setLoading(false)
      return
    }

    // Server-side length validation
    const nameVal = formData.get("name") as string
    const bioVal = formData.get("bio") as string
    if (nameVal.trim().length < 2) {
      setMessage({ type: "error", text: "Full name must be at least 2 characters." })
      setLoading(false)
      return
    }
    if (nameVal.length > 100) {
      setMessage({ type: "error", text: "Full name must be under 100 characters." })
      setLoading(false)
      return
    }
    if (bioVal.trim().length < 10) {
      setMessage({ type: "error", text: "Bio must be at least 10 characters." })
      setLoading(false)
      return
    }
    if (bioVal.length > 2000) {
      setMessage({ type: "error", text: "Bio must be under 2000 characters." })
      setLoading(false)
      return
    }
    
    if (!finalCroppedFile) {
      setMessage({ type: "error", text: "Please select and crop a profile image" })
      setLoading(false)
      return
    }

    if (finalCroppedFile.size > 2.5 * 1024 * 1024) {
      setMessage({ type: "error", text: "Image size exceeds 2.5 MB limit even after compression" })
      setLoading(false)
      return
    }

    let imageUrl = ""
    try {
      // crypto.randomUUID() is cryptographically secure — makes storage URLs unguessable
      const fileName = `${crypto.randomUUID()}.webp`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("avatar")
        .upload(fileName, finalCroppedFile)

      if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`)

      const { data: { publicUrl } } = supabase.storage
        .from("avatar")
        .getPublicUrl(fileName)
        
      imageUrl = publicUrl
    } catch (err: any) {
      console.error("Image upload error:", err)
      setMessage({ type: "error", text: err.message || "Failed to upload image" })
      setLoading(false)
      return
    }

    // Role is one of the presets from ROLES_BY_DEPARTMENT — no free text. Sub-teams are
    // assigned later in the portal by a director/HR (members don't know their sub-team yet).
    const finalRole = formData.get("role") as string

    const newMember = {
      name: formData.get("name") as string,
      email: (formData.get("email") as string).trim().toLowerCase(),
      discord_username: (formData.get("discord_username") as string).trim(),
      role: finalRole,
      department: formData.get("department") as string,
      bio: formData.get("bio") as string,
      image: imageUrl,
      socials: {
        website: (formData.get("website") as string).trim() || null,
        linkedin: (formData.get("linkedin") as string).trim() || null,
        instagram: (formData.get("instagram") as string).trim() || null,
      },
      approved: false,
    }

    try {
      const validateSocialUrl = (urlStr: string | null) => {
        if (!urlStr) return
        const parsed = new URL(urlStr)
        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
          throw new Error("Social links must use http:// or https:// protocol.")
        }
      }

      validateSocialUrl(newMember.socials.website)
      validateSocialUrl(newMember.socials.linkedin)
      validateSocialUrl(newMember.socials.instagram)
      
      // Register credentials in Supabase Auth
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: newMember.email,
        password: password,
      })

      if (signUpError) {
        throw new Error(`Authentication signup failed: ${signUpError.message}`)
      }

      const { error } = await supabase.from("members").insert([newMember])

      if (error) throw error

      // Securely trigger the Discord webhook notification via our Next.js API route
      try {
        await fetch("/api/members/apply/notify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newMember),
        })
      } catch (notifyErr) {
        // Log notification error but don't fail the user application submission UX
        console.error("Discord notification failed to send:", notifyErr)
      }

      setMessage({ type: "success", text: "✓ Application submitted successfully! We'll review it soon." })
      ;(e.target as HTMLFormElement).reset()
      setSelectedDepartment("")
      setSelectedRole("")
      setPassword("")
      setConfirmPassword("")
      setFinalCroppedFile(null)
      setImageSrc(null)
    } catch (err: any) {
      console.error(err)
      setMessage({ type: "error", text: `Error: ${err.message || "Invalid input"}` })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-2xl py-12 mx-auto px-4">
      <h1 className="text-3xl font-bold font-bricolage mb-2 text-[#1a1a1a]">Apply to Join</h1>
      <p className="text-gray-600 mb-8">Help us build an interesting community. Tell us about yourself.</p>

      {message && (
        <div
          className={`p-4 rounded-lg mb-6 ${
            message.type === "success" ? "bg-[#e8f5e9] text-[#2e7d32] border border-[#81c784]" : "bg-[#ffebee] text-[#c62828] border border-[#ef5350]"
          }`}
        >
          {message.text}
        </div>
      )}

      {showCropper && imageSrc && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white p-4 rounded-xl w-full max-w-lg flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4 font-bricolage">Crop your avatar</h2>
            <div className="relative w-full h-64 sm:h-80 bg-gray-100 rounded-lg overflow-hidden mb-4">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            <div className="w-full mb-6">
              <label className="text-sm font-medium text-gray-600 mb-2 block">Zoom</label>
              <input 
                type="range" 
                value={zoom} 
                min={1} 
                max={3} 
                step={0.1} 
                aria-labelledby="Zoom" 
                onChange={(e) => setZoom(Number(e.target.value))} 
                className="w-full" 
              />
            </div>
            <div className="flex gap-4 w-full">
              <Button onClick={() => setShowCropper(false)} variant="outline" className="flex-1">Cancel</Button>
              <Button onClick={handleSaveCrop} className="flex-1 bg-[#4CAF7D] hover:bg-[#2d8659]">Save Crop</Button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block font-medium mb-1 text-[#1a1a1a]">Full Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF7D] focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label htmlFor="email" className="block font-medium mb-1 text-[#1a1a1a]">Email Address *</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF7D] focus:border-transparent transition-all"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="password" className="block font-medium mb-1 text-[#1a1a1a]">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF7D] focus:border-transparent transition-all"
              placeholder="Min. 6 characters"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block font-medium mb-1 text-[#1a1a1a]">Confirm Password *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF7D] focus:border-transparent transition-all"
              placeholder="Re-type password"
            />
          </div>
        </div>

        <div>
          <label htmlFor="discord_username" className="block font-medium mb-1 text-[#1a1a1a]">Discord Username *</label>
          <input
            type="text"
            id="discord_username"
            name="discord_username"
            placeholder="e.g. username"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF7D] focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label htmlFor="department" className="block font-medium mb-1 text-[#1a1a1a]">Department *</label>
          <select
            id="department"
            name="department"
            required
            value={selectedDepartment}
            onChange={(e) => {
              setSelectedDepartment(e.target.value)
              setSelectedRole("")
            }}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF7D] focus:border-transparent transition-all bg-white"
          >
            <option value="">Select a department</option>
            {DEPARTMENTS.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="role" className="block font-medium mb-1 text-[#1a1a1a]">Role *</label>
          {selectedDepartment && ROLES_BY_DEPARTMENT[selectedDepartment] ? (
            <select
              id="role"
              name="role"
              required
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF7D] focus:border-transparent transition-all bg-white"
            >
              <option value="">Select a role</option>
              {ROLES_BY_DEPARTMENT[selectedDepartment].map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              id="role"
              name="role"
              placeholder="Select a department first"
              disabled
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF7D] focus:border-transparent transition-all bg-gray-50 text-gray-500"
            />
          )}
        </div>

        <div>
          <label htmlFor="bio" className="block font-medium mb-1 text-[#1a1a1a]">Bio *</label>
          <textarea
            id="bio"
            name="bio"
            placeholder="Tell us about yourself, your interests, and what you'd like to contribute..."
            required
            className="w-full p-3 border border-gray-300 rounded-lg min-h-[100px] resize-y focus:outline-none focus:ring-2 focus:ring-[#4CAF7D] focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label htmlFor="image" className="block font-medium mb-1 text-[#1a1a1a]">Profile Image (Max 2.5 MB) *</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleFileChange}
            required={!finalCroppedFile}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF7D] focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#e8f5e9] file:text-[#2e7d32] hover:file:bg-[#c8e6c9] bg-white cursor-pointer"
          />
          {finalCroppedFile && (
            <div className="mt-2 text-sm text-green-600 font-medium flex items-center gap-2">
              ✓ Image cropped and compressed ready for upload
            </div>
          )}
        </div>

        <div className="space-y-4">
          <label className="block font-medium text-[#1a1a1a]">Social Links (optional)</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="website" className="block text-sm mb-1 text-gray-600">Personal Website</label>
              <input
                type="url"
                id="website"
                name="website"
                placeholder="https://yourwebsite.com"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF7D] focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label htmlFor="linkedin" className="block text-sm mb-1 text-gray-600">LinkedIn</label>
              <input
                type="url"
                id="linkedin"
                name="linkedin"
                placeholder="https://linkedin.com/in/username"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF7D] focus:border-transparent transition-all"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="instagram" className="block text-sm mb-1 text-gray-600">Instagram</label>
              <input
                type="url"
                id="instagram"
                name="instagram"
                placeholder="https://instagram.com/username"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF7D] focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-[#4CAF7D] hover:bg-[#2d8659] text-white font-semibold text-lg rounded-lg transition-transform active:scale-95"
        >
          {loading ? "Submitting..." : "Submit Application"}
        </Button>
      </form>
    </div>
  )
}
