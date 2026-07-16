"use client";

import { useEffect, useRef, useState } from "react";

const MAX_INPUT = 2000;
const EC_LEVELS = [
  { value: "L", label: "L - 7% correction" },
  { value: "M", label: "M - 15% correction" },
  { value: "Q", label: "Q - 25% correction" },
  { value: "H", label: "H - 30% correction" },
] as const;

type EcLevel = "L" | "M" | "Q" | "H";

export function QrCodeGenerator() {
  const [text, setText] = useState("https://algocrew.io");
  const [size, setSize] = useState(256);
  const [ecLevel, setEcLevel] = useState<EcLevel>("M");
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [svgData, setSvgData] = useState("");

  useEffect(() => {
    // Empty/too-long messaging is derived at render time; the effect only
    // handles the async generation itself.
    if (!text.trim() || text.length > MAX_INPUT) return;

    let cancelled = false;
    async function run() {
      try {
        const QRCode = (await import("qrcode")).default;
        // Canvas
        if (canvasRef.current) {
          await QRCode.toCanvas(canvasRef.current, text, {
            width: size,
            errorCorrectionLevel: ecLevel,
            margin: 2,
          });
        }
        // SVG string
        const svg = await QRCode.toString(text, {
          type: "svg",
          errorCorrectionLevel: ecLevel,
          margin: 2,
        });
        if (!cancelled) {
          setSvgData(svg);
          setError("");
        }
      } catch {
        if (!cancelled) setError("Could not generate QR code.");
      }
    }
    run();
    return () => { cancelled = true; };
  }, [text, size, ecLevel]);

  function downloadPng() {
    if (!canvasRef.current) return;
    const a = document.createElement("a");
    a.href = canvasRef.current.toDataURL("image/png");
    a.download = "qrcode.png";
    a.click();
  }

  function downloadSvg() {
    if (!svgData) return;
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "qrcode.svg";
    a.click();
    URL.revokeObjectURL(url);
  }

  const tooLong = text.length > MAX_INPUT;

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="qr-text" className="text-sm font-medium text-primary">
          Text or URL
        </label>
        <textarea
          id="qr-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter a URL, Wi-Fi credentials, contact info…"
          className="mt-1.5 h-24 w-full resize-y rounded-xl border border-[var(--border-hairline)] [background:var(--bg-elevated)] p-3 text-sm text-primary placeholder:text-muted focus:border-[var(--accent)] focus:outline-none"
          aria-describedby="qr-char-count"
        />
        <p id="qr-char-count" className={`mt-1 text-right text-xs ${tooLong ? "text-[var(--danger)]" : "text-muted"}`}>
          {text.length}/{MAX_INPUT}
        </p>
      </div>

      <div className="flex flex-wrap gap-4">
        <div>
          <label htmlFor="qr-size" className="flex justify-between gap-4 text-sm font-medium text-primary">
            <span>Size</span>
            <span className="text-muted">{size}px</span>
          </label>
          <input
            id="qr-size"
            type="range"
            min={128}
            max={512}
            step={32}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="mt-1.5 w-40 accent-[var(--accent)]"
          />
        </div>

        <div>
          <label htmlFor="qr-ec" className="text-sm font-medium text-primary">
            Error correction
          </label>
          <select
            id="qr-ec"
            value={ecLevel}
            onChange={(e) => setEcLevel(e.target.value as EcLevel)}
            className="mt-1.5 block rounded-lg border border-[var(--border-hairline)] [background:var(--bg-elevated)] px-3 py-2 text-sm text-primary focus:border-[var(--accent)] focus:outline-none"
          >
            {EC_LEVELS.map((l) => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </div>
      </div>

      {(tooLong || error) && (
        <p role="alert" aria-live="assertive" className="rounded-xl border border-[var(--danger)] [background:color-mix(in_srgb,var(--danger)_10%,transparent)] px-4 py-3 text-sm text-secondary">
          {tooLong ? `Input too long (max ${MAX_INPUT} characters).` : error}
        </p>
      )}

      {text.trim() && !tooLong && !error && (
        <div className="flex flex-col items-center gap-5">
          <canvas
            ref={canvasRef}
            width={size}
            height={size}
            aria-label="Generated QR code"
            className="rounded-xl border border-[var(--border-hairline)]"
            style={{ maxWidth: "100%", height: "auto" }}
          />
          <div className="flex gap-3">
            <button onClick={downloadPng} className="btn-primary">
              Download PNG
            </button>
            <button
              onClick={downloadSvg}
              disabled={!svgData}
              className="rounded-xl border border-[var(--border-hairline)] px-5 py-2.5 text-sm font-semibold text-primary hover:border-[var(--accent)] disabled:opacity-40"
            >
              Download SVG
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
