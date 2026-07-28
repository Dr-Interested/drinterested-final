"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Utensils,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Users,
  Award,
  BookOpen,
  Heart,
  ChevronRight,
  HelpCircle,
  Share2,
  Check,
  Building,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// Easily configurable Google Form link & Pricing options
const GOOGLE_FORM_URL = "https://forms.gle/UMyitptfyXvdSCtz7" // Replace with official MedX 2026 form link when ready

const PRICING_TIERS = [
  {
    id: "event-only",
    name: "General Pass",
    badge: "Standard Access",
    price: "$5.00",
    numericPrice: 5,
    foodIncluded: false,
    description: "Full access to all MedX keynotes, panels, workshops, and networking sessions.",
    features: [
      "Admission to all Speaker Keynotes & Career Panels",
      "Access to Interactive Skill Workshops",
      "Networking Sessions with Healthcare Professionals & Peers",
      "Digital Certificate of Participation",
      "Official MedX Conference Digital Toolkit",
    ],
    highlighted: false,
    ctaText: "Register - $5.00",
  },
  {
    id: "event-plus-food",
    name: "Full Pass + Catered Breakfast & Lunch",
    badge: "Recommended & Most Popular",
    price: "$12.00",
    numericPrice: 12,
    foodIncluded: true,
    description: "Full conference access plus catered breakfast & lunch, drinks during breakfast, and priority extras.",
    features: [
      "Everything included in General Pass",
      "Catered Breakfast with Drinks & Beverages",
      "Delicious Catered Lunch Package included",
      "Priority Seating at Keynote & Workshop Sessions",
      "Full MedX Resource & Mentorship Pack",
    ],
    highlighted: true,
    ctaText: "Register - $12.00",
  },
]

