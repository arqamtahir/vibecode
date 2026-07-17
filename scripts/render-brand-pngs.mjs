/**
 * Rasterises the brand marks in public/brand/*.svg to upload-ready PNGs.
 *
 * Uses next/og (satori + resvg) rather than a generic SVG rasteriser so the
 * wordmark is drawn with the real JetBrains Mono - satori converts text to
 * vector paths using the font buffer we hand it, instead of falling back to a
 * system monospace.
 *
 * The shapes below intentionally mirror public/brand/*.svg - if you change one,
 * change the other. Run: node scripts/render-brand-pngs.mjs
 */
import { ImageResponse } from "next/og.js";
import { createElement as h } from "react";
import { writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "brand");

const CLAY = "#c2410c";
const PAPER = "#faf9f5";
const INK = "#1c1917";
const MUTED_LIGHT = "#78716c";
const MUTED_DARK = "#8a847a";
const PAPER_TEXT = "#f5f2ec";

/** Google Fonts hands back a TTF when the request has no browser UA. */
async function loadJetBrainsMono(text) {
  const css = await (
    await fetch(
      `https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500&text=${encodeURIComponent(text)}`,
    )
  ).text();
  const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/);
  if (!url) throw new Error("Could not resolve the JetBrains Mono TTF url");
  const res = await fetch(url[1]);
  if (!res.ok) throw new Error(`Font fetch failed: ${res.status}`);
  return res.arrayBuffer();
}

/**
 * The `>` chevron + block cursor, drawn on a 24-unit grid but with the viewBox
 * cropped to the glyph's inked bounds (incl. stroke caps) so flex centring has
 * no phantom padding to fight. `w` is the drawn width; height follows the ratio.
 */
const GLYPH_RATIO = 10.8 / 12.5;
const glyph = (w) =>
  h(
    "svg",
    {
      width: w,
      height: Math.round(w * GLYPH_RATIO),
      viewBox: "5.4 6.6 12.5 10.8",
      fill: "none",
    },
    h("path", {
      d: "M6.8 8 10.8 12 6.8 16",
      stroke: PAPER,
      strokeWidth: 2.3,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    }),
    h("rect", { x: 13.3, y: 8, width: 4.3, height: 8, rx: 1.2, fill: PAPER }),
  );

/** Clay rounded square containing the glyph. */
const markTile = (size, radius, glyphPx) =>
  h(
    "div",
    {
      style: {
        width: size,
        height: size,
        borderRadius: radius,
        background: CLAY,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
    },
    glyph(glyphPx),
  );

const wordmark = (size, tildeColor, nameColor) =>
  h(
    "div",
    {
      style: {
        display: "flex",
        fontFamily: "JetBrains Mono",
        fontSize: size,
        fontWeight: 500,
        letterSpacing: "-0.02em",
      },
    },
    h("span", { style: { color: tildeColor } }, "~/"),
    h("span", { style: { color: nameColor } }, "vibecode"),
  );

const designs = [
  {
    file: "mark.png",
    width: 512,
    height: 512,
    element: markTile(512, 116, 250),
  },
  {
    file: "avatar.png",
    width: 1000,
    height: 1000,
    element: h(
      "div",
      {
        style: {
          width: 1000,
          height: 1000,
          background: CLAY,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 60,
        },
      },
      glyph(370),
      h(
        "div",
        {
          style: {
            display: "flex",
            fontFamily: "JetBrains Mono",
            fontSize: 96,
            fontWeight: 500,
            letterSpacing: "-0.02em",
            color: PAPER,
          },
        },
        "vibecode",
      ),
    ),
  },
  {
    file: "logo.png",
    width: 1120,
    height: 280,
    element: h(
      "div",
      {
        style: {
          width: 1120,
          height: 280,
          display: "flex",
          alignItems: "center",
          gap: 40,
          padding: "0 20px",
        },
      },
      markTile(192, 44, 95),
      wordmark(116, MUTED_LIGHT, INK),
    ),
  },
  {
    file: "logo-invert.png",
    width: 1120,
    height: 280,
    element: h(
      "div",
      {
        style: {
          width: 1120,
          height: 280,
          display: "flex",
          alignItems: "center",
          gap: 40,
          padding: "0 20px",
        },
      },
      markTile(192, 44, 95),
      wordmark(116, MUTED_DARK, PAPER_TEXT),
    ),
  },
];

const font = await loadJetBrainsMono("~/vibecode");
await mkdir(OUT, { recursive: true });

for (const { file, width, height, element } of designs) {
  const img = new ImageResponse(element, {
    width,
    height,
    fonts: [{ name: "JetBrains Mono", data: font, style: "normal", weight: 500 }],
  });
  const buffer = Buffer.from(await img.arrayBuffer());
  await writeFile(join(OUT, file), buffer);
  console.log(`✓ ${file}  ${width}×${height}  ${(buffer.length / 1024).toFixed(1)} kB`);
}
