"use client";

import { useMemo, useRef, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { buildBoxShadow, buildBoxShadowCss, type ShadowLayer } from "@/lib/tools/box-shadow";
import { parseHex } from "@/lib/tools/contrast";

/** Widget-level layer: stores hex + alpha, mapped to an rgba() color for the lib. */
interface EditableLayer {
  id: string;
  x: number;
  y: number;
  blur: number;
  spread: number;
  hex: string;
  alpha: number;
  inset: boolean;
}

function toRgba(hex: string, alpha: number): string {
  const rgb = parseHex(hex);
  if (!rgb) return hex;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

const makeLayer = (id: string): EditableLayer => ({
  id,
  x: 0,
  y: 8,
  blur: 24,
  spread: -4,
  hex: "#06c8e8",
  alpha: 0.45,
  inset: false,
});

const toShadowLayer = (l: EditableLayer): ShadowLayer => ({
  id: l.id,
  x: l.x,
  y: l.y,
  blur: l.blur,
  spread: l.spread,
  color: toRgba(l.hex, l.alpha),
  inset: l.inset,
});

const sliders: { key: keyof EditableLayer; label: string; min: number; max: number }[] = [
  { key: "x", label: "Offset X", min: -50, max: 50 },
  { key: "y", label: "Offset Y", min: -50, max: 50 },
  { key: "blur", label: "Blur", min: 0, max: 100 },
  { key: "spread", label: "Spread", min: -50, max: 50 },
];

export function BoxShadowGenerator() {
  const [layers, setLayers] = useState<EditableLayer[]>([makeLayer("l1")]);
  const nextId = useRef(2);

  const shadowLayers = useMemo(() => layers.map(toShadowLayer), [layers]);
  const value = useMemo(() => buildBoxShadow(shadowLayers), [shadowLayers]);
  const css = useMemo(() => buildBoxShadowCss(shadowLayers), [shadowLayers]);

  function update(id: string, patch: Partial<EditableLayer>) {
    setLayers((ls) => ls.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }
  function addLayer() {
    setLayers((ls) => [...ls, makeLayer(`l${nextId.current++}`)]);
  }
  function removeLayer(id: string) {
    setLayers((ls) => (ls.length <= 1 ? ls : ls.filter((l) => l.id !== id)));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-primary">Shadow layers</span>
          <button
            type="button"
            onClick={addLayer}
            className="rounded-full border border-[var(--glass-border)] px-3 py-1 text-sm text-secondary transition-colors hover:text-primary hover:border-[var(--accent)]"
          >
            + Add layer
          </button>
        </div>

        {layers.map((layer, i) => (
          <fieldset key={layer.id} className="space-y-3 rounded-xl border border-[var(--glass-border)] p-4">
            <legend className="flex w-full items-center justify-between px-1">
              <span className="text-sm font-semibold text-primary">Layer {i + 1}</span>
            </legend>

            {sliders.map((s) => (
              <div key={s.key}>
                <label htmlFor={`${layer.id}-${s.key}`} className="text-xs text-secondary">
                  {s.label}: {layer[s.key] as number}px
                </label>
                <input
                  id={`${layer.id}-${s.key}`}
                  type="range"
                  min={s.min}
                  max={s.max}
                  value={layer[s.key] as number}
                  onChange={(e) => update(layer.id, { [s.key]: Number(e.target.value) })}
                  className="w-full accent-[var(--accent)]"
                />
              </div>
            ))}

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <label htmlFor={`${layer.id}-color`} className="text-xs text-secondary">
                  Color
                </label>
                <input
                  id={`${layer.id}-color`}
                  type="color"
                  value={layer.hex}
                  onChange={(e) => update(layer.id, { hex: e.target.value })}
                  className="h-9 w-12 cursor-pointer rounded border border-[var(--glass-border)] bg-transparent"
                />
              </div>
              <div className="flex-1">
                <label htmlFor={`${layer.id}-alpha`} className="text-xs text-secondary">
                  Opacity: {layer.alpha.toFixed(2)}
                </label>
                <input
                  id={`${layer.id}-alpha`}
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={layer.alpha}
                  onChange={(e) => update(layer.id, { alpha: Number(e.target.value) })}
                  className="w-full accent-[var(--accent)]"
                />
              </div>
              <label className="flex items-center gap-2 text-xs text-secondary">
                <input
                  type="checkbox"
                  checked={layer.inset}
                  onChange={(e) => update(layer.id, { inset: e.target.checked })}
                  className="accent-[var(--accent)]"
                />
                Inset
              </label>
              <button
                type="button"
                onClick={() => removeLayer(layer.id)}
                disabled={layers.length <= 1}
                aria-label={`Remove layer ${i + 1}`}
                className="rounded-lg border border-[var(--glass-border)] px-2 py-1 text-sm text-secondary transition-colors hover:text-primary disabled:opacity-40"
              >
                ✕
              </button>
            </div>
          </fieldset>
        ))}
      </div>

      <div className="space-y-4">
        <div className="grid h-56 w-full place-items-center rounded-2xl border border-[var(--glass-border)] [background:var(--bg-elevated)]">
          <div
            className="h-28 w-40 rounded-2xl [background:var(--bg-page)]"
            style={{ boxShadow: value }}
            role="img"
            aria-label="Live box-shadow preview on a sample element"
          />
        </div>
        <div className="flex items-center justify-between gap-3">
          <span id="shadow-css-label" className="text-sm font-medium text-primary">
            CSS
          </span>
          <CopyButton value={css} label="Copy CSS" />
        </div>
        <textarea
          readOnly
          aria-labelledby="shadow-css-label"
          value={css}
          spellCheck={false}
          className="h-24 w-full resize-y rounded-xl border border-[var(--glass-border)] [background:var(--bg-page)] p-3 font-mono text-sm text-primary focus:border-[var(--accent)] focus:outline-none"
        />
      </div>
    </div>
  );
}
