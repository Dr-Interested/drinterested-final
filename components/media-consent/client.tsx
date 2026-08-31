"use client"

import { useEffect } from "react"
import Link from "next/link"
import { FileText } from "lucide-react"
import ScrollToTop from "@/components/scroll-to-top"

export default function MediaConsentClientPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="hero-section container py-16 max-w-4xl">
      <ScrollToTop />
      <div className="bg-[#405862] text-white p-6 rounded-lg mb-8 shadow-md">
        <h1 className="text-3xl font-bold mb-2 text-center">Media Consent and Release</h1>
        <p className="text-center mb-0">What you're agreeing to if you or your child are photographed or filmed at our events.</p>
      </div>

      <div className="space-y-8 bg-white p-8 rounded-lg shadow-md">
        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">1. Why We Ask for Consent</h2>
          <p className="text-slate-600">
            We often photograph, film, and record our in-person events to share on our website, social media, and
            newsletters. For attendees under 18, we ask a parent or legal guardian to review and agree to this Media
            Consent and Release before the event, either digitally or on paper on-site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">2. What You're Granting</h2>
          <p className="text-slate-600">
            By giving consent, a parent or legal guardian — on behalf of the youth — grants Dr. Interested
            permission to photograph, film, record, and otherwise capture the youth's image, likeness, voice, and
            appearance, in photographs, videos, and other media created by Dr. Interested, its representatives,
            volunteers, or contractors, or provided by the youth or their guardian.
          </p>
          <p className="text-slate-600 mt-3">
            Consent also covers including identifying information alongside this media, such as the youth's full
            name, age, city of residence, school, program participation, and demographic information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">3. How Media May Be Used</h2>
          <p className="text-slate-600">
            Dr. Interested, its funders, sponsors, partners, affiliates, and representatives may use, reproduce,
            edit, publish, adapt, distribute, display, and share this media in whole or in part, in any format or
            medium — including but not limited to websites, social media platforms, newsletters, and other owned
            media — in perpetuity.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">4. What a Guardian Confirms by Signing</h2>
          <p className="text-slate-600">By signing, a parent or legal guardian confirms that they:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-slate-600">
            <li>are the legal guardian of the youth,</li>
            <li>grant permission for this subject's release on behalf of the youth, and</li>
            <li>acknowledge that they have read, understand, and agree with the contents of this Media Consent and Release.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">5. Related Policies</h2>
          <p className="text-slate-600">
            This consent operates alongside our{" "}
            <Link href="/safeguarding-policy" className="text-[#405862] font-medium underline hover:text-[#4ecdc4]">
              Safeguarding Policy
            </Link>
            ,{" "}
            <Link href="/privacy-policy" className="text-[#405862] font-medium underline hover:text-[#4ecdc4]">
              Privacy Policy
            </Link>
            , and{" "}
            <Link href="/terms" className="text-[#405862] font-medium underline hover:text-[#4ecdc4]">
              Terms and Conditions
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">6. Questions</h2>
          <p className="text-slate-600">
            If you have questions about this Media Consent and Release, or want to request that specific media of
            your child be taken down, contact us at{" "}
            <a href="mailto:admin@drinterested.org" className="text-[#405862] font-medium underline hover:text-[#4ecdc4]">
              admin@drinterested.org
            </a>
            .
          </p>
        </section>

        <section>
          <p className="text-xs text-slate-400 pt-2 border-t border-slate-100">
            © Dr. Interested. All rights reserved. This document is the intellectual property of Dr. Interested.
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