export default function MedXConferenceClient() {
  const [copied, setCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  // Countdown to August 16, 2026 at 9:30 AM EDT
  useEffect(() => {
    const targetDate = new Date("2026-08-16T09:30:00-04:00").getTime()

    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const difference = targetDate - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "MedX Conference 2026",
          text: "Check out MedX Conference 2026 at UTM on August 16th!",
          url: window.location.href,
        })
      } catch (err) {
        // Fallback copy
        copyToClipboard()
      }
    } else {
      copyToClipboard()
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const scrollToRegistration = () => {
    const el = document.getElementById("register-section")
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f1eb] via-white to-[#f5f1eb]/40 dark:from-[#080b0e] dark:via-[#0c1015] dark:to-[#080b0e] text-[#405862] dark:text-[#f1ece7] pb-20">
      
      {/* Top Banner Navigation back to Main Site */}
      <div className="bg-[#405862] text-white py-2.5 px-4 shadow-inner">
        <div className="container max-w-6xl mx-auto flex items-center justify-between text-xs md:text-sm">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-medium hover:text-[#4ecdc4] transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Return to Main Website</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-white/70">Organized by Dr. Interested</span>
            <Button
              onClick={handleShare}
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-white hover:text-[#4ecdc4] hover:bg-white/10 px-2"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 mr-1 text-[#4ecdc4]" /> Link Copied!
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5 mr-1" /> Share Event
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-8 pb-16 md:pt-14 md:pb-24 overflow-hidden border-b border-[#4ecdc4]/20">
        {/* Subtle Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#4ecdc4]/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 right-10 w-[300px] h-[300px] bg-[#405862]/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="container max-w-6xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-12 gap-8 md:gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 text-left space-y-6">
              
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2.5">
                <Badge className="bg-[#4ecdc4] hover:bg-[#3dbcb3] text-[#405862] font-semibold px-3 py-1 text-xs md:text-sm rounded-full shadow-sm">
                  MedX 2026 Official Flagship Event
                </Badge>
                <Badge variant="outline" className="border-[#405862]/30 text-[#405862] dark:text-[#f1ece7] px-3 py-1 text-xs rounded-full">
                  EXPLORE. LEARN. LEAD.
                </Badge>
              </div>

              {/* Main Heading */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 md:w-16 md:h-16 flex-shrink-0">
                    <Image
                      src="/medx.png"
                      alt="MedX Logo"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                  <div>
                    <h2 className="text-[#4ecdc4] font-extrabold tracking-wider uppercase text-sm md:text-base">
                      Dr. Interested Presents
                    </h2>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#405862] dark:text-white leading-tight tracking-tight">
                      MedX Conference <span className="text-[#4ecdc4]">2026</span>
                    </h1>
                  </div>
                </div>
                
                <p className="text-xl md:text-2xl font-medium text-[#405862]/90 dark:text-[#f1ece7]/90 italic">
                  "Discover your spark in healthcare!"
                </p>
              </div>

              {/* Event Description */}
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl text-pretty">
                The premier youth-focused career exploration and professional development conference empowering high school students, post-secondary learners, and aspiring healthcare leaders across Ontario.
              </p>

              {/* Key Details Cards Grid */}
              <div className="grid sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-white/80 dark:bg-[#11161d]/80 backdrop-blur-sm p-4 rounded-xl border border-[#4ecdc4]/20 shadow-sm flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-[#4ecdc4] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Date</p>
                    <p className="font-bold text-[#405862] dark:text-white text-sm md:text-base">Sunday, Aug 16, 2026</p>
                  </div>
                </div>

                <div className="bg-white/80 dark:bg-[#11161d]/80 backdrop-blur-sm p-4 rounded-xl border border-[#4ecdc4]/20 shadow-sm flex items-start gap-3">
                  <Clock className="h-5 w-5 text-[#4ecdc4] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Time</p>
                    <p className="font-bold text-[#405862] dark:text-white text-sm md:text-base">9:30 AM – 4:30 PM</p>
                  </div>
                </div>

                <div className="bg-white/80 dark:bg-[#11161d]/80 backdrop-blur-sm p-4 rounded-xl border border-[#4ecdc4]/20 shadow-sm flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-[#4ecdc4] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Location</p>
                    <p className="font-bold text-[#405862] dark:text-white text-sm md:text-base">UTM Campus (UTM Room)</p>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                <Button
                  onClick={scrollToRegistration}
                  size="lg"
                  className="bg-[#405862] hover:bg-[#30434b] text-white font-bold px-8 py-6 text-base rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2 group"
                >
                  <Sparkles className="h-5 w-5 text-[#4ecdc4] group-hover:rotate-12 transition-transform" />
                  <span>Register Now for MedX 2026</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>

                <Link href={GOOGLE_FORM_URL} target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto border-2 border-[#4ecdc4] text-[#405862] dark:text-white hover:bg-[#4ecdc4]/10 font-semibold px-6 py-6 text-base rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <span>Direct Form Link</span>
                    <ExternalLink className="h-4 w-4 text-[#4ecdc4]" />
                  </Button>
                </Link>
              </div>

            </div>

            {/* Right Card Column: Countdown & Registration Quick Card */}
            <div className="lg:col-span-5">
              <Card className="border-2 border-[#4ecdc4]/40 shadow-2xl bg-white dark:bg-[#11161d] overflow-hidden rounded-2xl">
                
                {/* Card Header Banner */}
                <div className="bg-gradient-to-r from-[#405862] to-[#2c3e46] p-6 text-white text-center relative overflow-hidden">
                  <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-24 h-24 bg-[#4ecdc4]/20 rounded-full blur-xl pointer-events-none" />
                  <Badge className="bg-[#4ecdc4] text-[#405862] font-bold uppercase text-[10px] mb-2">
                    Registration Open
                  </Badge>
                  <h3 className="text-xl md:text-2xl font-bold">Secure Your Spot Today</h3>
                  <p className="text-white/80 text-xs mt-1">Limited capacity at UTM. Early registration encouraged!</p>
                </div>

                <CardContent className="p-6 space-y-6">
                  
                  {/* Countdown Timer */}
                  <div className="bg-[#f5f1eb] dark:bg-[#161c24] p-4 rounded-xl border border-[#4ecdc4]/20 text-center">
                    <p className="text-xs font-bold text-[#405862] dark:text-[#4ecdc4] uppercase tracking-wider mb-2">
                      Event Countdown
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="bg-white dark:bg-[#0c1015] p-2 rounded-lg border border-[#405862]/10 shadow-xs">
                        <span className="block text-xl md:text-2xl font-black text-[#405862] dark:text-white">
                          {timeLeft.days}
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase font-semibold">Days</span>
                      </div>
                      <div className="bg-white dark:bg-[#0c1015] p-2 rounded-lg border border-[#405862]/10 shadow-xs">
                        <span className="block text-xl md:text-2xl font-black text-[#405862] dark:text-white">
                          {timeLeft.hours}
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase font-semibold">Hours</span>
                      </div>
                      <div className="bg-white dark:bg-[#0c1015] p-2 rounded-lg border border-[#405862]/10 shadow-xs">
                        <span className="block text-xl md:text-2xl font-black text-[#405862] dark:text-white">
                          {timeLeft.minutes}
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase font-semibold">Mins</span>
                      </div>
                      <div className="bg-white dark:bg-[#0c1015] p-2 rounded-lg border border-[#405862]/10 shadow-xs">
                        <span className="block text-xl md:text-2xl font-black text-[#405862] dark:text-white">
                          {timeLeft.seconds}
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase font-semibold">Secs</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Options Preview */}
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Pass Options:
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 rounded-lg border border-[#4ecdc4]/30 bg-[#4ecdc4]/5">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-[#4ecdc4]" />
                          <span className="text-sm font-semibold text-[#405862] dark:text-white">Event Access Only</span>
                        </div>
                        <span className="font-extrabold text-[#405862] dark:text-white">$5.00</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg border-2 border-[#4ecdc4] bg-white dark:bg-[#1a212b]">
                        <div className="flex items-center gap-2">
                          <Utensils className="h-4 w-4 text-[#4ecdc4]" />
                          <div>
                            <span className="text-sm font-bold text-[#405862] dark:text-white">Event Access + Food</span>
                            <span className="ml-2 text-[10px] bg-[#4ecdc4] text-[#405862] font-bold px-1.5 py-0.5 rounded">Popular</span>
                          </div>
                        </div>
                        <span className="font-extrabold text-[#405862] dark:text-white">$12.00</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={scrollToRegistration}
                    className="w-full bg-[#4ecdc4] hover:bg-[#3dbcb3] text-[#405862] font-bold py-6 text-base rounded-xl shadow-md transition-all hover:scale-[1.01]"
                  >
                    Select Pass & Register
                  </Button>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </section>

      {/* Pricing & Registration Section (CENTRAL GOAL) */}
      <section id="register-section" className="py-16 md:py-24 bg-[#f5f1eb]/60 dark:bg-[#0c1015]">
        <div className="container max-w-5xl mx-auto px-4">
          
          <div className="text-center space-y-4 mb-12">
            <Badge className="bg-[#405862] text-[#4ecdc4] font-bold px-4 py-1 text-sm rounded-full">
              Registration & Pricing
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#405862] dark:text-white">
              Choose Your MedX 2026 Pass
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              All registrations are processed through our official Google Form. Select your preferred tier below to begin your registration.
            </p>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
            {PRICING_TIERS.map((tier) => (
              <Card
                key={tier.id}
                className={`relative flex flex-col rounded-2xl transition-all duration-300 ${
                  tier.highlighted
                    ? "border-2 border-[#4ecdc4] shadow-xl bg-white dark:bg-[#11161d] scale-100 md:scale-[1.03] z-10"
                    : "border border-[#405862]/20 shadow-md bg-white/90 dark:bg-[#11161d]/90"
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#4ecdc4] text-[#405862] font-extrabold text-xs uppercase px-4 py-1 rounded-full shadow-sm tracking-wide">
                    {tier.badge}
                  </div>
                )}

                <CardHeader className="p-6 md:p-8 border-b border-[#405862]/10">
                  {!tier.highlighted && (
                    <Badge variant="secondary" className="w-fit mb-2 bg-[#f5f1eb] text-[#405862] font-semibold">
                      {tier.badge}
                    </Badge>
                  )}
                  <CardTitle className="text-2xl font-bold text-[#405862] dark:text-white">{tier.name}</CardTitle>
                  <CardDescription className="text-sm mt-1">{tier.description}</CardDescription>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-4xl md:text-5xl font-black text-[#405862] dark:text-white">
                      {tier.price}
                    </span>
                    <span className="text-sm text-muted-foreground font-medium">CAD / ticket</span>
                  </div>
                </CardHeader>

                <CardContent className="p-6 md:p-8 flex-1 space-y-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#405862] dark:text-[#4ecdc4]">
                    What's Included:
                  </p>
                  <ul className="space-y-3">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm">
                        <CheckCircle2
                          className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                            tier.highlighted ? "text-[#4ecdc4]" : "text-[#405862] dark:text-[#4ecdc4]"
                          }`}
                        />
                        <span className="text-[#405862]/90 dark:text-[#f1ece7]/90">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="p-6 md:p-8 pt-0">
                  <Link href={GOOGLE_FORM_URL} target="_blank" rel="noopener noreferrer" className="w-full">
                    <Button
                      size="lg"
                      className={`w-full font-bold py-6 text-base rounded-xl transition-all flex items-center justify-center gap-2 ${
                        tier.highlighted
                          ? "bg-[#4ecdc4] hover:bg-[#3dbcb3] text-[#405862] shadow-md hover:scale-[1.02]"
                          : "bg-[#405862] hover:bg-[#30434b] text-white hover:scale-[1.02]"
                      }`}
                    >
                      <span>{tier.ctaText}</span>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Pricing Disclaimer Box */}
          <div className="mt-10 p-6 rounded-2xl bg-white dark:bg-[#11161d] border border-[#4ecdc4]/30 max-w-3xl mx-auto text-center space-y-3 shadow-xs">
            <p className="text-sm font-semibold text-[#405862] dark:text-white">
              ℹ️ Registration Details & Pricing Note
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Ticket prices are set at $5.00 for General Pass and $12.00 for Full Pass + Catered Breakfast & Lunch. Clicking any registration button will redirect to the official Google Form where you can complete your details and confirm your ticket choice.
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              🎓 <strong className="text-[#405862] dark:text-white">Scholarships Available:</strong> If the ticket price poses a financial burden, scholarships are available to cover conference tickets. Please e-mail{" "}
              <a href="mailto:finance@drinterested.org" className="text-[#4ecdc4] hover:underline font-semibold">finance@drinterested.org</a>{" "}
              to indicate your interest in a scholarship to cover the conference ticket.
            </p>
          </div>

        </div>
      </section>

      {/* Official Greetings: Premier Doug Ford Message Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-[#080b0e]">
        <div className="container max-w-4xl mx-auto px-4">
          
          <div className="bg-gradient-to-b from-[#f9f7f4] to-white dark:from-[#11161d] dark:to-[#0e1218] rounded-3xl border-2 border-[#405862]/20 p-8 md:p-12 shadow-xl relative overflow-hidden">
            
            {/* Top Header */}
            <div className="text-center space-y-3 mb-10 border-b border-[#405862]/10 pb-8">
              <Badge className="bg-[#405862] text-[#4ecdc4] font-bold px-4 py-1 text-sm rounded-full">
                Official Greetings
              </Badge>
              <h3 className="text-2xl md:text-3xl font-black text-[#405862] dark:text-white">
                A Message from the Premier of Ontario
              </h3>
            </div>

            {/* Premier Portrait + Letter Side-by-Side */}
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              
              {/* Premier Portrait */}
              <div className="flex flex-col items-center gap-3 lg:w-56 flex-shrink-0">
                <div className="relative w-44 h-52 lg:w-52 lg:h-64 rounded-2xl overflow-hidden border-2 border-[#405862]/20 shadow-lg">
                  <Image
                    src="/medx/premier-doug-ford.jpg"
                    alt="Premier Doug Ford"
                    fill
                    className="object-cover object-top"
                  />
                </div>
                <div className="text-center">
                  <p className="font-bold text-[#405862] dark:text-white text-base">Doug Ford</p>
                  <p className="text-sm text-[#4ecdc4] font-semibold">Premier of Ontario</p>
                </div>
              </div>

              {/* Official Letter Image */}
              <div className="flex-1">
                <div className="relative w-full rounded-2xl overflow-hidden border border-[#405862]/10 shadow-md">
                  <Image
                    src="/medx/premier-letter.png"
                    alt="Official letter from Premier Doug Ford for MedX Conference 2026"
                    width={800}
                    height={1100}
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Conference Pillars / Why Attend */}
      <section className="py-16 md:py-24 bg-[#f5f1eb]/50 dark:bg-[#0c1015]">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="border-[#4ecdc4] text-[#405862] dark:text-[#f1ece7] font-semibold px-4 py-1 text-sm rounded-full">
              Why Attend MedX 2026?
            </Badge>
            <h2 className="text-3xl md:text-4xl font-black text-[#405862] dark:text-white">
              Empowering The Next Generation of Healthcare Leaders
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
              Designed specifically to bridge the gap between passion and career reality in healthcare, medicine, and research.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border border-[#4ecdc4]/20 shadow-md bg-white dark:bg-[#11161d] hover:shadow-lg transition-all rounded-2xl">
              <CardHeader className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#4ecdc4]/20 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-[#405862] dark:text-[#4ecdc4]" />
                </div>
                <CardTitle className="text-xl font-bold text-[#405862] dark:text-white">EXPLORE Pathways</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground leading-relaxed">
                Discover diverse careers in medicine, nursing, biomedical engineering, health policy, and clinical research. Learn about degree choices, high school prerequisites, and admissions.
              </CardContent>
            </Card>

            <Card className="border border-[#4ecdc4]/20 shadow-md bg-white dark:bg-[#11161d] hover:shadow-lg transition-all rounded-2xl">
              <CardHeader className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#4ecdc4]/20 flex items-center justify-center">
                  <Users className="h-6 w-6 text-[#405862] dark:text-[#4ecdc4]" />
                </div>
                <CardTitle className="text-xl font-bold text-[#405862] dark:text-white">LEARN from Experts</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground leading-relaxed">
                Hear directly from practicing physicians, medical students, professors, and health sector innovators. Ask real questions during dedicated live Q&A panel sessions.
              </CardContent>
            </Card>

            <Card className="border border-[#4ecdc4]/20 shadow-md bg-white dark:bg-[#11161d] hover:shadow-lg transition-all rounded-2xl">
              <CardHeader className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#4ecdc4]/20 flex items-center justify-center">
                  <Award className="h-6 w-6 text-[#405862] dark:text-[#4ecdc4]" />
                </div>
                <CardTitle className="text-xl font-bold text-[#405862] dark:text-white">LEAD & Connect</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground leading-relaxed">
                Build professional network connections with like-minded peers across Ontario, earn a verified Certificate of Participation, and unlock mentorship opportunities.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Schedule & Venue Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-[#080b0e]">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            
            {/* Timeline */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <Badge className="bg-[#4ecdc4] text-[#405862] font-bold mb-2">Event Breakdown</Badge>
                <h2 className="text-3xl font-black text-[#405862] dark:text-white">Tentative Event Schedule</h2>
                <p className="text-sm text-muted-foreground mt-1">August 16, 2026 • 9:30 AM to 4:30 PM</p>
              </div>

              <div className="space-y-4 relative border-l-2 border-[#4ecdc4]/40 pl-6 ml-3">
                <div className="relative">
                  <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-[#4ecdc4] border-2 border-white dark:border-[#080b0e]" />
                  <p className="text-xs font-bold text-[#4ecdc4]">9:30 AM - 9:45 AM</p>
                  <h4 className="font-bold text-[#405862] dark:text-white text-base">Doors Open & Registration</h4>
                  <p className="text-xs text-muted-foreground">Arrive, check in, pick up your delegate badge, and get settled before the program begins.</p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-[#4ecdc4] border-2 border-white dark:border-[#080b0e]" />
                  <p className="text-xs font-bold text-[#4ecdc4]">9:45 AM - 10:00 AM</p>
                  <h4 className="font-bold text-[#405862] dark:text-white text-base">Opening Ceremonies</h4>
                  <p className="text-xs text-muted-foreground">Welcome address, introduction to MedX 2026, and opening remarks from Dr. Interested leadership.</p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-[#4ecdc4] border-2 border-white dark:border-[#080b0e]" />
                  <p className="text-xs font-bold text-[#4ecdc4]">10:00 AM - 12:00 PM</p>
                  <h4 className="font-bold text-[#405862] dark:text-white text-base">Morning Session — Keynote Speeches</h4>
                  <p className="text-xs text-muted-foreground">Inspiring keynote speeches from healthcare professionals, physicians, and leaders across the medical sector.</p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-[#4ecdc4] border-2 border-white dark:border-[#080b0e]" />
                  <p className="text-xs font-bold text-[#4ecdc4]">12:00 PM - 1:00 PM</p>
                  <h4 className="font-bold text-[#405862] dark:text-white text-base">Lunch & Networking Break</h4>
                  <p className="text-xs text-muted-foreground">Enjoy catered lunch (for Full Pass holders) and network with speakers, sponsors, and peers.</p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-[#4ecdc4] border-2 border-white dark:border-[#080b0e]" />
                  <p className="text-xs font-bold text-[#4ecdc4]">1:00 PM - 4:30 PM</p>
                  <h4 className="font-bold text-[#405862] dark:text-white text-base">Afternoon Session — Interactive Workshops</h4>
                  <p className="text-xs text-muted-foreground">Hands-on breakout workshops on medical research, clinical problem-solving, healthcare skills, and career strategy.</p>
                </div>
              </div>
            </div>

            {/* Venue Box */}
            <div className="lg:col-span-5">
              <Card className="border-2 border-[#4ecdc4]/30 shadow-lg bg-[#f5f1eb]/50 dark:bg-[#11161d] rounded-2xl overflow-hidden">
                <CardHeader className="bg-[#405862] text-white p-6">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-6 w-6 text-[#4ecdc4]" />
                    <div>
                      <CardTitle className="text-xl font-bold">Venue Information</CardTitle>
                      <CardDescription className="text-white/80 text-xs">University of Toronto Mississauga</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase">Location</p>
                    <p className="font-bold text-[#405862] dark:text-white text-base">UTM Room / Main Campus</p>
                    <p className="text-sm text-muted-foreground">3359 Mississauga Rd, Mississauga, ON L5L 1C6</p>
                  </div>

                  <div className="p-4 rounded-xl bg-white dark:bg-[#0c1015] border border-[#405862]/10 space-y-2">
                    <p className="text-xs font-bold text-[#405862] dark:text-[#4ecdc4]">Getting Here</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Accessible via MiWay bus routes, shuttle service, and ample campus parking available near the venue.
                    </p>
                  </div>

                  <Link
                    href="https://maps.google.com/?q=University+of+Toronto+Mississauga"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" className="w-full border-[#405862] text-[#405862] dark:text-white hover:bg-[#405862]/10 font-semibold rounded-xl">
                      Open in Google Maps <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </section>

      {/* Sponsors & Partners Section */}
      <section className="py-14 bg-[#f5f1eb]/80 dark:bg-[#0c1015] border-t border-b border-[#4ecdc4]/20">
        <div className="container max-w-5xl mx-auto px-4 text-center space-y-8">
          <div>
            <Badge variant="secondary" className="bg-white dark:bg-[#161c24] text-[#405862] dark:text-[#4ecdc4] font-bold mb-2">
              Partners & Supporters
            </Badge>
            <h3 className="text-2xl font-extrabold text-[#405862] dark:text-white">Supported By Visionary Organizations</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-stretch justify-center">
            {/* Dr. Interested */}
            <div className="bg-white dark:bg-[#11161d] p-5 rounded-2xl border border-[#405862]/10 shadow-xs flex flex-col items-center justify-between gap-3 min-h-[120px]">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Presented By</span>
              <div className="relative w-full h-10 flex-shrink-0">
                <Image
                  src="/medx/dr-interested-logo.png"
                  alt="Dr. Interested"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-semibold text-xs text-[#405862] dark:text-white">Dr. Interested</span>
            </div>

            {/* Canada Service Corps */}
            <div className="bg-white dark:bg-[#11161d] p-5 rounded-2xl border border-[#405862]/10 shadow-xs flex flex-col items-center justify-between gap-3 min-h-[120px]">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Funded By</span>
              <div className="relative w-full h-12 flex-shrink-0">
                <Image
                  src="/medx/canada-service-corps-logo.png"
                  alt="Canada Service Corps / Canada"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-semibold text-xs text-[#405862] dark:text-white">Canada Service Corps</span>
            </div>

            {/* TakingITGlobal */}
            <div className="bg-white dark:bg-[#11161d] p-5 rounded-2xl border border-[#405862]/10 shadow-xs flex flex-col items-center justify-between gap-3 min-h-[120px]">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Sponsored By</span>
              <div className="relative w-full h-12 flex-shrink-0 flex items-center justify-center">
                <span className="text-2xl font-black text-[#405862] dark:text-white tracking-tight">TIG</span>
              </div>
              <span className="font-semibold text-xs text-[#405862] dark:text-white">TakingITGlobal</span>
            </div>

            {/* Sprout Fellowship */}
            <div className="bg-white dark:bg-[#11161d] p-5 rounded-2xl border border-[#405862]/10 shadow-xs flex flex-col items-center justify-between gap-3 min-h-[120px]">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Sponsored By</span>
              <div className="relative w-full h-12 flex-shrink-0 flex items-center justify-center">
                <span className="text-2xl font-black text-green-600 dark:text-green-400">🌱</span>
              </div>
              <span className="font-semibold text-xs text-[#405862] dark:text-white">Sprout Fellowship</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-[#080b0e]">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center space-y-3 mb-12">
            <Badge className="bg-[#405862] text-[#4ecdc4] font-bold">Got Questions?</Badge>
            <h2 className="text-3xl font-black text-[#405862] dark:text-white">Frequently Asked Questions</h2>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1" className="border border-[#405862]/20 rounded-xl px-4 bg-[#f5f1eb]/30 dark:bg-[#11161d]">
              <AccordionTrigger className="font-bold text-[#405862] dark:text-white hover:no-underline">
                Who can attend MedX Conference 2026?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                MedX Conference 2026 is open to high school students, post-secondary learners, undergraduate students, and any youth interested in medicine, healthcare, research, and life sciences.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border border-[#405862]/20 rounded-xl px-4 bg-[#f5f1eb]/30 dark:bg-[#11161d]">
              <AccordionTrigger className="font-bold text-[#405862] dark:text-white hover:no-underline">
                What is the difference between the $5.00 and $12.00 pass?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                The $5.00 General Pass covers full event access, keynotes, workshops, networking, and digital certificate. The $12.00 Full Pass includes all of that PLUS a catered lunch, afternoon snacks, and beverage package during the conference.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border border-[#405862]/20 rounded-xl px-4 bg-[#f5f1eb]/30 dark:bg-[#11161d]">
              <AccordionTrigger className="font-bold text-[#405862] dark:text-white hover:no-underline">
                How do I submit my registration?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                Clicking any "Register" button on this page will open our official Google Form. Simply fill in your contact information and select your ticket option to reserve your spot!
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border border-[#405862]/20 rounded-xl px-4 bg-[#f5f1eb]/30 dark:bg-[#11161d]">
              <AccordionTrigger className="font-bold text-[#405862] dark:text-white hover:no-underline">
                Will I receive volunteer hours or a certificate?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                Yes! All attendees will receive a verified Digital Certificate of Participation from Dr. Interested following the conference.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Return to Main Site Bottom CTA Banner */}
      <section className="py-12 bg-gradient-to-r from-[#405862] via-[#334852] to-[#405862] text-white">
        <div className="container max-w-5xl mx-auto px-4 text-center space-y-6">
          <h3 className="text-2xl md:text-3xl font-black">Ready to Discover Your Spark in Healthcare?</h3>
          <p className="text-white/80 max-w-xl mx-auto text-sm md:text-base">
            Don't miss out on Ontario's premier youth healthcare conference at UTM on August 16th, 2026.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Button
              onClick={scrollToRegistration}
              size="lg"
              className="bg-[#4ecdc4] hover:bg-[#3dbcb3] text-[#405862] font-extrabold px-8 py-6 rounded-xl text-base shadow-lg"
            >
              Register for MedX 2026
            </Button>
            <Link href="/">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white text-white bg-white/10 hover:bg-white/20 font-semibold px-6 py-6 rounded-xl text-base"
              >
                Return to Main Website
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Sticky Bottom Bar for Quick Registration on Mobile/Desktop */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0c1015]/95 backdrop-blur-md border-t border-[#4ecdc4]/30 py-3 px-4 shadow-2xl">
        <div className="container max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden sm:flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#4ecdc4]/20 flex items-center justify-center">
              <Calendar className="h-4 w-4 text-[#4ecdc4]" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#405862] dark:text-white">MedX Conference 2026</p>
              <p className="text-[11px] text-muted-foreground">Aug 16, 2026 @ UTM (9:30 AM - 4:30 PM)</p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3">
            <div className="text-left sm:text-right">
              <span className="text-xs text-muted-foreground block">Registration:</span>
              <span className="text-sm font-extrabold text-[#405862] dark:text-white">$5.00 / $12.00</span>
            </div>
            <Button
              onClick={scrollToRegistration}
              size="sm"
              className="bg-[#4ecdc4] hover:bg-[#3dbcb3] text-[#405862] font-bold px-5 py-2.5 rounded-lg shadow-sm text-xs md:text-sm"
            >
              Register Now
            </Button>
          </div>
        </div>
      </div>

    </div>
  )
}
