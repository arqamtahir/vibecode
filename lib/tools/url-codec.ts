/** URL encoding/decoding helpers with query-string breakdown. */

export type UrlCodecMode = "component" | "full";

export interface UrlCodecResult {
  ok: boolean;
  output: string;
  error?: string;
}

/**
 * `component` encodes every reserved character (for values inside a URL);
 * `full` keeps URL structure (/, ?, &, =, :) intact.
 */
export function encodeUrl(input: string, mode: UrlCodecMode): UrlCodecResult {
  try {
    const output = mode === "component" ? encodeURIComponent(input) : encodeURI(input);
    return { ok: true, output };
  } catch {
    return { ok: false, output: "", error: "Input contains an unpaired surrogate and cannot be encoded." };
  }
}

export function decodeUrl(input: string, mode: UrlCodecMode): UrlCodecResult {
  try {
    const normalised = input.replace(/\+/g, "%20");
    const output = mode === "component" ? decodeURIComponent(normalised) : decodeURI(normalised);
    return { ok: true, output };
  } catch {
    return { ok: false, output: "", error: "Malformed percent-encoding - check for stray % characters." };
  }
}

export interface QueryParam {
  key: string;
  value: string;
}

/** Break a full URL's query string into decoded key/value pairs. */
export function queryParams(input: string): QueryParam[] {
  try {
    const url = new URL(input.trim());
    return [...url.searchParams.entries()].map(([key, value]) => ({ key, value }));
  } catch {
    return [];
  }
}
