"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { supabase } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import Cropper from "react-easy-crop"
import { APPLY_DEPARTMENTS, APPLY_ROLES_BY_DEPARTMENT } from "@/lib/apply-options"
import { errorMessage } from "@/lib/errors"
import Link from "next/link"

const DEPARTMENTS = APPLY_DEPARTMENTS
const ROLES_BY_DEPARTMENT = APPLY_ROLES_BY_DEPARTMENT

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
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null)
  const messageRef = useRef<HTMLDivElement>(null)

  // The result message renders above the form, so on a phone (where Submit is far below) bring
  // it into view, otherwise it looks like nothing happened.
  useEffect(() => {
    if (message) messageRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
  }, [message])

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

    if (password.length < 8) {
      setMessage({ type: "error", text: "Password must be at least 8 characters." })
      setLoading(false)
      return
    }
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
      
      const { error: uploadError } = await supabase.storage
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
      
      // Register credentials in Supabase Auth. The confirmation email's link lands on the
      // portal login rather than the homepage.
      const { error: signUpError } = await supabase.auth.signUp({
        email: newMember.email,
        password: password,
        options: { emailRedirectTo: `${window.location.origin}/dashboard?login=true` },
      })

      if (signUpError) {
        throw new Error(`Account creation failed: ${signUpError.message}`)
      }

      // The members row is validated and saved server-side (it also notifies staff on Discord).
      const res = await fetch("/api/members/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMember),
      })
      const result = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(result.error || "We couldn't submit your application. Please try again.")

      setSubmittedEmail(newMember.email)
      window.scrollTo({ top: 0, behavior: "smooth" })
      ;(e.target as HTMLFormElement).reset()
      setSelectedDepartment("")
      setSelectedRole("")
      setPassword("")
      setConfirmPassword("")
      setFinalCroppedFile(null)
      setImageSrc(null)
    } catch (err) {
      console.error(err)
      setMessage({ type: "error", text: errorMessage(err) || "Something went wrong. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  // After a successful submit the form is replaced by this, so nobody can miss that the
  // application still needs an admin's approval and that the approval arrives by email.
  if (submittedEmail) {
    const steps = [
      {
        title: "Confirm your email",
        body: (
          <>
            We just sent a confirmation link to <strong className="break-all">{submittedEmail}</strong>. Click it so we
            know the address is yours (check your spam folder if you don&apos;t see it).
          </>
        ),
      },
      {
        title: "Wait for approval",
        body: <>An admin reviews every application. Until it&apos;s approved, you won&apos;t be able to use the member portal.</>,
      },
      {
        title: "Watch for your approval email",
        body: (
          <>
            We&apos;ll email you as soon as your application is approved. Then you can sign in to the portal with this email
            and the password you just chose.
          </>
        ),
      },
    ]
    return (
      <div className="container max-w-2xl py-12 mx-auto px-4">
        <div role="status" className="bg-white border border-[#81c784] rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-[#e8f5e9] text-[#2e7d32] flex items-center justify-center text-2xl font-bold mb-4">
            ✓
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-bricolage mb-2 text-[#1a1a1a]">Application received!</h1>
          <p className="text-gray-600 mb-6">
            Thanks for applying to Dr. Interested. <strong>Your application now needs to be approved by an admin</strong>, and
            we&apos;ll email you once it is.
          </p>
          <ol className="space-y-4 mb-8">
            {steps.map((step, i) => (
              <li key={step.title} className="flex gap-3">
                <span className="shrink-0 w-7 h-7 rounded-full bg-[#4CAF7D] text-white text-sm font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold text-[#1a1a1a]">{step.title}</p>
                  <p className="text-sm text-gray-600">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <Link
            href="/"
            className="inline-block w-full sm:w-auto text-center px-6 py-3 bg-[#4CAF7D] hover:bg-[#2d8659] text-white font-semibold rounded-lg transition-colors"
          >
            Back to the homepage
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-2xl py-12 mx-auto px-4">
      <h1 className="text-3xl font-bold font-bricolage mb-2 text-[#1a1a1a]">Apply to Join</h1>
      <p className="text-gray-600 mb-8">Help us build an interesting community. Tell us about yourself.</p>

      {message && (
        <div
          ref={messageRef}
          role={message.type === "error" ? "alert" : "status"}
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
            autoComplete="name"
            maxLength={100}
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
            autoComplete="email"
            autoCapitalize="none"
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
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF7D] focus:border-transparent transition-all"
              placeholder="Min. 8 characters"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block font-medium mb-1 text-[#1a1a1a]">Confirm Password *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              autoComplete="new-password"
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
            autoCapitalize="none"
            autoCorrect="off"
            maxLength={40}
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
            minLength={10}
            maxLength={2000}
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

        <p className="text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg p-3">
          After you apply, an admin reviews your application. <strong>We&apos;ll email you once it&apos;s approved</strong>, and
          then you can sign in to the member portal.
        </p>

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
