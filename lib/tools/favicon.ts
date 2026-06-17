/**
 * Favicon generation helpers - pure, framework-free, unit-testable.
 * The actual raster resizing happens in the widget via <canvas>; this module
 * defines the target set, validation rules, and the HTML snippet.
 */

export interface FaviconTarget {
  size: number;
  filename: string;
  rel: string;
  /** Apple touch icons use `apple-touch-icon` rel and no `type`. */
  apple?: boolean;
}

export const FAVICON_TARGETS: FaviconTarget[] = [
  { size: 16, filename: "favicon-16x16.png", rel: "icon" },
  { size: 32, filename: "favicon-32x32.png", rel: "icon" },
  { size: 48, filename: "favicon-48x48.png", rel: "icon" },
  { size: 180, filename: "apple-touch-icon.png", rel: "apple-touch-icon", apple: true },
  { size: 192, filename: "android-chrome-192x192.png", rel: "icon" },
  { size: 512, filename: "android-chrome-512x512.png", rel: "icon" },
];

/** Max accepted upload size (5 MB) to keep canvas work responsive. */
export const MAX_FAVICON_BYTES = 5 * 1024 * 1024;

export function isSupportedImageType(type: string): boolean {
  return /^image\/(png|jpe?g|gif|webp|svg\+xml|bmp)$/.test(type);
}

/** Validate a chosen file; returns an error message or null when OK. */
export function validateFaviconFile(file: { type: string; size: number }): string | null {
  if (!isSupportedImageType(file.type)) {
    return "Please choose an image file (PNG, JPEG, GIF, WebP, or SVG).";
  }
  if (file.size > MAX_FAVICON_BYTES) {
    return "That image is too large - please use one under 5 MB.";
  }
  return null;
}

/** The ready-to-paste HTML <link> tags for the generated favicon set. */
export function buildFaviconHtml(): string {
  return FAVICON_TARGETS.map((t) => {
    if (t.apple) {
      return `<link rel="apple-touch-icon" sizes="${t.size}x${t.size}" href="/${t.filename}">`;
    }
    return `<link rel="icon" type="image/png" sizes="${t.size}x${t.size}" href="/${t.filename}">`;
  }).join("\n");
}
