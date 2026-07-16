"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import {
  buildPool,
  defaultPasswordOptions,
  entropyBits,
  generatePassword,
  strengthLabel,
  type PasswordOptions,
} from "@/lib/tools/password-generator";

const TOGGLES = [
  { key: "lowercase", label: "Lowercase (a-z)" },
  { key: "uppercase", label: "Uppercase (A-Z)" },
  { key: "digits", label: "Digits (0-9)" },
  { key: "symbols", label: "Symbols (!@#…)" },
] as const;

export function PasswordGenerator() {
  const [options, setOptions] = useState<PasswordOptions>(defaultPasswordOptions);
  const [password, setPassword] = useState("");

  const poolEmpty = buildPool(options).length === 0;
  const bits = entropyBits(options);

  /** Update options and regenerate in the same user action. */
  function update(patch: Partial<PasswordOptions>) {
    const next = { ...options, ...patch };
    setOptions(next);
    setPassword(generatePassword(next));
  }

  return (
    <div className="space-y-6">
      <div>
        <label
          htmlFor="password-length"
          className="flex max-w-sm justify-between gap-4 text-sm font-medium text-primary"
        >
          <span>Length</span>
          <span className="font-mono text-muted">{options.length}</span>
        </label>
        <input
          id="password-length"
          type="range"
          min={8}
          max={64}
          value={options.length}
          onChange={(e) => update({ length: Number(e.target.value) })}
          className="mt-1.5 w-full max-w-sm accent-[var(--accent)]"
        />
      </div>

      <fieldset>
        <legend className="text-sm font-medium text-primary">Character sets</legend>
        <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
          {TOGGLES.map((t) => (
            <label key={t.key} className="flex items-center gap-2 text-sm text-secondary">
              <input
                type="checkbox"
                checked={options[t.key]}
                onChange={(e) => update({ [t.key]: e.target.checked })}
                className="h-4 w-4 accent-[var(--accent)]"
              />
              {t.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setPassword(generatePassword(options))}
          disabled={poolEmpty}
          className="btn-primary disabled:opacity-50"
        >
          Generate password
        </button>
        <CopyButton value={password} />
      </div>

      <div>
        <span id="password-output-label" className="text-sm font-medium text-primary">
          Generated password
        </span>
        <output
          aria-labelledby="password-output-label"
          aria-live="polite"
          className="mt-2 block w-full overflow-x-auto rounded-xl border border-[var(--border-hairline)] [background:var(--bg-elevated)] p-4 font-mono text-lg text-primary"
        >
          {poolEmpty ? "Select at least one character set." : password || "Press “Generate password”."}
        </output>
        <p className="mt-2 font-mono text-xs text-muted">
          {poolEmpty ? "" : `${bits} bits of entropy · ${strengthLabel(bits)}`}
        </p>
      </div>

      <p className="text-xs text-muted">
        Generated with your browser&apos;s cryptographic random source
        (crypto.getRandomValues) and never sent anywhere.
      </p>
    </div>
  );
}
