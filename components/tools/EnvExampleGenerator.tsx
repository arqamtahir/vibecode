"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { sanitizeEnv } from "@/lib/tools/env-example";

const SAMPLE = `# Database
DATABASE_URL=postgres://user:pass@localhost:5432/app
PORT=3000

# Auth
JWT_SECRET=super-secret-value
STRIPE_API_KEY=sk_live_abc123
NEXT_PUBLIC_SITE_URL=https://example.com`;

export function EnvExampleGenerator() {
  const [input, setInput] = useState("");

  const { output, secretKeys } = useMemo(() => sanitizeEnv(input), [input]);

  return (
    <div className="space-y-4">
      <p className="rounded-lg border border-[var(--glass-border)] p-3 text-xs text-secondary">
        <strong className="text-primary">Private:</strong> your <code>.env</code> may
        contain real secrets. Everything here is processed in your browser - nothing is
        ever uploaded or logged.
      </p>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col">
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="env-input" className="text-sm font-medium text-primary">
              Your .env
            </label>
            <button
              type="button"
              onClick={() => setInput(SAMPLE)}
              className="rounded-full border border-[var(--glass-border)] px-3 py-1 text-sm text-secondary transition-colors hover:text-primary"
            >
              Load sample
            </button>
          </div>
          <textarea
            id="env-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            placeholder={SAMPLE}
            className="mt-2 h-72 w-full resize-y rounded-xl border border-[var(--glass-border)] [background:var(--bg-page)] p-3 font-mono text-sm text-primary placeholder:text-muted focus:border-[var(--accent)] focus:outline-none"
          />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center justify-between gap-3">
            <span id="env-output-label" className="text-sm font-medium text-primary">
              .env.example
            </span>
            <CopyButton value={output} label="Copy output" />
          </div>
          <textarea
            readOnly
            aria-labelledby="env-output-label"
            value={output}
            spellCheck={false}
            placeholder="Sanitized output appears here - keys and comments kept, values blanked."
            className="mt-2 h-72 w-full resize-y rounded-xl border border-[var(--glass-border)] [background:var(--bg-page)] p-3 font-mono text-sm text-primary placeholder:text-muted focus:border-[var(--accent)] focus:outline-none"
          />
        </div>
      </div>

      <div aria-live="polite" role="status">
        {secretKeys.length > 0 ? (
          <div className="rounded-xl border border-[var(--brand-purple)] [background:color-mix(in_srgb,var(--brand-purple)_10%,transparent)] p-3 text-sm text-secondary">
            <strong className="text-primary">Heads up:</strong> these keys look like secrets -
            make sure their real values never get committed:{" "}
            <span className="font-mono text-primary">{secretKeys.join(", ")}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
