"use client";

import { useRef, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import {
  buildFaviconHtml,
  FAVICON_TARGETS,
  validateFaviconFile,
  type FaviconTarget,
} from "@/lib/tools/favicon";

interface GeneratedIcon {
  target: FaviconTarget;
  /** PNG data URL for preview. */
  url: string;
  /** PNG bytes for the zip. */
  bytes: Uint8Array;
}

function canvasToPngBytes(canvas: HTMLCanvasElement): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error("Canvas export failed."));
      blob.arrayBuffer().then((buf) => resolve(new Uint8Array(buf)), reject);
    }, "image/png");
  });
}

/** Draw the source image into a square canvas using "contain" (no distortion). */
function renderSize(img: HTMLImageElement, size: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const scale = Math.min(size / img.width, size / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
  }
  return canvas;
}

const htmlSnippet = buildFaviconHtml();

export function FaviconGenerator() {
  const [icons, setIcons] = useState<GeneratedIcon[]>([]);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateFaviconFile(file);
    if (validation) {
      setError(validation);
      setIcons([]);
      setStatus("");
      return;
    }
    setError("");
    setBusy(true);
    setStatus("Generating favicons…");

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = async () => {
      try {
        const generated = await Promise.all(
          FAVICON_TARGETS.map(async (target) => {
            const canvas = renderSize(img, target.size);
            const bytes = await canvasToPngBytes(canvas);
            return { target, url: canvas.toDataURL("image/png"), bytes };
          }),
        );
        setIcons(generated);
        setStatus(`Generated ${generated.length} favicon sizes.`);
      } catch {
        setError("Something went wrong while generating the favicons.");
        setStatus("");
      } finally {
        setBusy(false);
        URL.revokeObjectURL(url);
      }
    };
    img.onerror = () => {
      setError("That file couldn't be read as an image.");
      setStatus("");
      setBusy(false);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  async function downloadZip() {
    if (icons.length === 0) return;
    const { zipSync } = await import("fflate");
    const files: Record<string, Uint8Array> = {};
    for (const icon of icons) files[icon.target.filename] = icon.bytes;
    files["favicon.html"] = new TextEncoder().encode(htmlSnippet + "\n");

    const zipped = zipSync(files, { level: 6 });
    const blob = new Blob([zipped as BlobPart], { type: "application/zip" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "favicons.zip";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="favicon-file" className="block text-sm font-medium text-primary">
          Source image
        </label>
        <input
          ref={fileRef}
          id="favicon-file"
          type="file"
          accept="image/*"
          onChange={handleFile}
          aria-describedby="favicon-help"
          className="mt-1.5 block w-full text-sm text-secondary file:mr-3 file:rounded-full file:border-0 file:[background:var(--bg-elevated)] file:px-4 file:py-2 file:text-sm file:text-primary hover:file:border-[var(--accent)]"
        />
        <p id="favicon-help" className="mt-1.5 text-xs text-muted">
          PNG, JPEG, GIF, WebP, or SVG up to 5 MB. A square source works best. Everything is
          processed in your browser - nothing is uploaded.
        </p>
      </div>

      <div aria-live="assertive" role="alert">
        {error ? (
          <p className="rounded-xl border border-[var(--danger)] [background:color-mix(in_srgb,var(--danger)_10%,transparent)] p-3 text-sm text-secondary">
            {error}
          </p>
        ) : null}
      </div>
      <p role="status" aria-live="polite" className="sr-only">
        {status}
      </p>

      {icons.length > 0 ? (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={downloadZip} disabled={busy} className="btn-primary disabled:opacity-60">
              Download .zip
            </button>
            <span className="text-sm text-secondary">{icons.length} sizes ready</span>
          </div>

          <ul className="flex flex-wrap gap-5">
            {icons.map((icon) => (
              <li key={icon.target.filename} className="flex flex-col items-center gap-2">
                <span
                  className="grid place-items-center rounded-xl border border-[var(--border-hairline)] [background:var(--bg-elevated)] p-3"
                  style={{ width: 96, height: 96 }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- in-browser canvas data URL, not a remote asset */}
                  <img
                    src={icon.url}
                    alt={`${icon.target.size}×${icon.target.size} favicon preview`}
                    width={Math.min(icon.target.size, 64)}
                    height={Math.min(icon.target.size, 64)}
                  />
                </span>
                <span className="font-mono text-xs text-secondary">
                  {icon.target.size}×{icon.target.size}
                </span>
              </li>
            ))}
          </ul>

          <div>
            <div className="flex items-center justify-between gap-3">
              <span id="favicon-html-label" className="text-sm font-medium text-primary">
                HTML to add to your &lt;head&gt;
              </span>
              <CopyButton value={htmlSnippet} label="Copy HTML" />
            </div>
            <pre
              aria-labelledby="favicon-html-label"
              className="mt-2 overflow-x-auto rounded-xl border border-[var(--border-hairline)] [background:var(--bg-elevated)] p-3 font-mono text-xs text-primary"
            >
              <code>{htmlSnippet}</code>
            </pre>
          </div>
        </>
      ) : null}
    </div>
  );
}
