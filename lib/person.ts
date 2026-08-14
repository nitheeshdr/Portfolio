/**
 * Single source of truth for Nitheesh's identity, background, and links.
 * Pulled from his resume (nitheesh-resume.pdf), GitHub (github.com/nitheeshdr),
 * and the founder profile already shipped on setups.works — kept in sync with
 * that site's JSON-LD so Google resolves one Person entity, not several.
 */
export const person = {
  name: "Nitheesh Rajendran",
  legalName: "Nitheesh D R",
  alternateNames: ["Nitheesh D R", "Nitheesh DR", "Nitheesh D.R."],
  givenName: "Nitheesh",
  familyName: "Rajendran",
  jobTitles: [
    "Founder & CEO",
    "Lead Product Engineer",
    "Full Stack Developer",
    "AI Product Engineer",
    "Web Designer",
    "Digital Marketer",
    "Film Director",
  ],
  company: {
    name: "Setups Works",
    role: "Founder & CEO",
    period: "2024 – Present",
    url: "https://setups.works",
    description:
      "SaaS & AI product development studio. Delivering custom SaaS platforms, AI-powered applications, and enterprise software for clients across domains.",
  },
  tagline: ["Full-stack engineer &", "AI product builder"],
  summary:
    "Full Stack Developer and Product Engineer with experience designing and shipping AI-powered SaaS platforms, business intelligence systems, and scalable web applications using React, Next.js, TypeScript, and Node.js.",
  bio: "Founder of Setups Works, an AI & SaaS product studio in Chennai. I design and ship full-stack products end to end — from architecture and AI integration to deployment and production support — across web, mobile, and developer tooling.",
  location: "Chennai, Tamil Nadu, India",
  homeLocation: "Elavur, Tamil Nadu, India",
  family: {
    father: "Rajendran D",
    mother: "Mari R",
    siblings: ["Thilac D R", "Abinash D R"],
  },
  email: "nitheeshdr@gmail.com",
  phone: "+91 6383984698",
  portraitSrc: "/portrait.jpg",
  portraitHoverSrc: "/avatar.jpg",
  links: {
    github: "https://github.com/nitheeshdr",
    linkedin: "https://www.linkedin.com/in/nitheeshdr/",
    youtube: "https://www.youtube.com/@nitheeshrajendran",
    imdb: "https://www.imdb.com/name/nm16304237/",
    instagram: "https://www.instagram.com/nitheesh.rajendran/",
    website: "https://nitheeshdr.in",
    crunchbase: "https://www.crunchbase.com/person/nitheesh-rajendran",
    wikidata: "https://www.wikidata.org/wiki/Q140500455",
    /** Google Knowledge Panel share link — helps Google reconcile this Person entity with its existing panel. */
    knowledgePanel: "https://share.google/R49gz3hj0ZA74MmQt",
  },
  identifiers: {
    wikidataId: "Q140500455",
  },
  education: {
    school: "Vels Institute of Science, Technology & Advanced Studies",
    alternateName: "VISTAS",
    degree: "B.Tech, Computer Science Engineering (AI & ML)",
    period: "2022 – 2026",
    url: "https://vistas.ac.in",
    sameAs: [
      "https://www.wikidata.org/wiki/Q7919327",
      "https://en.wikipedia.org/wiki/Vels_Institute_of_Science,_Technology_%26_Advanced_Studies",
    ],
  },
  skillGroups: [
    {
      label: "Languages",
      items: ["JavaScript", "TypeScript", "Dart", "HTML5", "CSS3", "SQL"],
    },
    {
      label: "Frontend",
      items: [
        "React",
        "Next.js",
        "React Native",
        "Flutter",
        "Tailwind CSS",
        "Expo",
      ],
    },
    {
      label: "Backend",
      items: [
        "Node.js",
        "Express.js",
        "REST APIs",
        "Microservices",
        "JWT Auth",
        "Swagger/OpenAPI",
      ],
    },
    {
      label: "Data",
      items: ["MongoDB", "PostgreSQL", "Supabase", "MySQL", "Redis", "SQLite"],
    },
    {
      label: "AI & LLMs",
      items: [
        "AI Agents",
        "Groq / Llama",
        "Prompt Engineering",
        "AI Chatbots",
        "AI Workflow Automation",
      ],
    },
    {
      label: "Cloud & DevOps",
      items: ["Vercel", "Docker", "Linux", "CI/CD", "GitHub Actions"],
    },
    {
      label: "Security",
      items: [
        "API Security",
        "HMAC Auth",
        "Passkeys / WebAuthn",
        "OAuth 2.0",
        "Responsible Disclosure",
      ],
    },
    {
      label: "Tools & Platforms",
      items: [
        "Git",
        "VS Code",
        "Firebase",
        "Figma",
        "Postman",
        "WordPress",
        "Shopify",
      ],
    },
  ],
  /** Flat list — used for JSON-LD knowsAbout / Occupation.skills. */
  get skills(): string[] {
    return Array.from(new Set(this.skillGroups.flatMap((g) => g.items)));
  },
  knowsAbout: [
    "Artificial Intelligence",
    "Software Engineering",
    "Product Engineering",
    "System Design",
    "SaaS",
    "Business Intelligence",
    "Full Stack Development",
    "React",
    "Next.js",
    "TypeScript",
  ],
  achievements: [
    "Published multiple Android applications on the Google Play Store",
    "Open-source contributor with merged pull requests in Echo Music and Komi Store",
    "Engineered and deployed 5+ production software platforms across web and mobile",
    "Conducted a responsible-disclosure security assessment of StartupTN (Government of Tamil Nadu) using OWASP methodology",
  ],
  languages: ["English", "Tamil"],
  filmography: [
    {
      title: "Neram",
      url: "https://www.imdb.com/title/tt36239689/",
      role: "Director, Writer",
      format: "Short film · Sci-Fi",
      description:
        "A boy's discovery of a time-controlling watch leads him to alter fate, risking the life of a loved one.",
    },
    {
      title: "Number Thaan Kaasu",
      url: "https://www.imdb.com/title/tt32792683/",
      year: "2024",
      role: "Director, Writer",
      format: "Short film · Drama",
      description:
        "Two friends create a virtual wallet for quick cash, unaware a web developer tracks their scam. Their meeting sparks a confrontation and police intervention.",
    },
  ],
} as const;

export type SkillGroup = (typeof person.skillGroups)[number];
