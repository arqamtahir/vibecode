/**
 * Vibecode tool registry - the single source of truth.
 *
 * The homepage, sitemap.ts, and every /tools/<slug> page derive from this array.
 * Adding a tool = add one entry here + one widget in /components/tools.
 *
 * seoTitle / seoDescription / searchQuery are the assets that rank - keep them
 * specific, keyword-targeted, and honest about what the (100% client-side) tool does.
 */

export type ToolCategory =
  | "Developer Utilities"
  | "Frontend & Web"
  | "AI & Vibecoding"
  | "Converters & Formatters";

export interface Tool {
  /** URL slug - route is /tools/<slug>. Stable; never change after launch. */
  slug: string;
  /** Display name used in nav, cards, and headings. */
  name: string;
  category: ToolCategory;
  /** One-line value prop for cards and the homepage grid. */
  shortDescription: string;
  /** <title> for the tool page (Metadata API). ~50–60 chars, keyword-led. */
  seoTitle: string;
  /** Meta description. ~140–160 chars, benefit + "free, client-side". */
  seoDescription: string;
  /** The primary search query this page targets for ranking. */
  searchQuery: string;
}

export const categories: ToolCategory[] = [
  "Developer Utilities",
  "Frontend & Web",
  "AI & Vibecoding",
  "Converters & Formatters",
];

