export interface Podcast {
  id: string
  slug: string
  title: string
  description: string
  longDescription: string
  date: string
  duration: string
  thumbnailPath: string
  youtubeUrl: string
  spotifyUrl: string
  tags: string[]
  speaker?: string
}

// Every episode of the Dr. Interested Podcast — pulled from
// https://www.youtube.com/playlist?list=PLhgtIQtU24W2axj8qIfCS-j1idk6LbCF4 and
// https://open.spotify.com/show/6SLlRUL6co6fPxckAdrigf (cross-checked against both; all 11
// episodes matched exactly between the two platforms).
export const podcasts: Podcast[] = [
  {
    id: "stop-being-productive",
    slug: "stop-being-productive-rewrite-your-mind",
    title: "Stop Being Productive, Rewrite Your Mind by Simply Existing",
    description:
      "Sanaya explores the pressure around constant productivity and challenges the notion that your worth is tied to output.",
    longDescription:
      "Sanaya unpacks the cultural pressure to always be productive, and makes the case for rewriting your relationship with rest, worth, and simply existing.",
    date: "May 11, 2026",
    duration: "4:00",
    thumbnailPath: "https://img.youtube.com/vi/ynQLcM42WeU/hqdefault.jpg",
    youtubeUrl: "https://www.youtube.com/watch?v=ynQLcM42WeU",
    spotifyUrl: "https://open.spotify.com/episode/57w1NZzARjhdzzy4N3MAV6",
    tags: ["MentalHealth", "Productivity", "Wellbeing"],
    speaker: "Sanaya",
  },
  {
    id: "adhd-and-diet",
    slug: "adhd-diet-food-affecting-focus",
    title: "ADHD & Diet: Is Your Food Affecting Your Focus?",
    description: "Tanvi Sai Akella examines how food choices influence focus and attention.",
    longDescription:
      "Tanvi Sai Akella breaks down the nutrients that affect brain function and how diet may play a role in ADHD and attention.",
    date: "April 27, 2026",
    duration: "7:00",
    thumbnailPath: "https://img.youtube.com/vi/Wc_08j_J-oI/hqdefault.jpg",
    youtubeUrl: "https://www.youtube.com/watch?v=Wc_08j_J-oI",
    spotifyUrl: "https://open.spotify.com/episode/6iUStGJpBFD8MtK1afhnAo",
    tags: ["ADHD", "Nutrition", "Neuroscience"],
    speaker: "Tanvi Sai Akella",
  },
  {
    id: "all-about-schizophrenia",
    slug: "all-about-schizophrenia",
    title: "All About Schizophrenia",
    description: "Areebah B breaks down schizophrenia — symptoms, causes, diagnosis, and management — while addressing stigma.",
    longDescription:
      "Areebah B gives a clear, compassionate overview of schizophrenia: what it is, how it's diagnosed and managed, and why stigma around it needs to change.",
    date: "February 16, 2026",
    duration: "9:00",
    thumbnailPath: "https://img.youtube.com/vi/sIquKoZObjg/hqdefault.jpg",
    youtubeUrl: "https://www.youtube.com/watch?v=sIquKoZObjg",
    spotifyUrl: "https://open.spotify.com/episode/6Hv8wUaXeljqARTnqzqpOO",
    tags: ["MentalHealth", "Schizophrenia", "Psychiatry"],
    speaker: "Areebah B",
  },
  {
    id: "technology-and-teens",
    slug: "influence-of-technology-on-teens",
    title: "The Influence of Technology on Teens",
    description: "Sanaya discusses how social media and screen time affect teen mental health, relationships, and identity.",
    longDescription:
      "Sanaya looks at how technology shapes the teenage experience — mental health, relationships, and identity development in an always-online world.",
    date: "February 3, 2026",
    duration: "9:00",
    thumbnailPath: "https://img.youtube.com/vi/Nc146SM2xac/hqdefault.jpg",
    youtubeUrl: "https://www.youtube.com/watch?v=Nc146SM2xac",
    spotifyUrl: "https://open.spotify.com/episode/1k505jZkWSNpaauc7HIa6k",
    tags: ["Technology", "MentalHealth", "Teens"],
    speaker: "Sanaya",
  },
  {
    id: "teen-wellness-trends",
    slug: "hidden-risks-of-teen-wellness-trends",
    title: "The Hidden Risks of Teen Wellness Trends",
    description: "Sarra explores how wellness trends impact teen health and offers guidance on balanced approaches.",
    longDescription:
      "Sarra examines popular teen wellness trends, the risks hiding behind them, and how to approach wellness in a balanced, evidence-based way.",
    date: "November 10, 2025",
    duration: "11:00",
    thumbnailPath: "https://img.youtube.com/vi/otbEIuxCxrs/hqdefault.jpg",
    youtubeUrl: "https://www.youtube.com/watch?v=otbEIuxCxrs",
    spotifyUrl: "https://open.spotify.com/episode/6X97TCNlLudTBkO22WGwmu",
    tags: ["Wellness", "TeenHealth"],
    speaker: "Sarra",
  },
  {
    id: "fat-vs-carbs",
    slug: "how-your-body-chooses-fat-or-carbs",
    title: "How Your Body Chooses Between Burning Fat or Carbs",
    description: "Sifa explains the physiological factors determining which fuel source your body uses for energy.",
    longDescription:
      "Sifa breaks down the science of metabolism — how and why your body chooses between burning fat and burning carbs for energy.",
    date: "October 27, 2025",
    duration: "5:00",
    thumbnailPath: "https://img.youtube.com/vi/LcEHWy5SBJU/hqdefault.jpg",
    youtubeUrl: "https://www.youtube.com/watch?v=LcEHWy5SBJU",
    spotifyUrl: "https://open.spotify.com/episode/5G63dYh9xcXBsuPGXhSaGG",
    tags: ["Metabolism", "Nutrition", "Physiology"],
    speaker: "Sifa",
  },
  {
    id: "brains-and-age",
    slug: "how-our-brains-change-with-age",
    title: "How Our Brains Change with Age",
    description: "A roundtable discussion on the neuroscience of aging, memory, and brain health strategies, led by Areebah.",
    longDescription:
      "Areebah leads a roundtable on how the brain changes across a lifetime — memory, cognitive decline, and strategies to support brain health with age.",
    date: "October 13, 2025",
    duration: "17:00",
    thumbnailPath: "https://img.youtube.com/vi/3is0KQzQP6Q/hqdefault.jpg",
    youtubeUrl: "https://www.youtube.com/watch?v=3is0KQzQP6Q",
    spotifyUrl: "https://open.spotify.com/episode/37SoDSTFtIxFGGyIfbIabH",
    tags: ["Neuroscience", "Aging", "BrainHealth"],
    speaker: "Areebah",
  },
  {
    id: "altruism-and-amnesia",
    slug: "altruism-and-amnesia",
    title: "Altruism and Amnesia",
    description: "Dwarakamaye explores the connections between altruism, memory, and human behaviour through neuroscience.",
    longDescription:
      "Dwarakamaye examines the surprising neuroscience linking altruism and memory, and what it reveals about human behaviour.",
    date: "September 29, 2025",
    duration: "9:00",
    thumbnailPath: "https://img.youtube.com/vi/tkhldzMg1HE/hqdefault.jpg",
    youtubeUrl: "https://www.youtube.com/watch?v=tkhldzMg1HE",
    spotifyUrl: "https://open.spotify.com/episode/5TsgHVkSAJhjWA6jUj4EJV",
    tags: ["Neuroscience", "Psychology"],
    speaker: "Dwarakamaye",
  },
  {
    id: "eye-health-and-vision-care",
    slug: "eye-health-and-vision-care",
    title: "Eye Health and Vision Care",
    description: "Madison Wu discusses optometry, common vision-care misconceptions, and why eye health matters.",
    longDescription:
      "Madison Wu covers the basics of optometry, debunks common misconceptions about vision care, and explains why eye health deserves more attention.",
    date: "September 16, 2025",
    duration: "9:00",
    thumbnailPath: "https://img.youtube.com/vi/dQiELtTYjQs/hqdefault.jpg",
    youtubeUrl: "https://www.youtube.com/watch?v=dQiELtTYjQs",
    spotifyUrl: "https://open.spotify.com/episode/03vIYvBFFgNplGlVCKUmLm",
    tags: ["Optometry", "VisionCare"],
    speaker: "Madison Wu",
  },
  {
    id: "genetics-and-more",
    slug: "new-developments-genetics-and-more",
    title: "New Developments: Genetics and More",
    description: "Vedha Kannappan (with HBB) covers breakthroughs in genetics and their healthcare implications.",
    longDescription:
      "Vedha Kannappan, with HBB, walks through recent breakthroughs in genetics research and what they mean for the future of healthcare.",
    date: "May 17, 2025",
    duration: "5:00",
    thumbnailPath: "https://img.youtube.com/vi/FUUXw6gJ5L4/hqdefault.jpg",
    youtubeUrl: "https://www.youtube.com/watch?v=FUUXw6gJ5L4",
    spotifyUrl: "https://open.spotify.com/episode/5EuI0PljdJjhgw3MbyK6o6",
    tags: ["Genetics", "MedicalResearch"],
    speaker: "Vedha Kannappan (with HBB)",
  },
  {
    id: "ehlers-danlos-syndrome",
    slug: "understanding-ehlers-danlos-syndrome",
    title: "Understanding Ehlers-Danlos Syndrome: Stories and Science",
    description: "Amber Sher Rana (with HBB) explores lived experiences of EDS and raises awareness about rare conditions.",
    longDescription:
      "Amber Sher Rana, with HBB, combines personal stories and the underlying science to build understanding and awareness of Ehlers-Danlos Syndrome.",
    date: "May 17, 2025",
    duration: "8:00",
    thumbnailPath: "https://img.youtube.com/vi/Cbl35U3ytUo/hqdefault.jpg",
    youtubeUrl: "https://www.youtube.com/watch?v=Cbl35U3ytUo",
    spotifyUrl: "https://open.spotify.com/episode/0PGLBjdMcupoOYP3IzHooS",
    tags: ["RareDisease", "EhlersDanlos", "PatientStories"],
    speaker: "Amber Sher Rana (with HBB)",
  },
]

export function getPodcastBySlug(slug: string) {
  return podcasts.find((p) => p.slug.trim() === slug.trim())
}

export function getAllPodcastSlugs(): string[] {
  return podcasts.map((p) => p.slug)
}
