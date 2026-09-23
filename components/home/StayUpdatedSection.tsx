"use client"

import NewsletterForm from "@/components/newsletter-form"

export default function StayUpdatedSection() {
  return (
    <>
      {/* Stay Updated Section */}
      <section className="py-12 bg-[#405862] text-white">
        <div className="container max-w-4xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Stay Updated</h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Get our latest events, articles, and opportunities for future healthcare leaders straight to your inbox.
          </p>
          <div className="max-w-md mx-auto">
            <NewsletterForm darkMode={true} showFirstName={false} compact={true} />
          </div>
        </div>
      </section>
    </>
  )
}
