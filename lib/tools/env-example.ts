/**
 * .env → .env.example sanitizer - pure, framework-free, unit-testable.
 * Keeps keys, comments, blank lines, and order; blanks every value. Flags
 * keys whose names suggest they hold secrets.
 */

export interface EnvResult {
  output: string;
  /** Key names that look like they hold secrets (for a "don't commit" warning). */
  secretKeys: string[];
}

const KEY_RE = /^(\s*)(export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=(.*)$/;
const SECRET_RE =
  /(secret|token|password|passwd|pwd|private|credential|api[_-]?key|access[_-]?key|auth|client[_-]?secret)/i;

/** A blank line, a comment, or a non-assignment line is preserved verbatim. */
function isPreserved(line: string): boolean {
  const t = line.trim();
  return t === "" || t.startsWith("#");
}

export function sanitizeEnv(input: string): EnvResult {
  const lines = input.replace(/\r\n/g, "\n").split("\n");
  const secretKeys: string[] = [];

  const output = lines
    .map((line) => {
      if (isPreserved(line)) return line;
      const m = line.match(KEY_RE);
      if (!m) return line; // not an assignment - keep as-is
      const [, indent, exportKw = "", key] = m;
      if (SECRET_RE.test(key)) secretKeys.push(key);
      return `${indent}${exportKw}${key}=`;
    })
    .join("\n");

  return { output, secretKeys: [...new Set(secretKeys)] };
}
