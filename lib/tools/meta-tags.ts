/**
 * Meta tag / Open Graph generation + preview helpers - pure, framework-free,
 * unit-testable.
 */

export interface MetaInput {
  title: string;
  description: string;
  url: string;
  image: string;
  siteName: string;
  twitterCard: "summary" | "summary_large_image";
}

export const defaultMetaInput = (): MetaInput => ({
  title: "",
  description: "",
  url: "",
  image: "",
  siteName: "",
  twitterCard: "summary_large_image",
});

export function truncate(text: string, max: number): string {
  const t = text.trim();
  return t.length > max ? `${t.slice(0, max - 1).trimEnd()}…` : t;
}

/** Best-effort display hostname for search/social previews. */
export function displayHost(url: string): string {
  const raw = url.trim();
  if (!raw) return "example.com";
  try {
    return new URL(raw).hostname.replace(/^www\./, "");
  } catch {
    return raw.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0] || "example.com";
  }
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

/** Generate the copy-ready meta tags from the input (omitting empty fields). */
export function buildMetaTags(input: MetaInput): string {
  const lines: string[] = [];
  const t = input.title.trim();
  const d = input.description.trim();
  const u = input.url.trim();
  const img = input.image.trim();
  const site = input.siteName.trim();

  if (t) {
    lines.push(`<title>${escapeAttr(t)}</title>`);
    lines.push(`<meta name="title" content="${escapeAttr(t)}">`);
  }
  if (d) lines.push(`<meta name="description" content="${escapeAttr(d)}">`);

  // Open Graph
  lines.push(`<meta property="og:type" content="website">`);
  if (t) lines.push(`<meta property="og:title" content="${escapeAttr(t)}">`);
  if (d) lines.push(`<meta property="og:description" content="${escapeAttr(d)}">`);
  if (u) lines.push(`<meta property="og:url" content="${escapeAttr(u)}">`);
  if (img) lines.push(`<meta property="og:image" content="${escapeAttr(img)}">`);
  if (site) lines.push(`<meta property="og:site_name" content="${escapeAttr(site)}">`);

  // Twitter
  lines.push(`<meta name="twitter:card" content="${input.twitterCard}">`);
  if (t) lines.push(`<meta name="twitter:title" content="${escapeAttr(t)}">`);
  if (d) lines.push(`<meta name="twitter:description" content="${escapeAttr(d)}">`);
  if (img) lines.push(`<meta name="twitter:image" content="${escapeAttr(img)}">`);

  return lines.join("\n");
}
