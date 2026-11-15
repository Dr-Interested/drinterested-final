// Types for our events data
export type EventType = {
  title: string
  date: string
  time?: string
  location: string
  description: string
  image: string
  status: "open" | "full" | "completed" | "closed"
  link: string
  featured?: boolean
}

// Upcoming events data
export const upcomingEvents: EventType[] = [
  
  {
    title: "Canadian Innovation Week (CIW) Event",
    date: "May 11, 2026",
    time: "5:00 PM - 6:00 PM",
    location: "Virtual(Discord)",
    description:
      "Dr. Interested’s session at Canadian Innovation Week explores how youth-driven innovation can make healthcare more accessible and inclusive, featuring insights from founder Adil Mukhi on breaking systemic barriers, a student showcase of real-world healthcare solutions, and an interactive workshop designed to help participants identify challenges in their communities and turn ideas into actionable impact.",
    image: "/CIWEvent.png",
    status: "open",
    link: "https://discord.com/events/1321261267482312775/1489672884061470815",
    featured: true,
  },
  {
    title: "Code Blue Planet: Indigenous Wisdom & Climate Medicine",
    date: "June 7, 2026",
    time: "11:00 AM – 3:00 PM",
    location: "Humber Polytechnic, Toronto, ON ",
    description:
      "As part of Toronto Climate Week, Dr. Interested is hosting Code Blue Planet. The future of medicine isn't just about new tech; it's about remembering our connection to the land. Climate change is already reshaping healthcare, from rising temperatures to disrupted ecosystems. To face these challenges, we need to look at the intersection of climate science, modern healthcare, and Indigenous medicine. Join Dr. Interested for a high-energy day at Code Blue Planet. We're bringing together high school and university students with Indigenous Elders, Knowledge Holders, and health experts to explore how we can build a climate-resilient future. This isn't just a lecture; it's an interactive dive into traditional healing, nature-based wellness, and emerging career pathways. (1-hour lunch break included)",
    image: "/Code Blue Planet.png",
    status: "open",
    link: "https://luma.com/codeblue",
    featured: true,
  },
  {
    title: "Career Exploration Summer Event",
    date: "July 2026",
    location: "University of Toronto Mississauga",
    description: "Details coming soon.",
    image: "/logo.png",
    status: "open",
    link: "",
  },
  {
    title: "2026 Explore 3 Case Competition",
    date: "August 2026",
    location: "University of Toronto St George",
    description: "Details coming soon.",
    image: "/ex3-logo.png",
    status: "open",
    link: "https://www.explore3.live/",
  },
  {
    title: "The Annual Dr. Interested Research Proposal Competition",
    date: "September - October 2026",
    location: "Virtual",
    description:
      "Join the annual Dr. Interested Research Proposal Competition with over $2,500 in prizes and publication opportunities. Details coming soon.",
    image: "/logo.png",
    status: "open",
    link: "",
  },
  {
    title: "Office Hours",
    date: "Forever :)",
    time: "Whenever you need help",
    location: "Virtual",
    description:
      "Join our office hours for personalized support and guidance on your healthcare journey. Whether you have questions about our programs or need advice on your medical career path or even just life in general, we're here to help! Join our discord and go to #office-hours to book a time slot.",
    image: "/office-hours.png",
    status: "open",
    link: "https://discord.gg/pzbGRgsGXY",
  },
]

