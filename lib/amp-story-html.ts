import { siteConfig } from "@/lib/metadata";
import { person } from "@/lib/person";
import type { WebStory } from "@/lib/web-stories";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// The exact AMP boilerplate required on every AMP document — see
// https://amp.dev/documentation/guides-and-tutorials/start/create/basic_markup/
const AMP_BOILERPLATE = `<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>`;

const MAX_DESCRIPTION_LENGTH = 160;

/** No dedicated summary field on WebStory — derive one from the first page that has text, for meta/OG/JSON-LD description. */
function deriveDescription(story: WebStory): string {
  const withText = story.pages.find((page) => page.heading || page.text);
  const raw = [withText?.heading, withText?.text].filter(Boolean).join(" — ");
  if (!raw) return story.title;
  return raw.length > MAX_DESCRIPTION_LENGTH
    ? `${raw.slice(0, MAX_DESCRIPTION_LENGTH - 1)}…`
    : raw;
}

/** JSON that's safe to inline in a <script> tag — escapes `</` so story content can't break out of it. */
function toScriptSafeJson(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function renderPage(
  page: WebStory["pages"][number],
  index: number,
  isLast: boolean,
  story: WebStory
): string {
  const hasText = page.heading || page.text;
  const cta = isLast && story.ctaLabel && story.ctaUrl;

  return `
    <amp-story-page id="page-${index}">
      <amp-story-grid-layer template="fill">
        <amp-img src="${escapeHtml(page.image)}" width="720" height="1280" layout="responsive" alt="${escapeHtml(page.imageAlt)}"></amp-img>
      </amp-story-grid-layer>
      ${
        hasText
          ? `<amp-story-grid-layer template="vertical">
        ${page.heading ? `<h1>${escapeHtml(page.heading)}</h1>` : ""}
        ${page.text ? `<p>${escapeHtml(page.text)}</p>` : ""}
      </amp-story-grid-layer>`
          : ""
      }
      ${
        cta
          ? `<amp-story-cta-layer>
        <a href="${escapeHtml(story.ctaUrl)}">${escapeHtml(story.ctaLabel)}</a>
      </amp-story-cta-layer>`
          : ""
      }
    </amp-story-page>`;
}

export function renderAmpStoryHtml(story: WebStory): string {
  const canonicalUrl = `${siteConfig.url}/stories/${story.slug}`;
  const publisherLogoUrl = `${siteConfig.url}/avatar.jpg`;
  const description = deriveDescription(story);

  const pagesHtml = story.pages
    .map((page, index) =>
      renderPage(page, index, index === story.pages.length - 1, story)
    )
    .join("");

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${canonicalUrl}#article`,
    headline: story.title,
    description,
    image: [story.posterImage],
    datePublished: story.publishedAt ?? story.createdAt,
    dateModified: story.updatedAt,
    url: canonicalUrl,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
    author: { "@type": "Person", name: person.name, url: siteConfig.url },
    publisher: {
      "@type": "Organization",
      name: person.name,
      logo: { "@type": "ImageObject", url: publisherLogoUrl },
    },
  };

  return `<!doctype html>
<html amp lang="en">
<head>
  <meta charset="utf-8">
  <script async src="https://cdn.ampproject.org/v0.js"></script>
  <script async custom-element="amp-story" src="https://cdn.ampproject.org/v0/amp-story-1.0.js"></script>
  <title>${escapeHtml(story.title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${canonicalUrl}">
  <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${escapeHtml(story.title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:image" content="${escapeHtml(story.posterImage)}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(story.title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${escapeHtml(story.posterImage)}">
  <script type="application/ld+json">${toScriptSafeJson(articleJsonLd)}</script>
  ${AMP_BOILERPLATE}
</head>
<body>
  <amp-story standalone
    title="${escapeHtml(story.title)}"
    publisher="${escapeHtml(person.name)}"
    publisher-logo-src="${publisherLogoUrl}"
    poster-portrait-src="${escapeHtml(story.posterImage)}">${pagesHtml}
  </amp-story>
</body>
</html>`;
}

export function renderStoryNotFoundHtml(): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Story not found</title>
</head>
<body style="display:flex;min-height:100vh;align-items:center;justify-content:center;font-family:system-ui,-apple-system,sans-serif;text-align:center;padding:24px;">
  <div>
    <h1 style="font-size:24px;margin-bottom:8px;">Story not found</h1>
    <p><a href="${siteConfig.url}">Back to ${escapeHtml(person.name)}</a></p>
  </div>
</body>
</html>`;
}
