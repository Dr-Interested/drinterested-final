/**
 * Media coverage and public profiles, from the "Media Features" page of the 2026 Annual Impact
 * Report. Used by /our-work/in-the-media and the Profiles Hub on /contact.
 */

export type MediaFeature = {
  outlet: string
  title: string
  kind: "News" | "Radio" | "Article" | "Podcast" | "Feature" | "Recognition" | "Government" | "Event"
  url?: string
  date?: string
}

export const MEDIA_FEATURES: MediaFeature[] = [
  {
    outlet: "CBC Radio",
    title: "Segment on social media withdrawal, featuring Dr. Interested",
    kind: "Radio",
    url: "https://www.cbc.ca/radio/social-media-withdrawal-9.7324642",
  },
  {
    outlet: "OMNI News Punjabi",
    title: "Ontario honours achievements of youth, featuring Dr. Interested",
    kind: "News",
    url: "https://www.youtube.com/watch?v=n3epqtr3ywM",
  },
  {
    outlet: "Insauga",
    title: "Mississauga teen starts global organization helping students explore healthcare careers",
    kind: "News",
    url: "https://www.insauga.com/mississauga-teen-starts-global-organization-helping-students-explore-healthcare-careers/",
  },
  {
    outlet: "Global Indian",
    title: "Adil Mukhi: an Indo Canadian teen championing youth health education",
    kind: "Article",
    url: "https://www.globalindian.com/youth/story/cover-story/adil-mukhi-an-indo-canadian-teen-championing-youth-health-education/",
  },
  {
    outlet: "Global Indian",
    title: "Adil Mukhi and Dr. Interested: helping youth explore healthcare careers",
    kind: "Article",
    url: "https://www.globalindian.com/youth/adil-mukhi-dr-interested-helping-youth-explore-healthcare-careers/",
  },
  {
    outlet: "Share the Smile",
    title: "Empowering Peel students through global leadership and opportunity",
    kind: "Article",
    url: "https://www.sharethesmile.ca/news/empowering-peel-students-through-global-leadership-and-opportunity-20260311202706",
    date: "March 2026",
  },
  {
    outlet: "Voyage Dallas",
    title: "Inspiring conversations with Adil Mukhi of Dr. Interested",
    kind: "Article",
    url: "https://voyagedallas.com/inspiring-conversations-with-adil-mukhi-of-dr-interested/",
  },
  { outlet: "Bold Journey Magazine", title: "Meet Adil Mukhi", kind: "Article" },
  {
    outlet: "Youth Voices in Canada",
    title: "Healthcare Youth Voices in Canada: interview with Adil Mukhi",
    kind: "Podcast",
    url: "https://www.youtube.com/watch?v=J0WMiFPdAX8",
  },
  {
    outlet: "Hosted by Prof. Jay",
    title: "Empowering future doctors: interview with Adil Mukhi",
    kind: "Podcast",
    url: "https://www.youtube.com/watch?v=oOdXM5fxsR4",
  },
  {
    outlet: "Follow Your Youth Passion",
    title: "Season 4: follow your youth passion, featuring Adil Mukhi",
    kind: "Podcast",
    url: "https://youtu.be/QS6bjSg9AuM",
  },
  {
    outlet: "Elevate",
    title: "How curiosity is shaping Canada's next generation of changemakers (episode 48)",
    kind: "Podcast",
    url: "https://www.youtube.com/watch?v=5la_lzi05nQ",
  },
  {
    outlet: "Youth Services Alliance (YSA)",
    title: "Feature of the Resilient Minds event",
    kind: "Feature",
    url: "https://www.instagram.com/stories/highlights/18082846702711206/",
  },
  {
    outlet: "Student Sync",
    title: "Dr. Interested feature and listing",
    kind: "Feature",
    url: "https://www.instagram.com/p/DMV7GUPTsE2/",
  },
  {
    outlet: "NACY FrontLine Newsletter",
    title: "Our blog featured in the FrontLine newsletter",
    kind: "Feature",
    url: "https://www.instagram.com/stories/highlights/17869604658392062/",
  },
  {
    outlet: "Vibe for Youth",
    title: "Spotlight Fridays: Dr. Interested",
    kind: "Feature",
    url: "https://www.instagram.com/p/DHe7jjVPJI2/",
  },
  {
    outlet: "72 Dragons Health",
    title: "Featured by 72 Dragons Health",
    kind: "Feature",
    url: "https://www.instagram.com/p/DRlqUbeDF3o/",
  },
  {
    outlet: "Ward 3 Councillor",
    title: "Recognition from the Ward 3 Councillor",
    kind: "Government",
    url: "https://www.instagram.com/p/DRnRmp0gR3o/",
  },
  { outlet: "Deputy Mayor Singh", title: "Recognition from Deputy Mayor Singh", kind: "Government" },
  { outlet: "MPP Sheref Sabawy", title: "Recognition from MPP Sheref Sabawy", kind: "Government" },
  { outlet: "MPP Andrea Hazell", title: "Recognition from MPP Andrea Hazell", kind: "Government" },
  {
    outlet: "MYAC Fair",
    title: "Dr. Interested at the Mississauga Youth Action Committee fair",
    kind: "Event",
    url: "https://www.tiktok.com/@dr.interested/video/7510741364947160325",
  },
  {
    outlet: "YouthBizConnect",
    title: "YouthBizConnect Opportunity Fair",
    kind: "Event",
    url: "https://www.instagram.com/p/DTIlL2rE8mW/",
  },
  {
    outlet: "GLOCAL",
    title: "GLOCAL Doors Open year end panel",
    kind: "Event",
    url: "https://www.instagram.com/p/DS6DhQmjQ3-/",
  },
]

