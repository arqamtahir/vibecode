"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import {
  decodeUrl,
  encodeUrl,
  queryParams,
  type UrlCodecMode,
} from "@/lib/tools/url-codec";

type Direction = "encode" | "decode";

export function UrlEncoderDecoder() {
  const [input, setInput] = useState("");
  const [direction, setDirection] = useState<Direction>("encode");
  const [mode, setMode] = useState<UrlCodecMode>("component");

  const result = useMemo(
    () => (direction === "encode" ? encodeUrl(input, mode) : decodeUrl(input, mode)),
    [input, direction, mode],
  );
  const params = useMemo(
    () => (direction === "decode" ? queryParams(input) : queryParams(result.output)),
    [direction, input, result.output],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
        <div role="group" aria-label="Direction" className="inline-flex rounded-lg border border-[var(--border-hairline)] p-1">
          {(["encode", "decode"] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDirection(d)}
              aria-pressed={direction === d}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                direction === d
                  ? "[background:var(--accent)] text-[var(--accent-contrast)]"
                  : "text-secondary hover:text-primary"
              }`}
            >
              {d === "encode" ? "Encode" : "Decode"}
            </button>
          ))}
        </div>

        <div role="group" aria-label="Encoding scope" className="inline-flex rounded-lg border border-[var(--border-hairline)] p-1">
          {(
            [
              { value: "component", label: "Component" },
              { value: "full", label: "Full URL" },
            ] as const
          ).map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => setMode(m.value)}
              aria-pressed={mode === m.value}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                mode === m.value
                  ? "[background:var(--accent)] text-[var(--accent-contrast)]"
                  : "text-secondary hover:text-primary"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <label htmlFor="url-input" className="text-sm font-medium text-primary">
            Input
          </label>
          <textarea
            id="url-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            placeholder={
              direction === "encode"
                ? "https://example.com/search?q=hello world&lang=en"
                : "https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world"
            }
            className="mt-2 h-40 w-full resize-y rounded-xl border border-[var(--border-hairline)] [background:var(--bg-elevated)] p-3 font-mono text-sm text-primary placeholder:text-muted focus:border-[var(--accent)] focus:outline-none"
          />
        </div>
        <div>
          <div className="flex items-center justify-between gap-3">
            <span id="url-output-label" className="text-sm font-medium text-primary">
              Result
            </span>
            <CopyButton value={result.ok ? result.output : ""} label="Copy result" />
          </div>
          <textarea
            readOnly
            aria-labelledby="url-output-label"
            value={result.ok ? result.output : ""}
            spellCheck={false}
            placeholder="Result appears here."
            className="mt-2 h-40 w-full resize-y rounded-xl border border-[var(--border-hairline)] [background:var(--bg-elevated)] p-3 font-mono text-sm text-primary placeholder:text-muted focus:border-[var(--accent)] focus:outline-none"
          />
        </div>
      </div>

      <div aria-live="assertive" role="alert">
        {!result.ok && input !== "" ? (
          <p className="rounded-xl border border-[var(--danger)] [background:color-mix(in_srgb,var(--danger)_10%,transparent)] px-4 py-3 text-sm text-secondary">
            {result.error}
          </p>
        ) : null}
      </div>

      {params.length > 0 ? (
        <div>
          <h3 className="font-mono text-xs uppercase tracking-[0.08em] text-muted">
            Query parameters
          </h3>
          <div className="mt-2 overflow-x-auto rounded-xl border border-[var(--border-hairline)] [background:var(--bg-elevated)]">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-[var(--border-hairline)] text-left">
                  <th scope="col" className="px-3 py-2 font-medium text-secondary">Key</th>
                  <th scope="col" className="px-3 py-2 font-medium text-secondary">Value (decoded)</th>
                </tr>
              </thead>
              <tbody>
                {params.map((p, i) => (
                  <tr key={`${p.key}-${i}`} className="border-b border-[var(--border-hairline)] last:border-b-0">
                    <td className="px-3 py-2 font-mono text-xs text-primary">{p.key}</td>
                    <td className="break-all px-3 py-2 font-mono text-xs text-secondary">{p.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}
