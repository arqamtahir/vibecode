"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { convertCases } from "@/lib/tools/case-converter";

export function CaseConverter() {
  const [input, setInput] = useState("hello world example");
  const results = convertCases(input);

  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="case-input" className="text-sm font-medium text-primary">
          Input text
        </label>
        <textarea
          id="case-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or paste any text…"
          className="mt-1.5 h-24 w-full resize-y rounded-xl border border-[var(--border-hairline)] [background:var(--bg-elevated)] p-3 text-sm text-primary placeholder:text-muted focus:border-[var(--accent)] focus:outline-none"
        />
      </div>

      {results.length > 0 ? (
        <ul className="grid gap-3 sm:grid-cols-2" aria-label="Case conversion results">
          {results.map((r) => (
            <li
              key={r.key}
              className="panel flex items-center justify-between gap-3 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="text-xs text-muted">{r.label}</p>
                <p className="truncate font-mono text-sm text-primary">{r.value}</p>
              </div>
              <CopyButton value={r.value} aria-label={`Copy ${r.label}`} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted" aria-live="polite">
          Enter some text above to see all conversions.
        </p>
      )}
    </div>
  );
}
