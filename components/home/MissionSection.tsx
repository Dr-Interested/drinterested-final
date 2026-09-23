"use client"

import { Users, TrendingUp, Award, Globe } from "lucide-react"
import { motion } from "framer-motion"
import { fadeIn, staggerContainer, scaleIn } from "./animations"

export default function MissionSection() {
  return (
    <>
      {/* Our Goal, Mission, and Vision */}
      <section className="py-10 bg-white">
  <div className="container">
    <motion.div
      className="text-center mb-6"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeIn}
    >
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
          <div className="text-3xl font-bold text-[#405862] mb-1">3.7M+</div>
          <div className="text-[#405862]/70 text-xs font-medium">Content Impressions</div>
        </div>
      </motion.div>
    </motion.div>

    {/* PURPOSE SECTION — FIXED NESTING */}
    <div className="text-center mb-10">
      <h2 className="text-2xl font-bold text-[#405862] inline-flex flex-col items-center">
        Our Purpose
        <div className="w-16 h-1 bg-[#4ecdc4] mt-2"></div>
      </h2>
      <p className="text-[#405862]/70 max-w-2xl mx-auto mt-2 text-sm">
        To bridge the gap between interest and action in youth healthcare leadership
        by offering accessible resources, mentorship, and research opportunities.
      </p>
    </div>

    {/* GOAL / MISSION / VISION Redploy-2*/}
    <motion.div
      className="grid md:grid-cols-3 gap-4"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
    >
      <motion.div
        className="border border-[#405862]/10 p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow transform hover:-translate-y-1 duration-300"
        variants={fadeIn}
      >
        <div className="bg-[#4ecdc4]/10 w-10 h-10 rounded-full flex items-center justify-center mb-3">
          {/* icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#4ecdc4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 4v5h-9l1-1v-4" />
            <path d="M15 4h6v5h-6" />
            <path d="M4 13h5" />
            <path d="M9 18h6" />
            <path d="M13 12v6" />
            <path d="M4 7v12a2 2 0 0 0 2 2h12" />
            <path d="M4 11V9a2 2 0 0 1 2-2h2" />
          </svg>
        </div>
        <h3 className="text-base font-bold mb-1 text-[#405862]">Goal</h3>
        <p className="text-[#405862]/80 text-sm">
          To inspire, educate, and support high school students on their journey toward a career in healthcare.
        </p>
      </motion.div>

      <motion.div
        className="border border-[#405862]/10 p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow transform hover:-translate-y-1 duration-300"
        variants={fadeIn}
      >
        <div className="bg-[#4ecdc4]/10 w-10 h-10 rounded-full flex items-center justify-center mb-3">
          {/* icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#4ecdc4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
        <h3 className="text-base font-bold mb-1 text-[#405862]">Mission</h3>
        <p className="text-[#405862]/80 text-sm">
          To empower the next generation of healthcare professionals through education,
          collaboration, and meaningful experiences.
        </p>
      </motion.div>

      <motion.div
        className="border border-[#405862]/10 p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow transform hover:-translate-y-1 duration-300"
        variants={fadeIn}
      >
        <div className="bg-[#4ecdc4]/10 w-10 h-10 rounded-full flex items-center justify-center mb-3">
          {/* icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#4ecdc4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
        </div>
        <h3 className="text-base font-bold mb-1 text-[#405862]">Vision</h3>
        <p className="text-[#405862]/80 text-sm">
          A world where every young person has the support to discover their passion in medicine
          and drive change through innovation and advocacy.
        </p>
      </motion.div>
    </motion.div>
  </div>
</section>
    </>
  )
}
