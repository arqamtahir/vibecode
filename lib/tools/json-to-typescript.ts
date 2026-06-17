/**
 * JSON → TypeScript interface generator - pure, framework-free, unit-testable.
 *
 * Handles nested objects, arrays (merging object elements into one interface with
 * optional/union members), null, and mixed types. Identical object shapes are
 * de-duplicated so the same interface isn't emitted twice.
 */

export type TsResult = { ok: true; output: string } | { ok: false; error: string };

const IDENT_RE = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

function pascalCase(input: string): string {
  const parts = input.replace(/[^A-Za-z0-9]+/g, " ").trim().split(/\s+/);
  const name = parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join("");
  return name || "Item";
}

function singularize(name: string): string {
  if (/ies$/i.test(name)) return name.replace(/ies$/i, "y");
  if (/ses$/i.test(name)) return name.replace(/es$/i, "");
  if (/s$/i.test(name) && !/ss$/i.test(name)) return name.replace(/s$/i, "");
  return name;
}

function safeKey(key: string): string {
  return IDENT_RE.test(key) ? key : JSON.stringify(key);
}

class TypeBuilder {
  private interfaces = new Map<string, string>(); // name -> full declaration
  private bodyToName = new Map<string, string>(); // structural body -> name (dedupe)
  private usedNames = new Set<string>();

  private uniqueName(hint: string): string {
    const base = pascalCase(hint);
    let name = base;
    let n = 2;
    while (this.usedNames.has(name)) name = `${base}${n++}`;
    this.usedNames.add(name);
    return name;
  }

  /** Returns the TS type string for a value, registering interfaces as needed. */
  typeOf(value: unknown, hint: string): string {
    if (value === null) return "null";
    if (Array.isArray(value)) return this.arrayType(value, hint);
    switch (typeof value) {
      case "string":
        return "string";
      case "number":
        return "number";
      case "boolean":
        return "boolean";
      case "object":
        return this.objectType([value as Record<string, unknown>], hint);
      default:
        return "unknown";
    }
  }

  private arrayType(arr: unknown[], hint: string): string {
    if (arr.length === 0) return "unknown[]";
    const objects = arr.filter(
      (v) => v !== null && typeof v === "object" && !Array.isArray(v),
    ) as Record<string, unknown>[];

    if (objects.length === arr.length) {
      // All elements are plain objects - merge into one interface.
      return `${this.objectType(objects, singularize(hint))}[]`;
    }

    // Mixed/primitive array - union of distinct element types.
    const types = new Set<string>();
    arr.forEach((v) => types.add(this.typeOf(v, singularize(hint))));
    const union = [...types].join(" | ");
    return types.size > 1 ? `(${union})[]` : `${union}[]`;
  }

  /** Merge one or more object samples into a single interface; returns its name. */
  private objectType(samples: Record<string, unknown>[], hint: string): string {
    const keyTypes = new Map<string, Set<string>>();
    const keyPresence = new Map<string, number>();

    for (const sample of samples) {
      for (const [key, val] of Object.entries(sample)) {
        if (!keyTypes.has(key)) keyTypes.set(key, new Set());
        keyTypes.get(key)!.add(this.typeOf(val, key));
        keyPresence.set(key, (keyPresence.get(key) ?? 0) + 1);
      }
    }

    const lines: string[] = [];
    for (const [key, types] of keyTypes) {
      const optional = (keyPresence.get(key) ?? 0) < samples.length;
      const typeStr = [...types].join(" | ");
      lines.push(`  ${safeKey(key)}${optional ? "?" : ""}: ${typeStr};`);
    }
    const body = lines.join("\n");

    // De-duplicate structurally-identical interfaces.
    const existing = this.bodyToName.get(body);
    if (existing) return existing;

    const name = this.uniqueName(hint);
    this.bodyToName.set(body, name);
    this.interfaces.set(name, `export interface ${name} {\n${body || ""}\n}`);
    return name;
  }

  /** All emitted interfaces, root-first. */
  declarations(): string[] {
    return [...this.interfaces.values()].reverse();
  }
}

export function jsonToTypeScript(input: string, rootName = "Root"): TsResult {
  if (!input.trim()) return { ok: false, error: "Nothing to convert - the input is empty." };

  let data: unknown;
  try {
    data = JSON.parse(input);
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }

  const builder = new TypeBuilder();
  const root = pascalCase(rootName);

  if (data !== null && typeof data === "object") {
    builder.typeOf(data, root);
    return { ok: true, output: builder.declarations().join("\n\n") };
  }

  // Primitive / array root → emit a type alias.
  const aliasType = builder.typeOf(data, root);
  const decls = builder.declarations();
  const alias = `export type ${root} = ${aliasType};`;
  return { ok: true, output: decls.length ? `${decls.join("\n\n")}\n\n${alias}` : alias };
}
