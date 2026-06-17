/**
 * Prompt template parsing/rendering - pure, framework-free, unit-testable.
 * Variables use {{name}} syntax; whitespace inside the braces is tolerated.
 */

const VAR_RE = /\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g;

/** Unique variable names in first-appearance order (duplicates collapsed). */
export function extractVariables(template: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const match of template.matchAll(VAR_RE)) {
    const name = match[1].trim();
    if (name && !seen.has(name)) {
      seen.add(name);
      out.push(name);
    }
  }
  return out;
}

/** Replace every {{name}} with its value (missing/empty → empty string). */
export function renderTemplate(template: string, values: Record<string, string>): string {
  return template.replace(VAR_RE, (_full, rawName: string) => {
    const name = rawName.trim();
    return values[name] ?? "";
  });
}

export interface SavedTemplate {
  name: string;
  template: string;
  values?: Record<string, string>;
}

/** Serialize templates for export. */
export function exportTemplates(templates: SavedTemplate[]): string {
  return JSON.stringify({ version: 1, templates }, null, 2);
}

/** Parse imported JSON, tolerating shape errors. */
export function importTemplates(json: string): SavedTemplate[] {
  const data = JSON.parse(json) as unknown;
  const list = Array.isArray(data)
    ? data
    : (data as { templates?: unknown })?.templates;
  if (!Array.isArray(list)) throw new Error("Expected a list of templates.");
  return list
    .filter(
      (t): t is SavedTemplate =>
        !!t && typeof (t as SavedTemplate).name === "string" &&
        typeof (t as SavedTemplate).template === "string",
    )
    .map((t) => ({ name: t.name, template: t.template, values: t.values ?? {} }));
}
