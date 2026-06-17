import { ImageResponse } from "next/og";

export const alt = "Vibecode - 22 free developer tools by AlgoCrew";
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
          padding: "88px",
          background: "#09090f",
          backgroundImage:
            "radial-gradient(ellipse at 10% 20%, rgba(99,102,241,0.22), transparent 55%), radial-gradient(ellipse at 90% 80%, rgba(139,92,246,0.18), transparent 55%)",
          color: "#f1f5f9",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 14, color: "#6366f1", letterSpacing: 3, textTransform: "uppercase", fontWeight: 600, marginBottom: 32 }}>
          Vibecode by AlgoCrew
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            fontSize: 76,
            fontWeight: 700,
            lineHeight: 1.08,
            maxWidth: 960,
            letterSpacing: "-0.03em",
            color: "#f1f5f9",
          }}
        >
          22 developer tools. Private by design.
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#64748b", marginTop: 32, letterSpacing: "-0.01em" }}>
          Free, client-side, no signup. Everything runs in your browser.
        </div>
      </div>
    ),
    { ...size },
  );
}
