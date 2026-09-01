import type { Metadata } from "next"

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
    description:
      "A youth-led global pre-med community helping students explore the vast world of healthcare, research, and advocacy. We support youth in finding their unique 'spark' in medicine through interactive programs, publishing opportunities, and leadership development.",
    url: "https://www.drinterested.org",
    logo: "https://www.drinterested.org/android-chrome-512x512.png",
    image: "https://www.drinterested.org/websitebanner.jpg",
    foundingDate: "2024",
    founder: {
      "@type": "Person",
      name: "Adil Mukhi",
      jobTitle: "Founder & Executive Director",
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
      "https://news.impact.drinterested.org/",
      "https://www.drinterested.org/annualreport2025.pdf",
      "https://impact.drinterested.org/2025/annual",
      "https://impact.drinterested.org",
      "https://chess.drinterested.org/",
      "https://link.drinterested.org",
    ],
    hasPart: [
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
        "@type": "WebSite",
        "name": "2025 Annual Impact Report",
        "url": "https://impact.drinterested.org/2025/annual",
        "description": "Dr. Interested's 2025 Annual Impact Report showcasing impact metrics including 160,000+ youth impacted, 106 countries reached, 1,400+ members, 20+ events, 400+ mentor hours, and 900 volunteers.",
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
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: "Global",
    },
    slogan: "Inspiring the Next Generation of Healthcare Professionals",
    numberOfEmployees: {
      "@type": "QuantitativeValue",
      value: 367,
    },
    memberOf: {
      "@type": "Organization",
      name: "Healthcare Education Community",
    },
    knowsAbout: [
      "Healthcare Education",
      "Medical Careers",
      "Student Mentorship",
      "Healthcare Research",
      "Medical Technology",
      "Healthcare Leadership",
      "Pre-Medical Education",
      "Youth Healthcare Programs",
      "Medical Volunteering",
      "Healthcare Advocacy",
    ],
    areaServed: {
      "@type": "Place",
      name: "Worldwide",
    },
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "High School Students",
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
