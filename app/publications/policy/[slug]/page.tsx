import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ExternalLink, FileText, Download } from "lucide-react"
import { POLICY_SUBMISSIONS, getPolicySubmissionBySlug } from "@/data/policy-submissions"
import PageBreadcrumb from "@/components/page-breadcrumb"
import SeoSchema from "@/components/seo-schema"
import ScrollToTop from "@/components/scroll-to-top"
import PolicyPageGallery from "./PolicyPageGallery"

const SITE_URL = "https://www.drinterested.org"

export function generateStaticParams() {
  return POLICY_SUBMISSIONS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const submission = getPolicySubmissionBySlug(slug)
  if (!submission) return { title: "Policy Submission Not Found" }

  const url = `${SITE_URL}/publications/policy/${submission.slug}`
  const ogImage = submission.documents[0]?.pages[0]?.file

  return {
    title: `${submission.title} | Dr. Interested Policy Work`,
    description: submission.summary,
    keywords: [
      submission.title,
      submission.resolution,
      "OHCHR",
      "UN Human Rights Council",
      "youth mental health policy",
      "human rights submission",
      "Dr. Interested policy work",
      "youth human rights",
    ],
    authors: [{ name: "Dr. Interested" }],
    openGraph: {
      title: submission.title,
      description: submission.summary,
      url,
      siteName: "Dr. Interested",
      type: "article",
      publishedTime: submission.isoDate,
      images: ogImage ? [{ url: ogImage, width: 1347, height: 1743, alt: submission.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: submission.title,
      description: submission.summary,
      images: ogImage ? [ogImage] : undefined,
    },
    alternates: {
      canonical: url,
    },
  }
}

export default async function PolicySubmissionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const submission = getPolicySubmissionBySlug(slug)
  if (!submission) notFound()

  const url = `${SITE_URL}/publications/policy/${submission.slug}`

  const reportSchema = {
    "@context": "https://schema.org",
    "@type": "Report",
    name: submission.title,
    headline: submission.title,
    description: submission.summary,
    datePublished: submission.isoDate,
    url,
    author: {
      "@type": "Organization",
      name: "Dr. Interested",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Dr. Interested",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
    },
    about: submission.resolution,
    citation: submission.ohchrPdfUrl,
    isBasedOn: submission.ohchrDirectoryUrl,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  }

  return (
    <div>
      <ScrollToTop />
      <SeoSchema id="policy-report-schema" schema={reportSchema} />

      {/* Header */}
      <section className="bg-[#f5f1eb] py-10 md:py-16">
        <div className="container max-w-3xl">
          <PageBreadcrumb
            items={[
              { name: "Home", href: "/" },
              { name: "Publications", href: "/publications" },
              { name: "Policy Work", href: "/publications#policy-work" },
              { name: submission.title, href: `/publications/policy/${submission.slug}` },
            ]}
          />
          <Link
            href="/publications"
            className="inline-flex items-center text-[#405862] hover:text-[#4ecdc4] mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Publications
          </Link>

          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="bg-[#405862]/10 px-3 py-1 rounded-full text-sm font-medium text-[#405862]">
              Policy Work
            </span>
            <span className="bg-[#e3f2fd] px-3 py-1 rounded-full text-sm font-medium text-[#1976d2]">
              {submission.resolution}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-[#405862] mb-4 leading-tight">{submission.title}</h1>
          <p className="text-[#405862]/80 text-base md:text-lg mb-6 max-w-2xl">{submission.summary}</p>

          <p className="text-sm text-[#405862]/70 mb-8">
            Presented to the Council by <strong>{submission.presentedBy}</strong> &middot; Dated{" "}
            {submission.date}
          </p>

          {/* Prominent OHCHR links */}
          <div className="bg-white rounded-2xl border border-[#405862]/10 shadow-sm p-5 md:p-6">
            <p className="text-xs font-bold uppercase tracking-wide text-[#4ecdc4] mb-3">
              Hosted by the UN Office of the High Commissioner for Human Rights (OHCHR)
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={submission.ohchrPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#405862] hover:bg-[#334852] text-white font-semibold px-4 py-3 rounded-xl text-sm transition-colors"
              >
                <FileText className="h-4 w-4" />
                View submission on ohchr.org
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <a
                href={submission.ohchrDirectoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 border-2 border-[#405862] text-[#405862] hover:bg-[#405862]/10 font-semibold px-4 py-3 rounded-xl text-sm transition-colors"
              >
                View the OHCHR call for input
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Documents */}
      {submission.documents.map((doc) => (
        <section key={doc.label} className="py-12 md:py-16 border-t border-[#405862]/10 odd:bg-white even:bg-[#f5f1eb]/60">
          <div className="container max-w-3xl">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-[#405862]">{doc.label}</h2>
              <a
                href={doc.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#405862] hover:text-[#4ecdc4] transition-colors"
              >
                <Download className="h-4 w-4" />
                Download original PDF
              </a>
            </div>

            <PolicyPageGallery label={doc.label} pages={doc.pages} />

            <div className="mt-8 pt-8 border-t border-[#405862]/10">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#4ecdc4] mb-4">
                Full text (converted from the original PDF for readability)
              </p>
              <div className="blog-prose">
                {doc.paragraphs.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Footer links */}
      <section className="py-10 bg-[#405862] text-white text-center">
        <div className="container max-w-2xl mx-auto px-4 space-y-4">
          <p className="text-white/80 text-sm">
            This submission is officially hosted by the UN Office of the High Commissioner for Human Rights.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={submission.ohchrPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#4ecdc4] hover:bg-[#3dbcb3] text-[#405862] font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              View on ohchr.org <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <Link
              href="/publications"
              className="inline-flex items-center gap-2 border-2 border-white text-white hover:bg-white/10 font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              Back to Publications
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