export const tools: Tool[] = [
  // ───────────────────────── Developer Utilities ─────────────────────────
  {
    slug: "json-formatter",
    name: "JSON Formatter & Validator",
    category: "Developer Utilities",
    shortDescription: "Beautify, minify, and validate JSON instantly in your browser.",
    seoTitle: "JSON Formatter & Validator - Free Online JSON Beautifier",
    seoDescription:
      "Format, validate, and minify JSON online for free. Pretty-print messy JSON, catch syntax errors with line numbers, and copy results. 100% client-side and private.",
    searchQuery: "json formatter validator online",
  },
  {
    slug: "json-to-typescript",
    name: "JSON → TypeScript",
    category: "Developer Utilities",
    shortDescription: "Generate TypeScript interfaces from any JSON payload.",
    seoTitle: "JSON to TypeScript Interface Generator - Free Online",
    seoDescription:
      "Convert JSON to TypeScript interfaces and types instantly. Paste an API response, get clean, nested type definitions. Free, private, and runs entirely in your browser.",
    searchQuery: "json to typescript interface generator",
  },
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    category: "Developer Utilities",
    shortDescription: "Decode and inspect JWT header, payload, and claims.",
    seoTitle: "JWT Decoder - Decode & Inspect JSON Web Tokens Online",
    seoDescription:
      "Decode JWTs to read the header, payload, and claims (exp, iat, iss) instantly. Your token never leaves your browser - fully client-side and secure. Free, no signup.",
    searchQuery: "jwt decoder online",
  },
  {
    slug: "base64",
    name: "Base64 Encoder / Decoder",
    category: "Developer Utilities",
    shortDescription: "Encode or decode Base64 text and data URLs.",
    seoTitle: "Base64 Encoder & Decoder - Free Online Tool",
    seoDescription:
      "Encode text to Base64 or decode Base64 back to text, with UTF-8 and data-URL support. Fast, free, and 100% client-side - nothing is uploaded to a server.",
    searchQuery: "base64 encode decode online",
  },
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    category: "Developer Utilities",
    shortDescription: "Generate cryptographically random v4 UUIDs in bulk.",
    seoTitle: "UUID Generator - Free Online v4 UUID / GUID Generator",
    seoDescription:
      "Generate random v4 UUIDs (GUIDs) one at a time or in bulk, using your browser's crypto API. Copy with one click. Free, private, and works offline after load.",
    searchQuery: "uuid generator online",
  },
  {
    slug: "cron-builder",
    name: "Cron Expression Builder",
    category: "Developer Utilities",
    shortDescription: "Build and explain cron schedules in plain English.",
    seoTitle: "Cron Expression Builder & Explainer - Free Online",
    seoDescription:
      "Build cron expressions visually and see the next run times plus a plain-English explanation. Validate crontab syntax instantly. Free, client-side, no signup needed.",
    searchQuery: "cron expression builder",
  },

  {
    slug: "password-generator",
    name: "Password Generator",
    category: "Developer Utilities",
    shortDescription: "Generate strong random passwords with entropy readout.",
    seoTitle: "Password Generator - Strong Random Passwords, Free & Private",
    seoDescription:
      "Generate strong, cryptographically random passwords with custom length and character sets, plus an entropy readout. 100% client-side - nothing ever leaves your browser.",
    searchQuery: "password generator",
  },
  {
    slug: "diff-checker",
    name: "Diff Checker",
    category: "Developer Utilities",
    shortDescription: "Compare two texts line by line with a clear diff view.",
    seoTitle: "Diff Checker - Compare Two Texts Online, Free & Private",
    seoDescription:
      "Compare two blocks of text line by line and see additions and deletions highlighted instantly. Copy a unified diff. Free, private, and 100% client-side - no upload.",
    searchQuery: "diff checker text compare online",
  },
  {
    slug: "hash-generator",
    name: "Hash Generator",
    category: "Developer Utilities",
    shortDescription: "Compute MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes.",
    seoTitle: "Hash Generator - SHA-256, SHA-512, MD5 Online, Free",
    seoDescription:
      "Generate MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes from any text instantly, using your browser's Web Crypto API. Free, private, and fully client-side.",
    searchQuery: "sha256 hash generator online",
  },

  // ───────────────────────── Frontend & Web ─────────────────────────
  {
    slug: "css-gradient-generator",
    name: "CSS Gradient Generator",
    category: "Frontend & Web",
    shortDescription: "Design linear and radial gradients with live CSS output.",
    seoTitle: "CSS Gradient Generator - Free Linear & Radial Gradient Maker",
    seoDescription:
      "Create beautiful CSS gradients with a live preview and instant copy-ready code. Linear, radial, multi-stop, and angle control. Free and 100% client-side.",
    searchQuery: "css gradient generator",
  },
  {
    slug: "box-shadow-generator",
    name: "Box-Shadow Generator",
    category: "Frontend & Web",
    shortDescription: "Craft layered CSS box-shadows with a live preview.",
    seoTitle: "CSS Box-Shadow Generator - Free Online Shadow Maker",
    seoDescription:
      "Visually design CSS box-shadows - offset, blur, spread, color, and inset - with a live preview and copy-ready code. Stack multiple shadows. Free and private.",
    searchQuery: "css box shadow generator",
  },
  {
    slug: "color-contrast-checker",
    name: "Color Contrast Checker",
    category: "Frontend & Web",
    shortDescription: "Check WCAG AA/AAA contrast ratios for any color pair.",
    seoTitle: "Color Contrast Checker - WCAG AA / AAA Accessibility Tool",
    seoDescription:
      "Test foreground/background color contrast against WCAG 2.1 AA and AAA thresholds. Get the exact ratio and pass/fail for normal and large text. Free, client-side.",
    searchQuery: "color contrast checker wcag",
  },
  {
    slug: "svg-to-jsx",
    name: "SVG → JSX",
    category: "Frontend & Web",
    shortDescription: "Convert SVG markup into clean React JSX components.",
    seoTitle: "SVG to JSX Converter - Free Online React Component Generator",
    seoDescription:
      "Paste raw SVG and get clean, React-ready JSX with camelCased attributes and an optional component wrapper. Free, fast, and 100% in-browser. No upload required.",
    searchQuery: "svg to jsx converter",
  },
  {
    slug: "favicon-generator",
    name: "Favicon Generator",
    category: "Frontend & Web",
    shortDescription: "Turn an image into a full favicon set with HTML tags.",
    seoTitle: "Favicon Generator - Free Online Favicon & Icon Maker",
    seoDescription:
      "Upload an image and generate a complete favicon set with ready-to-paste HTML link tags. All processing happens in your browser - nothing is uploaded. Free to use.",
    searchQuery: "favicon generator",
  },
  {
    slug: "meta-tag-previewer",
    name: "Meta Tag & OG Previewer",
    category: "Frontend & Web",
    shortDescription: "Preview Google, Twitter, and Open Graph cards live.",
    seoTitle: "Meta Tag & Open Graph Previewer - Free SEO Preview Tool",
    seoDescription:
      "Write title, description, and Open Graph tags and preview exactly how your page looks on Google, Twitter/X, and Facebook. Copy the meta tags. Free and client-side.",
    searchQuery: "open graph meta tag previewer",
  },

  {
    slug: "color-converter",
    name: "Color Converter",
    category: "Frontend & Web",
    shortDescription: "Convert colors between hex, RGB, HSL, and OKLCH.",
    seoTitle: "Color Converter - HEX to RGB, HSL & OKLCH Online, Free",
    seoDescription:
      "Convert any color between hex, RGB, HSL, and modern OKLCH with a live swatch preview and one-click copy. Free, fast, and 100% client-side - works offline.",
    searchQuery: "hex to rgb color converter",
  },

  // ───────────────────────── AI & Vibecoding ─────────────────────────
  {
    slug: "token-counter",
    name: "Token Counter & Cost Estimator",
    category: "AI & Vibecoding",
    shortDescription: "Count LLM tokens and estimate API cost per model.",
    seoTitle: "LLM Token Counter & Cost Estimator - Free Online Tool",
    seoDescription:
      "Count tokens for your prompts and estimate the API cost across popular LLM models. Paste text, pick a model, see tokens and dollars. Free, private, runs in-browser.",
    searchQuery: "llm token counter cost estimator",
  },
  {
    slug: "prompt-template-builder",
    name: "Prompt Template Builder",
    category: "AI & Vibecoding",
    shortDescription: "Build reusable LLM prompts with typed variables.",
    seoTitle: "Prompt Template Builder - Free Reusable AI Prompt Tool",
    seoDescription:
      "Create reusable prompt templates with {{variables}}, fill them in, and copy the final prompt for any LLM. Save your work locally. Free, private, and client-side.",
    searchQuery: "ai prompt template builder",
  },
  {
    slug: "env-example-generator",
    name: ".env Example Generator",
    category: "AI & Vibecoding",
    shortDescription: "Generate a safe .env.example from your real .env.",
    seoTitle: ".env.example Generator - Strip Secrets From Env Files Free",
    seoDescription:
      "Paste a .env file and instantly get a redacted .env.example with keys preserved and values stripped. Keep secrets out of git. 100% client-side - nothing leaves your browser.",
    searchQuery: "env example generator",
  },
  {
    slug: "regex-tester",
    name: "Regex Tester & Explainer",
    category: "AI & Vibecoding",
    shortDescription: "Test regex with live matches and a plain-English breakdown.",
    seoTitle: "Regex Tester & Explainer - Free Online Regex Tool",
    seoDescription:
      "Test regular expressions against your text with live highlighting, capture groups, and a plain-English explanation of each token. Free, private, and runs in-browser.",
    searchQuery: "regex tester and explainer",
  },

  // ───────────────────────── Converters & Formatters ─────────────────────────
  {
    slug: "case-converter",
    name: "Case Converter",
    category: "Converters & Formatters",
    shortDescription: "Convert text between camel, snake, kebab, title, and more.",
    seoTitle: "Case Converter - camelCase, snake_case, kebab-case Online",
    seoDescription:
      "Convert text between camelCase, snake_case, kebab-case, PascalCase, Title Case, and UPPER/lower instantly. Free, fast, and 100% client-side. No upload, fully private.",
    searchQuery: "case converter camelcase snake case",
  },
  {
    slug: "markdown-to-html",
    name: "Markdown → HTML",
    category: "Converters & Formatters",
    shortDescription: "Convert Markdown to clean HTML with a live preview.",
    seoTitle: "Markdown to HTML Converter - Free Online with Live Preview",
    seoDescription:
      "Convert Markdown to clean, copy-ready HTML with a side-by-side live preview. Supports headings, lists, code, tables, and links. Free, private, runs in your browser.",
    searchQuery: "markdown to html converter",
  },
  {
    slug: "csv-to-json",
    name: "CSV → JSON",
    category: "Converters & Formatters",
    shortDescription: "Convert CSV to JSON with header detection.",
    seoTitle: "CSV to JSON Converter - Free Online with Header Detection",
    seoDescription:
      "Convert CSV data to JSON instantly - auto-detect headers, choose delimiters, and get pretty or minified output. Free, private, and 100% client-side. No file upload.",
    searchQuery: "csv to json converter",
  },
  {
    slug: "timestamp-converter",
    name: "Timestamp / Epoch Converter",
    category: "Converters & Formatters",
    shortDescription: "Convert Unix timestamps to dates and back, any timezone.",
    seoTitle: "Unix Timestamp Converter - Epoch to Date & Back, Free Online",
    seoDescription:
      "Convert Unix epoch timestamps to human-readable dates and back, in seconds or milliseconds, across timezones and ISO 8601. Free, client-side, and works offline.",
    searchQuery: "unix timestamp converter epoch",
  },
  {
    slug: "image-compressor",
    name: "Image Compressor",
    category: "Converters & Formatters",
    shortDescription: "Compress and resize images locally without quality loss.",
    seoTitle: "Image Compressor - Free Online, Private & In-Browser",
    seoDescription:
      "Compress and resize JPEG, PNG, and WebP images right in your browser - adjust quality, see the size saved, and download. Nothing is uploaded. Free and fully private.",
    searchQuery: "image compressor online",
  },
  {
    slug: "url-encoder-decoder",
    name: "URL Encoder / Decoder",
    category: "Converters & Formatters",
    shortDescription: "Encode or decode URLs and break down query parameters.",
    seoTitle: "URL Encoder & Decoder - Free Online Percent-Encoding Tool",
    seoDescription:
      "Encode or decode URLs and query strings (percent-encoding) instantly, with a decoded breakdown of every query parameter. Free, private, and 100% in-browser.",
    searchQuery: "url encoder decoder online",
  },
  {
    slug: "word-counter",
    name: "Word Counter",
    category: "Converters & Formatters",
    shortDescription: "Count words, characters, sentences, and reading time.",
    seoTitle: "Word Counter - Words, Characters & Reading Time, Free",
    seoDescription:
      "Count words, characters, sentences, and paragraphs, plus estimated reading and speaking time - live as you type. Free, private, and 100% client-side. No upload.",
    searchQuery: "word counter online",
  },
  {
    slug: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    category: "Converters & Formatters",
    shortDescription: "Generate placeholder text as plain paragraphs or HTML.",
    seoTitle: "Lorem Ipsum Generator - Free Placeholder Text Online",
    seoDescription:
      "Generate lorem ipsum placeholder text by paragraph and sentence count, as plain text or HTML paragraphs, and copy it in one click. Free, fast, and client-side.",
    searchQuery: "lorem ipsum generator",
  },
  {
    slug: "qr-code-generator",
    name: "QR Code Generator",
    category: "Converters & Formatters",
    shortDescription: "Generate downloadable QR codes for any text or URL.",
    seoTitle: "QR Code Generator - Free Online, Download PNG & SVG",
    seoDescription:
      "Create QR codes for URLs, text, Wi-Fi, and more with adjustable size and error correction, then download as PNG or SVG. Free, private, and 100% client-side.",
    searchQuery: "qr code generator online",
  },
];

/** Convenience lookups derived from the registry. */
export const getToolBySlug = (slug: string): Tool | undefined =>
  tools.find((t) => t.slug === slug);

export const toolsByCategory = (category: ToolCategory): Tool[] =>
  tools.filter((t) => t.category === category);
