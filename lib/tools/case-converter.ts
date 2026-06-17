/** Split text into words, normalising common separators and camelCase boundaries. */
function tokenize(input: string): string[] {
  return (
    input
      // Insert space before uppercase run or capital following lower
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
      // Replace non-alphanumeric runs with a space
      .replace(/[^a-zA-Z0-9]+/g, " ")
      .trim()
      .split(/\s+/)
      .filter(Boolean)
  );
}

export interface CaseResult {
  label: string;
  key: string;
  value: string;
}

export function convertCases(input: string): CaseResult[] {
  const words = tokenize(input);
  if (!words.length) return [];

  const lower = words.map((w) => w.toLowerCase());
  const upper = words.map((w) => w.toUpperCase());
  const title = words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());

  return [
    {
      label: "camelCase",
      key: "camel",
      value: lower[0] + title.slice(1).join(""),
    },
    {
      label: "PascalCase",
      key: "pascal",
      value: title.join(""),
    },
    {
      label: "snake_case",
      key: "snake",
      value: lower.join("_"),
    },
    {
      label: "kebab-case",
      key: "kebab",
      value: lower.join("-"),
    },
    {
      label: "CONSTANT_CASE",
      key: "constant",
      value: upper.join("_"),
    },
    {
      label: "Title Case",
      key: "title",
      value: title.join(" "),
    },
    {
      label: "Sentence case",
      key: "sentence",
      value:
        lower.length
          ? lower[0].charAt(0).toUpperCase() + lower[0].slice(1) + (lower.length > 1 ? " " + lower.slice(1).join(" ") : "")
          : "",
    },
    {
      label: "lowercase",
      key: "lower",
      value: lower.join(" "),
    },
    {
      label: "UPPERCASE",
      key: "upper",
      value: upper.join(" "),
    },
  ];
}
