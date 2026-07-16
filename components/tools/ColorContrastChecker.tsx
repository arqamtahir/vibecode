"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { evaluateContrast, suggestPalette } from "@/lib/tools/contrast";

const HEX_RE = /^#?[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/;

function normalizeHex(value: string): string {
  const v = value.startsWith("#") ? value : `#${value}`;
  return v;
}

function PassFail({ pass }: { pass: boolean }) {
  const tone = pass ? "var(--accent)" : "var(--danger)";
  return (
    <span
      className="rounded-full border px-2.5 py-0.5 text-xs font-medium"
      style={{ borderColor: tone, color: tone, background: `color-mix(in srgb, ${tone} 12%, transparent)` }}
    >
      {pass ? "Pass" : "Fail"}
    </span>
  );
}

/** Hoisted to module scope so it isn't remounted each render (preserves focus). */
function ColorField({
  id,
  label,
  value,
  onChange,
  valid,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  valid: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-primary">
        {label}
      </label>
      <div className="mt-1.5 flex items-center gap-2">
        <input
          type="color"
          aria-label={`${label} color picker`}
          value={valid ? normalizeHex(value) : "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-12 cursor-pointer rounded border border-[var(--border-hairline)] bg-transparent"
        />
        <input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!valid}
          spellCheck={false}
          className="w-32 rounded-lg border border-[var(--border-hairline)] [background:var(--bg-elevated)] px-3 py-2 font-mono text-sm text-primary focus:border-[var(--accent)] focus:outline-none"
        />
      </div>
    </div>
  );
}

export function ColorContrastChecker() {
  const [fg, setFg] = useState("#0b1120");
  const [bg, setBg] = useState("#f4f6fb");

  const result = useMemo(() => evaluateContrast(fg, bg), [fg, bg]);
  const palette = useMemo(() => suggestPalette(fg), [fg]);

  const validFg = HEX_RE.test(fg);
  const validBg = HEX_RE.test(bg);

  const checks = result
    ? [
        { label: "AA · Normal text", pass: result.aaNormal },
        { label: "AAA · Normal text", pass: result.aaaNormal },
        { label: "AA · Large text", pass: result.aaLarge },
        { label: "AAA · Large text", pass: result.aaaLarge },
      ]
    : [];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <div className="flex flex-wrap gap-6">
          <ColorField id="fg-hex" label="Foreground" value={fg} onChange={setFg} valid={validFg} />
          <ColorField id="bg-hex" label="Background" value={bg} onChange={setBg} valid={validBg} />
        </div>

        <div aria-live="assertive" role="alert">
          {!result ? (
            <p className="rounded-xl border border-[var(--danger)] [background:color-mix(in_srgb,var(--danger)_10%,transparent)] p-3 text-sm text-secondary">
              Enter two valid hex colors (e.g. #1a2b3c or #abc).
            </p>
          ) : null}
        </div>

        {result ? (
          <>
            <div className="panel p-5">
              <p className="text-sm text-secondary">Contrast ratio</p>
              <p className="mt-1 text-3xl font-bold text-primary" aria-live="polite">
                {result.ratio.toFixed(2)}:1
              </p>
            </div>
            <ul className="grid grid-cols-2 gap-3">
              {checks.map((c) => (
                <li
                  key={c.label}
                  className="flex items-center justify-between gap-2 rounded-xl border border-[var(--border-hairline)] p-3"
                >
                  <span className="text-sm text-secondary">{c.label}</span>
                  <PassFail pass={c.pass} />
                </li>
              ))}
            </ul>
          </>
        ) : null}

        {palette.length ? (
          <div>
            <p className="mb-2 text-sm font-medium text-primary">Suggested palette (foreground)</p>
            <ul className="flex flex-wrap gap-2">
              {palette.map((hex) => (
                <li key={hex} className="flex flex-col items-center gap-1">
                  <span
                    className="block h-10 w-12 rounded-lg border border-[var(--border-hairline)]"
                    style={{ background: hex }}
                    aria-hidden="true"
                  />
                  <CopyButton
                    value={hex}
                    label={hex}
                    className="font-mono text-[11px] text-secondary hover:text-primary"
                  />
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div className="space-y-4">
        <p className="text-sm font-medium text-primary">Live preview</p>
        <div
          className="space-y-4 rounded-2xl border border-[var(--border-hairline)] p-6"
          style={{ background: validBg ? normalizeHex(bg) : undefined, color: validFg ? normalizeHex(fg) : undefined }}
        >
          <p className="text-base">Normal text - the quick brown fox jumps over the lazy dog.</p>
          <p className="text-2xl font-bold">Large text - Vibecode</p>
        </div>
      </div>
    </div>
  );
}
