import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * Apple touch icon (180×180) - generated at build time.
 * Next.js emits <link rel="apple-touch-icon"> automatically.
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          background: "linear-gradient(135deg, #06c8e8, #2563eb)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="110" height="110" viewBox="0 0 24 24" fill="none">
          <path
            d="M8 9.5 10.5 12 8 14.5M13 15h3"
            stroke="#ffffff"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    ),
    { ...size },
  );
}
