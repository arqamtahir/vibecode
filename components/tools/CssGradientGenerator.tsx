"use client";

import { useMemo, useRef, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import {
  buildGradient,
  buildGradientCss,
  defaultGradient,
  type ColorStop,
  type GradientState,
} from "@/lib/tools/css-gradient";

export function CssGradientGenerator() {
  const [state, setState] = useState<GradientState>(defaultGradient);
  const nextId = useRef(2);

  const value = useMemo(() => buildGradient(state), [state]);
  const css = useMemo(() => buildGradientCss(state), [state]);

  function updateStop(id: string, patch: Partial<ColorStop>) {
    setState((s) => ({
      ...s,
      stops: s.stops.map((stop) => (stop.id === id ? { ...stop, ...patch } : stop)),
    }));
  }

  function addStop() {
    const id = `s${nextId.current++}`;
    setState((s) => ({
      ...s,
      stops: [...s.stops, { id, color: "#7c3aed", position: 50 }],
    }));
  }

  function removeStop(id: string) {
    setState((s) =>
      s.stops.length <= 2 ? s : { ...s, stops: s.stops.filter((stop) => stop.id !== id) },
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <fieldset>
          <legend className="text-sm font-medium text-primary">Gradient type</legend>
          <div className="mt-2 inline-flex rounded-full border border-[var(--border-hairline)] p-1">
            {(["linear", "radial"] as const).map((t) => (
              <label
                key={t}
                className={`cursor-pointer rounded-full px-4 py-1.5 text-sm capitalize transition-colors ${
                  state.type === t ? "[background:var(--accent)] text-[var(--accent-contrast)]" : "text-secondary"
                }`}
              >
                <input
                  type="radio"
                  name="gradient-type"
                  value={t}
                  checked={state.type === t}
                  onChange={() => setState((s) => ({ ...s, type: t }))}
                  className="sr-only"
                />
                {t}
              </label>
            ))}
          </div>
        </fieldset>

        {state.type === "linear" ? (
          <div>
            <label htmlFor="gradient-angle" className="text-sm font-medium text-primary">
              Angle: {state.angle}°
            </label>
            <input
              id="gradient-angle"
              type="range"
              min={0}
              max={360}
              value={state.angle}
              onChange={(e) => setState((s) => ({ ...s, angle: Number(e.target.value) }))}
              className="mt-1 w-full accent-[var(--accent)]"
            />
          </div>
        ) : null}

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-primary">Color stops</span>
            <button
              type="button"
              onClick={addStop}
              className="rounded-full border border-[var(--border-hairline)] px-3 py-1 text-sm text-secondary transition-colors hover:text-primary hover:border-[var(--accent)]"
            >
              + Add stop
            </button>
          </div>

          {state.stops.map((stop, i) => (
            <fieldset
              key={stop.id}
              className="flex flex-wrap items-center gap-3 rounded-xl border border-[var(--border-hairline)] p-3"
            >
              <legend className="sr-only">Color stop {i + 1}</legend>
              <label htmlFor={`color-${stop.id}`} className="sr-only">
                Stop {i + 1} color
              </label>
              <input
                id={`color-${stop.id}`}
                type="color"
                value={stop.color}
                onChange={(e) => updateStop(stop.id, { color: e.target.value })}
                className="h-9 w-12 cursor-pointer rounded border border-[var(--border-hairline)] bg-transparent"
              />
              <div className="flex-1">
                <label htmlFor={`pos-${stop.id}`} className="text-xs text-secondary">
                  Position: {Math.round(stop.position)}%
                </label>
                <input
                  id={`pos-${stop.id}`}
                  type="range"
                  min={0}
                  max={100}
                  value={stop.position}
                  onChange={(e) => updateStop(stop.id, { position: Number(e.target.value) })}
                  className="w-full accent-[var(--accent)]"
                />
              </div>
              <button
                type="button"
                onClick={() => removeStop(stop.id)}
                disabled={state.stops.length <= 2}
                aria-label={`Remove color stop ${i + 1}`}
                className="rounded-lg border border-[var(--border-hairline)] px-2 py-1 text-sm text-secondary transition-colors hover:text-primary disabled:opacity-40"
              >
                ✕
              </button>
            </fieldset>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div
          className="h-56 w-full rounded-2xl border border-[var(--border-hairline)]"
          style={{ background: value }}
          role="img"
          aria-label="Live gradient preview"
        />
        <div className="flex items-center justify-between gap-3">
          <span id="gradient-css-label" className="text-sm font-medium text-primary">
            CSS
          </span>
          <CopyButton value={css} label="Copy CSS" />
        </div>
        <textarea
          readOnly
          aria-labelledby="gradient-css-label"
          value={css}
          spellCheck={false}
          className="h-24 w-full resize-y rounded-xl border border-[var(--border-hairline)] [background:var(--bg-elevated)] p-3 font-mono text-sm text-primary focus:border-[var(--accent)] focus:outline-none"
        />
      </div>
    </div>
  );
}
