import type { Metadata } from "next"

// The member/admin portal (this route and everything under it, e.g. /dashboard/reset-password)
// must never appear in search results — it's a login-gated internal tool, not public content.
// page.tsx here is a client component ("use client"), which can't export its own metadata, so
// this server layout carries it instead. See app/robots.ts for why crawling itself stays allowed.
export const metadata: Metadata = {
  title: "Member Portal",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  alternates: {
    canonical: "https://www.drinterested.org/dashboard",
  },
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children
}
