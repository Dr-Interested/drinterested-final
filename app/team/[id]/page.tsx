import type { Metadata } from "next"
import { notFound } from "next/navigation"
import SeoSchema from "@/components/seo-schema"
import MemberCard from "@/components/members/MemberCard"
import { getUnifiedMemberById } from "@/lib/members-data"

const baseUrl = "https://www.drinterested.org"

const truncate = (text: string, maxLength = 160) =>
  text.length > maxLength ? `${text.slice(0, maxLength - 3)}...` : text

export const dynamic = "force-dynamic"
export const revalidate = 3600 // revalidate every hour

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const member = await getUnifiedMemberById(id)

  if (!member) {
    return {
      title: "Member Not Found | Dr. Interested",
      robots: { index: false, follow: false },
    }
  }

  const description = truncate(
    member.bio || `${member.name} is ${member.role} at Dr. Interested - inspiring youth in healthcare careers.`
  )
  const imageUrl = member.image.startsWith("http") ? member.image : `${baseUrl}${member.image}`
  const url = `${baseUrl}/team/${member.id}`

  // Build keyword list from name, role parts, and org
  const roleKeywords = member.role.split(/[-|,]/g).map((s) => s.trim()).filter(Boolean)
  const keywords = [
    member.name,
    member.role,
    ...roleKeywords,
    "Dr. Interested",
    "Dr. Interested team",
    "healthcare education",
    "medical education",
    "youth healthcare",
    "student organization",
  ]

  return {
    title: `${member.name} - ${member.role} | Dr. Interested`,
    description,
    keywords,
    authors: [{ name: member.name, url }],
    category: "People",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: `${member.name} | ${member.role} - Dr. Interested`,
      description,
      url,
      siteName: "Dr. Interested",
      type: "profile",
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: `${member.name} - ${member.role} at Dr. Interested`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${member.name} | ${member.role} - Dr. Interested`,
      description,
      images: [imageUrl],
      creator: "@DrInterested",
      site: "@DrInterested",
    },
    alternates: {
      canonical: url,
    },
  }
}

export default async function MemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const member = await getUnifiedMemberById(id)

  if (!member) {
    notFound()
  }

  const sameAs = member.socials
    ? Object.values(member.socials).filter(Boolean)
    : []
  const memberUrl = `${baseUrl}/team/${member.id}`
  const memberImage = member.image.startsWith("http") ? member.image : `${baseUrl}${member.image}`

  // schema.org/Person — rich Google Knowledge Panel signals
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${memberUrl}#person`,
    name: member.name,
    jobTitle: member.role,
    image: {
      "@type": "ImageObject",
      url: memberImage,
      width: 800,
      height: 800,
      caption: `${member.name} - ${member.role} at Dr. Interested`,
    },
    url: memberUrl,
    description: member.bio || undefined,
    affiliation: {
      "@type": "Organization",
      "@id": `${baseUrl}#organization`,
      name: "Dr. Interested",
      url: baseUrl,
    },
    worksFor: {
      "@type": "Organization",
      "@id": `${baseUrl}#organization`,
      name: "Dr. Interested",
      url: baseUrl,
    },
    sameAs: sameAs.length ? sameAs : undefined,
    mainEntityOfPage: {
      "@type": "ProfilePage",
      "@id": memberUrl,
      name: `${member.name} | Dr. Interested`,
      description: member.bio || undefined,
      url: memberUrl,
      image: memberImage,
    },
  }

  // Standalone BreadcrumbList for Google rich results
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Our Team",
        item: `${baseUrl}/members`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: member.name,
        item: memberUrl,
      },
    ],
  }

  return (
    <main className="min-h-screen bg-[#f5f1eb]/60 py-8">
      <SeoSchema schema={personSchema} />
      <SeoSchema schema={breadcrumbSchema} />
      <div className="container mx-auto">
        <MemberCard member={member} />
      </div>
    </main>
  )
}
