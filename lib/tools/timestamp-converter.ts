export interface TimestampResult {
  epochSeconds: number;
  epochMs: number;
  utc: string;
  local: string;
  iso: string;
  relative: string;
}

function relativeTime(ms: number): string {
  const diff = Date.now() - ms;
  const abs = Math.abs(diff);
  const future = diff < 0;
  const s = Math.floor(abs / 1000);
  if (s < 60) return future ? `in ${s}s` : `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return future ? `in ${m}m` : `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return future ? `in ${h}h` : `${h}h ago`;
  const d = Math.floor(h / 24);
  return future ? `in ${d}d` : `${d}d ago`;
}

/** Convert a Unix epoch (seconds or ms) or ISO string to a structured result. */
export function fromEpoch(input: string): TimestampResult | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  let ms: number;

  // ISO or date string
  if (/[T\-/:]/.test(trimmed)) {
    const d = new Date(trimmed);
    if (isNaN(d.getTime())) return null;
    ms = d.getTime();
  } else {
    const n = Number(trimmed);
    if (isNaN(n)) return null;
    // Heuristic: >9999999999 is milliseconds
    ms = n > 9_999_999_999 ? n : n * 1000;
  }

  const d = new Date(ms);
  if (isNaN(d.getTime())) return null;

  return {
    epochSeconds: Math.floor(ms / 1000),
    epochMs: ms,
    utc: d.toUTCString(),
    local: d.toLocaleString(),
    iso: d.toISOString(),
    relative: relativeTime(ms),
  };
}

/** Convert a human date/time string to a TimestampResult. */
export function fromHuman(input: string): TimestampResult | null {
  return fromEpoch(input);
}
