/**
 * Sitewide configuration - the single source of truth for URLs, brand strings,
 * and Open Graph defaults consumed by the Metadata API, sitemap, and robots.
 */

export const siteConfig = {
  name: "Vibecode",
  /** Used as the OG/Twitter site name and footer brand. */
  shortName: "Vibecode",
  /** Canonical production origin. Override per-environment with NEXT_PUBLIC_SITE_URL. */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://vibecode.pk").replace(
    /\/$/,
    "",
  ),
  description:
    "22 free, privacy-first developer tools that run 100% in your browser - formatters, converters, generators, and AI utilities. No signup, no upload, no tracking.",
  /**
   * Stable path to the build-generated social-share image (app/opengraph-image.tsx).
   * Referenced explicitly by pages that define their own `openGraph` object, since a
   * child segment's `openGraph` shallow-replaces (and would otherwise drop) the
   * file-convention image inherited from the root layout.
   */
  ogImage: "/opengraph-image",
  twitterHandle: "@algocrew",
  locale: "en_US",
} as const;

/** Absolute URL helper for canonical links and the sitemap. */
export const absoluteUrl = (path = "/"): string =>
  `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
