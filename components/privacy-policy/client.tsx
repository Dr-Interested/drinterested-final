"use client"

import { useEffect } from "react"
import Link from "next/link"
import { FileText } from "lucide-react"
import ScrollToTop from "@/components/scroll-to-top"
import { resetAnalyticsConsent } from "@/components/analytics-consent"

export default function PrivacyPolicyClientPage() {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="hero-section container py-16 max-w-4xl">
      <ScrollToTop />
      <div className="bg-[#405862] text-white p-6 rounded-lg mb-8 shadow-md">
        <h1 className="text-3xl font-bold mb-2 text-center">Privacy Policy</h1>
        <p className="text-center mb-0">Last updated: November 14, 2026</p>
      </div>

      <div className="space-y-8 bg-white p-8 rounded-lg shadow-md">
        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">1. Introduction</h2>
          <p className="text-slate-600">
            Dr. Interested ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy
            explains how we collect, use, disclose, and safeguard your information when you visit our website or use
            our services. Please read this Privacy Policy carefully. If you do not agree with the terms of this
            Privacy Policy, please do not access the site.
          </p>
          <p className="text-slate-600 mt-3">
            Dr. Interested is a Canadian youth-led project; it is not itself a registered business, corporation,
            nonprofit, charity, or other legal entity. Our nonprofit work runs through Future Interested, a fiscally
            sponsored US 501(c)(3) public charity. See our{" "}
            <Link href="/terms" className="text-[#405862] font-medium underline hover:text-[#4ecdc4]">
              Terms and Conditions
            </Link>{" "}
            for details. It is run by its volunteer organizers, who are collectively responsible for the information
            described in this Privacy Policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">2. Information We Collect</h2>
          <p className="text-slate-600">
            We may collect personal information that you voluntarily provide to us when you:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-slate-600">
            <li>Register for our newsletter</li>
            <li>Sign up for events or webinars</li>
            <li>Apply to join our organization or volunteer with us</li>
            <li>Contact us with inquiries</li>
            <li>Participate in our surveys or competitions</li>
          </ul>
          <p className="text-slate-600 mt-4">
            The personal information we may collect includes names, email addresses, phone numbers, school
            information, and other details you provide when interacting with our services. Where you or your parent
            or guardian sign a Media Consent and Release Form for an in-person event, we also collect and use the
            photos, video, and identifying details described in that form, in accordance with it.
          </p>
          <p className="text-slate-600 mt-4">
            In some cases, we may also collect demographic information through voluntary forms. This data is only
            used in combined (aggregated) formats for reporting and analysis. If used individually, all data will
            remain strictly anonymous and will never be linked to personally identifiable information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">3. How We Use Your Information</h2>
          <p className="text-slate-600">We may use the information we collect for various purposes, including:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-slate-600">
            <li>Providing, maintaining, and improving our services</li>
            <li>Sending newsletters, updates, and promotional materials</li>
            <li>Responding to your comments, questions, and requests</li>
            <li>Analyzing usage patterns to enhance user experience</li>
            <li>Protecting against unauthorized access and legal liability</li>
            <li>Reporting impact and trends through aggregate demographic data</li>
            <li>Administering our member portal and volunteer program</li>
          </ul>
          <p className="text-slate-600 mt-4">
            We take privacy seriously and ensure that demographic data is either combined with other responses or
            stripped of identifiable details to maintain full anonymity.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">4. AI Tools and Your Information</h2>
          <p className="text-slate-600">
            We do not use the personal information you provide us to train third-party AI models. Where an AI tool
            is used as part of how our website or internal systems function, that use is limited and described in
            our{" "}
            <Link href="/ai-policy" className="text-[#405862] font-medium underline hover:text-[#4ecdc4]">
              AI Policy
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">5. Email Communications</h2>
          <p className="text-slate-600">
            If you choose to provide us with your email address, you consent to receive emails from us. You can
            unsubscribe from our marketing emails at any time by clicking the "unsubscribe" link included in these
            emails or by contacting us directly. However, we may still send you non-promotional emails that are
            essential to your use of our services (for example, a task or meeting notification if you are a
            member).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">6. Third-Party Service Providers</h2>
          <p className="text-slate-600">
            We may share your information with third-party service providers who perform services on our behalf,
            such as email delivery, hosting, database, and analytics services. These service providers have access
            to your personal information only to perform these tasks on our behalf and are obligated not to disclose
            or use it for any other purpose.
          </p>
          <p className="text-slate-600 mt-2">The service providers we currently use are:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-slate-600">
            <li>
              <strong>Kit (ConvertKit)</strong>: our email newsletter. If you subscribe, your name and email are sent to
              Kit and handled under its Privacy Policy and Terms.
            </li>
            <li>
              <strong>Formspree</strong>: receives messages sent through our contact form.
            </li>
            <li>
              <strong>Supabase</strong>: our database, member accounts and file storage.
            </li>
            <li>
              <strong>Resend</strong>: sends member portal emails (task, reminder and account emails).
            </li>
            <li>
              <strong>Vercel</strong>: hosts the website and provides cookie-free, aggregate page-view and performance
              statistics (Vercel Web Analytics and Speed Insights).
            </li>
            <li>
              <strong>Google Analytics</strong> and the <strong>Meta Pixel</strong>: website analytics and measuring our
              social media outreach. These load only if you choose &ldquo;Allow&rdquo; in our cookie banner (see
              Section 7), and never on member portal pages.
            </li>
            <li>
              <strong>YouTube</strong> and <strong>Spotify</strong>: embedded videos and podcast episodes, which load only
              when you choose to play them.
            </li>
          </ul>
        </section>

        <section>
          <h2 id="cookies" className="text-xl font-semibold mb-3 text-[#405862] scroll-mt-24">
            7. Cookies and Tracking Technologies
          </h2>
          <p className="text-slate-600">
            Cookies are small files that may include an anonymous unique identifier. We use them in two ways:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-slate-600">
            <li>
              <strong>Necessary:</strong> keeping members signed in to the member portal and remembering settings such
              as dark mode and your cookie choice. These are always on.
            </li>
            <li>
              <strong>Analytics and advertising measurement (optional):</strong> Google Analytics and the Meta Pixel.
              They are off until you choose &ldquo;Allow&rdquo; in the cookie banner, and they are never loaded on member
              portal pages (sign in, password reset, and everything after signing in). If you choose
              &ldquo;Decline&rdquo; they are not loaded at all.
            </li>
          </ul>
          <p className="text-slate-600 mt-2">
            You can change your choice at any time:{" "}
            <button
              type="button"
              onClick={resetAnalyticsConsent}
              className="text-[#2d8659] underline underline-offset-2 hover:text-[#4CAF7D]"
            >
              change my cookie choice
            </button>
            . You can also set your browser to refuse cookies or to tell you when one is being sent.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">8. Data Retention</h2>
          <p className="text-slate-600">
            We retain personal information for as long as reasonably necessary for the purposes described in this
            Privacy Policy, or as needed to comply with our legal obligations, resolve disputes, and enforce our
            agreements. You may request that we delete your information at any time, subject to Section 9 below.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">9. Data Security</h2>
          <p className="text-slate-600">
            We have implemented appropriate technical and organizational security measures designed to protect the
            security of any personal information we process. However, please also remember that we cannot guarantee
            that the internet itself is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">10. Children's Privacy</h2>
          <p className="text-slate-600">
            Our services are intended for users who are at least 13 years of age. We do not knowingly collect
            personal information from children under 13. If you are a parent or guardian and believe your child has
            provided us with personal information, please contact us.
          </p>
          <p className="text-slate-600 mt-3">
            Separately, many participants in our programs and events are minors aged 13–17. Where we photograph,
            film, or record a participant under 18 for public use, we require signed parental or guardian consent
            beforehand — see our{" "}
            <Link href="/media-consent" className="text-[#405862] font-medium underline hover:text-[#4ecdc4]">
              Media Consent and Release
            </Link>{" "}
            page, and our{" "}
            <Link href="/safeguarding-policy" className="text-[#405862] font-medium underline hover:text-[#4ecdc4]">
              Safeguarding Policy
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">11. International Data Transfers</h2>
          <p className="text-slate-600">
            Dr. Interested's volunteers and the students we serve are located worldwide. Your information may be
            stored or processed in a country other than your own, including Canada, where our service providers'
            infrastructure is located. By using our services, you consent to this transfer.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">12. Your Rights</h2>
          <p className="text-slate-600">
            Depending on your location, you may have certain rights regarding your personal information, such as the
            right to access, correct, or delete your personal information. To exercise these rights, please contact
            us using the information provided below.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">13. Changes to This Privacy Policy</h2>
          <p className="text-slate-600">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
            Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy
            Policy periodically for any changes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#405862]">14. Contact Us</h2>
          <p className="text-slate-600">
            If you have any questions about this Privacy Policy, please contact us at{" "}
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
