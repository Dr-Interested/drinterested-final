import type { Metadata } from "next"
import { ALL_TIME, IMPACT_REPORT_2025, IMPACT_REPORT_2026, LEGAL_STATUS, ORG_ONE_LINER, YEAR_2026 } from "@/lib/impact-stats"

export interface SEOConfig {
  title: string
  description: string
  keywords?: string[]
  image?: string
  url?: string
  type?: "website" | "article"
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
  /**
   * A short, comma-separated list of the article's core topics (Google's legacy
   * news_keywords meta tag — still an optional signal for Top Stories eligibility on
   * timely content). Distinct from the general `keywords` list, which is longer/broader.
   */
  newsKeywords?: string[]
}

export function generateSeoMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    image = "/websitebanner.jpg",
    url,
    type = "website",
    publishedTime,
    modifiedTime,
    author,
    section,
    newsKeywords,
  } = config

  const metadata: Metadata = {
    title,
    description,
    keywords: keywords.join(", "),
    openGraph: {
      title,
      description,
      type: type === "article" ? "article" : "website",
      url,
      images: [
        {
          url: image,
          width: image === "/android-chrome-512x512.png" ? 512 : 1200,
          height: image === "/android-chrome-512x512.png" ? 512 : 630,
          alt: title,
        },
      ],
      siteName: "Dr. Interested",
      locale: "en_US",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@DrInterested",
    },
  }

  if (type === "article" && publishedTime) {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: "article",
      publishedTime,
      modifiedTime,
      authors: author ? [author] : undefined,
      section,
    }
  }

  if (url) {
    metadata.alternates = {
      canonical: url,
    }
  }

  if (newsKeywords && newsKeywords.length > 0) {
    metadata.other = {
      ...metadata.other,
      news_keywords: newsKeywords.join(", "),
    }
  }

  return metadata
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Dr. Interested",
    alternateName: ["Dr Interested", "Doctor Interested", "Dr. Int"],
    description: `${ORG_ONE_LINER} Across 2025 and 2026 we have impacted ${ALL_TIME.youthImpacted} youth in ${ALL_TIME.countries} countries and territories, with ${ALL_TIME.members} members and ${ALL_TIME.executives} executives. ${LEGAL_STATUS.short}`,
    url: "https://www.drinterested.org",
    logo: "https://www.drinterested.org/android-chrome-512x512.png",
    image: "https://www.drinterested.org/websitebanner.jpg",
    foundingDate: "2024",
    founder: {
      "@type": "Person",
      name: "Adil Mukhi",
      jobTitle: "Founder & Executive Director",
      url: "https://adilmukhi.vercel.app/",
    },
    // Our nonprofit work runs through our sister organization, a fiscally sponsored 501(c)(3).
    parentOrganization: {
      "@type": "NGO",
      name: "Future Interested",
      description: LEGAL_STATUS.fiscalSponsor,
    },
    sameAs: [
      "https://www.instagram.com/dr.interested/",
      "https://www.linkedin.com/company/dr-interested/",
      "https://www.youtube.com/@Dr.Interested",
      "https://open.spotify.com/show/6SLlRUL6co6fPxckAdrigf",
      "https://discord.gg/pzbGRgsGXY",
      "https://www.facebook.com/profile.php?id=61572438387454",
      "https://www.threads.com/@dr.interested",
      "https://bsky.app/profile/drinterested.org",
      "https://x.com/Dr_Interested_",
      "https://www.tiktok.com/@dr.interested",
      "https://mastodon.social/@drinterested",
      "https://www.reddit.com/r/drinterested/",
      "https://github.com/Dr-Interested",
      "https://linktr.ee/dr.interested",
      LEGAL_STATUS.unProfile,
      "https://www.idealist.org/en/community/d61c52b27f234069a12a07d87a5ce523-dr-interested-toronto",
      "https://hundred.org/en/innovations/dr-interested",
      "https://www.learning-planet.org/organisation/dr-interested/",
      "https://www.researchgate.net/lab/Dr-Interested-Pre-Med-Org-Adil-Mukhi",
      "https://zenodo.org/communities/drinterested",
      "https://ca.trustpilot.com/review/drinterested.org",
      // Only profiles on other websites belong in sameAs; the organization's own sites are
      // listed under hasPart below.
    ],
    hasPart: [
      {
        "@type": "WebSite",
        name: "Dr. Interested Impact",
        url: "https://impact.drinterested.org",
      },
      {
        "@type": "WebSite",
        name: "Dr. Interested Impact News",
        url: "https://news.impact.drinterested.org",
      },
      {
        "@type": "WebSite",
        name: "Simmon Chang Chess (Against Cancer) Club",
        url: "https://chess.drinterested.org",
        description:
          "The Dr. Interested Simmon Chang Chess (Against Cancer) Club — tournaments and initiatives supporting pediatric cancer research.",
      },
      {
        "@type": "WebSite",
        name: "Dr. Interested — Links",
        url: "https://link.drinterested.org",
        description:
          "The official Dr. Interested link-in-bio hub — every social profile, program, publication, and policy in one place.",
      },
      {
        "@type": "Report",
        name: IMPACT_REPORT_2026.title,
        url: IMPACT_REPORT_2026.url,
        datePublished: IMPACT_REPORT_2026.published,
        description: `${YEAR_2026.youthImpacted} youth impacted in 2026 (${ALL_TIME.youthImpacted} across 2025 and 2026), ${ALL_TIME.members} members in ${ALL_TIME.countries} countries and territories, ${ALL_TIME.executives} executives, ${ALL_TIME.volunteerHours} volunteer hours, and ${ALL_TIME.impressions} impressions.`,
      },
      {
        "@type": "Report",
        name: IMPACT_REPORT_2025.title,
        url: IMPACT_REPORT_2025.web,
        datePublished: "2025",
      },
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "General Inquiry",
        email: "admin@drinterested.org",
      },
      {
        "@type": "ContactPoint",
        contactType: "Human Resources",
        email: "hr@drinterested.org",
      },
      {
        "@type": "ContactPoint",
        contactType: "Finance & Sponsorships",
        email: "finance@drinterested.org",
      },
      {
        "@type": "ContactPoint",
        contactType: "Outreach",
        email: "outreach@drinterested.org",
      },
      {
        "@type": "ContactPoint",
        contactType: "Media Inquiries",
        email: "admin@drinterested.org",
      },
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: "Global",
    },
    slogan: "A year of youth led change and impact",
    // Volunteer executives (no paid staff).
    numberOfEmployees: {
      "@type": "QuantitativeValue",
      value: Number(YEAR_2026.executives),
    },
    memberOf: [
      { "@type": "Organization", name: "Imagine Canada" },
      { "@type": "Organization", name: "Development and Peace" },
      { "@type": "Organization", name: "National Canadian Youth Council (NCYC)" },
    ],
    knowsAbout: [
      "Youth Wellness",
      "Wellness Career Education",
      "Healthcare Careers",
      "Law Careers",
      "Finance Careers",
      "Youth Participation in Policy",
      "Youth Mentorship",
      "Youth Research and Publishing",
      "Safe Online Communities for Youth",
      "UN Convention on the Rights of the Child",
      "Sustainable Development Goals",
    ],
    areaServed: {
      "@type": "Place",
      name: "Worldwide",
    },
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "Youth aged 13 to 24",
    },
  }
}

export function generateArticleSchema(article: {
  title: string
  description: string
  author: string
  publishedDate: string
  modifiedDate?: string
  image?: string
  url: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    author: {
      "@type": "Person",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Dr. Interested",
      logo: {
        "@type": "ImageObject",
        url: "https://www.drinterested.org/android-chrome-512x512.png",
      },
    },
    datePublished: article.publishedDate,
    dateModified: article.modifiedDate || article.publishedDate,
    image: article.image || "https://www.drinterested.org/android-chrome-512x512.png",
    url: article.url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": article.url,
    },
  }
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
