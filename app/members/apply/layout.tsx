import type { Metadata } from "next"

// page.tsx here is a client component ("use client") and can't export metadata, so this
// server layout carries the title/description and — importantly — the self-canonical, which
// otherwise wouldn't be declared for this route.
export const metadata: Metadata = {
  title: "Apply to Join",
  description:
    "Apply to join the Dr. Interested team. Help build wellness career education, policy, and community programs for youth around the world.",
  alternates: {
    canonical: "https://www.drinterested.org/members/apply",
  },
  openGraph: {
    title: "Apply to Join | Dr. Interested",
    description:
      "Apply to join the Dr. Interested team and help build wellness, policy, and community programs for youth worldwide.",
    url: "https://www.drinterested.org/members/apply",
    siteName: "Dr. Interested",
    type: "website",
  },
}

export default function MembersApplyLayout({ children }: { children: React.ReactNode }) {
  return children
}
