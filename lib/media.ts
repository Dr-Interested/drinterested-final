/**
 * Real photography and quotes used across the site. Photos were cropped, colour corrected,
 * stripped of location data and compressed from public/2026-update-images-vids into
 * public/media. Quotes are from the 2026 member and team surveys in the Annual Impact Report;
 * we credit how people describe themselves, never their names.
 */

export type Photo = { src: string; alt: string; caption?: string }

const p = (src: string, alt: string, caption?: string): Photo => ({ src: `/media/${src}`, alt, caption })

export const PHOTOS = {
  medexplore: [
    p("medexplore/certificates-group.webp", "Volunteers holding certificates at MedExplore 2026", "MedExplore 2026"),
    p("medexplore/room-3.webp", "A full room of students at the MedExplore Conference", "MedExplore 2026"),
    p("medexplore/speakers-group.webp", "Speakers and organizers at MedExplore 2026", "MedExplore 2026"),
    p("medexplore/networking.webp", "Students networking at MedExplore 2026", "MedExplore 2026"),
    p("medexplore/room-1.webp", "Students at round tables during MedExplore", "MedExplore 2026"),
    p("medexplore/room-5.webp", "A speaker presenting at MedExplore", "MedExplore 2026"),
    p("medexplore/cake.webp", "The MedExplore cake", "MedExplore 2026"),
    p("medexplore/cake-cutting-crowd.webp", "Volunteers cutting the MedExplore cake", "MedExplore 2026"),
  ],
  codeblue: [
    p("codeblue/volunteers.webp", "The Code Blue Planet volunteer team", "Code Blue Planet"),
    p("codeblue/opening.webp", "Opening of Code Blue Planet at Humber Polytechnic", "Code Blue Planet"),
    p("codeblue/ayurveda.webp", "A session on Ayurveda and climate change", "Code Blue Planet"),
    p("codeblue/lunch.webp", "Students talking over lunch at Code Blue Planet", "Code Blue Planet"),
    p("codeblue/indigenous-wellness.webp", "A session on the changing climate and Indigenous wellness", "Code Blue Planet"),
    p("codeblue/modern-medicine.webp", "A session on modern medicine and climate change", "Code Blue Planet"),
    p("codeblue/mental-health.webp", "A session on mental health and climate change", "Code Blue Planet"),
    p("codeblue/closing-speaker.webp", "Closing remarks at Code Blue Planet", "Code Blue Planet"),
    p("codeblue/signed-wall.webp", "The Code Blue Planet wall signed by attendees", "Code Blue Planet"),
  ],
  explore3: [
    p("explore3/2025-group.webp", "Everyone at the Explore 3 Case Competition", "Explore 3"),
    p("explore3/2025-keynote.webp", "MP Peter Fonseca and Councillor Chris Fonseca giving the keynote at Explore 3", "Explore 3"),
    p("explore3/2025-judges-question.webp", "A participant asking the judges a question at Explore 3", "Explore 3"),
    p("explore3/2025-teams-working.webp", "Teams preparing their cases at Explore 3", "Explore 3"),
    p("explore3/2025-room.webp", "The Explore 3 competition room", "Explore 3"),
    p("explore3/2025-finalists.webp", "Finalists at Explore 3", "Explore 3"),
    p("explore3/2025-team.webp", "A team at Explore 3", "Explore 3"),
  ],
  explore3_2026: [
    p("explore3/2026-panel.webp", "A panel Q&A at the 2026 Explore 3 Case Competition", "Explore 3 2026"),
    p("explore3/2026-keynote.webp", "A keynote at the 2026 Explore 3 Case Competition", "Explore 3 2026"),
  ],
  psych: [
    p("psych/group.webp", "Everyone at the Culture and Psychology Conference", "Psychology Conference"),
    p("psych/question.webp", "A participant asking a speaker a question", "Psychology Conference"),
    p("psych/networking.webp", "Students networking with a speaker", "Psychology Conference"),
    p("psych/audience.webp", "The audience at the Culture and Psychology Conference", "Psychology Conference"),
  ],
  community: [
    p("community/ward3-bbq.webp", "The Dr. Interested team at the Ward 3 BBQ", "Ward 3 BBQ"),
    p("community/myac-fair.webp", "A Dr. Interested volunteer speaking at the MYAC Fair", "MYAC Fair"),
    p("community/omni-interview.webp", "Adil Mukhi being interviewed by OMNI News", "OMNI News"),
    p("community/networking.webp", "Students networking at a Dr. Interested event", "Networking"),
    p("community/general-meeting.webp", "A Dr. Interested general team meeting", "Team meeting"),
    p("community/online-general-meeting.webp", "A full online general meeting", "Team meeting"),
    p("community/directors-summit.webp", "The directors summit", "Directors summit"),
    p("community/ambassadors.webp", "An ambassadors get together", "Ambassadors"),
  ],
  awards: [
    p("awards/civic-awards-group.webp", "Dr. Interested members receiving the City of Mississauga Civic Award", "Mississauga Civic Award"),
    p("awards/civic-awards-stairs.webp", "Award recipients at the Mississauga Civic Recognition Awards", "Mississauga Civic Award"),
    p("awards/civic-award-1.webp", "Dr. Interested members with their civic awards", "Mississauga Civic Award"),
    p("awards/civic-award-3.webp", "Dr. Interested members at the civic awards evening", "Mississauga Civic Award"),
  ],
  programs: [
    p("programs/office-hours.webp", "An Office Hours meeting giving youth on demand mentorship", "Office Hours"),
    p("programs/rpc-info-meeting.webp", "The Research Proposal Competition information meeting", "Research Proposal Competition"),
    p("programs/rpc-recap.webp", "Research Proposal Competition recap", "Research Proposal Competition"),
    p("programs/race-to-fight-cancer.webp", "The Race to Fight Lung Cancer watch party and Q&A", "Race to Fight Cancer"),
    p("programs/ciw-2026.webp", "Scaling Accessible Healthcare Education at Canadian Innovation Week", "Canadian Innovation Week"),
    p("programs/future-doctors-forum.webp", "The Future Doctors Forum webinar", "Webinar"),
    p("programs/webinar-mdphd.webp", "A webinar on the MD/PhD path", "Webinar"),
  ],
}

