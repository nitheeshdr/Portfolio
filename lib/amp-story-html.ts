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

/**
 * AMP stories restrict plain <a> tags dropped directly into a regular grid
 * layer — they conflict with the tap-to-advance gesture zones, and the AMP
 * runtime silently disables ("Link was too large; skipped for navigation")
 * any it decides are oversized. `<amp-story-cta-layer>` is the one
 * officially-exempt container built for exactly this: a real, always-
 * tappable outbound link pinned near the bottom of a page. There's no
 * persistent chrome across pages without custom JS (which AMP forbids),
 * so this "back" control is repeated in every page's own cta-layer to read
 * as one persistent button.
 */
function renderPage(
  page: WebStory["pages"][number],
  index: number,
  backHref: string
): string {
  const hasText = page.heading || page.text;

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
      <amp-story-cta-layer class="ig-back-cta-layer">
        <a class="ig-back-link" href="${backHref}" aria-label="Back to Web Stories">&larr; Back</a>
      </amp-story-cta-layer>
    </amp-story-page>`;
}

/**
 * A dedicated end-card page rather than overloading the last content
 * page's <amp-story-cta-layer> with extra controls. `amp-social-share
 * type="system"` is AMP's own extension component — it opens the native
 * OS share sheet (the same officially-supported mechanism as
 * navigator.share on the React pages) so the visitor can hand the story's
 * URL to Instagram or anything else; a plain download link (valid AMP,
 * no script) gets them the branded image itself, since AMP has no
 * mechanism to attach a generated file to the system share sheet.
 */
function renderShareEndCard(story: WebStory, backHref: string): string {
  const imageUrl = `${siteConfig.url}/api/instagram-story/story/${story.slug}`;
  const fileName = `${story.slug}-instagram-story.png`;
  const cta =
    story.ctaLabel && story.ctaUrl
      ? `<a class="ig-share-cta" href="${escapeHtml(story.ctaUrl)}">${escapeHtml(story.ctaLabel)}</a>`
      : "";

  return `
    <amp-story-page id="page-share">
      <amp-story-grid-layer template="fill" class="ig-share-bg"></amp-story-grid-layer>
      <amp-story-grid-layer template="vertical" class="ig-share-layer">
        <h1>Enjoyed this story?</h1>
        <p>Share it to your Instagram Story.</p>
        <amp-social-share type="system" width="56" height="56" aria-label="Share this story"></amp-social-share>
        <p class="ig-share-hint">Add the link with Instagram&rsquo;s Link Sticker.</p>
      </amp-story-grid-layer>
      <amp-story-cta-layer class="ig-end-cta-layer">
        <a class="ig-share-download" href="${imageUrl}" download="${fileName}">Download Story Image</a>
        ${cta}
        <a class="ig-back-cta" href="${backHref}">&larr; Back to Web Stories</a>
      </amp-story-cta-layer>
    </amp-story-page>`;
}

const SHARE_CUSTOM_CSS = `<style amp-custom>
.ig-share-bg{background:#0a0a0a}
.ig-share-layer{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:48px;text-align:center;color:#fff;font-family:system-ui,-apple-system,sans-serif}
.ig-share-layer h1{font-size:28px;font-weight:700;margin:0}
.ig-share-layer p{font-size:16px;color:rgba(255,255,255,0.7);margin:0}
.ig-share-hint{font-size:13px!important;color:rgba(255,255,255,0.5)!important}
.ig-share-download,.ig-share-cta{display:inline-flex;align-items:center;justify-content:center;padding:14px 28px;border-radius:999px;background:#0066FF;color:#fff;font-weight:600;font-size:16px;text-decoration:none;margin-bottom:10px}
.ig-back-cta{display:inline-flex;color:rgba(255,255,255,0.7);font-size:14px;text-decoration:none;font-family:system-ui,-apple-system,sans-serif}
.ig-end-cta-layer{display:flex;flex-direction:column;align-items:center}
.ig-back-cta-layer{display:flex;align-items:center;justify-content:flex-start}
.ig-back-link{display:inline-flex;align-items:center;padding:10px 18px;border-radius:999px;background:rgba(0,0,0,0.5);color:#fff;font-family:system-ui,-apple-system,sans-serif;font-size:14px;font-weight:600;text-decoration:none}
</style>`;

export function renderAmpStoryHtml(story: WebStory): string {
  const canonicalUrl = `${siteConfig.url}/stories/${story.slug}`;
  const publisherLogoUrl = `${siteConfig.url}/avatar.jpg`;
  const description = deriveDescription(story);
  const backHref = "/stories";

  const pagesHtml =
    story.pages
      .map((page, index) => renderPage(page, index, backHref))
      .join("") + renderShareEndCard(story, backHref);

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
  <script async custom-element="amp-social-share" src="https://cdn.ampproject.org/v0/amp-social-share-0.1.js"></script>
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
  ${SHARE_CUSTOM_CSS}
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
