/**
 * CSS box-shadow building - pure, framework-free, unit-testable.
 * Supports multiple stacked shadow layers.
 */

export interface ShadowLayer {
  id: string;
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  inset: boolean;
}

export const defaultShadowLayer = (id: string): ShadowLayer => ({
  id,
  x: 0,
  y: 8,
  blur: 24,
  spread: -4,
  color: "rgba(6, 200, 232, 0.45)",
  inset: false,
});

/** One layer → its CSS fragment, e.g. `inset 0px 8px 24px -4px rgba(...)`. */
export function buildShadowLayer(layer: ShadowLayer): string {
  const parts = [
    layer.inset ? "inset" : null,
    `${layer.x}px`,
    `${layer.y}px`,
    `${layer.blur}px`,
    `${layer.spread}px`,
    layer.color,
  ].filter(Boolean);
  return parts.join(" ");
}

/** Comma-joined value for all layers (no `box-shadow:` prefix). */
export function buildBoxShadow(layers: ShadowLayer[]): string {
  if (layers.length === 0) return "none";
  return layers.map(buildShadowLayer).join(", ");
}

/** Full copy-ready declaration. */
export function buildBoxShadowCss(layers: ShadowLayer[]): string {
  return `box-shadow: ${buildBoxShadow(layers)};`;
}
