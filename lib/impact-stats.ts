/**
 * Every impact number on the site comes from here, so the next report only needs one edit.
 *
 * Source: the Dr. Interested 2026 Annual Impact Report (advance copy, figures as of
 * November 12, 2026). "allTime" is the report's last page: 2025 and 2026 combined.
 * "year2026" is this year on its own. Display strings are written the way the report writes
 * them; numeric fields are for structured data.
 */

export const IMPACT_REPORT_2026 = {
  title: "Dr. Interested 2026 Annual Impact Report",
  shortTitle: "2026 Annual Impact Report",
  // Served from /public. A clean, keyword-bearing file name ranks and shares better than the
  // 2025 file ("dr-interested-impact-report-2025 (1).pdf").
  path: "/dr-interested-2026-annual-impact-report.pdf",
  url: "https://www.drinterested.org/dr-interested-2026-annual-impact-report.pdf",
  cover: "/impact-report-2026-cover.jpg",
  published: "2026-11-14",
  asOf: "November 12, 2026",
  pages: 22,
} as const

export const IMPACT_REPORT_2025 = {
  title: "Dr. Interested 2025 Annual Impact Report",
  shortTitle: "2025 Annual Impact Report",
  path: "/dr-interested-impact-report-2025%20(1).pdf",
  web: "https://impact.drinterested.org/2025/annual",
} as const

/** 2025 and 2026 combined (the report's "All Time Impact" page). */
export const ALL_TIME = {
  youthImpacted: "389,000+",
  youthImpactedNumber: 389000,
  executives: "414",
  executivesNumber: 414,
  members: "2,200+",
  membersNumber: 2200,
  countries: "129",
  countriesNumber: 129,
  volunteers: "1,500",
  volunteerHours: "7,500+",
  events: "45+",
  mentorHours: "1,400+",
  followers: "29,000+",
  posts: "1,550+",
  impressions: "11M+",
  impressionsExact: "11,053,767",
} as const

/** 2026 on its own. */
export const YEAR_2026 = {
  youthImpacted: "229,000+",
  youthImpactedExact: "229,933",
  executives: "328",
  volunteers: "600",
  volunteerHours: "6,800",
  members: "2,200+",
  memberCountries: "129",
  teamCountries: "16",
  teamOriginCountries: "31",
  events: "25",
  mentorHours: "1,000",
  mentors: "13",
  followers: "17,300",
  impressions: "7.3M+",
  revenue: "$55,030.01 CAD",
} as const

/** The three pillars every program fits into (at least one, ideally all three). */
export const PILLARS = [
  {
    id: "career",
    number: 1,
    name: "Wellness Career Education",
    short: "Career Education",
    description:
      "We began with medicine and have grown well beyond it. We introduce youth to wellness as a whole: health, law, finance, and any career that improves human wellbeing and quality of life, through workshops, panels, mentorship, research and publishing, and skill building.",
  },
  {
    id: "policy",
    number: 2,
    name: "Access to Policy Spaces",
    short: "Youth in Policy",
    description:
      "Decisions about education, health, and the digital world are made every day, and young people are rarely in the room. With GLOCAL Canada and travel, micro, and technology grants, we help youth reach those rooms and give them the preparation and platforms to share their ideas with decision makers.",
  },
  {
    id: "community",
    number: 3,
    name: "Community Spaces",
    short: "Community",
    description:
      "In a digital world that is not always safe for young people, we are a safe online space for youth. Most of our work runs online so anyone, anywhere, can take part, and our in person events aim to be a welcoming third space beyond home and school.",
  },
] as const

/** One line used in meta descriptions and structured data. */
export const ORG_ONE_LINER =
  "Dr. Interested is a youth led global wellness organization helping young people explore wellness careers, take part in the policy decisions that shape their lives, and find a safe community to belong to."

export const LEGAL_STATUS = {
  short:
    "Dr. Interested is a Canadian youth led project, listed as a civil society organization with the UN ECOSOC. Our nonprofit work runs through Future Interested, a fiscally sponsored US 501(c)(3) public charity.",
  fiscalSponsor:
    "Future Interested is fiscally sponsored by The Hack Foundation (d.b.a. Hack Club), a 501(c)(3) public charity, EIN 81-2908499.",
  canada:
    "Dr. Interested is not a registered charity in Canada; it is a project. Donations made directly to Dr. Interested are not eligible for Canadian charitable tax receipts. If you need a receipt, contact us first: partner organizations can help facilitate one.",
  unProfile:
    "https://esango.un.org/civilsociety/showProfileDetail.do?method=showProfileDetails&tab=1&profileCode=709319",
} as const
