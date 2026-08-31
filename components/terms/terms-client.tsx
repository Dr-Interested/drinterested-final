"use client"

import { useEffect } from "react"
import Link from "next/link"
import { FileText } from "lucide-react"
import ScrollToTop from "@/components/scroll-to-top"

export default function TermsClient() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="hero-section container py-16 max-w-4xl">
      <ScrollToTop />
      <div className="bg-[#405862] text-white p-6 rounded-lg mb-8 shadow-md">
        <h1 className="text-3xl font-bold mb-2 text-center">Terms and Conditions</h1>
        <p className="text-center mb-0">
          Please read these terms carefully before accessing or using any of our services.
        </p>
      </div>

      <div className="space-y-8 bg-white p-8 rounded-lg shadow-md">
        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">1. Legal Status of Dr. Interested</h2>
          <p className="text-slate-600">
            Dr. Interested is a youth-led educational project intended to provide informational content and
            programming to students interested in healthcare-related careers. It is not a registered business,
            corporation, nonprofit, charity, or other legal entity in any jurisdiction. It is an informal,
            volunteer-run initiative. All activities, content, events, and communications are provided on a
            voluntary, non-commercial basis by its organizers and volunteers.
          </p>
          <p className="text-slate-600 mt-3">
            Because Dr. Interested has no separate legal existence, references in these Terms to "Dr. Interested,"
            "we," "us," or "our" mean the individual organizers, directors, and volunteers who run it collectively,
            acting in that capacity and not in their personal capacity. Nothing in these Terms, on our website, or
            in our programming should be understood as creating a partnership, joint venture, agency, or employment
            relationship between any two participants, organizers, or volunteers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">2. Acceptance of Terms</h2>
          <p className="text-slate-600">
            By accessing or using our website or services, you agree to be legally bound by these Terms and
            Conditions. If you do not agree with any part of these Terms, you must refrain from using our website or
            services. If you are under the age of majority in your jurisdiction, you confirm that a parent or legal
            guardian has reviewed and agreed to these Terms on your behalf.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">3. Educational Purpose Only</h2>
          <p className="text-slate-600">
            All content, events, webinars, publications, podcasts, and resources provided by Dr. Interested —
            including anything produced with the assistance of AI tools (see our{" "}
            <Link href="/ai-policy" className="text-[#405862] font-medium underline hover:text-[#4ecdc4]">
              AI Policy
            </Link>
            ) — are for informational and entertainment purposes only. Nothing we publish or present is intended as
            professional medical, legal, financial, or career advice, a diagnosis, a treatment recommendation, or a
            substitute for consulting a qualified, licensed professional.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">4. No Warranty</h2>
          <p className="text-slate-600">
            Our website, content, and services are provided "as is" and "as available," without warranties of any
            kind, whether express or implied, including but not limited to implied warranties of merchantability,
            fitness for a particular purpose, accuracy, or non-infringement. We do not guarantee that our website or
            services will be uninterrupted, timely, secure, or error-free.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">5. No Liability</h2>
          <p className="text-slate-600">
            To the fullest extent permitted by applicable law, Dr. Interested and its organizers, directors,
            deputy directors, coordinators, volunteers, mentors, speakers, contributors, and affiliates (each a
            "Representative") disclaim all liability for any damages of any kind — direct, indirect, incidental,
            consequential, or punitive — including but not limited to loss of data, loss of income, personal
            injury, or reputational harm, arising from or related to your use of, or inability to use, our website,
            content, or services, or your participation in any Dr. Interested event, program, or activity. Because
            Dr. Interested is not a registered legal entity, this limitation of liability extends individually to
            each Representative acting in that capacity.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">6. Assumption of Risk (Events and Activities)</h2>
          <p className="text-slate-600">
            Participation in any Dr. Interested event, conference, workshop, or in-person activity is voluntary. You
            acknowledge that such participation carries inherent risks, and you voluntarily assume all such risks.
            Where an event requires a separate waiver, release, or consent form (including a Media Consent and
            Release Form for attendees under 18), completing that form is a condition of participation.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">7. Indemnification</h2>
          <p className="text-slate-600">
            You agree to indemnify, defend, and hold harmless Dr. Interested and its Representatives from and
            against any claims, liabilities, damages, losses, and expenses (including reasonable legal fees) arising
            out of or related to: (a) your use of our website, content, or services; (b) your participation in any
            Dr. Interested event or activity; (c) your violation of these Terms; or (d) your violation of any
            rights of a third party.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">8. User Responsibilities</h2>
          <p className="text-slate-600">When engaging with our services, you agree not to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-slate-600">
            <li>Violate any local, national, or international laws or regulations</li>
            <li>Upload or transmit any harmful, misleading, or unlawful content</li>
            <li>Access or attempt to access unauthorized areas of the website, including the member portal</li>
            <li>Impersonate any individual or misrepresent your affiliation</li>
            <li>Exploit or misuse our resources for commercial purposes</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">9. Minors and Parental Consent</h2>
          <p className="text-slate-600">
            Many participants in our programs are minors. Where we photograph, film, or record a participant under
            18 for use on our website, social media, or newsletters, we require a parent or legal guardian's signed
            consent beforehand — see our{" "}
            <Link href="/media-consent" className="text-[#405862] font-medium underline hover:text-[#4ecdc4]">
              Media Consent and Release
            </Link>{" "}
            page. Our approach to the safety and wellbeing of the youth we work with is set out in our{" "}
            <Link href="/safeguarding-policy" className="text-[#405862] font-medium underline hover:text-[#4ecdc4]">
              Safeguarding Policy
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">10. Members and Volunteers</h2>
          <p className="text-slate-600">
            Anyone who joins Dr. Interested as a member, volunteer, or team lead does so on an unpaid, voluntary
            basis and agrees to our separate Volunteer Agreement, provided through the member portal at the time of
            approval. That Agreement governs matters specific to volunteering with us, including intellectual
            property assignment, confidentiality, and the limits of anyone's authority to act or make commitments on
            behalf of Dr. Interested. Where the Volunteer Agreement and these Terms overlap, the more specific terms
            of the Volunteer Agreement govern a volunteer's relationship with Dr. Interested.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">11. Privacy</h2>
          <p className="text-slate-600">
            Our{" "}
            <Link href="/privacy-policy" className="text-[#405862] font-medium underline hover:text-[#4ecdc4]">
              Privacy Policy
            </Link>{" "}
            outlines how personal data is collected, stored, and used. By using our services, you consent to the
            collection and use of information as outlined in our Privacy Policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">12. Intellectual Property</h2>
          <p className="text-slate-600">
            All content made available through this project, including but not limited to text, graphics, logos,
            and digital materials, remains the intellectual property of the creators of Dr. Interested. No content
            may be copied, reproduced, or distributed without explicit written consent.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">13. Communications</h2>
          <p className="text-slate-600">
            By submitting your contact information, you agree to receive emails or messages from Dr. Interested,
            including but not limited to event updates and educational content. You may opt out of such
            communications at any time.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">14. Severability</h2>
          <p className="text-slate-600">
            If any provision of these Terms is found to be unenforceable or invalid under applicable law, that
            provision will be limited or eliminated to the minimum extent necessary, and the remaining provisions
            will remain in full force and effect.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">15. Modifications</h2>
          <p className="text-slate-600">
            We reserve the right to amend or modify these Terms at any time without prior notice. It is your
            responsibility to review the Terms periodically. Continued use of the website or services constitutes
            acceptance of any changes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">16. Governing Law</h2>
          <p className="text-slate-600">
            These Terms and any disputes arising under them shall be governed by and interpreted in accordance with
            the laws of the Province of Ontario, Canada, and the applicable laws of Canada, without regard to
            conflict of laws principles.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">17. Contact Information</h2>
          <p className="text-slate-600">
            For questions or concerns regarding these Terms and Conditions, please contact us at:{" "}
            <a
              href="mailto:admin@drinterested.org"
              className="text-[#405862] font-medium underline hover:text-[#4ecdc4]"
            >
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
