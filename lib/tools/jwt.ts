/**
 * JWT decoding - pure, framework-free, unit-testable. Decodes header and payload
 * only. Signatures are NEVER verified (that requires the secret/public key and a
 * server). Browser/Node base64url decoding via atob + TextDecoder.
 */

export type JwtStatus = "valid" | "expired" | "not-yet-valid" | "no-expiry";

export interface DecodedJwt {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
  /** Standard time claims (seconds since epoch) when present. */
  exp?: number;
  iat?: number;
  nbf?: number;
  status: JwtStatus;
}

export type JwtResult = { ok: true; value: DecodedJwt } | { ok: false; error: string };

function base64UrlDecode(segment: string): string {
  let b64 = segment.replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64.length % 4;
  if (pad === 2) b64 += "==";
  else if (pad === 3) b64 += "=";
  else if (pad === 1) throw new Error("Invalid base64url length.");

  const binary = atob(b64);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder("utf-8", { fatal: false }).decode(bytes);
}

function parseJson(segment: string, label: string): Record<string, unknown> {
  let json: string;
  try {
    json = base64UrlDecode(segment);
  } catch {
    throw new Error(`The ${label} is not valid base64url.`);
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error(`The ${label} is not valid JSON.`);
  }
  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(`The ${label} is not a JSON object.`);
  }
  return parsed as Record<string, unknown>;
}

function numericClaim(obj: Record<string, unknown>, key: string): number | undefined {
  const v = obj[key];
  return typeof v === "number" && Number.isFinite(v) ? v : undefined;
}

export function decodeJwt(token: string, nowMs = Date.now()): JwtResult {
  const trimmed = token.trim();
  if (!trimmed) return { ok: false, error: "Paste a JWT to decode." };

  const parts = trimmed.split(".");
  if (parts.length !== 3) {
    return {
      ok: false,
      error: "A JWT must have three dot-separated parts: header.payload.signature.",
    };
  }

  try {
    const header = parseJson(parts[0], "header");
    const payload = parseJson(parts[1], "payload");
    const exp = numericClaim(payload, "exp");
    const iat = numericClaim(payload, "iat");
    const nbf = numericClaim(payload, "nbf");

    let status: JwtStatus = "no-expiry";
    if (typeof exp === "number") {
      status = exp * 1000 < nowMs ? "expired" : "valid";
    }
    if (status !== "expired" && typeof nbf === "number" && nbf * 1000 > nowMs) {
      status = "not-yet-valid";
    }

    return {
      ok: true,
      value: { header, payload, signature: parts[2], exp, iat, nbf, status },
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
