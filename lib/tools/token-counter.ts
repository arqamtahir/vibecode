/**
 * Token counting helpers + cost estimation - pure, framework-free, unit-testable.
 *
 * The actual tokenizer (gpt-tokenizer) is dynamic-imported in the widget so it
 * stays out of the shared bundle. This module owns the cheap counts, the
 * editable pricing presets, and the cost math.
 */

export interface PricingPreset {
  id: string;
  model: string;
  /** USD per 1,000,000 input tokens. */
  inputPer1M: number;
  /** USD per 1,000,000 output tokens. */
  outputPer1M: number;
}

/**
 * Editable starting presets. These are plain data the user can change - Vibecode
 * makes no live pricing calls, and prices drift, so treat them as a starting point.
 */
export const DEFAULT_PRESETS: PricingPreset[] = [
  { id: "gpt-4o", model: "GPT-4o", inputPer1M: 2.5, outputPer1M: 10 },
  { id: "gpt-4o-mini", model: "GPT-4o mini", inputPer1M: 0.15, outputPer1M: 0.6 },
  { id: "gpt-3.5", model: "GPT-3.5 Turbo", inputPer1M: 0.5, outputPer1M: 1.5 },
  { id: "claude-sonnet", model: "Claude Sonnet", inputPer1M: 3, outputPer1M: 15 },
  { id: "claude-haiku", model: "Claude Haiku", inputPer1M: 0.8, outputPer1M: 4 },
];

export function countCharacters(text: string): number {
  // Count Unicode code points, not UTF-16 units (so emoji count as one).
  return [...text].length;
}

export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

/** Cost in USD for a token count at a given per-1M price. */
export function estimateCost(tokens: number, pricePer1M: number): number {
  return (tokens / 1_000_000) * pricePer1M;
}

export function formatUsd(amount: number): string {
  if (amount === 0) return "$0.00";
  if (amount < 0.01) return `$${amount.toFixed(6)}`;
  return `$${amount.toFixed(4)}`;
}
