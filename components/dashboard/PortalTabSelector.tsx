"use client"

type Tab = { id: string; label: string }

/**
 * Portal tab navigation. On phones it's a native <select> (the pill row doesn't fit and
 * horizontal-scrolling tabs are easy to miss); from `sm` up it's the pill row, wrapping to
 * multiple lines rather than running off the edge of the screen.
 */
export default function PortalTabSelector({
  tabs,
  active,
  onSelect,
}: {
  tabs: Tab[]
  active: string
  onSelect: (id: string) => void
}) {
  return (
    <div className="mb-8">
      <select
        value={tabs.some((t) => t.id === active) ? active : tabs[0]?.id}
        onChange={(e) => onSelect(e.target.value)}
        className="sm:hidden w-full p-3 border border-gray-300 rounded-lg text-sm font-semibold bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4CAF7D]"
      >
        {tabs.map((tab) => (
          <option key={tab.id} value={tab.id}>
            {tab.label}
          </option>
        ))}
      </select>

      <div className="hidden sm:flex flex-wrap gap-1.5 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onSelect(tab.id)}
            className={`px-4 py-2 rounded-md font-semibold text-sm transition-all whitespace-nowrap ${
              active === tab.id ? "bg-white text-[#4CAF7D] shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}
