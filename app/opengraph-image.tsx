import { ImageResponse } from "next/og";
import { tools } from "@/data/tools";

export const alt = `Vibecode - ${tools.length} free client-side developer tools by AlgoCrew`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const HEADLINE = "Quiet tools for serious developers.";

/**
 * Fetch Instrument Serif (subset to the headline glyphs) at build time.
 * Returns null when the fetch fails so the image can fall back to Georgia.
 */
async function loadInstrumentSerif(): Promise<ArrayBuffer | null> {
  try {
    const css = await (
      await fetch(
        `https://fonts.googleapis.com/css2?family=Instrument+Serif&text=${encodeURIComponent(HEADLINE)}`,
      )
    ).text();
    const resource = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/);
    if (!resource) return null;
    const res = await fetch(resource[1]);
    return res.ok ? await res.arrayBuffer() : null;
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const serif = await loadInstrumentSerif();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#faf9f5",
          padding: 40,
          fontFamily: serif ? "Instrument Serif" : "Georgia, serif",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            border: "1px solid #e7e4da",
            borderRadius: 8,
            padding: "56px 64px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 24,
              color: "#c2410c",
              letterSpacing: 4,
            }}
          >
            vibecode.pk
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 84,
              lineHeight: 1.05,
              maxWidth: 900,
              letterSpacing: "-0.02em",
              color: "#1c1917",
            }}
          >
            {HEADLINE}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              color: "#57534e",
              letterSpacing: 1,
            }}
          >
            {tools.length} tools · 100% client-side · $0 forever — by AlgoCrew
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: serif
        ? [{ name: "Instrument Serif", data: serif, style: "normal" as const, weight: 400 as const }]
        : undefined,
    },
  );
}
