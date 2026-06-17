/**
 * Color contrast (WCAG 2.1) + simple palette generation - pure, framework-free,
 * unit-testable.
 */

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

/** Parse #rgb / #rgba / #rrggbb / #rrggbbaa into RGB (alpha ignored). */
export function parseHex(input: string): Rgb | null {
  const hex = input.trim().replace(/^#/, "");
  if (!/^[0-9a-fA-F]+$/.test(hex)) return null;
  let r: number;
  let g: number;
  let b: number;
  if (hex.length === 3 || hex.length === 4) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 6 || hex.length === 8) {
    r = parseInt(hex.slice(0, 2), 16);
    g = parseInt(hex.slice(2, 4), 16);
    b = parseInt(hex.slice(4, 6), 16);
  } else {
    return null;
  }
  return { r, g, b };
}

export function toHex({ r, g, b }: Rgb): string {
  const h = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}

/** WCAG relative luminance. */
export function relativeLuminance({ r, g, b }: Rgb): number {
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export interface ContrastResult {
  ratio: number;
  aaNormal: boolean;
  aaaNormal: boolean;
  aaLarge: boolean;
  aaaLarge: boolean;
}

/** Contrast ratio + WCAG pass/fail. Returns null if either color is unparseable. */
export function evaluateContrast(fg: string, bg: string): ContrastResult | null {
  const f = parseHex(fg);
  const b = parseHex(bg);
  if (!f || !b) return null;
  const lf = relativeLuminance(f);
  const lb = relativeLuminance(b);
  const ratio = (Math.max(lf, lb) + 0.05) / (Math.min(lf, lb) + 0.05);
  return {
    ratio,
    aaNormal: ratio >= 4.5,
    aaaNormal: ratio >= 7,
    aaLarge: ratio >= 3,
    aaaLarge: ratio >= 4.5,
  };
}

/** Mix a color toward white (amount > 0) or black (amount < 0), amount in [-1, 1]. */
function mix({ r, g, b }: Rgb, amount: number): Rgb {
  const target = amount >= 0 ? 255 : 0;
  const t = Math.abs(amount);
  return {
    r: r + (target - r) * t,
    g: g + (target - g) * t,
    b: b + (target - b) * t,
  };
}

/** Generate a tint/shade palette around a base color (light → dark). */
export function suggestPalette(base: string): string[] {
  const rgb = parseHex(base);
  if (!rgb) return [];
  const steps = [0.6, 0.3, 0, -0.3, -0.6];
  return steps.map((s) => toHex(s === 0 ? rgb : mix(rgb, s)));
}
