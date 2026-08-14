# Nitheesh Rajendran — Portfolio

Personal portfolio of **Nitheesh Rajendran** — full-stack engineer and AI product builder based in Chennai, India. Founder & CEO of [Setups Works](https://setups.works) and [CodeForge AI](https://codeforgeai.io).

Live at [nitheeshdr.in](https://nitheeshdr.in) · Built with Next.js, Tailwind CSS, and Motion.

## What's here

- **Home** — introduction, featured projects, quick contact
- **About** — background, experience, skills, tech stack, education, filmography, and achievements
- **Projects** — SaaS platforms, AI products, and mobile apps shipped end to end, each with its own detail page linking to GitHub and the live product

## Featured projects

| Project | What it is |
|---|---|
| [CodeForge AI](https://codeforgeai.io) | AI-powered coding-interview platform with a real-time AI mentor and live multi-language execution |
| [PulseCommerce](https://github.com/nitheeshdr/PulseCommerce) | AI commerce-intelligence platform for WooCommerce |
| [Community Finance](https://finance-village-web.vercel.app) | Multi-tenant finance SaaS for community groups |
| [Setups Works](https://setups.works) | The digital product studio I founded |
| [AI Expense Tracker](https://github.com/nitheeshdr/AI-Expense-Tracker-App) | Privacy-first Flutter app that reads bank/UPI SMS on-device |
| [Inventory Management](https://github.com/nitheeshdr/Inventory-Management) | Job-work and inventory tracking system for a manufacturing client |
| [Job-Email](https://job-email-teal.vercel.app) | Cold-email campaign manager for job applications |

## Stack

- **Framework:** Next.js 16 (App Router), TypeScript
- **Styling:** Tailwind CSS v4
- **Motion:** Motion (Framer Motion), Lenis smooth scroll, raw WebGL flow shader (OGL), Matter.js physics chips
- **SEO:** Person/Organization/WebSite/ProfilePage/SoftwareApplication JSON-LD, dynamic OG images, sitemap, robots.txt, llms.txt

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start the development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start the production server |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Run TypeScript type checking |

## Project structure

```
├── app/                    # Routes: home, about, projects, projects/[id]
├── components/
│   ├── about/               # Experience, education, skills, stack, filmography, family, achievements
│   ├── contact/              # Contact card and CTAs
│   ├── hero/                  # Hero section and portrait morph
│   ├── projects/               # Project grid, detail media, and project data
│   └── seo/                     # JSON-LD schema builders
├── lib/
│   ├── person.ts            # Single source of truth for bio, skills, experience, links
│   └── metadata.ts          # Site metadata helpers
└── public/                  # Portrait, project screenshots, brand logos, icons
```

## License

Personal portfolio — not licensed for reuse or redistribution.
