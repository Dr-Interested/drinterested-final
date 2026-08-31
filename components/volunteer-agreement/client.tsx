"use client"

import { useEffect } from "react"
import Link from "next/link"
import { FileText } from "lucide-react"
import ScrollToTop from "@/components/scroll-to-top"

export default function VolunteerAgreementClientPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="hero-section container py-16 max-w-4xl">
      <ScrollToTop />
      <div className="bg-[#405862] text-white p-6 rounded-lg mb-8 shadow-md">
        <h1 className="text-3xl font-bold mb-2 text-center">Dr. Interested Volunteer Agreement</h1>
        <p className="text-center mb-0">
          This Agreement is between Dr. Interested ("the Organization") and the undersigned volunteer
          ("Volunteer"). By accepting a volunteer position with Dr. Interested, the Volunteer agrees to the
          following terms.
        </p>
      </div>

      <div className="space-y-8 bg-white p-8 rounded-lg shadow-md">
        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">1. Volunteer Status</h2>
          <p className="text-slate-600">
            The Volunteer acknowledges that they are serving as an unpaid volunteer and that this Agreement does not
            create an employment, contractor, partnership, ownership, shareholder, or agency relationship.
          </p>
          <p className="text-slate-600 mt-3">
            The Volunteer is not entitled to wages, salary, benefits, equity, royalties, commissions, or any other
            form of compensation unless explicitly approved in writing by the Organization.
          </p>
          <p className="text-slate-600 mt-3">
            Volunteer participation is voluntary and may be ended by either the Volunteer or the Organization at any
            time.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">2. Expenses and Purchases</h2>
          <p className="text-slate-600">
            The Volunteer understands that they must not spend personal funds, purchase goods or services, or incur
            expenses on behalf of the Organization unless they have received prior written approval.
          </p>
          <p className="text-slate-600 mt-3">
            Approved expenses may be reimbursed only where written authorization was provided before the expense
            occurred. Where required, the Organization may provide an organizational payment method, including a
            debit card. Volunteers should not use personal funds unless specifically authorized.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">3. Intellectual Property and Ownership</h2>
          <p className="text-slate-600">
            All work, materials, ideas, research, content, or creations developed by the Volunteer in connection
            with Dr. Interested, including work created using Organization resources, systems, branding, research,
            accounts, or intellectual property, shall belong exclusively to Dr. Interested.
          </p>
          <p className="text-slate-600 mt-3">This includes, but is not limited to:</p>
          <p className="text-slate-600 mt-2">
            Documents, research, reports, educational materials, presentations, graphics, videos, photographs,
            software, code, websites, social media content, databases, publications, event materials, and other
            creative or technical work.
          </p>
          <p className="text-slate-600 mt-3">
            The Volunteer assigns all rights, title, and interest in such work to the Organization and agrees they
            will not claim ownership, royalties, licensing fees, equity, or future compensation related to
            Organization intellectual property.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">4. Confidentiality</h2>
          <p className="text-slate-600">
            The Volunteer must keep confidential all non-public information obtained through their involvement with
            the Organization.
          </p>
          <p className="text-slate-600 mt-3">
            This includes internal documents, research, strategies, financial information, member information,
            passwords, databases, partnerships, grant materials, policies, and communications.
          </p>
          <p className="text-slate-600 mt-3">
            Confidential information must not be shared, used, or distributed without written authorization. This
            obligation continues after the Volunteer leaves the Organization.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">5. Organizational Resources</h2>
          <p className="text-slate-600">
            All Organization accounts, files, data, documents, software, passwords, equipment, branding, and other
            resources remain the property of Dr. Interested.
          </p>
          <p className="text-slate-600 mt-3">
            The Volunteer may only use these resources for authorized Organization purposes and must return or
            delete them when requested or when their volunteer service ends.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">6. Representation and Authority</h2>
          <p className="text-slate-600">
            When representing Dr. Interested, the Volunteer agrees to act professionally, respectfully, ethically,
            and in accordance with Organization policies.
          </p>
          <p className="text-slate-600 mt-3">
            The Volunteer does not have authority to legally represent or bind the Organization unless specifically
            authorized in writing. Without written authorization, the Volunteer may not:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-slate-600">
            <li>Sign contracts or agreements</li>
            <li>Make legal commitments</li>
            <li>Accept financial obligations</li>
            <li>Promise funding, partnerships, sponsorships, or grants</li>
            <li>Represent that they have authority to act on behalf of the Organization</li>
          </ul>
          <p className="text-slate-600 mt-3">
            Only authorized representatives designated by the Organization may enter agreements or create legal
            obligations for Dr. Interested.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">7. Conduct and Responsibilities</h2>
          <p className="text-slate-600">The Volunteer agrees to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-slate-600">
            <li>Follow Organization policies and reasonable instructions</li>
            <li>Complete assigned responsibilities honestly and responsibly</li>
            <li>Protect confidential information</li>
            <li>Treat members, partners, volunteers, and the public respectfully</li>
            <li>Avoid conduct that could harm the Organization's reputation</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">8. Removal and Termination</h2>
          <p className="text-slate-600">
            Volunteer participation is provided at the sole discretion of the Organization.
          </p>
          <p className="text-slate-600 mt-3">
            The Organization may remove a Volunteer, suspend access, change responsibilities, or end volunteer
            service at any time, with or without notice and with or without providing a reason.
          </p>
          <p className="text-slate-600 mt-3">
            The Volunteer understands that holding a title, position, or role does not guarantee continued
            participation or decision making authority.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">9. Conflicts of Interest</h2>
          <p className="text-slate-600">
            The Volunteer agrees to disclose any actual or potential conflicts of interest related to their
            responsibilities. The Organization may take appropriate action to manage any conflict.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">10. Return of Materials</h2>
          <p className="text-slate-600">
            When volunteer service ends, or when requested by the Organization, the Volunteer must promptly:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-slate-600">
            <li>Return Organization property</li>
            <li>Transfer Organization files and work products</li>
            <li>Remove Organization access from personal devices where applicable</li>
            <li>Delete confidential information and Organization materials unless instructed otherwise</li>
          </ul>
          <p className="text-slate-600 mt-3">The Volunteer must not retain copies of confidential Organization information.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">11. General Terms</h2>
          <p className="text-slate-600">
            If any part of this Agreement is found unenforceable, the remaining provisions remain valid. This
            Agreement represents the understanding between the Volunteer and the Organization regarding volunteer
            participation. This Agreement is governed by and interpreted in accordance with the laws of the Province
            of Ontario and the applicable laws of Canada.
          </p>
        </section>

        <section>
          <p className="text-xs text-slate-400 pt-2 border-t border-slate-100">
            © Dr. Interested. All rights reserved. This document is the intellectual property of Dr. Interested and
            its founder, Adil Mukhi.
          </p>
        </section>
      </div>

      <div className="mt-8 text-center">
        <Link href="/dashboard" className="inline-flex items-center text-[#405862] hover:text-[#4ecdc4] transition-colors">
          <FileText className="h-4 w-4 mr-2" />
          Return to Portal
        </Link>
      </div>
    </div>
  )
}
