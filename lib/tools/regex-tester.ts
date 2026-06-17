/**
 * Regex matching + plain-English explanation - pure, framework-free, unit-testable.
 *
 * Matching is bounded (capped test-string length + max match count + zero-length
 * guard) so it terminates; the widget additionally runs it inside a Web Worker
 * with a timeout so a catastrophic-backtracking pattern can never hang the tab.
 */

export const MAX_TEST_LENGTH = 20_000;
export const MAX_MATCHES = 5_000;

export interface MatchInfo {
  match: string;
  index: number;
  groups: (string | undefined)[];
  namedGroups: Record<string, string>;
}

export type MatchResult =
  | { ok: true; matches: MatchInfo[]; truncated: boolean }
  | { ok: false; error: string };

/** Compile + run a regex against text, with hard caps. Never throws. */
export function findMatches(pattern: string, flags: string, text: string): MatchResult {
  if (text.length > MAX_TEST_LENGTH) {
    return {
      ok: false,
      error: `Test string is too long (max ${MAX_TEST_LENGTH.toLocaleString()} characters).`,
    };
  }

  let re: RegExp;
  try {
    const withGlobal = flags.includes("g") ? flags : `${flags}g`;
    re = new RegExp(pattern, withGlobal);
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Invalid regular expression." };
  }

  const matches: MatchInfo[] = [];
  let truncated = false;
  let m: RegExpExecArray | null;

  while ((m = re.exec(text)) !== null) {
    matches.push({
      match: m[0],
      index: m.index,
      groups: m.slice(1),
      namedGroups: m.groups ? { ...m.groups } : {},
    });
    // Avoid an infinite loop on zero-length matches.
    if (m.index === re.lastIndex) re.lastIndex++;
    if (matches.length >= MAX_MATCHES) {
      truncated = true;
      break;
    }
  }

  return { ok: true, matches, truncated };
}

export interface ExplainToken {
  token: string;
  description: string;
}

const ESCAPE_DESCRIPTIONS: Record<string, string> = {
  d: "any digit (0–9)",
  D: "any non-digit",
  w: "any word character (letter, digit, or underscore)",
  W: "any non-word character",
  s: "any whitespace",
  S: "any non-whitespace",
  b: "a word boundary",
  B: "a non-word boundary",
  n: "a newline",
  t: "a tab",
  r: "a carriage return",
};

const QUANTIFIER_DESCRIPTIONS: Record<string, string> = {
  "*": "zero or more times",
  "+": "one or more times",
  "?": "zero or one time (optional)",
};

/**
 * Token-by-token, plain-English explanation of a pattern. Pragmatic scanner that
 * covers the common constructs; always returns something (never throws).
 */
export function explainRegex(pattern: string): ExplainToken[] {
  const tokens: ExplainToken[] = [];
  if (!pattern) return tokens;

  let literal = "";
  const flushLiteral = () => {
    if (literal) {
      tokens.push({
        token: literal,
        description: `the literal text “${literal}”`,
      });
      literal = "";
    }
  };

  try {
    let i = 0;
    while (i < pattern.length) {
      const c = pattern[i];

      if (c === "\\") {
        const next = pattern[i + 1] ?? "";
        flushLiteral();
        tokens.push({
          token: `\\${next}`,
          description: ESCAPE_DESCRIPTIONS[next] ?? `the literal character “${next}”`,
        });
        i += 2;
        continue;
      }

      if (c === "[") {
        flushLiteral();
        const end = pattern.indexOf("]", i + 1);
        const body = end === -1 ? pattern.slice(i + 1) : pattern.slice(i + 1, end);
        const negated = body.startsWith("^");
        tokens.push({
          token: pattern.slice(i, end === -1 ? undefined : end + 1),
          description: `${negated ? "any character NOT" : "any character"} in the set “${negated ? body.slice(1) : body}”`,
        });
        i = end === -1 ? pattern.length : end + 1;
        continue;
      }

      if (c === "(") {
        flushLiteral();
        if (pattern.startsWith("(?:", i)) {
          tokens.push({ token: "(?:", description: "start of a non-capturing group" });
          i += 3;
        } else if (pattern.startsWith("(?<", i) && !pattern.startsWith("(?<=", i) && !pattern.startsWith("(?<!", i)) {
          const end = pattern.indexOf(">", i);
          const name = end === -1 ? "" : pattern.slice(i + 3, end);
          tokens.push({ token: pattern.slice(i, end + 1), description: `start of a named capture group “${name}”` });
          i = end === -1 ? pattern.length : end + 1;
        } else if (pattern.startsWith("(?=", i)) {
          tokens.push({ token: "(?=", description: "start of a positive lookahead" });
          i += 3;
        } else if (pattern.startsWith("(?!", i)) {
          tokens.push({ token: "(?!", description: "start of a negative lookahead" });
          i += 3;
        } else if (pattern.startsWith("(?<=", i)) {
          tokens.push({ token: "(?<=", description: "start of a positive lookbehind" });
          i += 4;
        } else if (pattern.startsWith("(?<!", i)) {
          tokens.push({ token: "(?<!", description: "start of a negative lookbehind" });
          i += 4;
        } else {
          tokens.push({ token: "(", description: "start of a capture group" });
          i += 1;
        }
        continue;
      }

      if (c === ")") {
        flushLiteral();
        tokens.push({ token: ")", description: "end of the group" });
        i += 1;
        continue;
      }

      if (c === "{") {
        const end = pattern.indexOf("}", i);
        if (end !== -1) {
          const body = pattern.slice(i + 1, end);
          flushLiteral();
          const parts = body.split(",");
          let desc: string;
          if (parts.length === 1) desc = `exactly ${parts[0]} times`;
          else if (parts[1] === "") desc = `${parts[0]} or more times`;
          else desc = `between ${parts[0]} and ${parts[1]} times`;
          tokens.push({ token: pattern.slice(i, end + 1), description: desc });
          i = end + 1;
          continue;
        }
      }

      if (c === "*" || c === "+" || c === "?") {
        flushLiteral();
        const lazy = pattern[i + 1] === "?";
        tokens.push({
          token: lazy ? `${c}?` : c,
          description: `${QUANTIFIER_DESCRIPTIONS[c]}${lazy ? " (lazy - as few as possible)" : ""}`,
        });
        i += lazy ? 2 : 1;
        continue;
      }

      if (c === "^") {
        flushLiteral();
        tokens.push({ token: "^", description: "the start of the string (or line)" });
        i += 1;
        continue;
      }
      if (c === "$") {
        flushLiteral();
        tokens.push({ token: "$", description: "the end of the string (or line)" });
        i += 1;
        continue;
      }
      if (c === ".") {
        flushLiteral();
        tokens.push({ token: ".", description: "any character (except newline)" });
        i += 1;
        continue;
      }
      if (c === "|") {
        flushLiteral();
        tokens.push({ token: "|", description: "OR - match either side" });
        i += 1;
        continue;
      }

      literal += c;
      i += 1;
    }
    flushLiteral();
  } catch {
    return [{ token: pattern, description: "this pattern (could not break it down further)" }];
  }

  return tokens;
}
