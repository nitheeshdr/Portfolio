export type Project = {
  id: string;
  name: string;
  iconLabel: string;
  headline: string;
  description: string;
  meta: string;
  githubUrl: string;
  liveUrl?: string;
  language: string;
  /** Screenshot, when one exists that's safe to publish (no third-party client data). */
  image?: string;
  imageAlt?: string;
  /** Local brand mark shown on the gradient placeholder when there's no screenshot. */
  logo?: string;
  logoIsDark?: boolean;
  /** Placeholder gradient, used when `image` is absent. */
  gradient?: string;
  /** Shown on the project detail page only. */
  techStack?: string[];
  features?: string[];
  /** schema.org SoftwareApplication.applicationCategory, e.g. "BusinessApplication". */
  applicationCategory: string;
  /** schema.org SoftwareApplication.operatingSystem, e.g. "Web" or "Android". */
  operatingSystem: string;
};

const SCREENSHOT_RATIO = 2560 / 1600;

export const PROJECTS: Project[] = [
  {
    id: "codeforge-ai",
    name: "CodeForge AI",
    iconLabel: "CodeForge AI",
    headline:
      "An AI-powered coding-interview platform with a real-time AI mentor, live multi-language execution, and gamified prep.",
    description:
      "Scalable platform serving 33+ database tables, contest infrastructure, and subscription-based learning. Streams a Groq/Llama AI mentor over SSE, with Passkey/OAuth authentication, Razorpay subscriptions, XP/badges/streaks, personalized roadmaps, discussion forums, and an admin dashboard.",
    meta: "Founder & CEO, 2026",
    githubUrl: "https://github.com/CodeForgeAI-io/Codeforge-AI",
    liveUrl: "https://codeforgeai.io",
    language: "TypeScript",
    image: "/projects/codeforge-ai.png",
    imageAlt: "CodeForge AI landing page — master coding interviews with AI",
    logo: "/brand/codeforge-ai-icon.svg",
    applicationCategory: "EducationApplication",
    operatingSystem: "Web",
    techStack: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "Tailwind CSS v4",
      "Supabase (Postgres, Auth, Storage)",
      "Upstash Redis",
      "Groq (Llama 3)",
      "Zustand",
      "React Query",
      "Passkeys / WebAuthn",
      "Playwright",
    ],
    features: [
      "LeetCode-style DSA problems with an instant online compiler",
      "Frontend sandbox challenges and live contests",
      "Real-time streaming AI Mentor (Groq Llama 3) over SSE",
      "Personalized roadmaps and spaced-repetition revision",
      "Community forum and local mock interviews",
      "Passkey and OAuth authentication, Razorpay subscriptions",
      "Gamification — XP, badges, streaks",
      "33+ table Postgres schema with row-level security",
    ],
  },
  {
    id: "pulsecommerce",
    name: "PulseCommerce",
    iconLabel: "PulseCommerce",
    headline:
      "An AI commerce-intelligence platform for WooCommerce, turning store data into segments, churn signals, and revenue forecasts.",
    description:
      "13+ analytics modules — RFM segmentation, customer lifetime value, churn prediction, inventory intelligence, and revenue forecasting — plus a Groq-powered AI Commerce Agent that turns natural-language requests into automated customer workflows via WooCommerce REST APIs and self-hosted WhatsApp automation.",
    meta: "Founder & Product Engineer, 2026",
    githubUrl: "https://github.com/nitheeshdr/PulseCommerce",
    language: "TypeScript",
    logo: "/brand/pulsecommerce-logo.svg",
    logoIsDark: true,
    gradient: "linear-gradient(140deg, #0b0b0b 0%, #262626 60%, #0b0b0b 100%)",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    techStack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind CSS 4",
      "shadcn/ui",
      "WooCommerce REST API",
      "Groq LLM",
    ],
    features: [
      "13+ analytics modules — RFM segmentation, CLV, churn prediction, inventory intelligence, revenue forecasting",
      "AI Commerce Agent that turns natural-language requests into automated workflows",
      "Self-hosted WhatsApp campaign sending — customer numbers never touch a third party",
      "Store-authorized via WooCommerce's own app-authorization flow; no sample data in the codebase",
      "Automated flows, broadcast pipeline, and multi-store support",
    ],
  },
  {
    id: "community-finance",
    name: "Community Finance",
    iconLabel: "Community Finance",
    headline:
      "A multi-tenant finance SaaS for community groups, with AutoPay subscriptions and shared type-safe contracts.",
    description:
      "Supports three event-funding modes and Razorpay AutoPay subscriptions, with role-based access control, real-time notifications, and financial reporting dashboards — spanning a Next.js 15 web app (admin + REST API) and an Expo SDK 54 mobile app sharing Zod schemas.",
    meta: "Founder & Product Engineer, 2026",
    githubUrl: "https://github.com/nitheeshdr/Community-Finance",
    liveUrl: "https://finance-village-web.vercel.app",
    language: "TypeScript",
    image: "/projects/community-finance.png",
    imageAlt: "Community Finance sign-in screen",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web, Android, iOS",
    techStack: [
      "Next.js 15",
      "Expo SDK 54",
      "React Native 0.81",
      "TypeScript",
      "MongoDB Atlas",
      "Razorpay",
      "Turborepo",
      "Zod",
    ],
    features: [
      "Multi-tenant from day one — every community's data structurally isolated",
      "Three event-funding modes: community balance, split among members, or collect payment",
      "Razorpay AutoPay subscriptions, pay links, and manual cash/UPI with an approval queue",
      "One shared Zod contract package across the web admin and mobile app",
      "Append-only audit log; realtime notifications via Pusher",
      "Bulk CSV member import, family/household grouping, PDF/Excel/CSV exports",
    ],
  },
  {
    id: "setups-works",
    name: "Setups Works",
    iconLabel: "Setups Works",
    headline:
      "The studio I founded — a SaaS & AI product development shop shipping client platforms end to end.",
    description:
      "From requirement gathering through architecture, AI integration, deployment, and post-launch support. The marketing site, admin CMS, lead pipeline, and IMAP-connected mailbox are all built in-house on Next.js.",
    meta: "Founder & CEO, 2024 – Present",
    githubUrl: "https://github.com/nitheeshdr/Setups-Works",
    liveUrl: "https://setups.works",
    language: "TypeScript",
    image: "/projects/setups-works.png",
    imageAlt: "Setups Works homepage — we design & build digital products that convert",
    logo: "/brand/setups-works-mark.png",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    techStack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind CSS 4",
      "MongoDB",
      "Mongoose",
    ],
    features: [
      "Public marketing site — services, products, portfolio, case studies, blog, careers",
      "Database-backed admin CMS at /admin — publish without a redeploy",
      "Perfex CRM lead sync, plus an IMAP/SMTP-connected mailbox for replies",
      "Verified search-crawler activity logging for indexing diagnostics",
    ],
  },
  {
    id: "ai-expense-tracker",
    name: "AI Expense Tracker",
    iconLabel: "AI Expense Tracker",
    headline:
      "A privacy-first Flutter finance app that reads bank & UPI SMS on-device — no manual entry.",
    description:
      "Offline-first architecture built with Flutter 3, Riverpod, and SQLite. Parses bank and UPI alerts entirely on-device, then surfaces AI-powered spending insights, subscription detection, and budget recommendations. Distributed as a direct APK download — no Play Store required.",
    meta: "Founder & Product Engineer, 2026",
    githubUrl: "https://github.com/nitheeshdr/AI-Expense-Tracker-App",
    language: "Dart",
    logo: "/brand/ai-expense-tracker-logo.png",
    gradient: "linear-gradient(140deg, #4338ca 0%, #7c6bff 60%, #4338ca 100%)",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Android",
    techStack: [
      "Flutter 3",
      "Riverpod",
      "GoRouter",
      "SQLite",
      "Groq (via dio)",
      "flutter_local_notifications",
    ],
    features: [
      "On-device SMS parsing for bank & UPI debit/credit alerts — nothing leaves the phone",
      "AI assistant (“Aria”) grounded in real spending data",
      "Budgets, savings goals, and subscription/autopay detection",
      "Home-screen widget and live spend notifications",
      "Offline-first, with encrypted local storage for the AI key",
    ],
  },
  {
    id: "inventory-management",
    name: "Inventory Management",
    iconLabel: "Inventory Management",
    headline:
      "A job-work and inventory tracking system built for a manufacturing client's factory floor.",
    description:
      "Tracks customer-owned stock held for job work (electrolysis, copper plating, painting, powder coating, stripping, buffing), ages inward challans against the one-year GST return deadline, and reconciles supplier bills and stock movements — built to replace a spreadsheet the client's team was reconciling by hand.",
    meta: "Founder & Product Engineer, 2026",
    githubUrl: "https://github.com/nitheeshdr/Inventory-Management",
    language: "TypeScript",
    gradient: "linear-gradient(140deg, #0f766e 0%, #14b8a6 60%, #0f766e 100%)",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    techStack: ["Next.js", "TypeScript", "MongoDB"],
    features: [
      "Tracks job-work processing for principals — electrolysis, copper plating, painting, powder coating, stripping, buffing",
      "Ages inward challans against the one-year GST return deadline",
      "Inward challans, outward returns, job-work invoices (HSN 998898), and supplier bills",
      "Setup checklist gates entry screens until the required master data exists",
    ],
  },
  {
    id: "job-email",
    name: "Job-Email",
    iconLabel: "Job-Email",
    headline:
      "A cold-email campaign manager for job applications, with access-locked campaign workspaces.",
    description:
      "Next.js app for organizing job-application outreach — templated sending via Nodemailer, JWT-authenticated access, and a locked workspace per campaign so drafts stay private until they're ready.",
    meta: "Founder & Product Engineer, 2026",
    githubUrl: "https://github.com/nitheeshdr/Job-Email",
    liveUrl: "https://job-email-teal.vercel.app",
    language: "TypeScript",
    image: "/projects/job-email.png",
    imageAlt: "Job-Email locked campaign workspace screen",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    techStack: ["Next.js 15", "MongoDB", "Mongoose", "Nodemailer", "JWT"],
    features: [
      "Access-locked campaign workspaces for job-application outreach",
      "Templated email sending via Nodemailer",
      "JWT-authenticated access to keep drafts private",
    ],
  },
];

export { SCREENSHOT_RATIO };
