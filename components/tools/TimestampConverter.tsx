"use client";

import { useEffect, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { fromEpoch } from "@/lib/tools/timestamp-converter";

interface Row {
  label: string;
  value: string;
}

export function TimestampConverter() {
  const [input, setInput] = useState("");
  const [nowMs, setNowMs] = useState(Date.now);

  // Live epoch ticker - updates every second
  useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const result = fromEpoch(input || String(Math.floor(nowMs / 1000)));
  const rows: Row[] = result
    ? [
        { label: "Unix (seconds)", value: String(result.epochSeconds) },
        { label: "Unix (milliseconds)", value: String(result.epochMs) },
        { label: "ISO 8601", value: result.iso },
        { label: "UTC", value: result.utc },
        { label: "Local", value: result.local },
        { label: "Relative", value: result.relative },
      ]
    : [];

  const error = input.trim() && !result ? "Invalid timestamp or date - enter a Unix epoch (s or ms), ISO string, or date." : "";

  return (
    <div className="space-y-6">
      {/* Current epoch ticker */}
      <div className="glass-card flex items-center justify-between gap-4 px-5 py-4">
        <div>
          <p className="text-xs text-muted">Current Unix timestamp</p>
          <p className="font-mono text-2xl font-semibold text-primary tabular-nums" aria-live="polite" aria-atomic="true">
            {Math.floor(nowMs / 1000)}
          </p>
          <p className="mt-0.5 font-mono text-xs text-muted tabular-nums">{nowMs} ms</p>
        </div>
        <CopyButton value={String(Math.floor(nowMs / 1000))} aria-label="Copy current epoch" />
      </div>

      {/* Input */}
      <div>
        <label htmlFor="ts-input" className="text-sm font-medium text-primary">
          Convert timestamp or date
        </label>
        <input
          id="ts-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. 1700000000  ·  2024-11-15  ·  leave blank to use current time"
          className="mt-1.5 w-full rounded-lg border border-[var(--glass-border)] [background:var(--bg-page)] px-3 py-2 font-mono text-sm text-primary placeholder:text-muted focus:border-[var(--accent)] focus:outline-none"
        />
        {error && (
          <p aria-live="assertive" className="mt-2 text-xs text-[var(--brand-purple)]">
            {error}
          </p>
        )}
      </div>

      {/* Results */}
      {rows.length > 0 && (
        <ul className="grid gap-3 sm:grid-cols-2" aria-label="Timestamp conversions">
          {rows.map((r) => (
            <li key={r.label} className="glass-card flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="text-xs text-muted">{r.label}</p>
                <p className="truncate font-mono text-sm text-primary">{r.value}</p>
              </div>
              <CopyButton value={r.value} aria-label={`Copy ${r.label}`} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
