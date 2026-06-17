import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * Browser favicon - generated at build time via ImageResponse.
 * Next.js emits <link rel="icon"> pointing to this route automatically.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Code chevron symbol */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M8 9.5 10.5 12 8 14.5M13 15h3"
            stroke="#ffffff"
            stroke-width="2.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    ),
    { ...size },
  );
}
