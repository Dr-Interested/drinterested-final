import { supabase } from "@/lib/supabase-client"
import { POLICY_SUBMISSIONS } from "@/data/policy-submissions"
import { webinars as webinarData } from "@/data/webinars"
import { podcasts as podcastData } from "@/data/podcasts"

// Helper function to escape XML special characters
function escapeXml(unsafe: string): string {
  if (!unsafe) return ""
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

export async function GET() {
  const baseUrl = "https://www.drinterested.org"

  // RSS <media:content>/<img> URLs must be absolute — some curated data entries store a
  // site-relative path (e.g. "/11.png") rather than a full URL.
  const absoluteUrl = (path: string) => (path.startsWith("http") ? path : `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`)

  const imageDescriptions: Record<string, string> = {
    // Logo and branding
    "/logo.png":
      "Dr. Interested official logo - A professional medical education organization empowering youth to explore healthcare careers through research, mentorship, and community engagement",
    "/circle-logo.png":
      "Dr. Interested circular logo variant - Round emblem representing the organization's commitment to youth medical education and healthcare advocacy",
    "/websitebanner.jpg":
      "Dr. Interested website banner - Hero image showcasing the organization's mission to inspire the next generation of healthcare professionals",
    "/pattern-bg.png":
      "Decorative background pattern - Subtle medical-themed texture used throughout the Dr. Interested website for visual depth",

    // Favicons and app icons
    "/favicon-16x16.png":
      "Dr. Interested favicon 16x16 - Small icon for browser tabs representing the medical education platform",
    "/favicon-32x32.png": "Dr. Interested favicon 32x32 - Medium icon for browser tabs and bookmarks",
    "/apple-touch-icon.png":
      "Dr. Interested Apple touch icon - iOS home screen icon for the medical education platform",
    "/android-chrome-192x192.png":
      "Dr. Interested Android icon 192x192 - Android home screen icon for mobile app experience",
    "/android-chrome-512x512.png":
      "Dr. Interested Android icon 512x512 - High-resolution Android icon for splash screens and app listings",

    // Team member photos
    "/adil.png":
      "Adil Mukhi - Executive Director and Founder of Dr. Interested, passionate advocate for youth healthcare education and medical policy reform",
    "/lari.png":
      "Muhammad Ibrahim Lari - High school student researcher specializing in medical writing, healthcare law, and cancer research at Dr. Interested",
    "/shaza-ali.jpg":
      "Shaza Ali - 9th grade STEM enthusiast with interests in neurology and cardiology, contributing medical research articles to Dr. Interested",
    "/Maliha.JPG":
      "Maliha Metla - Medical education content creator developing resources to help students understand medical concepts and career paths",
    "/velan.png":
      "Velan Mangai Sivakumar - Grade 10 biological sciences researcher, HOSA trainer, and Canadian Science Olympiad qualifier at Dr. Interested",
    "/Dabosmita.jpg":
      "Dabosmita Das - Year 12 interdisciplinary student exploring technology, medicine, and philosophy through research and writing",
    "/Manasvi.jpg":
      "Manasvi Bobade - Sophomore researcher exploring the intersection of business, healthcare innovation, and youth engagement in medicine",
    "/raine.jpg":
      "Raine Waverka - Phage researcher exploring CRISPR technology and oncology through elite science programs at Vanderbilt and Boston University",
    "/chinthala.png":
      "Chinthala Trisha Goud - Research methodology expert and webinar speaker on academic publishing and literature review processes",
    "/akeer-med.png":
      "Akeer - Medical department member contributing to Dr. Interested's research initiatives and healthcare education programs",
    "/shamoon.png":
      "Shamoon - Team member supporting Dr. Interested's mission to make medical education accessible to youth worldwide",
    "/katetucker.png":
      "Kate Tucker - Pre-medical pathway advisor and webinar speaker on Master's, PhD, and gap year options for aspiring doctors",
    "/arghya.jpg":
      "Arghya - Department director leading initiatives in medical research and youth healthcare education at Dr. Interested",
    "/Bhavish.jpg":
      "Bhavish - Team member contributing to Dr. Interested's educational content and community outreach programs",
    "/madina.jpg":
      "Madina - Healthcare education advocate working to expand Dr. Interested's reach and impact in underserved communities",
    "/hasaan.png":
      "Hasaan - Research team member supporting Dr. Interested's mission to democratize medical knowledge for students",
    "/Paulina.png":
      "Paulina - Content creator and researcher developing accessible medical education resources for youth",
    "/manmeet.png":
      "Manmeet - Team member contributing to Dr. Interested's research publications and educational initiatives",
    "/yumeth.png":
      "Yumeth - Healthcare education specialist supporting Dr. Interested's programs and community engagement",
    "/ali-salman.jpeg": "Ali Salman - Medical education advocate and team member at Dr. Interested",
    "/soham.png":
      "Soham - Research contributor supporting Dr. Interested's mission to inspire future healthcare professionals",
    "/keenan.jpg": "Keenan - Team member working on Dr. Interested's educational content and outreach programs",
    "/akeer.png":
      "Akeer - Healthcare education specialist contributing to Dr. Interested's research and mentorship initiatives",
    "/kishan-headshot.jpg":
      "Kishan - Leadership team member guiding Dr. Interested's strategic initiatives in medical education",

    // Blog post cover images - Medical topics
    "/sleep-deprivation.png":
      "Sleep deprivation effects on teens - Visual representation of how lack of sleep impacts teenage stress, anxiety, and mental health",
    "/exercise_hobbies_cover.jpg":
      "Exercise and hobbies for teen wellness - Illustration showing the mental health benefits of physical activity and creative pursuits for adolescents",
    "/or-nurse.jpg":
      "Operating room nurse in action - Perioperative nurse preparing surgical instruments and assisting during medical procedures",
    "/emergency_nurse_cover.jpg":
      "Emergency room nurse providing critical care - ER nurse responding to urgent medical situations with speed and expertise",
    "/travel_nurse_cover.jpg":
      "Travel nurse on assignment - Healthcare professional providing temporary nursing services across different medical facilities",
    "/oncology_nurse_cover.jpg":
      "Oncology nurse caring for cancer patient - Specialized nurse administering chemotherapy and providing emotional support during cancer treatment",
    "/cps1-gene-editing.png":
      "CRISPR gene editing breakthrough - Illustration of personalized gene therapy treating CPS1 deficiency in infant patient",
    "/maurice-hilleman.png":
      "Maurice Hilleman vaccine pioneer - Portrait of the scientist who developed over 40 vaccines saving millions of lives worldwide",
    "/mrna-history.png":
      "mRNA vaccine development timeline - Historical progression from basic research to COVID-19 breakthrough vaccines",
    "/oped-ai-adil.png":
      "Youth AI policy advocacy - Visual representation of young people's role in shaping artificial intelligence healthcare policy in Canada",
    "/crispr.png":
      "CRISPR gene editing ethics - Illustration of the He Jiankui case and healthcare law implications of human embryo modification",
    "/malpractice-cover.png":
      "Medical malpractice law - Visual representation of healthcare negligence cases and patient rights in Canadian medical system",
    "/mental-health-act.png":
      "Ontario Mental Health Act - Illustration of mental health legislation balancing patient rights with necessary psychiatric care",
    "/cryosurgery.png":
      "Cryosurgery medical procedure - Visualization of extreme cold temperature treatment destroying abnormal tissue in cancer therapy",
    "/Internist.png":
      "Internal medicine physician - Doctor specializing in complex adult diseases and diagnostic problem-solving in hospital setting",
    "/Psychiatrists.png":
      "Psychiatrist providing mental health care - Medical doctor treating mental health disorders through therapy and medication management",
    "/bacteriophage-article.png":
      "Bacteriophages fighting antibiotic resistance - Microscopic viruses targeting bacteria as alternative to failing antibiotics",
    "/Neurosurgeon.jpg":
      "Neurosurgeon performing brain surgery - Highly trained specialist operating on brain, spinal cord, and nervous system conditions",
    "/Opthalmicsurgeon.png":
      "Ophthalmic surgeon treating eye conditions - Specialist performing vision-saving surgeries including cataract removal and retinal repair",
    "/vascular.png":
      "Vascular surgeon treating blood vessel disease - Specialist repairing arteries and veins through surgical and minimally invasive procedures",
    "/Granulocytes.png":
      "Granulocytes white blood cells - Microscopic view of immune cells discovered by Paul Ehrlich using innovative staining techniques",
    "/eosinophils.png":
      "Eosinophils in cancer research - White blood cells playing unexpected roles in tumor microenvironment and cancer progression",
    "/stereotactic-surgery.png":
      "Stereotactic radiosurgery treatment - Precise radiation beams targeting cancer tumors without invasive surgery",
    "/coleytoxins.png":
      "Coley's toxins immunotherapy - Historical bacterial treatment pioneering modern cancer immunotherapy approaches",
    "/Elder-healthcare.png":
      "Elder care nursing - Nurses providing comprehensive care to elderly patients in long-term care facilities",
    "/Immunotherapy.png":
      "Cancer immunotherapy treatment - Visualization of immune system being enhanced to recognize and destroy cancer cells",
    "/Anaplastic.png":
      "Anaplastic thyroid cancer - Aggressive undifferentiated thyroid cancer requiring multimodal treatment approach",
    "/cancer.png":
      "Cancer cell biology - Illustration of uncontrolled cell growth and metastasis in various cancer types",
    "/Chemo.png":
      "Chemotherapy cancer treatment - Medical illustration of chemotherapy drugs targeting rapidly dividing cancer cells",
    "/Nephrologist.png":
      "Nephrologist treating kidney disease - Specialist managing chronic kidney disease, dialysis, and transplant care",
    "/endocrinologist.png":
      "Endocrinologist treating hormonal disorders - Doctor specializing in diabetes, thyroid disease, and metabolic conditions",
    "/chemotherapy-cover.jpg":
      "Chemotherapy administration - Healthcare professional preparing and administering cancer-fighting drugs to patient",
    "/PediatricNurse.png":
      "Pediatric nurse caring for children - Specialized nurse providing medical care to infants, children, and adolescents",
    "/cardiologists.jpg":
      "Cardiologist examining heart health - Cardiovascular specialist using diagnostic tools to assess and treat heart conditions",
    "/hepatology-cover.jpg":
      "Hepatologist treating liver disease - Specialist managing hepatitis, cirrhosis, and other liver-related conditions",

    // Events and programs
    "/ex3-logo.png":
      "EX3 Medical Innovation Conference - Logo for Dr. Interested's flagship event exploring cutting-edge healthcare technology and research",
    "/psych-conference.png":
      "Psychology and Mental Health Conference - Event bringing together students and professionals to discuss mental health advocacy",
    "/office-hours.png":
      "Dr. Interested office hours - Virtual mentorship sessions connecting students with medical professionals and researchers",
    "/webinar-cert.png":
      "Webinar series certificate - Official recognition for participants completing Dr. Interested's educational webinar programs",
    "/research-proposal.png":
      "Research proposal workshop - Educational event teaching students how to design and write medical research proposals",
    "/biomedpodcast.png":
      "Biomedical podcast series - Audio content exploring medical topics, research, and healthcare careers for youth",
    "/media-event.png":
      "Media and communications event - Workshop on medical journalism, science communication, and healthcare advocacy",
    "/hbbpodcast.png":
      "Healthcare Beyond Borders podcast - International perspectives on global health challenges and medical innovation",
    "/mindsproject.png":
      "MINDS Project initiative - Dr. Interested's program fostering medical research and innovation among high school students",
    "/research.png":
      "Research opportunities program - Platform connecting students with medical research projects and mentorship",
    "/competition.png":
      "Medical competitions and challenges - Opportunities for students to showcase research and clinical knowledge",
    "/cards.png":
      "Educational resource cards - Quick-reference materials covering medical topics, career paths, and study strategies",

    // Internship recap images
    "/ctscan.png":
      "CT scan medical imaging - Computed tomography technology used for detailed cross-sectional body imaging in diagnosis",
    "/ultrasound.png":
      "Ultrasound imaging procedure - Non-invasive diagnostic tool using sound waves to visualize internal organs and tissues",
    "/petscans.png":
      "PET scan nuclear medicine - Positron emission tomography revealing metabolic activity for cancer detection and staging",
    "/surgery.png":
      "Surgical procedure in operating room - Medical team performing complex operation with advanced surgical techniques",
    "/dnasquence.png":
      "DNA sequencing technology - Genetic analysis equipment used in personalized medicine and disease research",
    "/bioprinting.png":
      "3D bioprinting innovation - Cutting-edge technology creating living tissue and organs for transplantation research",

    // Merchandise
    "/tshirt.jpg": "Dr. Interested t-shirt - Official branded apparel supporting youth medical education initiatives",
    "/hoodie.jpg": "Dr. Interested hoodie - Comfortable branded clothing representing the medical education community",
    "/sticker.jpg": "Dr. Interested sticker - Collectible adhesive featuring the organization's logo and mission",
    "/mug.jpg": "Dr. Interested mug - Branded drinkware for supporters of youth healthcare education",
  }

  const items: string[] = []

  // ===== MedExplore 2026 (MedX 2026) Conference Recap =====
  {
    const recapUrl = `${baseUrl}/medx-2026`
    const recapImage = `${baseUrl}/medexplore-2026/MedExplore2026.png`
    const recapDescription =
      "See how the Dr. Interested MedExplore 2026 Conference (MedX 2026) went at the University of Toronto Mississauga, Davis Building on Sunday, August 16, 2026. Over 100 students, 23 speakers, guests, and panelists, and 17 volunteers came together for a full day exploring careers in healthcare. Photos, full agenda recap, letters of support, and certificates of recognition."

    items.push(`
    <item>
      <title><![CDATA[MedExplore 2026 Recap (MedX 2026)]]></title>
      <link>${escapeXml(recapUrl)}</link>
      <guid isPermaLink="true">${escapeXml(recapUrl)}</guid>
      <description><![CDATA[${recapDescription}]]></description>
      <pubDate>${new Date("2026-08-16T09:30:00-04:00").toUTCString()}</pubDate>
      <category>Event</category>
      <category>MedExplore 2026</category>
      <category>MedX 2026</category>
      <media:content url="${escapeXml(recapImage)}" medium="image" type="image/png">
        <media:title><![CDATA[MedExplore 2026 (MedX 2026) Conference]]></media:title>
        <media:description><![CDATA[Students, speakers, and volunteers at the Dr. Interested MedExplore 2026 Conference (MedX 2026), University of Toronto Mississauga, August 16, 2026]]></media:description>
      </media:content>
      <content:encoded><![CDATA[
        <img src="${escapeXml(recapImage)}" alt="MedExplore 2026 (MedX 2026) Conference Recap" />
        <p>${recapDescription}</p>
      ]]></content:encoded>
    </item>`)
  }

  // ===== Policy Submissions (e.g. UN/OHCHR filings) =====
  POLICY_SUBMISSIONS.forEach((submission) => {
    const policyUrl = `${baseUrl}/publications/policy/${submission.slug}`
    const policyImage = `${baseUrl}${submission.documents[0]?.pages[0]?.file || "/websitebanner.jpg"}`

    items.push(`
    <item>
      <title><![CDATA[${submission.title}]]></title>
      <link>${escapeXml(policyUrl)}</link>
      <guid isPermaLink="true">${escapeXml(policyUrl)}</guid>
      <description><![CDATA[${submission.summary}]]></description>
      <pubDate>${new Date(submission.isoDate).toUTCString()}</pubDate>
      <category>Policy Work</category>
      <category>${escapeXml(submission.resolution)}</category>
      <media:content url="${escapeXml(policyImage)}" medium="image" type="image/jpeg">
        <media:title><![CDATA[${submission.title}]]></media:title>
        <media:description><![CDATA[${submission.summary}]]></media:description>
      </media:content>
      <content:encoded><![CDATA[
        <img src="${escapeXml(policyImage)}" alt="${escapeXml(submission.title)}" />
        <p>${submission.summary}</p>
        <p>Hosted by OHCHR: <a href="${escapeXml(submission.ohchrPdfUrl)}">${escapeXml(submission.ohchrPdfUrl)}</a></p>
      ]]></content:encoded>
    </item>`)
  })

  // Fetch blogs
  const { data: blogs } = await supabase.from("blogs").select("*")
  const blogPosts = blogs || []

  // Fetch webinars
  const { data: webinarsData } = await supabase.from("webinars").select("*")
  const webinars = webinarsData || []

  // Fetch events
  const { data: eventsData } = await supabase.from("events").select("*")
  const events = eventsData || []

  // Fetch members
  const { data: allMembers } = await supabase.from('members').select('*').eq('approved', true)

  blogPosts.forEach((post) => {
    const postUrl = `${baseUrl}/blog/${post.slug}`
    const imageUrl = post.cover_image?.startsWith('http') ? post.cover_image : `${baseUrl}${post.cover_image || '/websitebanner.jpg'}`
    const pubDate = new Date(post.created_at || new Date()).toUTCString()

    items.push(`
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${escapeXml(postUrl)}</link>
      <guid isPermaLink="true">${escapeXml(postUrl)}</guid>
      <description><![CDATA[${post.excerpt}]]></description>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml(post.topic || "Blog")}</category>
      <media:content url="${escapeXml(imageUrl)}" medium="image" type="image/jpeg">
        <media:title><![CDATA[${post.title} - Cover Image]]></media:title>
        <media:description><![CDATA[${imageDescriptions[post.cover_image] || `Cover image for ${post.title} - ${post.excerpt}`}]]></media:description>
      </media:content>
      <content:encoded><![CDATA[
        <img src="${escapeXml(imageUrl)}" alt="${escapeXml(post.title)}" />
        <p>${post.excerpt}</p>
      ]]></content:encoded>
    </item>`)
  })

  webinars.forEach((webinar) => {
    const webinarUrl = `${baseUrl}/watch/${webinar.id}`
    const thumbnailUrl = webinar.image?.startsWith('http') ? webinar.image : `${baseUrl}${webinar.image}`
    const pubDate = new Date(webinar.created_at || new Date()).toUTCString()

    items.push(`
    <item>
      <title><![CDATA[${webinar.title}]]></title>
      <link>${escapeXml(webinarUrl)}</link>
      <guid isPermaLink="true">${escapeXml(webinarUrl)}</guid>
      <description><![CDATA[${webinar.description}]]></description>
      <pubDate>${pubDate}</pubDate>
      <category>Webinar</category>
      <category>Medical Education</category>
      ${webinar.speaker ? `<author><![CDATA[${webinar.speaker}]]></author>` : ""}
      <media:content url="${escapeXml(thumbnailUrl)}" medium="image" type="image/jpeg">
        <media:title><![CDATA[${webinar.title} - Thumbnail]]></media:title>
        <media:description><![CDATA[${imageDescriptions[webinar.image] || webinar.description}]]></media:description>
      </media:content>
      <content:encoded><![CDATA[
        <img src="${escapeXml(thumbnailUrl)}" alt="${escapeXml(webinar.title)}" />
        <p>${webinar.description}</p>
        ${webinar.speaker ? `<p><strong>Speaker:</strong> ${escapeXml(webinar.speaker)}</p>` : ""}
      ]]></content:encoded>
    </item>`)
  })

  // ===== Curated episode archive (Webinar Series, Code Blue Planet 2026, Podcast) =====
  webinarData.forEach((w) => {
    const url = `${baseUrl}/watch/${w.slug}`
    const pubDate = new Date(w.date).toUTCString()
    items.push(`
    <item>
      <title><![CDATA[${w.title}]]></title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <description><![CDATA[${w.description}]]></description>
      <pubDate>${pubDate}</pubDate>
      <category>Webinar</category>
      ${w.speaker ? `<author><![CDATA[${w.speaker}]]></author>` : ""}
      <media:content url="${escapeXml(absoluteUrl(w.thumbnailPath))}" medium="image" type="image/jpeg">
        <media:title><![CDATA[${w.title} - Thumbnail]]></media:title>
        <media:description><![CDATA[${w.description}]]></media:description>
      </media:content>
      <content:encoded><![CDATA[
        <img src="${escapeXml(absoluteUrl(w.thumbnailPath))}" alt="${escapeXml(w.title)}" />
        <p>${w.description}</p>
        <p><a href="${escapeXml(w.youtubeUrl)}">Watch on YouTube</a>${w.spotifyUrl ? ` &middot; <a href="${escapeXml(w.spotifyUrl)}">Listen on Spotify</a>` : ""}</p>
      ]]></content:encoded>
    </item>`)
  })

  podcastData.forEach((p) => {
    const url = `${baseUrl}/listen/${p.slug}`
    const pubDate = new Date(p.date).toUTCString()
    items.push(`
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <description><![CDATA[${p.description}]]></description>
      <pubDate>${pubDate}</pubDate>
      <category>Podcast</category>
      ${p.speaker ? `<author><![CDATA[${p.speaker}]]></author>` : ""}
      <media:content url="${escapeXml(absoluteUrl(p.thumbnailPath))}" medium="image" type="image/jpeg">
        <media:title><![CDATA[${p.title} - Thumbnail]]></media:title>
        <media:description><![CDATA[${p.description}]]></media:description>
      </media:content>
      <content:encoded><![CDATA[
        <img src="${escapeXml(absoluteUrl(p.thumbnailPath))}" alt="${escapeXml(p.title)}" />
        <p>${p.description}</p>
        <p><a href="${escapeXml(p.youtubeUrl)}">Watch on YouTube</a> &middot; <a href="${escapeXml(p.spotifyUrl)}">Listen on Spotify</a></p>
      ]]></content:encoded>
    </item>`)
  })

// ===== Add Members =====
  ;(allMembers || []).forEach((member) => {
    const memberUrl = `${baseUrl}/team/${member.id}`
    const imageUrl = member.image?.startsWith('http') ? member.image : `${baseUrl}${member.image || '/logo.png'}`
    const memberImageDescription = member.image === '/logo.png' 
      ? `${member.name}, ${member.role}` 
      : (imageDescriptions[member.image] || `${member.name}, ${member.role}`)
    const pubDate = new Date(member.created_at || "2025-01-01T00:00:00Z").toUTCString()

    items.push(`
    <item>
      <title><![CDATA[${member.name} - ${member.role}]]></title>
      <link>${escapeXml(memberUrl)}</link>
      <guid isPermaLink="true">${escapeXml(memberUrl)}</guid>
      <description><![CDATA[${member.bio || ''}]]></description>
      <pubDate>${pubDate}</pubDate>
      <category>Team Member</category>
      <media:content url="${escapeXml(imageUrl)}" medium="image" type="image/jpeg">
        <media:title><![CDATA[${member.name} - Headshot]]></media:title>
        <media:description><![CDATA[${memberImageDescription}]]></media:description>
      </media:content>
      <content:encoded><![CDATA[
        <img src="${escapeXml(imageUrl)}" alt="${escapeXml(member.name)}" />
        <p><strong>${escapeXml(member.role)}</strong></p>
        <p>${member.bio || ''}</p>
      ]]></content:encoded>
    </item>`)
  })

  // ===== Add Events =====
  events.forEach((event) => {
    const isExternalLink = event.link?.startsWith('http://') || event.link?.startsWith('https://')
    const eventUrl = isExternalLink ? event.link : `${baseUrl}${event.link || '/events'}`
    
    if (isExternalLink) {
      return
    }
    
    const imageUrl = event.image?.startsWith('http') ? event.image : `${baseUrl}${event.image}`
    const pubDate = new Date(event.created_at || new Date()).toUTCString()

    items.push(`
    <item>
      <title><![CDATA[${event.title}]]></title>
      <link>${escapeXml(eventUrl)}</link>
      <guid isPermaLink="true">${escapeXml(eventUrl)}</guid>
      <description><![CDATA[${event.description}]]></description>
      <pubDate>${pubDate}</pubDate>
      <category>Event</category>
      <media:content url="${escapeXml(imageUrl)}" medium="image" type="image/jpeg">
        <media:title><![CDATA[${event.title} - Event Image]]></media:title>
        <media:description><![CDATA[${imageDescriptions[event.image] || event.description}]]></media:description>
      </media:content>
      <content:encoded><![CDATA[
        <img src="${escapeXml(imageUrl)}" alt="${escapeXml(event.title)}" />
        <p>${event.description}</p>
        <p><strong>Date:</strong> ${escapeXml(event.date)}</p>
        <p><strong>Location:</strong> ${escapeXml(event.location)}</p>
      ]]></content:encoded>
    </item>`)
  })

  Object.entries(imageDescriptions).forEach(([imagePath, description]) => {
    const imageUrl = `${baseUrl}${imagePath}`
    const imageName =
      imagePath
        .split("/")
        .pop()
        ?.replace(/\.(jpg|jpeg|png|webp|svg)$/, "") || "image"
    const title = imageName
      .split(/[-_]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")

    items.push(`
    <item>
      <title><![CDATA[${title} - Dr. Interested]]></title>
      <link>${escapeXml(imageUrl)}</link>
      <guid isPermaLink="true">${escapeXml(imageUrl)}</guid>
      <description><![CDATA[${description}]]></description>
      <pubDate>${new Date().toUTCString()}</pubDate>
      <category>Image</category>
      <category>Medical Education</category>
      <media:content url="${escapeXml(imageUrl)}" medium="image">
        <media:title><![CDATA[${title}]]></media:title>
        <media:description><![CDATA[${description}]]></media:description>
      </media:content>
      <content:encoded><![CDATA[
        <img src="${escapeXml(imageUrl)}" alt="${escapeXml(title)}" />
        <p>${description}</p>
      ]]></content:encoded>
    </item>`)
  })

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:media="http://search.yahoo.com/mrss/"
     xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Dr. Interested - Empowering Youth in Healthcare</title>
    <link>${escapeXml(baseUrl)}</link>
    <description>Dr. Interested is a youth-led organization dedicated to inspiring the next generation of healthcare professionals through research, education, and mentorship. Explore medical topics, career guidance, and opportunities in healthcare.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(baseUrl)}/rss.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${escapeXml(baseUrl)}/logo.png</url>
      <title>Dr. Interested</title>
      <link>${escapeXml(baseUrl)}</link>
    </image>
    ${items.join("\n    ")}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  })
}
