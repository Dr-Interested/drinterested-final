import type { Metadata } from "next"
import VolunteerAgreementClientPage from "@/components/volunteer-agreement/client"

// Portal-only by design — not linked from the footer, not in the sitemap, and explicitly
// noindexed, same treatment as /dashboard itself. Only reachable via the link inside the
// authenticated portal header.
export const metadata: Metadata = {
  title: "Volunteer Agreement",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
}

export default function VolunteerAgreementPage() {
  return <VolunteerAgreementClientPage />
}
