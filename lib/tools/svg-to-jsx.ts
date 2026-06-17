/**
 * SVG → JSX conversion - pure, framework-free, unit-testable. String-based
 * (no DOM dependency) so it runs anywhere. Handles attribute camelCasing,
 * class→className, inline style objects, comments, and an optional component
 * wrapper. Designed for well-formed SVG; reports a clear error otherwise.
 */

export interface SvgToJsxOptions {
  /** Wrap the SVG in a React component that spreads props onto <svg>. */
  asComponent?: boolean;
  /** Component name when asComponent is true. */
  componentName?: string;
}

export type SvgResult = { ok: true; output: string } | { ok: false; error: string };

/** kebab-case → camelCase, preserving leading characters. */
function camelCase(name: string): string {
  return name.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
}

/** Map an SVG/HTML attribute name to its JSX equivalent. */
function jsxAttrName(name: string): string {
  if (name === "class") return "className";
  if (name === "for") return "htmlFor";
  if (/^(data|aria)-/.test(name)) return name; // keep as-is
  if (name.includes(":")) {
    // Namespaced attrs, e.g. xlink:href → xlinkHref, xml:space → xmlSpace.
    const [ns, local] = name.split(":");
    return ns + local.charAt(0).toUpperCase() + camelCase(local).slice(1);
  }
  return camelCase(name);
}

/** Convert an inline `style="a:b;c:d"` value to a JSX style object literal. */
function styleToObject(value: string): string {
  const entries = value
    .split(";")
    .map((decl) => decl.trim())
    .filter(Boolean)
    .map((decl) => {
      const idx = decl.indexOf(":");
      if (idx === -1) return null;
      const prop = decl.slice(0, idx).trim();
      const val = decl.slice(idx + 1).trim();
      const key = /^-/.test(prop) ? prop : camelCase(prop);
      const safeKey = /^[A-Za-z][A-Za-z0-9]*$/.test(key) ? key : JSON.stringify(key);
      return `${safeKey}: ${JSON.stringify(val)}`;
    })
    .filter(Boolean);
  return `{{ ${entries.join(", ")} }}`;
}

export function svgToJsx(input: string, options: SvgToJsxOptions = {}): SvgResult {
  const trimmed = input.trim();
  if (!trimmed) return { ok: false, error: "Paste some SVG markup to convert." };
  if (!/<svg[\s>]/i.test(trimmed)) {
    return { ok: false, error: "That doesn't look like SVG - no <svg> tag was found." };
  }

  try {
    let out = trimmed;

    // HTML comments → JSX comments.
    out = out.replace(/<!--([\s\S]*?)-->/g, (_, c: string) => `{/*${c}*/}`);

    // Inline style attributes → JSX style objects.
    out = out.replace(/\sstyle=("([^"]*)"|'([^']*)')/g, (_m, _q, dq, sq) => {
      return ` style=${styleToObject(dq ?? sq ?? "")}`;
    });

    // Rename attributes (skip style, already handled above).
    out = out.replace(
      /(\s)([a-zA-Z_:][-a-zA-Z0-9_:]*)=/g,
      (_m, ws: string, name: string) => {
        if (name === "style") return `${ws}${name}=`;
        return `${ws}${jsxAttrName(name)}=`;
      },
    );

    if (options.asComponent) {
      const name = (options.componentName || "SvgIcon").replace(/[^A-Za-z0-9]/g, "") || "SvgIcon";
      // Spread incoming props onto the root <svg> for sizing/aria overrides.
      const withProps = out.replace(/<svg(\s|>)/i, `<svg {...props}$1`);
      return {
        ok: true,
        output: `export function ${name}(props: React.SVGProps<SVGSVGElement>) {\n  return (\n    ${withProps.replace(/\n/g, "\n    ")}\n  );\n}`,
      };
    }

    return { ok: true, output: out };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Could not convert that SVG." };
  }
}
