"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CopyButton } from "@/components/CopyButton";
import {
  parseColor,
  toHex,
  toHslString,
  toOklchString,
  toRgbString,
} from "@/lib/tools/color-convert";

export function ColorConverter() {
  const [input, setInput] = useState("#c2410c");
  const rgb = useMemo(() => parseColor(input), [input]);

  const formats = rgb
    ? [
        { label: "hex", value: toHex(rgb) },
        { label: "rgb", value: toRgbString(rgb) },
        { label: "hsl", value: toHslString(rgb) },
        { label: "oklch", value: toOklchString(rgb) },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-4">
        <div className="grow sm:max-w-sm">
          <label htmlFor="color-input" className="text-sm font-medium text-primary">
            Color (hex, rgb, or hsl)
          </label>
          <input
            id="color-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            placeholder="#c2410c · rgb(194, 65, 12) · hsl(17, 88%, 40%)"
            className="mt-2 w-full rounded-xl border border-[var(--border-hairline)] [background:var(--bg-elevated)] px-3 py-2.5 font-mono text-sm text-primary placeholder:text-muted focus:border-[var(--accent)] focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="color-picker" className="sr-only">
            Pick a color
          </label>
          <input
            id="color-picker"
            type="color"
            value={rgb ? toHex(rgb) : "#c2410c"}
            onChange={(e) => setInput(e.target.value)}
            className="h-11 w-16 cursor-pointer rounded-lg border border-[var(--border-hairline)] [background:var(--bg-elevated)] p-1"
          />
        </div>
      </div>

      <div aria-live="polite">
        {rgb ? (
          <div className="grid gap-6 sm:grid-cols-[10rem_1fr]">
            <div
              aria-hidden="true"
              className="h-40 w-full rounded-xl border border-[var(--border-hairline)]"
              style={{ backgroundColor: toHex(rgb) }}
            />
            <ul className="space-y-3">
              {formats.map((f) => (
                <li
                  key={f.label}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border-hairline)] [background:var(--bg-elevated)] px-4 py-3"
                >
                  <div className="min-w-0">
                    <span className="font-mono text-xs uppercase tracking-[0.08em] text-muted">
                      {f.label}
                    </span>
                    <p className="truncate font-mono text-sm text-primary">{f.value}</p>
                  </div>
                  <CopyButton value={f.value} />
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p
            role="alert"
            className="rounded-xl border border-[var(--danger)] [background:color-mix(in_srgb,var(--danger)_10%,transparent)] px-4 py-3 text-sm text-secondary"
          >
            Couldn&apos;t parse that color. Try formats like #c2410c, rgb(194, 65, 12),
            or hsl(17, 88%, 40%).
          </p>
        )}
      </div>

      <p className="text-xs text-muted">
        Need to check readability? Pair this with the{" "}
        <Link href="/tools/color-contrast-checker" className="text-[var(--accent)] hover:underline">
          color contrast checker
        </Link>
        .
      </p>
    </div>
  );
}
