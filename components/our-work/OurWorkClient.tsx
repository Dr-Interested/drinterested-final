"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Quote, Users, TrendingUp, Heart, Award, BookOpen, Sparkles, Globe } from "lucide-react"
import { LiteYouTube, LiteSpotify } from "@/components/lite-embed"

export default function OurWorkPage() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  const fadeInLeft = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  }

  const fadeInRight = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
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

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section bg-[#f5f1eb] py-10 md:py-16 relative overflow-hidden">
        <div className="container relative z-10 max-w-5xl mx-auto">
          <motion.div className="text-center" initial="hidden" animate="visible" variants={fadeIn}>
            <motion.a
              href="https://impact.drinterested.org/2025/annual"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#4ecdc4]/20 text-[#4ecdc4] px-4 py-2 rounded-full text-sm font-medium mb-4 hover:bg-[#4ecdc4]/30 transition-colors cursor-pointer"
              variants={fadeIn}
            >
              <Sparkles className="w-4 h-4" />
              <span>Check out our 2025 Annual Impact Report</span>
            </motion.a>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#405862] mb-4">
              Empowering the Next Generation of Healthcare Leaders
            </h1>
            <p className="text-[#405862]/80 text-lg mb-6 leading-relaxed max-w-3xl mx-auto">
              Discover how Dr. Interested is transforming youth healthcare education through innovative programs,
              mentorship, and community building across the globe.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="#impact"
                className="bg-[#4ecdc4] text-[#405862] px-6 py-2.5 rounded-lg font-semibold hover:bg-[#4ecdc4]/90 transition-colors"
              >
                View Our Impact
              </a>
              <a
                href="#media"
                className="bg-[#405862] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#334852] transition-colors"
              >
                Watch Our Content
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Impact Numbers Section */}
      <section id="impact" className="py-12 bg-white">
        <div className="container max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#405862] mb-3">Our Impact by the Numbers</h2>
            <p className="text-[#405862]/70 max-w-2xl mx-auto">
              Real results from our commitment to youth healthcare education and community building
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={scaleIn}>
              <div className="bg-gradient-to-br from-[#4ecdc4]/10 to-[#4ecdc4]/5 p-5 rounded-xl text-center border border-[#4ecdc4]/20 hover:border-[#4ecdc4]/40 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <Users className="w-7 h-7 text-[#4ecdc4] mx-auto mb-2" />
                <div className="text-3xl font-bold text-[#405862] mb-1">160,000+</div>
                <div className="text-[#405862]/70 text-xs font-medium">Youth Impacted</div>
              </div>
            </motion.div>

            <motion.div variants={scaleIn}>
              <div className="bg-gradient-to-br from-[#4ecdc4]/10 to-[#4ecdc4]/5 p-5 rounded-xl text-center border border-[#4ecdc4]/20 hover:border-[#4ecdc4]/40 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <Globe className="w-7 h-7 text-[#4ecdc4] mx-auto mb-2" />
                <div className="text-3xl font-bold text-[#405862] mb-1">106</div>
                <div className="text-[#405862]/70 text-xs font-medium">Countries Reached</div>
              </div>
            </motion.div>

            <motion.div variants={scaleIn}>
              <div className="bg-gradient-to-br from-[#4ecdc4]/10 to-[#4ecdc4]/5 p-5 rounded-xl text-center border border-[#4ecdc4]/20 hover:border-[#4ecdc4]/40 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <TrendingUp className="w-7 h-7 text-[#4ecdc4] mx-auto mb-2" />
                <div className="text-3xl font-bold text-[#405862] mb-1">1,400+</div>
                <div className="text-[#405862]/70 text-xs font-medium">Members</div>
              </div>
            </motion.div>

            <motion.div variants={scaleIn}>
              <div className="bg-gradient-to-br from-[#4ecdc4]/10 to-[#4ecdc4]/5 p-5 rounded-xl text-center border border-[#4ecdc4]/20 hover:border-[#4ecdc4]/40 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <Award className="w-7 h-7 text-[#4ecdc4] mx-auto mb-2" />
                <div className="text-3xl font-bold text-[#405862] mb-1">367+</div>
                <div className="text-[#405862]/70 text-xs font-medium">Executives</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Additional Stats Grid - Condensed */}
          <motion.div
            className="grid md:grid-cols-4 gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn}>
              <div className="bg-[#f5f1eb] p-4 rounded-xl text-center">
                <div className="text-2xl font-bold text-[#4ecdc4] mb-1">400+</div>
                <div className="text-[#405862]/70 text-xs">Mentor Hours</div>
              </div>
            </motion.div>

            <motion.div variants={fadeIn}>
              <div className="bg-[#f5f1eb] p-4 rounded-xl text-center">
                <div className="text-2xl font-bold text-[#4ecdc4] mb-1">106%</div>
                <div className="text-[#405862]/70 text-xs">Weekly Growth Rate</div>
              </div>
            </motion.div>

            <motion.div variants={fadeIn}>
              <div className="bg-[#f5f1eb] p-4 rounded-xl text-center">
                <div className="text-2xl font-bold text-[#4ecdc4] mb-1">3.7M+</div>
                <div className="text-[#405862]/70 text-xs">Content Impressions</div>
              </div>
            </motion.div>

            <motion.div variants={fadeIn}>
              <div className="bg-[#f5f1eb] p-4 rounded-xl text-center">
                <div className="text-2xl font-bold text-[#4ecdc4] mb-1">600+</div>
                <div className="text-[#405862]/70 text-xs">Service Hours Earned</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-[#f5f1eb]/50">
        <div className="container max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#405862] mb-3">Our Events & Initiatives</h2>
            <p className="text-[#405862]/70 max-w-2xl mx-auto">
              Transformative programs designed to inspire, educate, and empower youth in healthcare
            </p>
          </motion.div>

          <div className="space-y-10">
            {/* Research Proposal Competition */}
            <motion.div
              className="grid md:grid-cols-2 gap-6 items-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInLeft}
            >
              <div className="space-y-3">
                <div className="inline-block bg-[#4ecdc4]/10 text-[#4ecdc4] px-3 py-1.5 rounded-full text-xs font-semibold">
                  Research Competition
                </div>
                  <h3 className="text-xl font-bold text-[#405862]">
                    The Annual Dr. Interested Research Proposal Competition
                  </h3>
                  <p className="text-[#405862]/80 text-sm leading-relaxed">
                    Bringing together over 200 participants from 30+ countries, this competition empowers youth to explore research through guided webinars and mentorship. Top submissions earn one-on-one mentorship from medical students and research professionals.
                  </p>
                <div className="bg-white p-3 rounded-lg border-l-4 border-[#4ecdc4]">
                  <div className="flex gap-2">
                    <Quote className="w-4 h-4 text-[#4ecdc4] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[#405862]/80 text-xs italic mb-1">
                        "This Research Competition for me was a wonderful experience as it helped me with learning the
                        importance of biomedical engineering which is something I want to pursue in the future."
                      </p>
                      <p className="text-[#405862]/60 text-xs">— 15 y.o., Low Income, USA</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative h-[280px] rounded-xl overflow-hidden shadow-xl">
                <Image
                  src="/research.png"
                  alt="Research Competition"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </motion.div>

            {/* Resilient Minds Project */}
            <motion.div
              className="grid md:grid-cols-2 gap-6 items-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInRight}
            >
              <div className="order-2 md:order-1 relative h-[280px] rounded-xl overflow-hidden shadow-xl">
                <Image
                  src="/mindsproject.png"
                  alt="Resilient Minds Project"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="order-1 md:order-2 space-y-3">
                <div className="inline-block bg-[#4ecdc4]/10 text-[#4ecdc4] px-3 py-1.5 rounded-full text-xs font-semibold">
                  Mental Health Initiative
                </div>
                <h3 className="text-xl font-bold text-[#405862]">The Resilient Minds Project</h3>
                <p className="text-[#405862]/80 text-sm leading-relaxed">
                  A mental health-focused event series fostering resilience, emotional literacy, and peer connection.
                  Over 400 youth impacted with a $60 toolkit provided to 300+ participants.
                </p>
                <div className="bg-white p-3 rounded-lg border-l-4 border-[#4ecdc4]">
                  <div className="flex gap-2">
                    <Quote className="w-4 h-4 text-[#4ecdc4] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[#405862]/80 text-xs italic mb-1">
                        "Being part of Dr. Interested—especially through the Resilient Minds event—opened my eyes to how
                        mental health and medicine connect."
                      </p>
                      <p className="text-[#405862]/60 text-xs">— 14 y.o., Black, Canada</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Cards for Nurses */}
            <motion.div
              className="grid md:grid-cols-2 gap-6 items-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInLeft}
            >
              <div className="space-y-3">
                <div className="inline-block bg-[#4ecdc4]/10 text-[#4ecdc4] px-3 py-1.5 rounded-full text-xs font-semibold">
                  Community Service
                </div>
                <h3 className="text-xl font-bold text-[#405862]">Virtual Cards for Nurses Initiative</h3>
                <p className="text-[#405862]/80 text-sm leading-relaxed">
                  Members earned volunteer hours while learning about the vital role and everyday challenges faced by
                  nurses, fostering both empathy and civic engagement.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded-lg text-center">
                    <div className="text-xl font-bold text-[#4ecdc4] mb-0.5">375+</div>
                    <div className="text-[#405862]/70 text-xs">Cards Collected</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg text-center">
                    <div className="text-xl font-bold text-[#4ecdc4] mb-0.5">5+</div>
                    <div className="text-[#405862]/70 text-xs">Care Centers</div>
                  </div>
                </div>
              </div>
              <div className="relative h-[280px] rounded-xl overflow-hidden shadow-xl">
                <Image
                  src="/cards.png"
                  alt="Cards for Nurses"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </motion.div>

            {/* Creative Contest */}
            <motion.div
              className="grid md:grid-cols-2 gap-6 items-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInRight}
            >
              <div className="order-2 md:order-1 relative h-[280px] rounded-xl overflow-hidden shadow-xl">
                <Image
                  src="/competition.png"
                  alt="Creative Contest"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="order-1 md:order-2 space-y-3">
                <div className="inline-block bg-[#4ecdc4]/10 text-[#4ecdc4] px-3 py-1.5 rounded-full text-xs font-semibold">
                  Creative Expression
                </div>
                <h3 className="text-xl font-bold text-[#405862]">Creative Arts & Writing Competition</h3>
                <p className="text-[#405862]/80 text-sm leading-relaxed">
                  This contest encouraged youth to express themselves through storytelling and art, showing how
                  creativity can drive advocacy in healthcare and medicine. 35+ youth engaged with 20+ text and 15+ art
                  submissions.
                </p>
              </div>
            </motion.div>

            {/* Chess Club */}
            <motion.div
              className="grid md:grid-cols-2 gap-6 items-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInLeft}
            >
              <div className="space-y-3">
                <div className="inline-block bg-[#4ecdc4]/10 text-[#4ecdc4] px-3 py-1.5 rounded-full text-xs font-semibold">
                  Community Fundraising
                </div>
                <h3 className="text-xl font-bold text-[#405862]">
                  <Link href="https://chess.drinterested.org" target="_blank" rel="noopener noreferrer" className="hover:text-[#4ecdc4] transition-colors">
                    Simmon Chang Chess (Against Cancer) Club
                  </Link>
                </h3>
                <p className="text-[#405862]/80 text-sm leading-relaxed">
                  The{" "}
                  <Link
                    href="https://chess.drinterested.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#4ecdc4] font-medium hover:underline"
                  >
                    Simmon Chang Chess (Against Cancer) Club
                  </Link>{" "}
                  runs CFC-rated chess tournaments that donate 100% of proceeds to the Pediatric Cancer Research
                  Foundation, in honour of Simmon Chang.
                </p>
              </div>
              <div className="relative h-[280px] rounded-xl overflow-hidden shadow-xl">
                <Image
                  src="/chessdrint.png"
                  alt="Simmon Chang Chess (Against Cancer) Club"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#405862] mb-3">Voices from Our Community</h2>
            <p className="text-[#405862]/70 max-w-2xl mx-auto">
              Real stories from youth who have grown through Dr. Interested programs
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn}>
              <div className="bg-[#f5f1eb] p-5 rounded-xl h-full flex flex-col">
                <Quote className="w-6 h-6 text-[#4ecdc4] mb-3" />
                <p className="text-[#405862]/80 text-xs italic mb-3 flex-grow">
                  "I thoroughly enjoyed participating in the competition because it gave me a chance to grow and look
                  back at my personal lackings while embracing new challenges in the journey."
                </p>
                <div className="text-[#405862]/60 text-xs font-medium">— Research Competition Participant</div>
              </div>
            </motion.div>

            <motion.div variants={fadeIn}>
              <div className="bg-[#f5f1eb] p-5 rounded-xl h-full flex flex-col">
                <Quote className="w-6 h-6 text-[#4ecdc4] mb-3" />
                <p className="text-[#405862]/80 text-xs italic mb-3 flex-grow">
                  "I used to feel intimidated by the idea of starting my own venture. However, I've come to realize that
                  this opportunity is simply a way to advocate for my passion."
                </p>
                <div className="text-[#405862]/60 text-xs font-medium">— Webinar Attendee</div>
              </div>
            </motion.div>

            <motion.div variants={fadeIn}>
              <div className="bg-[#f5f1eb] p-5 rounded-xl h-full flex flex-col">
                <Quote className="w-6 h-6 text-[#4ecdc4] mb-3" />
                <p className="text-[#405862]/80 text-xs italic mb-3 flex-grow">
                  "Dr. Interested helped me level up as a leader by teaching me how to actually communicate clearly and
                  confidently. Being a leader isn't about being loud, it's about being reliable."
                </p>
                <div className="text-[#405862]/60 text-xs font-medium">— Team Member</div>
              </div>
            </motion.div>

            <motion.div variants={fadeIn}>
              <div className="bg-[#f5f1eb] p-5 rounded-xl h-full flex flex-col">
                <Quote className="w-6 h-6 text-[#4ecdc4] mb-3" />
                <p className="text-[#405862]/80 text-xs italic mb-3 flex-grow">
                  "The Discord community has been such a supportive space. I've met people who genuinely understand my
                  journey and are always willing to share advice or encouragement."
                </p>
                <div className="text-[#405862]/60 text-xs font-medium">— Discord Member</div>
              </div>
            </motion.div>

            <motion.div variants={fadeIn}>
              <div className="bg-[#f5f1eb] p-5 rounded-xl h-full flex flex-col">
                <Quote className="w-6 h-6 text-[#4ecdc4] mb-3" />
                <p className="text-[#405862]/80 text-xs italic mb-3 flex-grow">
                  "This was a really insightful experience. As someone who's always aspired to work on a research paper
                  of her own, it provided me with the guidance I'd needed."
                </p>
                <div className="text-[#405862]/60 text-xs font-medium">— Research Participant</div>
              </div>
            </motion.div>

            <motion.div variants={fadeIn}>
              <div className="bg-[#f5f1eb] p-5 rounded-xl h-full flex flex-col">
                <Quote className="w-6 h-6 text-[#4ecdc4] mb-3" />
                <p className="text-[#405862]/80 text-xs italic mb-3 flex-grow">
                  "Understanding ways I could make an impact as a highschooler! Learning about the importance of having
                  a numerical way to track individuals who want to share the same passion as you."
                </p>
                <div className="text-[#405862]/60 text-xs font-medium">— Webinar Participant</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section id="media" className="py-12 bg-[#f5f1eb]/50">
        <div className="container max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#405862] mb-3">Our Content & Media</h2>
            <p className="text-[#405862]/70 max-w-2xl mx-auto">
              Watch our webinar series and listen to our podcast episodes on healthcare, advocacy, and youth leadership
            </p>
          </motion.div>

          {/* Webinar Series */}
          <motion.div
            className="mb-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <h3 className="text-xl font-bold text-[#405862] mb-5 flex items-center gap-2">
              <div className="w-1 h-6 bg-[#4ecdc4] rounded-full"></div>
              Webinar Series
            </h3>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="p-3 pb-0">
                  <LiteYouTube
                    id="8Mp9ulR7L4Y"
                    title="How Youth Can Impact Health Policy"
                    watchHref="/watch/youth-impact-health-policy"
                  />
                </div>
                <div className="p-3">
                  <h4 className="font-semibold text-[#405862] text-sm mb-1">Healthcare Advocacy & Policy Webinar</h4>
                  <p className="text-[#405862]/70 text-xs">
                    Learn how to create your own opportunities and make an impact in healthcare policy
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="p-3 pb-0">
                  <LiteYouTube
                    id="dZj0Oi0aKPw"
                    title="Pathways to Med School: Master's, PhD, and Gap Year Options"
                    watchHref="/watch/pathways-to-med-school"
                  />
                </div>
                <div className="p-3">
                  <h4 className="font-semibold text-[#405862] text-sm mb-1">Youth Leadership in Healthcare</h4>
                  <p className="text-[#405862]/70 text-xs">
                    Discover strategies for building your own healthcare initiative and community
                  </p>
                </div>
              </div>
            </div>

            {/* Spotify Webinar */}
            <div className="mt-5 bg-white rounded-xl p-5 shadow-lg">
              <h4 className="font-semibold text-[#405862] mb-3 text-sm">Listen on Spotify</h4>
              <LiteSpotify
                episodeId="4CwnZwJufNXRcB7iGzrObO"
                title="How Youth Can Impact Health Policy"
                watchHref="/watch/youth-impact-health-policy"
              />
            </div>
          </motion.div>

          {/* Podcast Series */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <h3 className="text-xl font-bold text-[#405862] mb-5 flex items-center gap-2">
              <div className="w-1 h-6 bg-[#4ecdc4] rounded-full"></div>
              Podcast Episodes
            </h3>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="p-3 pb-0">
                  <LiteYouTube
                    id="dQiELtTYjQs"
                    title="Eye Health and Vision Care — Dr. Interested Podcast"
                    watchHref="/listen/eye-health-and-vision-care"
                  />
                </div>
                <div className="p-3">
                  <h4 className="font-semibold text-[#405862] text-sm mb-1">Healthcare Insights Podcast</h4>
                  <p className="text-[#405862]/70 text-xs">
                    Deep conversations about medicine, research, and youth empowerment
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-lg flex flex-col justify-center">
                <h4 className="font-semibold text-[#405862] mb-3 text-sm">Listen on Spotify</h4>
                <LiteSpotify
                  episodeId="03vIYvBFFgNplGlVCKUmLm"
                  title="Eye Health and Vision Care — Dr. Interested Podcast"
                  watchHref="/listen/eye-health-and-vision-care"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInLeft}
            >
              <h2 className="text-3xl font-bold text-[#405862] mb-3">Join Our Thriving Community</h2>
              <p className="text-[#405862]/80 mb-5 text-sm leading-relaxed">
                Our Discord server is the heart of Dr. Interested—a safe, inclusive space where 1,400+ members connect,
                collaborate, and support each other daily. With a 106% weekly growth rate, we're building something
                special.
              </p>
              <div className="space-y-3 mb-5">
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 bg-[#4ecdc4]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-[#4ecdc4]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#405862] text-sm mb-0.5">Real-Time Support</h4>
                    <p className="text-[#405862]/70 text-xs">
                      Get instant feedback, mentorship, and guidance from peers and advisors
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 bg-[#4ecdc4]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-4 h-4 text-[#4ecdc4]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#405862] text-sm mb-0.5">Office Hours & Mentorship</h4>
                    <p className="text-[#405862]/70 text-xs">
                      Regular sessions with medical students and healthcare professionals
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 bg-[#4ecdc4]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Heart className="w-4 h-4 text-[#4ecdc4]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#405862] text-sm mb-0.5">Safe & Inclusive Space</h4>
                    <p className="text-[#405862]/70 text-xs">
                      Especially welcoming for marginalized youth and first-generation students
                    </p>
                  </div>
                </div>
              </div>
              <a
                href="https://discord.gg/pzbGRgsGXY"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#4ecdc4] text-[#405862] px-6 py-2.5 rounded-lg font-semibold hover:bg-[#4ecdc4]/90 transition-colors text-sm"
              >
                Join Our Discord
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </a>
            </motion.div>
            <motion.div
              className="relative h-[320px] rounded-xl overflow-hidden shadow-xl"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInRight}
            >
              <Image src="/office-hours.png" alt="Discord Community" fill className="object-cover" />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gradient-to-br from-[#405862] to-[#2d4149] text-white">
        <div className="container max-w-4xl text-center mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Ready to Make an Impact?</h2>
            <p className="text-white/90 mb-6 text-base leading-relaxed max-w-2xl mx-auto">
              Join 1,400+ youth from around the world who are discovering their passion in healthcare and making a
              difference in their communities.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="/contact"
                className="bg-[#4ecdc4] text-[#405862] px-7 py-2.5 rounded-lg font-semibold hover:bg-[#4ecdc4]/90 transition-colors"
              >
                Get Involved
              </a>
              <a
                href="/publications"
                className="bg-white/10 text-white px-7 py-2.5 rounded-lg font-semibold hover:bg-white/20 transition-colors backdrop-blur-sm"
              >
                Read Our Publications
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
