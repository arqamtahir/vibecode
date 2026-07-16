"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { svgToJsx } from "@/lib/tools/svg-to-jsx";

const SAMPLE = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2" class="icon">
  <path d="M5 12h14" stroke="currentColor" stroke-linecap="round" />
</svg>`;

export function SvgToJsx() {
  const [input, setInput] = useState("");
  const [asComponent, setAsComponent] = useState(false);
  const [componentName, setComponentName] = useState("SvgIcon");

  const result = useMemo(
    () => (input.trim() ? svgToJsx(input, { asComponent, componentName }) : null),
    [input, asComponent, componentName],
  );

  const output = result?.ok ? result.output : "";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="flex flex-col">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label htmlFor="svg-input" className="text-sm font-medium text-primary">
            SVG markup
          </label>
          <button
            type="button"
            onClick={() => setInput(SAMPLE)}
            className="rounded-full border border-[var(--border-hairline)] px-3 py-1 text-sm text-secondary transition-colors hover:text-primary"
          >
            Load sample
          </button>
        </div>
        <textarea
          id="svg-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck={false}
          placeholder={SAMPLE}
          className="mt-2 h-72 w-full resize-y rounded-xl border border-[var(--border-hairline)] [background:var(--bg-elevated)] p-3 font-mono text-sm text-primary placeholder:text-muted focus:border-[var(--accent)] focus:outline-none"
        />

        <div className="mt-3 flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-secondary">
            <input
              type="checkbox"
              checked={asComponent}
              onChange={(e) => setAsComponent(e.target.checked)}
              className="accent-[var(--accent)]"
            />
            Wrap in a React component
          </label>
          {asComponent ? (
            <div className="flex items-center gap-2">
              <label htmlFor="svg-component-name" className="text-xs text-secondary">
                Name
              </label>
              <input
                id="svg-component-name"
                value={componentName}
                onChange={(e) => setComponentName(e.target.value)}
                className="w-32 rounded-lg border border-[var(--border-hairline)] [background:var(--bg-elevated)] px-2 py-1.5 text-sm text-primary focus:border-[var(--accent)] focus:outline-none"
              />
            </div>
          ) : null}
        </div>

        <div aria-live="assertive" role="alert" className="mt-3">
          {result && !result.ok ? (
            <p className="rounded-xl border border-[var(--danger)] [background:color-mix(in_srgb,var(--danger)_10%,transparent)] p-3 text-sm text-secondary">
              {result.error}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center justify-between gap-3">
          <span id="svg-output-label" className="text-sm font-medium text-primary">
            JSX output
          </span>
          <CopyButton value={output} label="Copy JSX" />
        </div>
        <textarea
          readOnly
          aria-labelledby="svg-output-label"
          value={output}
          spellCheck={false}
          placeholder="React-ready JSX appears here."
          className="mt-2 h-72 w-full resize-y rounded-xl border border-[var(--border-hairline)] [background:var(--bg-elevated)] p-3 font-mono text-sm text-primary placeholder:text-muted focus:border-[var(--accent)] focus:outline-none"
        />
      </div>
    </div>
  );
}
