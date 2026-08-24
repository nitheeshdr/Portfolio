import { config as faConfig } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { Providers } from "@/components/layout/providers";
import { SiteChrome } from "@/components/layout/site-chrome";
import { SkipToContent } from "@/components/layout/skip-to-content";
import {
  JsonLd,
  organizationSchema,
  personSchema,
  siteNavigationSchema,
  websiteSchema,
} from "@/components/seo/json-ld";
import { baseMetadata } from "@/lib/metadata";
import type { Metadata, Viewport } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

// Import the CSS ourselves (above) instead of relying on FontAwesome's
// runtime <style> injection — avoids a flash of oversized icons on load.
faConfig.autoAddCss = false;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
  display: "swap",
});

export const metadata: Metadata = baseMetadata;

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>): ReactNode {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} bg-background text-foreground min-h-screen font-sans antialiased`}
      >
        <JsonLd
          items={[
            personSchema(),
            organizationSchema(),
            websiteSchema(),
            ...siteNavigationSchema(),
          ]}
        />
        <Providers>
          <SiteChrome />
          <SkipToContent />
          {children}
        </Providers>
      </body>
    </html>
  );
}
