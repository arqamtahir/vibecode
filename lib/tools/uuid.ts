/**
 * UUID v4 generation - pure, framework-free, unit-testable. Uses the platform
 * crypto API for cryptographically-strong randomness.
 */

/** Hard cap on bulk generation to keep the UI responsive and accessible. */
export const MAX_UUIDS = 500;

/** Generate a single RFC 4122 version-4 UUID. */
export function generateUuidV4(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // Fallback for environments without randomUUID but with getRandomValues.
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant 10xx
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0"));
  return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex
    .slice(6, 8)
    .join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10, 16).join("")}`;
}

/** Clamp an arbitrary (possibly invalid) count into the supported range. */
export function clampCount(count: number): number {
  if (!Number.isFinite(count)) return 1;
  return Math.min(MAX_UUIDS, Math.max(1, Math.floor(count)));
}

/** Generate `count` UUIDs (clamped to [1, MAX_UUIDS]). */
export function generateUuids(count: number): string[] {
  const n = clampCount(count);
  return Array.from({ length: n }, generateUuidV4);
}