export type Recognition = { title: string; detail: string; date?: string }

export const RECOGNITION: Recognition[] = [
  {
    title: "Ontario Volunteer Service Award",
    detail:
      "Awarded to Dr. Interested members, presented with the Hon. Nina Tangri, Associate Minister of Small Business.",
    date: "May 19, 2026",
  },
  {
    title: "City of Mississauga Civic Award",
    detail: "Awarded to Dr. Interested members for community service.",
    date: "July 12, 2026",
  },
  {
    title: "Canadian Choice Award finalist",
    detail: "Named a finalist in the local Non Profit category.",
    date: "Late 2025",
  },
]

export type Profile = { name: string; url: string; group: "Social" | "Directory" | "Membership" | "Research" }

/** Everywhere Dr. Interested has an official profile or listing. */
export const PROFILES: Profile[] = [
  { name: "Instagram", url: "https://www.instagram.com/dr.interested/", group: "Social" },
  { name: "LinkedIn", url: "https://www.linkedin.com/company/dr-interested/", group: "Social" },
  { name: "Discord", url: "https://discord.gg/pzbGRgsGXY", group: "Social" },
  { name: "YouTube", url: "https://www.youtube.com/@Dr.Interested", group: "Social" },
  { name: "TikTok", url: "https://www.tiktok.com/@dr.interested", group: "Social" },
  { name: "Facebook", url: "https://www.facebook.com/profile.php?id=61572438387454", group: "Social" },
  { name: "Spotify", url: "https://open.spotify.com/show/6SLlRUL6co6fPxckAdrigf", group: "Social" },
  { name: "X", url: "https://x.com/Dr_Interested_", group: "Social" },
  { name: "Threads", url: "https://www.threads.com/@dr.interested", group: "Social" },
  { name: "Bluesky", url: "https://bsky.app/profile/drinterested.org", group: "Social" },
  { name: "Mastodon", url: "https://mastodon.social/@drinterested", group: "Social" },
  { name: "Reddit", url: "https://www.reddit.com/r/drinterested/", group: "Social" },
  { name: "GitHub", url: "https://github.com/Dr-Interested", group: "Social" },
  { name: "Newsletter", url: "https://news.drinterested.org/posts", group: "Social" },
  { name: "Linktree", url: "https://linktr.ee/dr.interested", group: "Social" },
  {
    name: "UN DESA civil society profile (ECOSOC)",
    url: "https://esango.un.org/civilsociety/showProfileDetail.do?method=showProfileDetails&tab=1&profileCode=709319",
    group: "Membership",
  },
  {
    name: "Imagine Canada member",
    url: "https://imaginecanada.ca/en/membership/current-imagine-canada-members",
    group: "Membership",
  },
  { name: "Learning Planet (UNESCO partner network)", url: "https://www.learning-planet.org/organisation/dr-interested/", group: "Membership" },
  {
    name: "Youth Collective (Restless Development)",
    url: "https://youthcollective.restlessdevelopment.org/?_organisation_search=Dr.%20Interested",
    group: "Membership",
  },
  { name: "Canadian Innovation Space", url: "https://canadianinnovationspace.ca/partners/dr-interested/", group: "Membership" },
  { name: "HundrED", url: "https://hundred.org/en/innovations/dr-interested", group: "Directory" },
  {
    name: "Idealist",
    url: "https://www.idealist.org/en/community/d61c52b27f234069a12a07d87a5ce523-dr-interested-toronto",
    group: "Directory",
  },
  { name: "TMU DMZ OH Canada Tech Directory", url: "https://dmzlegacy.torontomu.ca/oh-canadas-tech-directory", group: "Directory" },
  { name: "Leaders of Today", url: "https://www.leadersoftoday.com/opportunities/volunteer-with-dr-interested-1", group: "Directory" },
  { name: "Youthfully", url: "https://www.youthfully.com/internships/", group: "Directory" },
  { name: "Student Sync", url: "https://www.studentsync.online/listings/dr.-interested", group: "Directory" },
  { name: "Trustpilot", url: "https://ca.trustpilot.com/review/drinterested.org", group: "Directory" },
  { name: "ResearchGate", url: "https://www.researchgate.net/lab/Dr-Interested-Pre-Med-Org-Adil-Mukhi", group: "Research" },
  { name: "Zenodo community", url: "https://zenodo.org/communities/drinterested", group: "Research" },
]

/** Memberships and campaigns named on the report cover. */
export const AFFILIATIONS = [
  "Listed civil society organization with the UN Department of Economic and Social Affairs (ECOSOC)",
  "Imagine Canada member",
  "Development and Peace member",
  "National Canadian Youth Council (NCYC) member",
  "Hope Can't Wait campaign supporter",
]
