"use client"

import Image from "next/image"
import NewsletterForm from "@/components/newsletter-form"

export default function StayUpdatedSection() {
  return (
    <section className="relative overflow-hidden bg-ink py-10 text-white md:py-12">
      <Image
        src="/brand/icon.png"
        alt=""
        width={320}
        height={320}
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 w-56 opacity-[0.07] invert md:w-72"
      />
      <div className="container relative grid items-center gap-6 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold md:text-3xl">A short email, every other Saturday</h2>
          <p className="mt-2 max-w-md text-sm text-white/75">
            8,000+ people already get our newsletter: new events, articles, and opportunities in wellness careers,
            policy, and community.
          </p>
        </div>
        <div className="md:justify-self-end md:w-full md:max-w-md">
          <NewsletterForm darkMode={true} showFirstName={false} compact={true} />
        </div>
      </div>
    </section>
  )
}
