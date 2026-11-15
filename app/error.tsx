"use client"

import Link from "next/link"

/**
 * MED-2: Root error boundary.
 * Catches any unhandled error in the app (Supabase failures, network errors, etc.)
 * and shows a recoverable UI instead of Next.js's default unstyled crash page.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="container py-24 flex items-center justify-center min-h-screen">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-[#4ecdc4]/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">⚠️</span>
        </div>
        <h1 className="text-2xl font-bold text-[#405862] mb-3 font-bricolage">
          Something went wrong
        </h1>
        <p className="text-[#405862]/85 mb-8 text-sm leading-relaxed">
          We had trouble loading this page. This is usually a temporary issue — try refreshing or go back to the home page.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-2.5 bg-[#4ecdc4] hover:bg-[#3dbdb5] text-white font-semibold rounded-lg transition-colors text-sm"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-6 py-2.5 border border-[#405862]/20 text-[#405862] hover:bg-[#f5f1eb] font-semibold rounded-lg transition-colors text-sm"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}
