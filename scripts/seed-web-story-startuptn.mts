/**
 * One-time seed: turns the "Recognized by StartupTN for Responsible
 * Security Disclosure" blog post into a Web Story, hardcoded from that
 * post's actual content/images.
 *   node --env-file=.env.local scripts/seed-web-story-startuptn.mts
 * Safe to re-run — skips if a story with this slug already exists.
 */
import { MongoClient } from "mongodb";

const COVER_IMAGE =
  "https://res.cloudinary.com/da9j5n4g4/image/upload/v1787574641/portfolio/yenit56mzz9z6imkiex0.jpg";
const CERTIFICATE_IMAGE =
  "https://res.cloudinary.com/da9j5n4g4/image/upload/v1787574976/portfolio/nzzd8yt9aotubr8zglbd.jpg";

const SLUG = "startuptn-responsible-disclosure-recognition";

const STORY = {
  title: "Recognized by StartupTN for Responsible Security Disclosure",
  slug: SLUG,
  posterImage: COVER_IMAGE,
  pages: [
    {
      image: COVER_IMAGE,
      imageAlt: "StartupTN — Tamil Nadu Startup and Innovation Mission",
      heading: "Recognized by StartupTN",
      text: "A formal Letter of Recognition, after a responsible-disclosure security assessment on their platform.",
    },
    {
      image: COVER_IMAGE,
      imageAlt: "StartupTN platform",
      heading: "A government platform",
      text: "Earlier this year I ran a responsible-disclosure assessment against StartupTN — Tamil Nadu's official Startup and Innovation Mission.",
    },
    {
      image: CERTIFICATE_IMAGE,
      imageAlt: "The security assessment process",
      heading: "OWASP methodology",
      text: "Identify issues using standard OWASP methodology, report them privately, then work directly with the technical team through remediation — verifying each fix before closing it out.",
    },
    {
      image: CERTIFICATE_IMAGE,
      imageAlt: "Letter of Recognition from StartupTN",
      heading: "The letter",
      text: "No vulnerability details here — that's the point of responsible disclosure. What I can share is the letter itself, signed by Nikunj Panchal, AVP of TANSIM.",
    },
    {
      image: CERTIFICATE_IMAGE,
      imageAlt: "Security research as curiosity",
      heading: "Same curiosity, different lens",
      text: "Security research is an extension of the same curiosity I bring to building software — how a system actually behaves, not just how it's supposed to.",
    },
  ],
  ctaLabel: "Read the full post",
  ctaUrl: `https://nitheeshdr.in/blog/${SLUG}`,
  published: true,
};

async function main(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Missing MONGODB_URI");

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB ?? "portfolio");
  const collection = db.collection("web_stories");

  const existing = await collection.findOne({ slug: SLUG });
  if (existing) {
    console.log(`Story "${SLUG}" already exists — skipping.`);
    await client.close();
    return;
  }

  const now = new Date();
  await collection.insertOne({
    ...STORY,
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
  });

  console.log(`Inserted story "${SLUG}".`);
  await client.close();
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
