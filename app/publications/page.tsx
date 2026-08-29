import type { Metadata } from "next"
import { generateSeoMetadata } from "@/lib/seo-utils"
import PublicationsClientPage from "./PublicationsClientPage"
import { getAllPublications } from "@/lib/publications-data"
import { getEpisodesByCategory } from "@/lib/episodes"

export const revalidate = 300; // Revalidate every 5 minutes (ISR)

export const metadata: Metadata = generateSeoMetadata({
  title: "Publications",
  description:
    "Explore Dr. Interested's blog posts, op-eds, and policy work on healthcare education and medical advocacy.",
  url: "https://www.drinterested.org/publications",
  keywords: [
    "healthcare publications",
    "medical policy",
    "op-eds",
    "healthcare research",
    "advocacy",
    "policy statements",
  ],
})

export default async function PublicationsPage() {
  const [{ policyWork, opEds, blogs }, curatedWebinars, curatedPodcasts] = await Promise.all([
    getAllPublications(),
    getEpisodesByCategory("webinar"),
    getEpisodesByCategory("podcast"),
  ])

  // Every list here is the FULL, unsliced set — PublicationsClientPage previews the first 6
  // of each and links out to that category's own subpage for the rest.
  return (
    <PublicationsClientPage
      policyWork={policyWork}
      opEds={opEds}
      blogs={blogs}
      webinars={curatedWebinars}
      podcasts={curatedPodcasts}
    />
  )
}
