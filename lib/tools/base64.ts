/**
 * Base64 encoding / decoding - pure, framework-free, unit-testable.
 * UTF-8 safe (handles emoji and non-Latin text) via TextEncoder/TextDecoder.
 */

export type Base64Result = { ok: true; output: string } | { ok: false; error: string };

/** Encode raw bytes to a standard base64 string. */
export function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunk = 0x8000; // avoid call-stack limits on large inputs
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

/** Decode a base64 string to raw bytes. Throws on invalid input. */
export function base64ToBytes(b64: string): Uint8Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/** UTF-8 text → base64. */
export function encodeBase64(text: string): string {
  return bytesToBase64(new TextEncoder().encode(text));
}

/** Loose validity check for a base64 string (ignoring surrounding whitespace). */
export function isValidBase64(input: string): boolean {
  const clean = input.replace(/\s+/g, "");
  if (clean.length === 0 || clean.length % 4 !== 0) return false;
  return /^[A-Za-z0-9+/]*={0,2}$/.test(clean);
}

/** base64 → UTF-8 text, with graceful error handling. */
export function decodeBase64(input: string): Base64Result {
  const clean = input.replace(/\s+/g, "");
  if (!clean) return { ok: false, error: "Nothing to decode - the input is empty." };
  if (!isValidBase64(clean)) {
    return {
      ok: false,
      error: "This isn't valid base64 (allowed: A–Z, a–z, 0–9, +, / and = padding).",
    };
  }
  try {
    const text = new TextDecoder("utf-8", { fatal: false }).decode(base64ToBytes(clean));
    return { ok: true, output: text };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to decode." };
  }
}
