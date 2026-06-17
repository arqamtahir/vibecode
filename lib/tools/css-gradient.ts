/**
 * CSS gradient building - pure, framework-free, unit-testable.
 */

export type GradientType = "linear" | "radial";

export interface ColorStop {
  id: string;
  /** CSS color string (hex, rgb, etc.). */
  color: string;
  /** Position along the gradient, 0–100 (%). */
  position: number;
}

export interface GradientState {
  type: GradientType;
  /** Angle in degrees (linear only). */
  angle: number;
  stops: ColorStop[];
}

export const defaultGradient = (): GradientState => ({
  type: "linear",
  angle: 135,
  stops: [
    { id: "a", color: "#06c8e8", position: 0 },
    { id: "b", color: "#2563eb", position: 100 },
  ],
});

/** The `linear-gradient(...)`/`radial-gradient(...)` value (no `background:` prefix). */
export function buildGradient(state: GradientState): string {
  const stops = [...state.stops]
    .sort((a, b) => a.position - b.position)
    .map((s) => `${s.color} ${Math.round(s.position)}%`)
    .join(", ");

  if (state.type === "radial") {
    return `radial-gradient(circle, ${stops})`;
  }
  return `linear-gradient(${Math.round(state.angle)}deg, ${stops})`;
}

/** Full copy-ready declaration. */
export function buildGradientCss(state: GradientState): string {
  return `background: ${buildGradient(state)};`;
}
