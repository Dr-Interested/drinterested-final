import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-[#405862]">
      <Loader2 className="w-8 h-8 animate-spin mb-4 text-teal-deep" />
      <p className="text-sm font-medium">Loading content...</p>
    </div>
  )
}
