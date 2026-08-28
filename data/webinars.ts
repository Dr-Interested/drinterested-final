export interface Webinar {
  id: string
  slug: string
  title: string
  description: string
  longDescription: string
  date: string
  views: number
  duration: string
  videoPath: string // Path to video file in public folder
  thumbnailPath: string // Path to thumbnail in public folder
  youtubeUrl: string
  spotifyUrl?: string
  tags: string[]
  host?: string
  speaker?: string
  transcript?: string
}

export const webinars: Webinar[] = [
  {
    id: "11",
    slug: "sup-apps-tips-tricks-being-yourself",
    title: "Dr. Interested Webinar Series: Sup Apps, Tips, Tricks & Being Yourself",
    description:
      "A practical session on supplemental applications — tips, strategies, and the importance of authenticity.",
    longDescription:
      "Learn how to approach supplemental applications with confidence. We’ll cover effective strategies, common pitfalls, and how to present your true self in competitive processes.",
    date: "November 23, 2025",
    views: 268,
    duration: "25:25",
    videoPath: "https://hc-cdn.hel1.your-objectstorage.com/s/v3/fe40edc3e5303f47ecc367d2c4db76097d3d4cf8_video1674994875.mp4", // UPDATE THIS PATH
    thumbnailPath: "/11.png", // UPDATE THIS PATH
    youtubeUrl: "https://www.youtube.com/playlist?list=PLhgtIQtU24W31o5fuBLCyjHjMtJemQatE",
    spotifyUrl: "https://open.spotify.com/show/33gmJc8TuysM6eDYWTmBvJ",
    tags: ["Applications", "Tips", "StudentSuccess"],
    speaker: "Nicholas Elias",
    host: "Dr. Interested Webinar Series",
  },
  {
    id: "10",
    slug: "mcmaster-health-sci-experience-application-to-first-year",
    title: "Dr. Interested Webinar Series: From Application to First Year — McMaster Health Sci Experience",
    description:
      "A candid look at the McMaster Health Sci journey from applying to thriving in first year.",
    longDescription:
      "Hear firsthand insights on preparing a strong application, adjusting to university life, and making the most of the Health Sci program at McMaster.",
    date: "November 16, 2025",
    views: 337,
    duration: "25:25",
    videoPath: "https://hc-cdn.hel1.your-objectstorage.com/s/v3/a80721f9747dd50b8155530af94c0bb9b7fc5813_video1339333384.mp4", // UPDATE THIS PATH
    thumbnailPath: "/10.png", // UPDATE THIS PATH
    youtubeUrl: "https://www.youtube.com/playlist?list=PLhgtIQtU24W31o5fuBLCyjHjMtJemQatE",
    spotifyUrl: "https://open.spotify.com/show/33gmJc8TuysM6eDYWTmBvJ",
    tags: ["HealthSci", "McMaster", "University", "Applications"],
    speaker: "Isaac Tang",
    host: "Dr. Interested Webinar Series",
  },
  {
    id: "9",
    slug: "inside-biomedical-science-first-year-experience",
    title: "Dr. Interested Webinar Series: Inside Biomedical Science — First Year of University",
    description:
      "What first year Biomedical Science is really like — expectations, challenges, and tips.",
    longDescription:
      "Get a transparent overview of the first-year experience in Biomedical Science, including study habits, managing workload, and building a foundation for success.",
    date: "November 9, 2025",
    views: 149,
    duration: "25:25",
    videoPath: "https://hc-cdn.hel1.your-objectstorage.com/s/v3/5d02b16c5ccc37bdb2e60503645bae67af875f2f_video1695640159.mp4", // UPDATE THIS PATH
    thumbnailPath: "/9.png", // UPDATE THIS PATH
    youtubeUrl: "https://www.youtube.com/playlist?list=PLhgtIQtU24W31o5fuBLCyjHjMtJemQatE",
    spotifyUrl: "https://open.spotify.com/show/33gmJc8TuysM6eDYWTmBvJ",
    tags: ["BiomedicalScience", "University", "FirstYear"],
    speaker: "Maiwand Gawharzad",
    host: "Dr. Interested Webinar Series",
  },
  {
    id: "8",
    slug: "from-code-to-care-mental-health-social-media",
    title: "Dr. Interested Webinar Series: From Code to Care — Mental Health and Social Media",
    description:
      "Exploring the intersection of technology, social media, and mental health.",
    longDescription:
      "Dive into how social platforms influence mental health and how tech can be leveraged for care, support, and healthier online habits.",
    date: "November 2, 2025",
    views: 223,
    duration: "25:25",
    videoPath: "https://hc-cdn.hel1.your-objectstorage.com/s/v3/cf77a8f2d8f71d8d826135604d13a4696a96a4b4_video1146441928.mp4", // UPDATE THIS PATH
    thumbnailPath: "/8.png", // UPDATE THIS PATH
    youtubeUrl: "https://www.youtube.com/playlist?list=PLhgtIQtU24W31o5fuBLCyjHjMtJemQatE",
    spotifyUrl: "https://open.spotify.com/show/33gmJc8TuysM6eDYWTmBvJ",
    tags: ["MentalHealth", "SocialMedia", "Technology"],
    speaker: "Saul Drantch",
    host: "Dr. Interested Webinar Series",
  },
  {
    id: "7",
    slug: "md-phd-path-medical-ethics-casper-research-careers",
    title: "Dr. Interested Webinar Series: MD/PhD Path, Medical Ethics & CASPer, and Careers as Research Scientists",
    description:
      "An overview of the MD/PhD journey, medical ethics and CASPer, plus research career insights.",
    longDescription:
      "Understand the dual-degree MD/PhD path, prepare for CASPer with an ethics-focused lens, and learn what careers look like for research scientists.",
    date: "October 26, 2025",
    views: 314,
    duration: "25:25",
    videoPath: "https://hc-cdn.hel1.your-objectstorage.com/s/v3/562b547b3e612e6439e2fe01b6e30107f136fa64_video1171919166.mp4", // UPDATE THIS PATH
    thumbnailPath: "/7.png", // UPDATE THIS PATH
    youtubeUrl: "https://www.youtube.com/playlist?list=PLhgtIQtU24W31o5fuBLCyjHjMtJemQatE",
    spotifyUrl: "https://open.spotify.com/show/33gmJc8TuysM6eDYWTmBvJ",
    tags: ["MDPhD", "Ethics", "CASPer", "ResearchCareers"],
    speaker: "David Zhu",
    host: "Dr. Interested Webinar Series",
  },
  {
    id: "6",
    slug: "from-hormones-to-careers-exploring-endocrinology",
    title: "Dr. Interested Webinar Series: From Hormones to Careers — Exploring Endocrinology",
    description:
      "Discover endocrinology from foundational hormone science to real-world career paths.",
    longDescription:
      "Explore the field of endocrinology — what it studies, why it matters, and how to build a career in this specialty.",
    date: "October 19, 2025",
    views: 182,
    duration: "25:25",
    videoPath: "https://hc-cdn.hel1.your-objectstorage.com/s/v3/e0528368df72d8d370543862d6dd0523a4e153d7_video1914344293.mp4", // UPDATE THIS PATH
    thumbnailPath: "/6.png", // UPDATE THIS PATH
    youtubeUrl: "https://www.youtube.com/playlist?list=PLhgtIQtU24W31o5fuBLCyjHjMtJemQatE",
    spotifyUrl: "https://open.spotify.com/show/33gmJc8TuysM6eDYWTmBvJ",
    tags: ["Endocrinology", "Hormones", "Careers"],
    speaker: "Muhammad Shamoon Umerani",
    host: "Dr. Interested Webinar Series",
  },
  {
    id: "5",
    slug: "demystifying-research-papers",
    title: "Dr. Interested Webinar Series #5: Demystifying Research Papers From Literature Review to Publication",
    description:
      "Watch the full recording of our fifth Dr. Interested Webinar, featuring Chinthala Trisha Goud. In this session, Trisha breaks down the research process step by step — from reviewing existing literature to writing and publishing your own paper.",
    longDescription:
      "Perfect for students, early researchers, and anyone curious about how academic research really works. Learn the complete research paper process from literature review to publication, including practical tips for writing, formatting, and submitting your work to journals. Hosted by Dr. Interested — empowering youth to explore health, science, and research.",
    date: "October 10, 2025",
    views: 254,
    duration: "25:25",
    videoPath: "https://hc-cdn.hel1.your-objectstorage.com/s/v3/eda700b4c902a2c307da7946568be7b3669f8bf8_drintpremedcompwebinar.mp4", // UPDATE THIS PATH
    thumbnailPath: "/drintthumbnaildemistifiyingreasearch.png", // UPDATE THIS PATH
    youtubeUrl: "https://youtu.be/8G57EJFUZzE?si=JInq2f-H9BpM1_vb",
    spotifyUrl: "https://open.spotify.com/episode/4Z4UkUTF7AldXtoyujxzdK?si=86b5ed24a7194b10",
    tags: ["ResearchPaper", "MedicalResearch", "ScienceEducation", "AcademicWriting", "Publication"],
    speaker: "Chinthala Trisha Goud",
    host: "Dr. Interested Webinar Series",
  },
  {
    id: "4",
    slug: "pathways-to-med-school",
    title: "Dr. Interested Webinar Series #4: Pathways to Med School: Master's, PhD, and Gap Year Options",
    description:
      "Youth exploring medicine, this one's for you! In this webinar, Kate Tucker breaks down the different pathways to medical school, including pursuing a Master's, a PhD, or taking a gap year.",
    longDescription:
      "Learn the pros and cons of each path, how to prepare effectively, and tips for making decisions that align with your goals. Whether you're planning your pre-med journey, considering research opportunities, or curious about gap year strategies, this session gives practical advice and inspiration to navigate your next steps confidently.",
    date: "October 6, 2025",
    views: 206,
    duration: "32:31",
    videoPath: "https://hc-cdn.hel1.your-objectstorage.com/s/v3/329e59bafc0b9ce5b7e0b7dc3a9e29716da8a9ea_drintpathwaystomedwebinar.mp4", // UPDATE THIS PATH
    thumbnailPath: "/drintthumbnailpathwaystomed.png", // UPDATE THIS PATH
    youtubeUrl: "https://youtu.be/dZj0Oi0aKPw?si=7nOnJz1coLZG5356",
    spotifyUrl: "https://open.spotify.com/episode/5ru345a1LG0AUHKYonqqvM?si=cc04b6676d1e4efe",
    tags: ["PreMed", "Education", "StudentSuccess", "MedicalSchool", "GapYear", "GraduateSchool"],
    speaker: "Kate Tucker",
    host: "Dr. Interested Webinar Series",
  },
  {
    id: "3",
    slug: "premed-competitions",
    title: "Dr. Interested Webinar Series: #3 Premed Competitions — How to Find, Prepare, and Excel",
    description:
      "Thinking about entering premed competitions? Whether it's science fairs, Olympiads, medical journalism, or research challenges — this session breaks down how to discover the right opportunities, prepare strategically, and excel in the process.",
    longDescription:
      "Hosted by Dr. Interested with insights from youth leaders and aspiring medical professionals, this webinar is designed to support high school and undergraduate students on their premed journey. Learn proven strategies for competition success and how to make your applications stand out.",
    date: "September 14, 2025",
    views: 145,
    duration: "29:48",
    videoPath: "https://hc-cdn.hel1.your-objectstorage.com/s/v3/407c212257a8ecc9b8a07e6ffff30fdcdbe17a79_drintresearchwebinar.mp4", // UPDATE THIS PATH
    thumbnailPath: "/drintthumbnailpremedcomps.png", // UPDATE THIS PATH
    youtubeUrl: "https://youtu.be/3YPxHLOdsOU?si=giCeC-MCk0R7JlOK",
    spotifyUrl: "https://open.spotify.com/episode/2ZajhQT5piThDtwZgdk1dX?si=9550ca993e8d4c8c",
    tags: ["Premed", "MedicalSchool", "FutureDoctors", "Competitions", "ScienceFair"],
    host: "Dr. Interested Webinar Series",
  },
  {
    id: "2",
    slug: "youth-impact-health-policy",
    title: "Dr. Interested Webinar Series: #2 How Youth Can Impact Health Policy w/ our Exec Dir Adil Mukhi",
    description:
      "Youth voices matter in shaping the future of healthcare. In this webinar, our Executive Director Adil Mukhi shares insights on how young people can influence policy, advocate for change, and contribute meaningfully to health systems.",
    longDescription:
      "Whether you're a student, aspiring leader, or passionate about advocacy, this session will give you tools and inspiration to get started in health policy. Learn about real-world examples of youth-led policy initiatives and discover pathways to make your voice heard in healthcare decision-making.",
    date: "September 7, 2025",
    views: 329,
    duration: "28:55",
    videoPath: "https://hc-cdn.hel1.your-objectstorage.com/s/v3/eb91a975d980d65fa664c18d3c68acf71c120cb0_drintpolicywebinar.mp4", // UPDATE THIS PATH
    thumbnailPath: "/drintthumbnailpolicy.png", // UPDATE THIS PATH
    youtubeUrl: "https://youtu.be/8Mp9ulR7L4Y?si=eyAZF1DVFzO9uscQ",
    spotifyUrl: "https://open.spotify.com/episode/4CwnZwJufNXRcB7iGzrObO?si=2e5148b845e94246",
    tags: ["YouthLeadership", "HealthPolicy", "DrInterested", "Advocacy", "Healthcare", "Adil Mukhi"],
    speaker: "Adil Mukhi",
    host: "Dr. Interested Webinar Series",
  },
  {
    id: "1",
    slug: "exploring-medicine-early",
    title: "Dr Interested Webinar Series: #1 Exploring Medicine Early & Choosing the Right Major for You",
    description:
      "Join us for the Dr. Interested Webinar Series as we explore how to get a head start in medicine and choose the right major for your future career!",
    longDescription:
      "In this session, you'll learn how to explore medicine early as a high school or college student, tips for choosing a major that aligns with your career goals, and insights from medical students and professionals. Perfect for students just starting their pre-med journey.",
    date: "August 31, 2025",
    views: 187,
    duration: "29:56",
    videoPath: "https://hc-cdn.hel1.your-objectstorage.com/s/v3/e1f451ca973f1a72f5407b6696d89f9ec132c251_drintexploremed-chossemajorwebinar.mp4", // UPDATE THIS PATH
    thumbnailPath: "/drintthumbnailmedearly-majors.png", // UPDATE THIS PATH
    youtubeUrl: "https://youtu.be/al1ybYrlMi4?si=ZJHEYbNNyA4td7ss",
    spotifyUrl: "https://open.spotify.com/episode/5cmZdrgxarbyCci9DeBdzD?si=c8d6f3256a5e41d3",
    tags: ["PreMed", "MedicalSchool", "CollegeMajor", "CareerPlanning", "HighSchool"],
    host: "Dr. Interested Webinar Series",
  },
]

