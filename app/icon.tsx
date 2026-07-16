import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * Browser favicon - generated at build time via ImageResponse.
 * Next.js emits <link rel="icon"> pointing to this route automatically.
 * Brand mark: paper prompt glyph on a solid clay square.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: "#c2410c",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* > chevron + block cursor — echoes the wordmark's ▊ */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M6.8 8 10.8 12 6.8 16"
            stroke="#faf9f5"
            strokeWidth="2.4"
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
