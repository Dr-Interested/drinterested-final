"use client"

import { useEffect } from "react"
import Link from "next/link"
import { FileText } from "lucide-react"
import ScrollToTop from "@/components/scroll-to-top"

export default function SafeguardingPolicyClientPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="hero-section container py-16 max-w-4xl">
      <ScrollToTop />
      <div className="bg-[#405862] text-white p-6 rounded-lg mb-8 shadow-md">
        <h1 className="text-3xl font-bold mb-2 text-center">Safeguarding Policy</h1>
        <p className="text-center mb-0">Our commitment to the safety and wellbeing of the youth we work with.</p>
      </div>

      <div className="space-y-8 bg-white p-8 rounded-lg shadow-md">
        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">1. Our Commitment</h2>
          <p className="text-slate-600">
            Dr. Interested is a youth-led organization, and many of the students who participate in our programs,
            events, and membership are minors. We are committed to creating a safe, respectful environment for
            every young person we work with, and to responding seriously and promptly to any concern raised about
            their wellbeing.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">2. Who This Applies To</h2>
          <p className="text-slate-600">
            This policy applies to everyone who represents Dr. Interested in any capacity — organizers, directors,
            deputy directors, coordinators, volunteers, mentors, and speakers — in all interactions with students,
            whether at in-person events, online (webinars, Discord, social media), or through mentorship.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">3. Code of Conduct</h2>
          <p className="text-slate-600">Everyone representing Dr. Interested is expected to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-slate-600">
            <li>Treat every young person with respect, patience, and professionalism</li>
            <li>Keep communication with students on official, monitorable channels (e.g. our Discord, official email) rather than personal accounts, where practical</li>
            <li>Avoid one-on-one, unsupervised, private contact with a minor outside of a program's normal structure</li>
            <li>Never request or share inappropriate images, messages, or personal information with a minor</li>
            <li>Never provide alcohol, drugs, or other age-restricted substances to a minor</li>
            <li>Follow our{" "}
              <Link href="/ai-policy" className="text-[#405862] font-medium underline hover:text-[#4ecdc4]">
                AI Policy
              </Link>
              , our{" "}
              <Link href="/privacy-policy" className="text-[#405862] font-medium underline hover:text-[#4ecdc4]">
                Privacy Policy
              </Link>
              , and any media consent requirements when photographing or filming students
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">4. Media, Consent, and Minors</h2>
          <p className="text-slate-600">
            Where we photograph, film, or record students at our events, we seek consent in advance — for minors,
            from a parent or legal guardian — before using that media publicly. See our{" "}
            <Link href="/media-consent" className="text-[#405862] font-medium underline hover:text-[#4ecdc4]">
              Media Consent and Release
            </Link>{" "}
            page for details on how that consent works.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">5. Reporting a Concern</h2>
          <p className="text-slate-600">
            If you have a concern about the safety or wellbeing of a young person involved with Dr. Interested — or
            about the conduct of anyone representing us — please report it as soon as possible to{" "}
            <a href="mailto:hr@drinterested.org" className="text-[#405862] font-medium underline hover:text-[#4ecdc4]">
              hr@drinterested.org
            </a>
            . Reports are taken seriously and handled as confidentially as circumstances allow. If a young person is
            in immediate danger, please contact local emergency services first.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">6. Response to Concerns</h2>
          <p className="text-slate-600">
            Where a concern is raised about someone representing Dr. Interested, we will review the situation and
            may suspend or remove that person's access, role, or involvement while the matter is looked into,
            consistent with our{" "}
            <Link href="/terms" className="text-[#405862] font-medium underline hover:text-[#4ecdc4]">
              Terms and Conditions
            </Link>
            . Where a concern involves suspected abuse, harm, or illegal conduct, we will refer the matter to the
            appropriate authorities.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">7. Ongoing Review</h2>
          <p className="text-slate-600">
            This policy is reviewed periodically as our organization and programs grow, and updated as needed to
            reflect current practice.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">8. Contact Us</h2>
          <p className="text-slate-600">
            Questions about this Safeguarding Policy can be directed to{" "}
            <a href="mailto:hr@drinterested.org" className="text-[#405862] font-medium underline hover:text-[#4ecdc4]">
              hr@drinterested.org
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
