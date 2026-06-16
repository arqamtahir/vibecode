import { ImageResponse } from "next/og";

// Sitewide Open Graph / Twitter share image, generated at build time (static).
export const alt = "Vibecode — 22 free client-side developer tools";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0b1120",
          backgroundImage:
            "radial-gradient(circle at 0% 0%, rgba(6,200,232,0.22), transparent 45%), radial-gradient(circle at 100% 100%, rgba(37,99,235,0.22), transparent 45%)",
          color: "#f1f5f9",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, color: "#94a3b8", letterSpacing: 2 }}>
          VIBECODE · BY ALGOCREW
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            fontSize: 84,
            fontWeight: 700,
            lineHeight: 1.05,
            marginTop: 24,
            maxWidth: 980,
          }}
        >
          Developer tools that never leave your browser
        </div>
        <div style={{ display: "flex", fontSize: 34, color: "#94a3b8", marginTop: 28 }}>
          22 free tools · 100% client-side · no signup, no tracking
        </div>
      </div>
    ),
    { ...size },
  );
}