/** A varied mix for the scrolling photo strips. */
export const HIGHLIGHT_REEL: Photo[] = [
  PHOTOS.medexplore[0],
  PHOTOS.codeblue[0],
  PHOTOS.explore3[0],
  PHOTOS.awards[0],
  PHOTOS.community[0],
  PHOTOS.medexplore[1],
  PHOTOS.codeblue[1],
  PHOTOS.psych[0],
  PHOTOS.explore3[1],
  PHOTOS.community[1],
  PHOTOS.codeblue[3],
  PHOTOS.medexplore[3],
  PHOTOS.explore3[2],
  PHOTOS.community[2],
]

export const VIDEOS = {
  explore3Room: { src: "/media/video/explore3-2025-room.mp4", poster: "/media/video/explore3-2025-room.jpg" },
  explore3Crowd: { src: "/media/video/explore3-2025-crowd.mp4", poster: "/media/video/explore3-2025-crowd.jpg" },
  explore3Pitch: { src: "/media/video/explore3-2025-pitch.mp4", poster: "/media/video/explore3-2025-pitch.jpg" },
  explore3Panel2026: { src: "/media/video/explore3-2026-panel.mp4", poster: "/media/video/explore3-2026-panel.jpg" },
  explore3Keynote2026: { src: "/media/video/explore3-2026-keynote.mp4", poster: "/media/video/explore3-2026-keynote.jpg" },
  codeblue: { src: "/media/video/codeblue-tables.mp4", poster: "/media/video/codeblue-tables.jpg" },
  psych: { src: "/media/video/psych-keynote.mp4", poster: "/media/video/psych-keynote.jpg" },
  communityFair: { src: "/media/video/community-fair.mp4", poster: "/media/video/community-fair.jpg" },
}

/** The homepage hero: one wide room shot per event, played in turn. */
export const HERO_REEL = [
  { src: "/media/video/hero-explore3.mp4", poster: "/media/video/hero-explore3.jpg", label: "Explore 3 Case Competition 2025" },
  { src: "/media/video/hero-medexplore.mp4", poster: "/media/video/hero-medexplore.jpg", label: "MedExplore 2026" },
  { src: "/media/video/hero-codeblue.mp4", poster: "/media/video/hero-codeblue.jpg", label: "Code Blue Planet" },
  { src: "/media/video/hero-psych.mp4", poster: "/media/video/hero-psych.jpg", label: "Culture and Psychology Conference" },
  { src: "/media/video/hero-explore3-2026.mp4", poster: "/media/video/hero-explore3-2026.jpg", label: "Explore 3 Case Competition 2026" },
]