// Code Blue Planet 2026 — a Dr. Interested x Toronto Climate Week mini-series on climate change
// and health, YouTube-only (no self-hosted file, no matching Spotify episode).
const codeBluePlanet2026: Webinar[] = [
  {
    id: "cbp-opening-lunch-closing",
    slug: "code-blue-planet-2026-opening-lunch-closing",
    title: "Code Blue Planet 2026: Opening Remarks, Lunch & Closing",
    description: "Opening remarks, lunch, and closing from Code Blue Planet 2026 — a Dr. Interested x Toronto Climate Week event on climate change and health.",
    longDescription:
      "The opening and closing bookends of Code Blue Planet 2026, a joint Dr. Interested x Toronto Climate Week event bringing together students and speakers to explore the intersection of climate change and healthcare.",
    date: "June 12, 2026",
    views: 0,
    duration: "",
    videoPath: "",
    thumbnailPath: "https://img.youtube.com/vi/ICwOUxjWmeQ/hqdefault.jpg",
    youtubeUrl: "https://youtu.be/ICwOUxjWmeQ",
    tags: ["CodeBluePlanet", "ClimateChange", "TorontoClimateWeek"],
    host: "Dr. Interested x Toronto Climate Week",
  },
  {
    id: "cbp-reshaping-modern-medicine",
    slug: "code-blue-planet-2026-reshaping-modern-medicine",
    title: "Code Blue Planet 2026: How Climate Change Is Reshaping Modern Medicine",
    description: "Melissa Blum & Annalise Morelock on how climate change is reshaping modern medicine.",
    longDescription:
      "Melissa Blum and Annalise Morelock explore how a changing climate is reshaping the practice of modern medicine, from Code Blue Planet 2026.",
    date: "June 13, 2026",
    views: 0,
    duration: "",
    videoPath: "",
    thumbnailPath: "https://img.youtube.com/vi/WJJwFvn1s-Y/hqdefault.jpg",
    youtubeUrl: "https://youtu.be/WJJwFvn1s-Y",
    tags: ["CodeBluePlanet", "ClimateChange", "ModernMedicine"],
    speaker: "Melissa Blum & Annalise Morelock",
    host: "Dr. Interested x Toronto Climate Week",
  },
  {
    id: "cbp-indigenous-medicine",
    slug: "code-blue-planet-2026-indigenous-medicine",
    title: "Code Blue Planet 2026: Climate Change and Indigenous Medicine",
    description: "Dr. Dawn Martin-Hill on climate change and Indigenous medicine.",
    longDescription:
      "Dr. Dawn Martin-Hill discusses the impact of climate change on Indigenous medicine and healing practices, from Code Blue Planet 2026.",
    date: "June 14, 2026",
    views: 0,
    duration: "",
    videoPath: "",
    thumbnailPath: "https://img.youtube.com/vi/Usr0GrMELo8/hqdefault.jpg",
    youtubeUrl: "https://youtu.be/Usr0GrMELo8",
    tags: ["CodeBluePlanet", "ClimateChange", "IndigenousMedicine"],
    speaker: "Dr. Dawn Martin-Hill",
    host: "Dr. Interested x Toronto Climate Week",
  },
  {
    id: "cbp-ayurveda",
    slug: "code-blue-planet-2026-ayurveda",
    title: "Code Blue Planet 2026: What Is Ayurveda and How Is Climate Change Affecting It?",
    description: "Tanvi & Neah on Ayurveda and how climate change is affecting it.",
    longDescription:
      "Tanvi and Neah introduce Ayurvedic medicine and examine how climate change is affecting its practice, from Code Blue Planet 2026.",
    date: "June 15, 2026",
    views: 0,
    duration: "",
    videoPath: "",
    thumbnailPath: "https://img.youtube.com/vi/omOJGHNKtho/hqdefault.jpg",
    youtubeUrl: "https://youtu.be/omOJGHNKtho",
    tags: ["CodeBluePlanet", "ClimateChange", "Ayurveda"],
    speaker: "Tanvi & Neah",
    host: "Dr. Interested x Toronto Climate Week",
  },
  {
    id: "cbp-pharmacy",
    slug: "code-blue-planet-2026-pharmacy",
    title: "Code Blue Planet 2026: How Climate Change Is Affecting Pharmacy",
    description: "Shellyza Sajwani on how climate change is affecting pharmacy.",
    longDescription:
      "Shellyza Sajwani examines how climate change is affecting the field of pharmacy, from Code Blue Planet 2026.",
    date: "June 16, 2026",
    views: 0,
    duration: "",
    videoPath: "",
    thumbnailPath: "https://img.youtube.com/vi/_Qzy7ARuvvA/hqdefault.jpg",
    youtubeUrl: "https://youtu.be/_Qzy7ARuvvA",
    tags: ["CodeBluePlanet", "ClimateChange", "Pharmacy"],
    speaker: "Shellyza Sajwani",
    host: "Dr. Interested x Toronto Climate Week",
  },
  {
    id: "cbp-mental-health",
    slug: "code-blue-planet-2026-mental-health",
    title: "Code Blue Planet 2026: How Climate Change Affects Mental Health",
    description: "Maiwand Amiri on how climate change affects mental health.",
    longDescription:
      "Maiwand Amiri explores the connection between climate change and mental health, from Code Blue Planet 2026.",
    date: "June 17, 2026",
    views: 0,
    duration: "",
    videoPath: "",
    thumbnailPath: "https://img.youtube.com/vi/om_aT09d4Ww/hqdefault.jpg",
    youtubeUrl: "https://youtu.be/om_aT09d4Ww",
    tags: ["CodeBluePlanet", "ClimateChange", "MentalHealth"],
    speaker: "Maiwand Amiri",
    host: "Dr. Interested x Toronto Climate Week",
  },
]

webinars.push(...codeBluePlanet2026)

export function getWebinarBySlug(slug: string) {
  return webinars.find(
    (webinar) => webinar.slug.trim() === slug.trim()
  )
}

export function getAllWebinarSlugs(): string[] {
  return webinars.map((webinar) => webinar.slug)
}
