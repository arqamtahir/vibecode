"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { jsonToTypeScript } from "@/lib/tools/json-to-typescript";

const SAMPLE = `{
  "id": 1,
  "name": "Ada",
  "active": true,
  "roles": ["admin", "user"],
  "profile": { "age": 36, "city": null },
  "posts": [{ "title": "Hi", "likes": 4 }, { "title": "Yo" }]
}`;

const IDENT_RE = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

export function JsonToTypeScript() {
  const [input, setInput] = useState("");
  const [rootName, setRootName] = useState("Root");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  function convert() {
    const name = IDENT_RE.test(rootName.trim()) ? rootName.trim() : "Root";
    const result = jsonToTypeScript(input, name);
    if (result.ok) {
      setOutput(result.output);
      setError("");
    } else {
      setOutput("");
      setError(result.error);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="flex flex-col">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <label htmlFor="jts-input" className="text-sm font-medium text-primary">
            JSON input
          </label>
          <div className="flex items-center gap-2">
            <label htmlFor="jts-root" className="text-xs text-secondary">
              Root interface
            </label>
            <input
              id="jts-root"
              value={rootName}
              onChange={(e) => setRootName(e.target.value)}
              className="w-28 rounded-lg border border-[var(--glass-border)] [background:var(--bg-elevated)] px-2 py-1.5 text-sm text-primary focus:border-[var(--accent)] focus:outline-none"
            />
          </div>
        </div>
        <textarea
          id="jts-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck={false}
          placeholder={SAMPLE}
          className="mt-2 h-72 w-full resize-y rounded-xl border border-[var(--glass-border)] [background:var(--bg-page)] p-3 font-mono text-sm text-primary placeholder:text-muted focus:border-[var(--accent)] focus:outline-none"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={convert} className="glow-button">
            Generate TypeScript
          </button>
          <button
            type="button"
            onClick={() => setInput(SAMPLE)}
            className="inline-flex items-center rounded-full border border-[var(--glass-border)] px-5 py-2.5 text-sm font-medium text-secondary transition-colors hover:text-primary"
          >
            Load sample
          </button>
        </div>
        <div aria-live="assertive" role="alert" className="mt-3">
          {error ? (
            <p className="rounded-xl border border-[var(--brand-purple)] [background:color-mix(in_srgb,var(--brand-purple)_10%,transparent)] p-3 text-sm text-secondary">
              {error}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center justify-between gap-3">
          <span id="jts-output-label" className="text-sm font-medium text-primary">
            TypeScript interfaces
          </span>
          <CopyButton value={output} label="Copy code" />
        </div>
        <textarea
          readOnly
          aria-labelledby="jts-output-label"
          value={output}
          spellCheck={false}
          placeholder="export interface Root { … }"
          className="mt-2 h-72 w-full resize-y rounded-xl border border-[var(--glass-border)] [background:var(--bg-page)] p-3 font-mono text-sm text-primary placeholder:text-muted focus:border-[var(--accent)] focus:outline-none"
        />
      </div>
    </div>
  );
}
