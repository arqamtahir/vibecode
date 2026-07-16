import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * Apple touch icon (180×180) - generated at build time.
 * Next.js emits <link rel="apple-touch-icon"> automatically.
 * Brand mark: paper prompt glyph on a solid clay square.
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          background: "#c2410c",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* > chevron + block cursor — echoes the wordmark's ▊ */}
        <svg width="120" height="120" viewBox="0 0 24 24" fill="none">
          <path
            d="M6.8 8 10.8 12 6.8 16"
            stroke="#faf9f5"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect x="13.3" y="8" width="4.3" height="8" rx="1.2" fill="#faf9f5" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
