"use client";

import { useRef, useState } from "react";

const MAX_INPUT_BYTES = 20 * 1024 * 1024; // 20 MB
const ACCEPT = "image/jpeg,image/png,image/webp,image/gif";

interface CompressResult {
  url: string;
  size: number;
  width: number;
  height: number;
}

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(2)} MB`;
}

function compressImage(
  file: File,
  quality: number,
  maxDim: number | null,
): Promise<CompressResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read file."));
    reader.onload = (ev) => {
      const img = new Image();
      img.onerror = () => reject(new Error("Could not load image."));
      img.onload = () => {
        let { naturalWidth: w, naturalHeight: h } = img;
        if (maxDim && (w > maxDim || h > maxDim)) {
          const ratio = Math.min(maxDim / w, maxDim / h);
          w = Math.round(w * ratio);
          h = Math.round(h * ratio);
        }
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) { reject(new Error("Canvas unavailable.")); return; }
        ctx.drawImage(img, 0, 0, w, h);
        const mime = file.type === "image/png" ? "image/png" : "image/jpeg";
        canvas.toBlob(
          (blob) => {
            if (!blob) { reject(new Error("Compression failed.")); return; }
            resolve({ url: URL.createObjectURL(blob), size: blob.size, width: w, height: h });
          },
          mime,
          quality / 100,
        );
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function ImageCompressor() {
  const [original, setOriginal] = useState<{ file: File; url: string; width: number; height: number } | null>(null);
  const [quality, setQuality] = useState(80);
  const [maxDim, setMaxDim] = useState<string>("");
  const [result, setResult] = useState<CompressResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  // Track the last compressed URL so we can revoke it before creating a new one,
  // without relying on stale state in the async compress callback.
  const lastResultUrl = useRef<string | null>(null);

  async function handleFile(file: File) {
    setError("");
    setResult(null);
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (JPEG, PNG, WebP, or GIF).");
      return;
    }
    if (file.size > MAX_INPUT_BYTES) {
      setError(`File is too large (max ${formatBytes(MAX_INPUT_BYTES)}).`);
      return;
    }
    if (original) URL.revokeObjectURL(original.url);
    const url = URL.createObjectURL(file);
    // Read natural dimensions for the original preview img width/height attributes.
    const dims = await new Promise<{ width: number; height: number }>((res) => {
      const img = new Image();
      img.onload = () => res({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = () => res({ width: 0, height: 0 });
      img.src = url;
    });
    setOriginal({ file, url, ...dims });
    await compress(file, quality, maxDim);
  }

  async function compress(file: File, q: number, dim: string) {
    setLoading(true);
    setError("");
    try {
      const maxD = dim ? parseInt(dim, 10) : null;
      const r = await compressImage(file, q, maxD && maxD > 0 ? maxD : null);
      if (lastResultUrl.current) URL.revokeObjectURL(lastResultUrl.current);
      lastResultUrl.current = r.url;
      setResult(r);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Compression failed.");
    } finally {
      setLoading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function download() {
    if (!result || !original) return;
    const a = document.createElement("a");
    a.href = result.url;
    const ext = original.file.type === "image/png" ? "png" : "jpg";
    a.download = `compressed.${ext}`;
    a.click();
  }

  const saving =
    original && result
      ? Math.round((1 - result.size / original.file.size) * 100)
      : null;

  return (
    <div className="space-y-6">
      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload image: click or drag and drop"
        onClick={() => fileRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" || e.key === " " ? fileRef.current?.click() : undefined}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-[var(--border-hairline)] p-10 text-center transition-colors hover:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true"
          stroke="currentColor" strokeWidth="1.5" className="text-muted">
          <path d="M4 16l4-4 4 4 4-6 4 6" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="3" y="3" width="18" height="18" rx="3"/>
        </svg>
        <p className="text-sm text-secondary">
          {original ? original.file.name : "Click or drag an image here"}
        </p>
        <p className="text-xs text-muted">JPEG, PNG, WebP · max 20 MB</p>
        <input
          ref={fileRef}
          type="file"
          accept={ACCEPT}
          className="sr-only"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          aria-label="Upload image file"
        />
      </div>

      {/* Controls */}
      {original && (
        <div className="flex flex-wrap gap-6">
          <div className="flex-1 min-w-40">
            <label htmlFor="img-quality" className="flex justify-between text-sm font-medium text-primary">
              <span>Quality</span>
              <span className="text-muted">{quality}%</span>
            </label>
            <input
              id="img-quality"
              type="range"
              min={1}
              max={100}
              value={quality}
              onChange={(e) => {
                const q = Number(e.target.value);
                setQuality(q);
                compress(original.file, q, maxDim);
              }}
              className="mt-1.5 w-full accent-[var(--accent)]"
            />
          </div>
          <div>
            <label htmlFor="img-maxdim" className="text-sm font-medium text-primary">
              Max dimension (px)
            </label>
            <input
              id="img-maxdim"
              type="number"
              min={1}
              placeholder="e.g. 1920"
              value={maxDim}
              onChange={(e) => {
                setMaxDim(e.target.value);
                compress(original.file, quality, e.target.value);
              }}
              className="mt-1.5 w-28 rounded-lg border border-[var(--border-hairline)] [background:var(--bg-elevated)] px-3 py-2 text-sm text-primary placeholder:text-muted focus:border-[var(--accent)] focus:outline-none"
            />
          </div>
        </div>
      )}

      {error && (
        <p role="alert" aria-live="assertive" className="rounded-xl border border-[var(--danger)] [background:color-mix(in_srgb,var(--danger)_10%,transparent)] px-4 py-3 text-sm text-secondary">
          {error}
        </p>
      )}

      {loading && (
        <p aria-live="polite" className="text-sm text-muted">Compressing…</p>
      )}

      {/* Before / After */}
      {original && result && !loading && (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3" aria-label="Compression results" aria-live="polite">
            <div className="panel px-4 py-3 text-center">
              <p className="text-xs text-muted">Original</p>
              <p className="font-mono text-lg font-semibold text-primary">{formatBytes(original.file.size)}</p>
            </div>
            <div className="panel px-4 py-3 text-center">
              <p className="text-xs text-muted">Compressed</p>
              <p className="font-mono text-lg font-semibold text-primary">{formatBytes(result.size)}</p>
              <p className="text-xs text-muted">{result.width}×{result.height}px</p>
            </div>
            <div className="panel px-4 py-3 text-center">
              <p className="text-xs text-muted">Saved</p>
              <p className={`font-mono text-lg font-semibold ${saving && saving > 0 ? "text-[var(--accent)]" : "text-primary"}`}>
                {saving !== null ? `${saving > 0 ? saving : 0}%` : "-"}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-1.5 text-xs text-muted">Original</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={original.url} alt="Original image preview" width={original.width || undefined} height={original.height || undefined} className="max-h-64 w-full rounded-xl border border-[var(--border-hairline)] object-contain" />
            </div>
            <div>
              <p className="mb-1.5 text-xs text-muted">Compressed</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={result.url} alt="Compressed image preview" width={result.width} height={result.height} className="max-h-64 w-full rounded-xl border border-[var(--border-hairline)] object-contain" />
            </div>
          </div>

          <button
            onClick={download}
            className="btn-primary"
          >
            Download compressed image
          </button>
        </div>
      )}
    </div>
  );
}
