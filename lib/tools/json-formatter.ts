/**
 * JSON formatting / validation - pure, framework-free, unit-testable.
 * Runs in the browser (and Node) with no external dependencies.
 */

export interface JsonError {
  message: string;
  /** Zero-based character offset of the error, when known. */
  position?: number;
  /** One-based line number, when known. */
  line?: number;
  /** One-based column number, when known. */
  column?: number;
}

export type JsonResult =
  | { ok: true; output: string }
  | { ok: false; error: JsonError };

/** Convert a character offset into 1-based line/column for error display. */
export function locate(input: string, position: number): { line: number; column: number } {
  let line = 1;
  let column = 1;
  const max = Math.min(position, input.length);
  for (let i = 0; i < max; i++) {
    if (input[i] === "\n") {
      line++;
      column = 1;
    } else {
      column++;
    }
  }
  return { line, column };
}

/** Normalize a thrown JSON.parse error into a structured JsonError. */
function toJsonError(err: unknown, input: string): JsonError {
  const raw = err instanceof Error ? err.message : String(err);
  // V8/modern engines include "... at position N (line L column C)".
  const posMatch = raw.match(/position (\d+)/);
  if (posMatch) {
    const position = Number(posMatch[1]);
    const { line, column } = locate(input, position);
    return { message: raw, position, line, column };
  }
  const lineMatch = raw.match(/line (\d+) column (\d+)/i);
  if (lineMatch) {
    return { message: raw, line: Number(lineMatch[1]), column: Number(lineMatch[2]) };
  }
  return { message: raw };
}

function parse(input: string): { ok: true; value: unknown } | { ok: false; error: JsonError } {
  if (!input.trim()) {
    return { ok: false, error: { message: "Nothing to parse - the input is empty." } };
  }
  try {
    return { ok: true, value: JSON.parse(input) };
  } catch (err) {
    return { ok: false, error: toJsonError(err, input) };
  }
}

/** Pretty-print JSON with the given indent (spaces). */
export function formatJson(input: string, indent = 2): JsonResult {
  const result = parse(input);
  if (!result.ok) return result;
  return { ok: true, output: JSON.stringify(result.value, null, indent) };
}

/** Collapse JSON to a single line. */
export function minifyJson(input: string): JsonResult {
  const result = parse(input);
  if (!result.ok) return result;
  return { ok: true, output: JSON.stringify(result.value) };
}

/** Validate only; returns the structured error (or null when valid). */
export function validateJson(input: string): JsonError | null {
  const result = parse(input);
  return result.ok ? null : result.error;
}
