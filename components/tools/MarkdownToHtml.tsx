"use client";

import { useEffect, useState } from "react";
import { CopyButton } from "@/components/CopyButton";

const INITIAL = `# Hello, Markdown

Convert **bold**, *italic*, and \`inline code\` to HTML instantly.

## Lists & Tables

- Item one
- Item two
  - Nested item

| Column A | Column B |
|----------|----------|
| Cell 1   | Cell 2   |

\`\`\`js
console.log("code block");
\`\`\`

[Visit AlgoCrew](https://algocrew.io)
`;

export function MarkdownToHtml() {
  const [markdown, setMarkdown] = useState(INITIAL);
  const [html, setHtml] = useState("");
  const [tab, setTab] = useState<"preview" | "html">("preview");

  useEffect(() => {
    let cancelled = false;
    async function run() {
      const [{ marked }, DOMPurify] = await Promise.all([
        import("marked"),
        import("dompurify"),
      ]);
      marked.setOptions({ gfm: true });
      const raw = await marked.parse(markdown);
      const clean = DOMPurify.default.sanitize(raw);
      if (!cancelled) setHtml(clean);
    }
    run();
    return () => { cancelled = true; };
  }, [markdown]);

  function download() {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "output.html";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Editor */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="md-input" className="text-sm font-medium text-primary">
            Markdown
          </label>
          <textarea
            id="md-input"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            spellCheck={false}
            className="h-96 resize-y rounded-xl border border-[var(--glass-border)] [background:var(--bg-page)] p-3 font-mono text-sm text-primary focus:border-[var(--accent)] focus:outline-none"
          />
        </div>

        {/* Output */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <div
              role="tablist"
              aria-label="Output format"
              className="flex gap-1 rounded-lg border border-[var(--glass-border)] p-0.5 [background:var(--bg-elevated)]"
            >
              {(["preview", "html"] as const).map((t) => (
                <button
                  key={t}
                  role="tab"
                  aria-selected={tab === t}
                  onClick={() => setTab(t)}
                  className={`rounded-md px-3 py-1 text-xs font-medium capitalize transition-colors ${
                    tab === t
                      ? "bg-[var(--accent)] text-white"
                      : "text-secondary hover:text-primary"
                  }`}
                >
                  {t === "html" ? "HTML source" : "Preview"}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <CopyButton value={html} aria-label="Copy HTML" />
              <button
                onClick={download}
                className="rounded-lg border border-[var(--glass-border)] px-3 py-1.5 text-xs font-medium text-secondary hover:text-primary"
              >
                Download
              </button>
            </div>
          </div>

          {tab === "preview" ? (
            <div
              role="tabpanel"
              aria-label="Rendered HTML preview"
              className="md-preview h-96 overflow-y-auto rounded-xl border border-[var(--glass-border)] [background:var(--bg-page)] p-4 text-primary"
              // dangerouslySetInnerHTML is safe here because html is DOMPurify-sanitized
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ) : (
            <pre
              role="tabpanel"
              aria-label="HTML source"
              className="h-96 overflow-auto rounded-xl border border-[var(--glass-border)] [background:var(--bg-page)] p-3 font-mono text-xs text-primary whitespace-pre-wrap break-all"
            >
              {html}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