export type Quote = { quote: string; who: string; topic?: string }

export const QUOTES: Quote[] = [
  {
    quote:
      "I came looking for something meaningful to do beyond another day behind a screen. I left having spoken to my elected officials for the first time, discovered careers I never knew how to access, and connected with a speaker who has since become a mentor.",
    who: "Racialized and low income student living in Canada, age 16 to 18",
    topic: "MedExplore",
  },
  {
    quote:
      "This was one of the first opportunities I found that had absolutely no barrier for me to access. My parents could let me participate from home without having to worry about paying for anything.",
    who: "Low income and first generation student living in Canada, age 16 to 18",
    topic: "Access",
  },
  {
    quote: "They showed me that being a leader isn't about being loud, it's about being reliable and making sure everyone's voice gets heard.",
    who: "First generation student living in the United Arab Emirates, age 14 to 16",
    topic: "Leadership",
  },
  {
    quote:
      "Instead of just scrolling through opportunities I wished I could participate in, I was actually helping create them. I've gained confidence, friendships, and a sense of purpose.",
    who: "Newcomer and first generation student living in Canada, age 16 to 18",
    topic: "Team",
  },
  {
    quote: "My message to the future of education is simple: give young people not only a seat at the table, but a voice in shaping the table itself.",
    who: "Low income student living in Ghana, age 14 to 16",
    topic: "Youth in policy",
  },
  {
    quote:
      "MedExplore helped me picture myself in medicine in a way I hadn't before. Hearing professionals share their experiences, including the challenges they faced, made the career feel more real and achievable.",
    who: "Racialized newcomer living in Canada, age 16 to 18",
    topic: "Career education",
  },
  {
    quote:
      "Discord gave me a place to ask questions without feeling embarrassed. I could take my time reading through information and reach out when I needed help.",
    who: "Student with a disability living in Canada, age 14 to 16",
    topic: "Community",
  },
  {
    quote:
      "I used to think opportunities like this were only for students who already knew the right people. It was one of the first times I felt like I had a real place in conversations about my future.",
    who: "Newcomer and first generation student living in Canada, age 14 to 16",
    topic: "Belonging",
  },
  {
    quote:
      "Career education should be accessible to everyone, not just students who can afford expensive programs or have parents who know how university admissions work. Dr. Interested helped bridge that gap for me.",
    who: "First generation and low income student living in Canada, age 16 to 18",
    topic: "Career education",
  },
  {
    quote: "I think one of the most valuable things a youth organisation can create is a space where people do not feel like they have to prove themselves before they are allowed to participate.",
    who: "Team member living in India, age 14 to 16",
    topic: "Community",
  },
  {
    quote: "Young people from different backgrounds should be part of healthcare policy discussions. We bring experiences and perspectives that might otherwise be overlooked.",
    who: "Racialized newcomer living in Canada, age 16 to 18",
    topic: "Youth in policy",
  },
  {
    quote: "Dr. Interested gave me opportunities to attend interesting webinars. It also helped me with my confidence. I don't fear starting new projects anymore.",
    who: "Racialized and low income student living in France, age 16 to 18",
    topic: "Confidence",
  },
  {
    quote: "I arrived not knowing many people, but I left feeling connected to a community that I wanted to stay involved with.",
    who: "Newcomer and first generation student living in Canada, age 14 to 16",
    topic: "Community",
  },
  {
    quote: "I am glad I had the chance to work on it last year, it made me feel like I had the power to contribute to policy change as well.",
    who: "Team member living in Singapore, age 18 to 24",
    topic: "Youth in policy",
  },
]

/** Where we have been seen, listed or recognized: the scrolling credibility strip. */
export const AS_SEEN_IN = [
  "CBC Radio",
  "OMNI News",
  "Insauga",
  "UN ECOSOC listed CSO",
  "Imagine Canada",
  "Learning Planet Festival (UNESCO)",
  "HundrED",
  "Global Indian",
  "Canadian Choice Award finalist",
  "National Canadian Youth Council",
  "Development and Peace",
  "Ontario Volunteer Service Award",
  "Mississauga Civic Award",
]
