import dynamic from "next/dynamic";
import type { ComponentType } from "react";

/**
 * Maps a tool slug to its interactive widget, lazily code-split via next/dynamic
 * so each widget ships only on its own route (keeping shared JS lean). Widgets
 * are client components but render server-side too, so the initial HTML is
 * present for crawlers. Slugs without an entry fall back to the placeholder.
 */
function loading() {
  return (
    <div className="glass-card p-12 text-center text-secondary" aria-busy="true">
      Loading tool…
    </div>
  );
}

export const toolWidgets: Record<string, ComponentType> = {
  "json-formatter": dynamic(
    () => import("@/components/tools/JsonFormatter").then((m) => m.JsonFormatter),
    { loading },
  ),
  "json-to-typescript": dynamic(
    () => import("@/components/tools/JsonToTypeScript").then((m) => m.JsonToTypeScript),
    { loading },
  ),
  "jwt-decoder": dynamic(
    () => import("@/components/tools/JwtDecoder").then((m) => m.JwtDecoder),
    { loading },
  ),
  base64: dynamic(
    () => import("@/components/tools/Base64Tool").then((m) => m.Base64Tool),
    { loading },
  ),
  "uuid-generator": dynamic(
    () => import("@/components/tools/UuidGenerator").then((m) => m.UuidGenerator),
    { loading },
  ),
  "cron-builder": dynamic(
    () => import("@/components/tools/CronBuilder").then((m) => m.CronBuilder),
    { loading },
  ),
  "css-gradient-generator": dynamic(
    () => import("@/components/tools/CssGradientGenerator").then((m) => m.CssGradientGenerator),
    { loading },
  ),
  "box-shadow-generator": dynamic(
    () => import("@/components/tools/BoxShadowGenerator").then((m) => m.BoxShadowGenerator),
    { loading },
  ),
  "color-contrast-checker": dynamic(
    () => import("@/components/tools/ColorContrastChecker").then((m) => m.ColorContrastChecker),
    { loading },
  ),
  "svg-to-jsx": dynamic(
    () => import("@/components/tools/SvgToJsx").then((m) => m.SvgToJsx),
    { loading },
  ),
  "favicon-generator": dynamic(
    () => import("@/components/tools/FaviconGenerator").then((m) => m.FaviconGenerator),
    { loading },
  ),
  "meta-tag-previewer": dynamic(
    () => import("@/components/tools/MetaTagPreviewer").then((m) => m.MetaTagPreviewer),
    { loading },
  ),
  "token-counter": dynamic(
    () => import("@/components/tools/TokenCounter").then((m) => m.TokenCounter),
    { loading },
  ),
  "prompt-template-builder": dynamic(
    () => import("@/components/tools/PromptTemplateBuilder").then((m) => m.PromptTemplateBuilder),
    { loading },
  ),
  "env-example-generator": dynamic(
    () => import("@/components/tools/EnvExampleGenerator").then((m) => m.EnvExampleGenerator),
    { loading },
  ),
  "regex-tester": dynamic(
    () => import("@/components/tools/RegexTester").then((m) => m.RegexTester),
    { loading },
  ),
  "case-converter": dynamic(
    () => import("@/components/tools/CaseConverter").then((m) => m.CaseConverter),
    { loading },
  ),
  "markdown-to-html": dynamic(
    () => import("@/components/tools/MarkdownToHtml").then((m) => m.MarkdownToHtml),
    { loading },
  ),
  "csv-to-json": dynamic(
    () => import("@/components/tools/CsvToJson").then((m) => m.CsvToJson),
    { loading },
  ),
  "timestamp-converter": dynamic(
    () => import("@/components/tools/TimestampConverter").then((m) => m.TimestampConverter),
    { loading },
  ),
  "image-compressor": dynamic(
    () => import("@/components/tools/ImageCompressor").then((m) => m.ImageCompressor),
    { loading },
  ),
  "qr-code-generator": dynamic(
    () => import("@/components/tools/QrCodeGenerator").then((m) => m.QrCodeGenerator),
    { loading },
  ),
};
