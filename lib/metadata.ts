import type { Metadata } from "next";
import { person } from "./person";

export const siteConfig = {
  name: person.name,
  shortName: "Nitheesh",
  description: person.summary,
  url: person.links.website,
  creator: "@nitheeshdr",
  authors: [
    {
      name: person.name,
      url: person.links.website,
    },
  ],
  keywords: [
    "Nitheesh Rajendran",
    "Nitheeshdr",
    "Nitheesh DR",
    "Nitheesh D R",
    "Setups Works",
    "CodeForge AI",
    "full stack developer",
    "AI product engineer",
    "Next.js developer",
    "React developer",
    "software engineer Chennai",
    "portfolio",
  ],
} as const;

export const baseMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} - Portfolio`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [...siteConfig.authors],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.svg",
  },
  manifest: "/site.webmanifest",
  verification: {
    google: "uH8AwiyTQRveEutMVXpmFTDTuRtUeANLFJbHk71kStk",
  },
};

export function createMetadata({
  title,
  description,
  path = "/",
  image,
  noIndex = false,
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const url = `${siteConfig.url}${path}`;

  return {
    ...(title ? { title } : {}),
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: title ?? siteConfig.name,
      description: description ?? siteConfig.description,
      url,
      // No `images` here when `image` is omitted — Next.js falls back to the
      // nearest route-segment opengraph-image.tsx (dynamic, per-page) instead.
      ...(image
        ? { images: [{ url: image, width: 1200, height: 630, alt: title ?? siteConfig.name }] }
        : {}),
    },
    twitter: {
      title: title ?? siteConfig.name,
      description: description ?? siteConfig.description,
      ...(image ? { images: [image] } : {}),
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
