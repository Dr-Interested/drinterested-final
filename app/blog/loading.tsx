export default function Loading() {
  return (
    <div className="container py-16 flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-4 text-[#405862]/85">
        <div className="w-8 h-8 border-4 border-[#4ecdc4] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium">Loading articles...</p>
      </div>
    </div>
  )
}
