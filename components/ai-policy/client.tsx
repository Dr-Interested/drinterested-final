"use client"

import { useEffect } from "react"
import Link from "next/link"
import { FileText } from "lucide-react"
import ScrollToTop from "@/components/scroll-to-top"

export default function AiPolicyClientPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="hero-section container py-16 max-w-4xl">
      <ScrollToTop />
      <div className="bg-[#405862] text-white p-6 rounded-lg mb-8 shadow-md">
        <h1 className="text-3xl font-bold mb-2 text-center">AI Policy</h1>
        <p className="text-center mb-0">How Dr. Interested uses artificial intelligence tools.</p>
      </div>

      <div className="space-y-8 bg-white p-8 rounded-lg shadow-md">
        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">1. Purpose</h2>
          <p className="text-slate-600">
            This policy explains how Dr. Interested uses artificial intelligence (AI) tools in producing content,
            building and maintaining our website, and supporting our operations, and the limits we place on that use.
            It applies alongside our{" "}
            <Link href="/terms" className="text-[#405862] font-medium underline hover:text-[#4ecdc4]">
              Terms and Conditions
            </Link>{" "}
            and{" "}
            <Link href="/privacy-policy" className="text-[#405862] font-medium underline hover:text-[#4ecdc4]">
              Privacy Policy
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">2. Where We Use AI</h2>
          <p className="text-slate-600">We use AI tools to help with tasks including:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-slate-600">
            <li>Drafting, editing, and researching blog posts, op-eds, and other written content</li>
            <li>Building and maintaining this website and the tools our team uses internally</li>
            <li>Summarizing, organizing, or formatting information (for example, event recaps or documentation)</li>
            <li>General administrative and operational support</li>
          </ul>
          <p className="text-slate-600 mt-4">
            AI-assisted content is reviewed by a member of our team before it is published. AI tools support our
            work; they do not publish on our behalf without human review, and they do not make decisions about
            individual people (such as membership applications, approvals, or task assignments) on our behalf.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">3. Content Is Not Professional Advice</h2>
          <p className="text-slate-600">
            Regardless of whether a piece of content was written with AI assistance, everything published by Dr.
            Interested — including blog posts, guides, and webinars — is for informational and entertainment
            purposes only and is not medical, legal, financial, or career advice. See our{" "}
            <Link href="/terms" className="text-[#405862] font-medium underline hover:text-[#4ecdc4]">
              Terms and Conditions
            </Link>{" "}
            for more.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">4. Your Data and AI</h2>
          <p className="text-slate-600">
            We do not use the personal information you provide us (such as through the contact form, event
            registration, or membership application) to train third-party AI models. Where an AI tool processes
            information as part of how our website or internal systems function, that processing is limited to
            performing the requested task and is handled under the same safeguards described in our{" "}
            <Link href="/privacy-policy" className="text-[#405862] font-medium underline hover:text-[#4ecdc4]">
              Privacy Policy
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">5. Accuracy</h2>
          <p className="text-slate-600">
            AI tools can make mistakes. We take reasonable steps to review AI-assisted content for accuracy before
            publishing it, but we cannot guarantee that every statement is error-free. If you notice something
            incorrect, please let us know at{" "}
            <a href="mailto:admin@drinterested.org" className="text-[#405862] font-medium underline hover:text-[#4ecdc4]">
              admin@drinterested.org
            </a>{" "}
            and we'll review it.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">6. Changes to This Policy</h2>
          <p className="text-slate-600">
            We may update this AI Policy from time to time as our tools and practices evolve. Continued use of our
            website or services after a change constitutes acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">7. Contact Us</h2>
          <p className="text-slate-600">
            If you have questions about this AI Policy, please contact us at{" "}
            <a href="mailto:admin@drinterested.org" className="text-[#405862] font-medium underline hover:text-[#4ecdc4]">
              admin@drinterested.org
            </a>
            .
          </p>
        </section>
      </div>

      <div className="mt-8 text-center">
        <Link href="/" className="inline-flex items-center text-[#405862] hover:text-[#4ecdc4] transition-colors">
          <FileText className="h-4 w-4 mr-2" />
          Return Home
        </Link>
      </div>
    </div>
  )
}
