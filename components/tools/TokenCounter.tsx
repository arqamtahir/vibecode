"use client";

import { useEffect, useMemo, useState } from "react";
import {
  countCharacters,
  countWords,
  DEFAULT_PRESETS,
  estimateCost,
  formatUsd,
  type PricingPreset,
} from "@/lib/tools/token-counter";

export function TokenCounter() {
  const [text, setText] = useState("");
  const [presets, setPresets] = useState<PricingPreset[]>(DEFAULT_PRESETS);
  const [activeId, setActiveId] = useState(DEFAULT_PRESETS[0].id);

  // The tokenizer is heavy, so it's loaded lazily and kept out of the shared bundle.
  // Held in state (not a ref) so reading it during render is safe and reactive.
  const [counter, setCounter] = useState<((text: string) => number) | null>(null);

  useEffect(() => {
    let active = true;
    import("gpt-tokenizer")
      .then((mod) => {
        if (!active) return;
        const fn = mod.countTokens ?? ((t: string) => mod.encode(t).length);
        setCounter(() => fn); // store the function (async, post-import)
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const chars = useMemo(() => countCharacters(text), [text]);
  const words = useMemo(() => countWords(text), [text]);
  const tokens = useMemo(() => (counter ? counter(text) : null), [text, counter]);

  const activePreset = presets.find((p) => p.id === activeId) ?? presets[0];

  function updatePreset(id: string, patch: Partial<PricingPreset>) {
    setPresets((ps) => ps.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="token-input" className="text-sm font-medium text-primary">
          Text
        </label>
        <textarea
          id="token-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste a prompt or any text to count its tokens…"
          className="mt-2 h-48 w-full resize-y rounded-xl border border-[var(--border-hairline)] [background:var(--bg-elevated)] p-3 font-mono text-sm text-primary placeholder:text-muted focus:border-[var(--accent)] focus:outline-none"
        />
      </div>

      <dl className="grid grid-cols-3 gap-3" aria-live="polite">
        <div className="panel p-4">
          <dt className="text-xs text-secondary">Tokens</dt>
          <dd className="mt-1 text-2xl font-bold text-primary">
            {tokens === null ? "…" : tokens.toLocaleString()}
          </dd>
        </div>
        <div className="panel p-4">
          <dt className="text-xs text-secondary">Characters</dt>
          <dd className="mt-1 text-2xl font-bold text-primary">{chars.toLocaleString()}</dd>
        </div>
        <div className="panel p-4">
          <dt className="text-xs text-secondary">Words</dt>
          <dd className="mt-1 text-2xl font-bold text-primary">{words.toLocaleString()}</dd>
        </div>
      </dl>

      <div>
        <h2 className="text-sm font-medium text-primary">Estimated cost</h2>
        <p className="mt-1 text-xs text-muted">
          Prices are editable presets in USD per 1M tokens - Vibecode makes no live pricing
          calls. Token counts are an approximation; real tokenization varies by model and
          provider.
        </p>

        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[34rem] border-collapse text-sm">
            <caption className="sr-only">Editable model pricing presets and estimated input cost</caption>
            <thead>
              <tr className="text-left text-xs text-secondary">
                <th scope="col" className="p-2">Use</th>
                <th scope="col" className="p-2">Model</th>
                <th scope="col" className="p-2">Input $/1M</th>
                <th scope="col" className="p-2">Output $/1M</th>
                <th scope="col" className="p-2">Est. input cost</th>
              </tr>
            </thead>
            <tbody>
              {presets.map((p) => (
                <tr key={p.id} className="border-t border-[var(--border-hairline)]">
                  <td className="p-2">
                    <input
                      type="radio"
                      name="active-preset"
                      checked={activeId === p.id}
                      onChange={() => setActiveId(p.id)}
                      aria-label={`Use ${p.model} for the cost estimate`}
                      className="accent-[var(--accent)]"
                    />
                  </td>
                  <td className="p-2">
                    <label className="sr-only" htmlFor={`model-${p.id}`}>Model name</label>
                    <input
                      id={`model-${p.id}`}
                      value={p.model}
                      onChange={(e) => updatePreset(p.id, { model: e.target.value })}
                      className="w-32 rounded-lg border border-[var(--border-hairline)] [background:var(--bg-elevated)] px-2 py-1 text-primary focus:border-[var(--accent)] focus:outline-none"
                    />
                  </td>
                  <td className="p-2">
                    <label className="sr-only" htmlFor={`in-${p.id}`}>{p.model} input price per million</label>
                    <input
                      id={`in-${p.id}`}
                      type="number"
                      min={0}
                      step={0.01}
                      value={p.inputPer1M}
                      onChange={(e) => updatePreset(p.id, { inputPer1M: Number(e.target.value) })}
                      className="w-24 rounded-lg border border-[var(--border-hairline)] [background:var(--bg-elevated)] px-2 py-1 text-primary focus:border-[var(--accent)] focus:outline-none"
                    />
                  </td>
                  <td className="p-2">
                    <label className="sr-only" htmlFor={`out-${p.id}`}>{p.model} output price per million</label>
                    <input
                      id={`out-${p.id}`}
                      type="number"
                      min={0}
                      step={0.01}
                      value={p.outputPer1M}
                      onChange={(e) => updatePreset(p.id, { outputPer1M: Number(e.target.value) })}
                      className="w-24 rounded-lg border border-[var(--border-hairline)] [background:var(--bg-elevated)] px-2 py-1 text-primary focus:border-[var(--accent)] focus:outline-none"
                    />
                  </td>
                  <td className="p-2 font-mono text-primary">
                    {tokens === null ? "…" : formatUsd(estimateCost(tokens, p.inputPer1M))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-sm text-secondary" aria-live="polite">
          {tokens === null
            ? "Loading tokenizer…"
            : `At ${activePreset.model} input pricing, ${tokens.toLocaleString()} tokens ≈ ${formatUsd(
                estimateCost(tokens, activePreset.inputPer1M),
              )}.`}
        </p>
      </div>
    </div>
  );
}
