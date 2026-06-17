"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { formatJson, minifyJson, type JsonError } from "@/lib/tools/json-formatter";

type Indent = "2" | "4" | "tab";

const indentValue = (indent: Indent): number | string =>
  indent === "tab" ? "\t" : Number(indent);

/** The line of input where the error occurred, for inline highlighting. */
function errorLine(input: string, error: JsonError): string | null {
  if (!error.line) return null;
  return input.split("\n")[error.line - 1] ?? null;
}

export function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<JsonError | null>(null);
  const [indent, setIndent] = useState<Indent>("2");

  const errorContext = useMemo(
    () => (error ? errorLine(input, error) : null),
    [error, input],
  );

  function run(kind: "format" | "minify") {
    const result =
      kind === "format" ? formatJson(input, indentValue(indent) as number) : minifyJson(input);
    if (result.ok) {
      setOutput(result.output);
      setError(null);
    } else {
      setOutput("");
      setError(result.error);
    }
  }

  function clearAll() {
    setInput("");
    setOutput("");
    setError(null);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Input */}
      <div className="flex flex-col">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label htmlFor="json-input" className="text-sm font-medium text-primary">
            JSON input
          </label>
          <div className="flex items-center gap-2">
            <label htmlFor="json-indent" className="text-xs text-secondary">
              Indent
            </label>
            <select
              id="json-indent"
              value={indent}
              onChange={(e) => setIndent(e.target.value as Indent)}
              className="rounded-lg border border-[var(--glass-border)] [background:var(--bg-elevated)] px-2 py-1.5 text-sm text-primary focus:border-[var(--accent)] focus:outline-none"
            >
              <option value="2">2 spaces</option>
              <option value="4">4 spaces</option>
              <option value="tab">Tabs</option>
            </select>
          </div>
        </div>
        <textarea
          id="json-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck={false}
          placeholder={'{"hello": "world", "items": [1, 2, 3]}'}
          className="mt-2 h-72 w-full resize-y rounded-xl border border-[var(--glass-border)] [background:var(--bg-page)] p-3 font-mono text-sm text-primary placeholder:text-muted focus:border-[var(--accent)] focus:outline-none"
        />

        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={() => run("format")} className="glow-button">
            Format
          </button>
          <button
            type="button"
            onClick={() => run("minify")}
            className="inline-flex items-center rounded-full border border-[var(--glass-border)] px-5 py-2.5 text-sm font-medium text-primary transition-colors hover:border-[var(--accent)]"
          >
            Minify
          </button>
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex items-center rounded-full border border-[var(--glass-border)] px-5 py-2.5 text-sm font-medium text-secondary transition-colors hover:text-primary"
          >
            Clear
          </button>
        </div>

        <div aria-live="assertive" role="alert" className="mt-3">
          {error ? (
            <div className="rounded-xl border border-[var(--brand-purple)] [background:color-mix(in_srgb,var(--brand-purple)_10%,transparent)] p-3">
              <p className="text-sm font-medium text-primary">
                Invalid JSON
                {error.line ? (
                  <span className="text-secondary">
                    {" "}
                    - line {error.line}, column {error.column}
                  </span>
                ) : null}
              </p>
              <p className="mt-1 text-sm text-secondary">{error.message}</p>
              {errorContext ? (
                <pre className="mt-2 overflow-x-auto rounded-lg [background:var(--bg-page)] p-2 font-mono text-xs text-primary">
                  <code>{errorContext}</code>
                  {error.column ? (
                    <code className="block text-[var(--accent)]">
                      {" ".repeat(Math.max(0, error.column - 1))}^
                    </code>
                  ) : null}
                </pre>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      {/* Output */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between gap-3">
          <span id="json-output-label" className="text-sm font-medium text-primary">
            Result
          </span>
          <CopyButton value={output} label="Copy result" />
        </div>
        <textarea
          readOnly
          aria-labelledby="json-output-label"
          value={output}
          spellCheck={false}
          placeholder="Formatted JSON appears here."
          className="mt-2 h-72 w-full resize-y rounded-xl border border-[var(--glass-border)] [background:var(--bg-page)] p-3 font-mono text-sm text-primary placeholder:text-muted focus:border-[var(--accent)] focus:outline-none"
        />
      </div>
    </div>
  );
}
