"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Mail,
  MapPin,
  Phone,
  Instagram,
  Linkedin,
  ArrowRight,
  Youtube,
  Music2, // Spotify
  Video, // TikTok
  MessageSquare,
  Facebook,
  AtSign as Threads,
  Cloud, // Mastodon
  Layers, // Bluesky
  Twitter
} from "lucide-react"
import SeoSchema from "@/components/seo-schema"
import { motion } from "framer-motion"

export default function ContactClientPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Prepare the data for submission
    const formDataToSend = new FormData()
    formDataToSend.append("name", formData.name)
    formDataToSend.append("email", formData.email)
    formDataToSend.append("subject", formData.subject)
    formDataToSend.append("message", formData.message)

    // Send the data to Formspree endpoint
    try {
      const response = await fetch("https://formspree.io/f/mnnpgkee", {
        method: "POST",
        body: formDataToSend,
        headers: {
          Accept: "application/json",
        },
      })

      // Check if the form submission was successful
      if (response.ok) {
        setIsSubmitted(true)
        setSubmitError(null)

        // Meta Pixel: track contact form submission
        if (typeof window !== "undefined" && (window as any).fbq) {
          ;(window as any).fbq("track", "Contact")
        }
        
        // Securely trigger the Discord webhook notification via our API route
        try {
          await fetch("/api/contact/notify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          })
        } catch (notifyErr) {
          console.error("Discord contact notification failed:", notifyErr)
        }

        setFormData({ name: "", email: "", subject: "", message: "" })
        setTimeout(() => setIsSubmitted(false), 5000)
      } else {
        console.error("Form submission failed")
        setSubmitError("There was an error submitting the form. Please try again.")
      }
    } catch (error) {
      console.error("Error:", error)
      setSubmitError("There was an error submitting the form. Please try again.")
    }
  }

  // SEO schema for contact page
  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Dr. Interested",
    description:
      "Get in touch with Dr. Interested for questions about our events, collaborations, or joining our team.",
    url: "https://www.drinterested.org/contact",
    mainEntity: {
      "@type": "Organization",
      name: "Dr. Interested",
      email: "admin@drinterested.org",
      url: "https://www.drinterested.org",
      sameAs: ["https://www.instagram.com/dr.interested/", "https://www.linkedin.com/company/dr-interested"],
    },
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <div>
      <SeoSchema id="contact-schema" schema={contactPageSchema} />

      <section className="hero-section bg-[#f5f1eb] py-10 md:py-16">
        <div className="container">
          <motion.div className="text-center" initial="hidden" animate="visible" variants={fadeIn}>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#405862]">Contact Us</h1>
            <p className="text-lg text-[#405862]/80 mt-3 max-w-2xl mx-auto">
              Have questions or want to get involved? We'd love to hear from you!
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-10">
        <div className="container max-w-5xl">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl font-bold mb-4 text-[#405862] flex items-center">
                Get in Touch
                <div className="w-10 h-1 bg-[#4ecdc4] ml-3"></div>
              </h2>
              <p className="text-[#405862]/80 text-sm mb-6">
                Whether you have questions about our events, want to collaborate, or are interested in joining our team,
                we're here to help.
              </p>

              <div className="space-y-5">
                <div className="flex items-start gap-3 p-3 rounded-lg border border-[#405862]/10 hover:border-[#4ecdc4]/30 hover:bg-[#f5f1eb]/30 transition-all duration-300">
                  <Mail className="h-5 w-5 text-[#4ecdc4] mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-[#405862] text-sm">Email</h3>
                    <p className="text-[#405862]/80 text-sm">admin@drinterested.org</p>
                    <p className="text-xs text-[#405862]/60 mt-1">We'll respond within 48 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg border border-[#405862]/10 hover:border-[#4ecdc4]/30 hover:bg-[#f5f1eb]/30 transition-all duration-300">
                  <MapPin className="h-5 w-5 text-[#4ecdc4] mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-[#405862] text-sm">Find us on our Discord space!</h3>
                    <p className="text-[#405862]/80 text-sm">Connect with our community</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg border border-[#405862]/10 hover:border-[#4ecdc4]/30 hover:bg-[#f5f1eb]/30 transition-all duration-300">
                  <Phone className="h-5 w-5 text-[#4ecdc4] mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-[#405862] text-sm">Follow Us</h3>
                    <div className="flex space-x-3 mt-2">
                      <a
                        href="https://www.instagram.com/dr.interested/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#405862]/80 hover:text-[#4ecdc4] transition-colors hover:scale-110 duration-200"
                      >
                        <Instagram className="h-5 w-5" />
                      </a>
                      <a
                        href="https://www.linkedin.com/company/dr-interested/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#405862]/80 hover:text-[#4ecdc4] transition-colors hover:scale-110 duration-200"
                      >
                        <Linkedin className="h-5 w-5" />
                      </a>
                      <a
                        href="https://www.facebook.com/profile.php?id=61572438387454"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#405862]/80 hover:text-[#4ecdc4] transition-colors hover:scale-110 duration-200"
                      >
                        <Facebook className="h-5 w-5" />
                      </a>
                      <a
                        href="https://www.youtube.com/@Dr.Interested"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#405862]/80 hover:text-[#4ecdc4] transition-colors hover:scale-110 duration-200"
                      >
                        <Youtube className="h-5 w-5" />
                      </a>
                      <a
                        href="https://open.spotify.com/show/6SLlRUL6co6fPxckAdrigf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#405862]/80 hover:text-[#4ecdc4] transition-colors hover:scale-110 duration-200"
                      >
                        <Music2 className="h-5 w-5" />
                      </a>
                      <a
                        href="https://www.tiktok.com/@dr.interested"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#405862]/80 hover:text-[#4ecdc4] transition-colors hover:scale-110 duration-200"
                      >
                        <Video className="h-5 w-5" />
                      </a>
                      <a
                        href="https://discord.gg/pzbGRgsGXY"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#405862]/80 hover:text-[#4ecdc4] transition-colors hover:scale-110 duration-200"
                      >
                        <MessageSquare className="h-5 w-5" />
                      </a>
                      <a
                        href="https://www.threads.com/@dr.interested"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#405862]/80 hover:text-[#4ecdc4] transition-colors hover:scale-110 duration-200"
                      >
                        <Threads className="h-5 w-5" />
                      </a>
                      <a
                        href="https://bsky.app/profile/drinterested.org"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#405862]/80 hover:text-[#4ecdc4] transition-colors hover:scale-110 duration-200"
                      >
                        <Layers className="h-5 w-5" />
                      </a>
                      <a
                        href="https://mastodon.social/@drinterested"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#405862]/80 hover:text-[#4ecdc4] transition-colors hover:scale-110 duration-200"
                      >
                        <Cloud className="h-5 w-5" />
                      </a>
                      <a
                        href="https://x.com/Dr_Interested_"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#405862]/80 hover:text-[#4ecdc4] transition-colors hover:scale-110 duration-200"
                      >
                        <Twitter className="h-5 w-5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl font-bold mb-4 text-[#405862] flex items-center">
                Send Us a Message
                <div className="w-10 h-1 bg-[#4ecdc4] ml-3"></div>
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4 p-4 border border-[#405862]/10 rounded-lg">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-sm text-[#405862]">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    className="border-[#405862]/20 focus:border-[#4ecdc4] h-9 text-sm"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-sm text-[#405862]">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    required
                    className="border-[#405862]/20 focus:border-[#4ecdc4] h-9 text-sm"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="subject" className="text-sm text-[#405862]">
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What is this regarding?"
                    required
                    className="border-[#405862]/20 focus:border-[#4ecdc4] h-9 text-sm"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="message" className="text-sm text-[#405862]">
                    Your message
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    rows={4}
                    required
                    className="border-[#405862]/20 focus:border-[#4ecdc4] text-sm resize-none"
                  />
                </div>

                <Button type="submit" className="w-full bg-[#405862] hover:bg-[#334852] group">
                  <span>Send Message</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </form>

              {/* Show success message */}
              {isSubmitted && (
                <div className="mt-4 p-3 text-center text-green-600 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm font-medium">Message sent successfully! We will get back to you soon.</p>
                </div>
              )}

              {/* Show error message */}
              {submitError && (
                <div className="mt-4 p-3 text-center text-red-600 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm font-medium">{submitError}</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-10 bg-[#f5f1eb]/50">
        <div className="container max-w-5xl">
          <motion.div
            className="text-center mb-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <h2 className="text-xl font-bold text-[#405862] inline-flex flex-col items-center">
              Frequently Asked Questions
              <div className="w-16 h-1 bg-[#4ecdc4] mt-2"></div>
            </h2>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn}>
              <Card className="border-[#405862]/10 hover:border-[#4ecdc4]/30 hover:shadow-md transition-all duration-300">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 text-[#405862] text-sm">How can I join Dr. Interested?</h3>
                  <p className="text-[#405862]/80 text-xs">
                    Join our Discord to become a regular member, follow us on Instagram, and stay active on Discord to
                    be the first to know when executive applications open!
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Card className="border-[#405862]/10 hover:border-[#4ecdc4]/30 hover:shadow-md transition-all duration-300">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 text-[#405862] text-sm">Do I need to be pre-med to join?</h3>
                  <p className="text-[#405862]/80 text-xs">
                    Not at all! We welcome all high school students interested in healthcare, regardless of their future
                    career plans.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Card className="border-[#405862]/10 hover:border-[#4ecdc4]/30 hover:shadow-md transition-all duration-300">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 text-[#405862] text-sm">Are your events only for members?</h3>
                  <p className="text-[#405862]/80 text-xs">
                    Most of our webinars and educational events are open to all interested students. Some special events
                    may be member-exclusive (meaning they would only be offered to the people on our Discord).
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Card className="border-[#405862]/10 hover:border-[#4ecdc4]/30 hover:shadow-md transition-all duration-300">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 text-[#405862] text-sm">
                    How many schools collaborate with Dr. Interested?
                  </h3>
                  <p className="text-[#405862]/80 text-xs">
                    We're always open to school partnerships and currently work with several high schools. Contact our
                    Outreach Department for potential collaborations.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