// Past events data
export const pastEvents: EventType[] = [
  {
    title:
      "The Race to Fight Cancer: Documentary Watch Party & Surgeon-Scientist Q&A",
    date: "April 17, 2026",
    time: "5:00 PM",
    location: "Virtual (Discord)",
    description:
      "Can we cut cancer diagnostic wait times from weeks to minutes? Join Dr. Interested and Curiosity Films for an exclusive virtual screening of the groundbreaking CBC The Nature of Things documentary, \"Doctor, Doctor: The Race to Fight Lung Cancer.\" We are diving deep into the world of medical innovation to see how surgeon-scientist Dr. Kazuhiro Yasufuku and his team are fighting the Canadian healthcare crisis head-on. Following the documentary, we will host a live Q&A session with the experts featured in the film from the Yasufuku Lab (UHN). This is a rare opportunity for students and aspiring MDs to go behind the scenes of life-saving research and hear directly from the doctors and researchers at the forefront of surgical innovation. What to Expect: Exclusive Screening: Watch the newly released documentary detailing the high-stakes race to innovate lung cancer diagnostics. Live Q&A: Meet Nicholas Bernards, Judy McConnell, and the team from the Yasufuku Lab to ask your questions about research, medicine, and the future of surgery. Career Insight: Learn what it’s really like to work at the intersection of clinical practice and groundbreaking lab research.",
    image: "/The Race to Fight Cancer Documentary.png",
    status: "completed",
    link: "https://discord.gg/yEZzREht?event=1489666317731500213",
  },
  {
    title: "Future Doctors Forum (Dr. Interested x HEAAL)",
    date: "March 29, 2026",
    time: "Webinar Panel",
    location: "Virtual",
    description:
      "In collaboration with HEAAL, Dr. Interested hosted the Future Doctors Forum to give students practical insight into the journey toward medicine. The panel featured voices from multiple stages of the path: Vy Kim Pham (1st year, Wichita State University), Tasnime Ben Behaz (3rd year, Faculty of Medicine - Algiers 1), and Anika S. Goodwin, MD, FACS. The session was moderated by Evin Bradley and Calvin Lin, and included an interactive Q&A where attendees asked questions and received real, experience-based guidance.",
    image: "/FutureDoctorsForum.png",
    status: "completed",
    link: "https://youtu.be/mTuFe372D3k",
  },
  {
    title: "Disease Discovery Day",
    date: "February 23 - March 6, 2026",
    time: "8 PM - 9 PM EST (Monday to Friday)",
    location: "Virtual",
    description:
      "From February 23 to March 6, Monday to Friday, 8 PM to 9 PM EST, you will step into the role of a researcher. Not as a spectator. As the investigator.\n\nHere is the mission.\n\nIdentify a prevalent disease in your local area.\nBreak down its causes and risk factors.\nAnalyze its real world impact.\nPresent your findings to the community using clear, compelling storytelling.\n\nScience meets communication. Data meets purpose.",
    image: "/diseasediscnew.png",
    status: "completed",
    link: "https://www.instagram.com/p/DU1iGLCAEan/?hl=en&img_index=1",
  },
  {
    title: "Power of Opportunity: Research Webinar (Dr. Interested x ColdMatchAI)",
    date: "February 21, 2026",
    time: "6:30 PM - 7:30 PM EST",
    location: "Virtual",
    description:
      "Dr. Interested partnered with ColdMatchAI to host this guest speaker webinar focused on the value of learning and conducting scientific research. Participants explored how to find research related opportunities through strategic cold emailing, with actionable steps explained during the session. Attendees also learned about ways to explore medical career pathways through mentorship, research competitions, webinars, and speaker talks.",
    image: "/PowerOfOppertinuty.jpg",
    status: "completed",
    link: "https://www.instagram.com/p/DU0_hUdjhNP/?hl=en&img_index=1",
  },
  {
    title: "Importance of Words in Medicine",
    date: "March 7, 2026",
    time: "Upcoming",
    location: "Virtual",
    description:
      "In partnership with The Kindness and Smile Zone, Dr. Interested presents a webinar on medical literacy focused on the importance of proper communication in healthcare. This workshop helps families understand and navigate the healthcare system more confidently, featuring Muhammad Awais speaking on effective communication and logistical planning with medical professionals. A Q&A session will be offered at the end for questions and follow-ups.",
    image: "/importanceofmed.png",
    status: "completed",
    link: "https://docs.google.com/forms/d/e/1FAIpQLSebQpmty8v4O3YNQO2PEuX5umWItU4YHFklLxa_Wjqa8owk8w/viewform",
    featured: false,
  },
  {
    title: "Beyond the White Coat",
    date: "February 1 - 14, 2026",
    time: " ",
    location: "Virtual",
    description:
      "Explore diverse medical fields and discover hidden, lesser-known healthcare professions in this interactive 2-week event. Participants engage in three sequential activities: first, review informative sheets and short videos about unique healthcare careers; next, solve puzzles and navigate a virtual escape room themed around these professions; finally, choose a healthcare profession, select a related myth to debunk, and create a one-page resource to submit. Top submissions will be featured and celebrated!",
    image: "/Beyond the White Coat.png",
    status: "closed",
    link: "https://forms.gle/raS2Gr9nynyjPnnS7",
    featured: true,
  },
  {
    title: "From Classroom to Career: Expanding Pathways in a Changing World",
    date: "January 27, 2026",
    time: "18:00 EST",
    location: "Virtual",
    description:
      "Hosted as part of the Learning Planet Festival with UNESCO, this policy focused session looks at how education systems can better support young people as they move from learning into work. Careers are changing fast. Linear pathways no longer fit reality. We explore flexibility, early exposure, interdisciplinary skills, and what real system level change can look like.",
    image: "/unesco-webinar.png",
    status: "completed",
    link: "https://youtu.be/fMrcCGrTRF8?t=6",
  },
  {
    title: "Dr. Interested Simmon Chang Chess (Against Cancer) Club",
    date: "December 28, 2025",
    location: "Virtual",
    description:
      "Registration Open for Weiss Open (CFC Rated). Hosted by The Dr. Interested Simmon Chang Chess (Against Cancer) Club. Entry Fee: $15. Complete the registration form and send an Interac e-transfer with your Lichess username, name, and CFC-ID to redlory23@gmail.com. All proceeds benefit PCRF — 100% of tournament proceeds are donated to the Pediatric Cancer Research Foundation.",
    image: "/chessdrint.png",
    status: "completed",
    link: "https://chess.drinterested.org",
  },
  {
    title: "Cards for Doctors",
    date: "Dec 1st, 2025 - Dec 19th, 2025",
    location: "Virtual",
    description:
      "Join us in celebrating doctors for their dedication and care! 💙 Help spread gratitude by designing appreciation cards that will be distributed to doctors across the Greater Toronto Area by our team. Cards may be handwritten or digitally designed, and messages should be positive and professional. Volunteer Hours: 0.5 hours per card. Maximum of 20 cards per person (up to 10 hours).",
    image: "/cardsfordoctors.png",
    status: "completed",
    link: "https://www.instagram.com/p/DSgEZpyjh1k/",
  },
  {
    title: "2025 EXPLORE³ Case Competition",
    date: "November 22, 2025",
    time: "9 AM – 4 PM",
    location: "TMU Ted Rogers School of Business",
    description:
      "Tackle real-world innovation challenges, receive mentorship from industry leaders, and present your ideas to expert judges. Includes case package, light refreshments, networking, and early access perks. Fee: $10. Spots are limited! Learn more: https://www.instagram.com/explore3comp/",
    image: "/ex3-logo.png",
    status: "completed",
    link: "https://www.instagram.com/p/DRk9lNagPR9/",
  },
  {
    title: "First Chess Against Cancer Tournament Complete!",
    date: "November 2025",
    location: "Virtual",
    description:
      "We’re excited to share that our first Chess Against Cancer tournament is officially done, and together we raised $105 CAD for the Pediatric Cancer Research Foundation! In honor of Simmon Chang, a remarkable young man who unfortunately passed away from osteosarcoma shortly after registering for the tournament, we have renamed our initiative the Simmon Chang Chess (Against Cancer) Club, with permission from his family. His courage and love for chess continue to inspire us and drive our mission to fight childhood cancer. Thank you to everyone who participated, donated, and helped make this first tournament a success!",
    image: "/chessdrint.png",
    status: "completed",
    link: "https://chess.drinterested.org",
  },
  {
    title: "Culture & Psychology Conference",
    date: "October 11, 2025",
    time: "1:30 PM - 5:30 PM EST",
    location: "York University, 169 Enterprise Blvd 3rd floor, Markham, ON L6G 0E7",
    description:
      "Join us for the Culture & Psychology Conference, hosted in partnership with the Bridge of Culture, on October 18, 2025, at York University’s YSpace (Markham Campus). This exciting event brings together experts, students, and professionals for a day of talks, workshops, and discussions exploring the intersection of culture, psychology, and mental health.",
    image: "/psych-conference.png",
    status: "closed",
    link: "/events/psychology-conference",
  },
  {
    title: "Dr. Interested Webinar Series Recap",
    date: "August - November 2025",
    location: "Virtual",
    description:
      "A recap of the Dr. Interested Webinar Series, featuring discussions on research, pre-med pathways, and health policy. Watch full recordings and explore key takeaways from each session.",
    image: "/webinarrecap.jpg",
    status: "completed",
    link: "/events/webinar-series-recap",
    featured: true,
  }, 
  {
    title: "Research Proposal Competition",
    date: "July 1 to September 1",
    time: "Independent",
    location: "Virtual",
    description:
      "Compete with students around the world to pitch a real research idea — no experience needed! Top 3 win mentorship and publication (Dr. Interested covers the $200 DOI cost). All participants receive certificates. Deadline: July 23.",
    image: "/RCPRecap.png",
    status: "closed",
    link: "https://www.instagram.com/p/DO_Peudgriv/",
  },
  {
    title: "Podcast Collaboration with BioMedizone",
    date: "June 2025",
    location: "Virtual",
    description: "Join our exciting podcast collaboration with BioMedizone to explore cutting-edge topics in healthcare and medical innovation. Sign-ups to make the podcast with us are now open!",
    image: "/biomedpodcast.png",
    status: "completed",
    link: "https://open.spotify.com/show/6SLlRUL6co6fPxckAdrigf",
  },
  {
    title: "Healthcare Media Promotion Event",
    date: "March 2025 - Ongoing",
    time: "Ongoing",
    location: "Virtual & Social Media Platforms",
    description: "Promoting healthcare-related media to spread awareness on medical topics and innovations.",
    image: "/media-event.png",
    status: "closed",
    link: "https://www.instagram.com/p/DLN6eRTvJZc/m",
  },
  {
    title: "Podcast Collaboration with Health Beyond Borders",
    date: "May 2025",
    location: "Virtual",
    description:
      "A collaborative podcast with Health Beyond Borders, featuring discussions on youth engagement in global health equity. Check out the recap!",
    image: "/hbbpodcast.png",
    status: "completed",
    link: "https://open.spotify.com/show/6SLlRUL6co6fPxckAdrigf",
  },
  {
    title: "The Resilient Minds Project",
    date: "April 27, 2025",
    time: "2:00 PM - 4:00 PM EST",
    location: "Google Meet",
    description:
      "A virtual initiative aimed at empowering youth with practical strategies to improve mental, emotional, and physical well-being. Through engaging workshops, interactive activities, and expert insights, participants will gain valuable skills in stress management, resilience-building, and self-care.",
    image: "/mindsproject.png",
    status: "completed",
    link: "https://www.instagram.com/p/DI9yuL0u8SK/?img_index=1",
  },
  {
    title: "Dr. Interested Medical-Technological Compitition",
    date: "March 2025",
    location: "Virtual Event",
    description:
      "Participants worked on research projects and technological innovations in medicine, culminating in final presentations.",
    image: "/research.png",
    status: "completed",
    link: "/events/internship-recap",
  },
  {
    title: "Dr. Interested Creative Contest",
    date: "February 2025",
    location: "Virtual Event",
    description:
      "Encouraged students to creatively express their passion for healthcare through art, writing, and multimedia projects.",
    image: "/competition.png",
    status: "completed",
    link: "https://www.instagram.com/p/DHBvw9WOyKj/?img_index=1",
  },
  {
    title: "Virtual Cards for Nurses",
    date: "January 2025 - February 2025",
    location: "Virtual Event",
    description:
      "Participants created over 375 virtual appreciation cards for nurses to recognize their dedication and hard work.",
    image: "/cards.png",
    status: "completed",
    link: "https://www.instagram.com/p/DGjvbTNup3c/",
  },
]

// Helper function to get the latest ongoing event
export const getLatestOngoingEvent = (): EventType | undefined => {
  return upcomingEvents.find(
    (event) =>
      event.featured ||
      event.date.toLowerCase().includes("ongoing") ||
      new Date(event.date.split(" - ")[1] || event.date) >= new Date(),
  )
}
