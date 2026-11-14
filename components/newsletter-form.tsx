"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useIsMobile } from "@/hooks/use-mobile"

export default function NewsletterForm({
  className = "",
  darkMode = false,
  showFirstName = false,
  compact = false,
}: {
  className?: string
  darkMode?: boolean
  showFirstName?: boolean
  compact?: boolean
}) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const isMobile = useIsMobile()

  // Add useEffect to load ConvertKit script
  useEffect(() => {
    // Check if the script is already loaded
    if (!document.getElementById("ck-script")) {
      const script = document.createElement("script")
      script.id = "ck-script"
      script.src = "https://f.convertkit.com/ckjs/ck.5.js"
      script.async = true
      document.body.appendChild(script)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    // Simulate form submission
    setTimeout(() => {
      router.push("/thank-you")
    }, 500)
  }

  const textColor = darkMode ? "text-white" : "text-[#405862]"
  const inputBgColor = darkMode ? "bg-[#4f6b75]" : "bg-white"
  const inputBorderColor = darkMode ? "border-[#5a7682]" : "border-[#405862]/20"
  const inputTextColor = darkMode ? "text-white" : "text-[#405862]"
  const inputPlaceholderColor = darkMode ? "placeholder:text-white/60" : "placeholder:text-gray-500"
  const linkColor = darkMode ? "text-white/80 hover:text-[#4ecdc4]" : "text-[#405862]/80 hover:text-[#4ecdc4]"

  // Adjust heading sizes for compact mode
  const headingClass = compact
    ? `text-lg font-bold mb-2 ${textColor}`
    : `text-2xl font-bold mb-3 ${textColor} flex items-center`

  const descriptionClass = compact
    ? `mb-3 text-sm ${darkMode ? "text-white/80" : "text-[#405862]/80"}`
    : `mb-5 text-base ${darkMode ? "text-white/80" : "text-[#405862]/80"}`

  // Adjust input padding for mobile
  const inputPadding = isMobile || compact ? "px-3 py-2" : "px-4 py-2.5"
  const buttonPadding = isMobile || compact ? "px-4 py-2" : "px-5 py-2.5"

  return (
    <div className={`w-full ${className}`}>
      <div className="mx-auto max-w-md">
        {!compact && (
          <>
            <h2 className={headingClass}>
              {!compact && <span className="w-2 h-6 bg-[#4ecdc4] mr-3 hidden md:block"></span>}
              Stay Updated
            </h2>
            <p className={descriptionClass}>
              Stay updated on Dr. Interested and new opportunities in wellness careers, policy, and community!
            </p>
          </>
        )}

        <form onSubmit={handleSubmit} className="seva-form formkit-form space-y-2">
          <div data-style="clean">
            <ul className="formkit-alert formkit-alert-error" data-element="errors" data-group="alert"></ul>
            <div data-element="fields" data-stacked="false" className="formkit-fields space-y-2">
              {showFirstName && (
                <>
                  <div className="formkit-field">
                    <input
                      className={`${inputPadding} rounded-md border ${inputBorderColor} ${inputBgColor} ${inputTextColor} ${inputPlaceholderColor} focus:outline-none focus:ring-2 focus:ring-[#4ecdc4] w-full text-sm`}
                      aria-label="First Name"
                      name="fields[first_name]"
                      placeholder="First Name"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="formkit-field">
                    <input
                      className={`${inputPadding} rounded-md border ${inputBorderColor} ${inputBgColor} ${inputTextColor} ${inputPlaceholderColor} focus:outline-none focus:ring-2 focus:ring-[#4ecdc4] w-full text-sm`}
                      aria-label="Last Name"
                      name="fields[last_name]"
                      placeholder="Last Name"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </>
              )}
              <div className="formkit-field">
                <input
                  className={`${inputPadding} rounded-md border ${inputBorderColor} ${inputBgColor} ${inputTextColor} ${inputPlaceholderColor} focus:outline-none focus:ring-2 focus:ring-[#4ecdc4] w-full text-sm`}
                  name="email_address"
                  aria-label="Email Address"
                  placeholder="Email Address"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`formkit-submit formkit-submit bg-[#4ecdc4] hover:bg-[#3dbdb5] text-white ${buttonPadding} rounded-md font-medium w-full flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300 text-sm`}
              >
                <div className="formkit-spinner">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
                <span>{isSubmitting ? "Subscribing..." : "Subscribe"}</span>
              </button>
            </div>
          </div>
          <p className={`text-center text-xs mt-1.5 ${darkMode ? "text-white/60" : "text-[#405862]/60"}`}>
            By subscribing, you agree to our{" "}
            <Link href="/terms" className={`${linkColor} transition-colors underline`}>
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy-policy" className={`${linkColor} transition-colors underline`}>
              Privacy Policy
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
