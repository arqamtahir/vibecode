"use client";

import { useRef, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { parseCsv } from "@/lib/tools/csv-to-json";

const SAMPLE = `name,age,city
Alice,30,New York
Bob,25,"San Francisco, CA"
Carol,28,Austin`;

const DELIMITERS = [
  { label: "Comma (,)", value: "," },
  { label: "Tab (\\t)", value: "\t" },
  { label: "Semicolon (;)", value: ";" },
  { label: "Pipe (|)", value: "|" },
];

export function CsvToJson() {
  const [csv, setCsv] = useState(SAMPLE);
  const [delimiter, setDelimiter] = useState(",");
  const [hasHeader, setHasHeader] = useState(true);
  const [pretty, setPretty] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);

  const result = csv.trim() ? parseCsv(csv, { delimiter, hasHeader }) : null;
  const json = result
    ? pretty
      ? JSON.stringify(result.data, null, 2)
      : JSON.stringify(result.data)
    : "";

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setCsv((ev.target?.result as string) ?? "");
    reader.readAsText(file);
  }

  function download() {
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "output.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex flex-wrap gap-4">
        <div>
          <label htmlFor="csv-delimiter" className="text-sm font-medium text-primary">
            Delimiter
          </label>
          <select
            id="csv-delimiter"
            value={delimiter}
            onChange={(e) => setDelimiter(e.target.value)}
            className="mt-1.5 block rounded-lg border border-[var(--glass-border)] [background:var(--bg-page)] px-3 py-2 text-sm text-primary focus:border-[var(--accent)] focus:outline-none"
          >
            {DELIMITERS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        <label className="flex cursor-pointer items-center gap-2 self-end pb-2 text-sm text-primary">
          <input
            type="checkbox"
            checked={hasHeader}
            onChange={(e) => setHasHeader(e.target.checked)}
            className="accent-[var(--accent)]"
          />
          First row is header
        </label>

        <label className="flex cursor-pointer items-center gap-2 self-end pb-2 text-sm text-primary">
          <input
            type="checkbox"
            checked={pretty}
            onChange={(e) => setPretty(e.target.checked)}
            className="accent-[var(--accent)]"
          />
          Pretty-print JSON
        </label>

        <div className="self-end pb-1.5">
          <button
            onClick={() => fileRef.current?.click()}
            className="rounded-lg border border-[var(--glass-border)] px-3 py-1.5 text-sm font-medium text-secondary hover:text-primary"
          >
            Upload CSV
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".csv,text/csv,text/plain"
            className="sr-only"
            onChange={handleFile}
            aria-label="Upload CSV file"
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label htmlFor="csv-input" className="text-sm font-medium text-primary">
            CSV input
          </label>
          <textarea
            id="csv-input"
            value={csv}
            onChange={(e) => setCsv(e.target.value)}
            spellCheck={false}
            placeholder="Paste CSV here or upload a file…"
            className="mt-1.5 h-72 w-full resize-y rounded-xl border border-[var(--glass-border)] [background:var(--bg-page)] p-3 font-mono text-sm text-primary placeholder:text-muted focus:border-[var(--accent)] focus:outline-none"
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-primary" aria-live="polite">
              JSON output
              {result ? ` - ${result.rowCount} row${result.rowCount === 1 ? "" : "s"}` : ""}
            </span>
            <div className="flex gap-2">
              <CopyButton value={json} aria-label="Copy JSON" />
              <button
                onClick={download}
                disabled={!json}
                className="rounded-lg border border-[var(--glass-border)] px-3 py-1.5 text-xs font-medium text-secondary hover:text-primary disabled:opacity-40"
              >
                Download
              </button>
            </div>
          </div>

          {result?.errors.length ? (
            <ul aria-live="assertive" className="mt-2 space-y-1">
              {result.errors.map((e, i) => (
                <li key={i} className="rounded-lg border border-[var(--brand-purple)] [background:color-mix(in_srgb,var(--brand-purple)_10%,transparent)] px-3 py-2 text-xs text-secondary">
                  {e}
                </li>
              ))}
            </ul>
          ) : null}

          <pre className="mt-1.5 h-72 overflow-auto rounded-xl border border-[var(--glass-border)] [background:var(--bg-page)] p-3 font-mono text-xs text-primary whitespace-pre-wrap break-all">
            {json || <span className="text-muted">JSON will appear here.</span>}
          </pre>
        </div>
      </div>
    </div>
  );
}
