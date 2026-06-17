# Vibecode — Build Plan

A phased checklist. **Every phase ends with the same gate:** `npm run build` passes, no
console errors, and a written self-check of the four Lighthouse pillars (Performance,
Accessibility, Best Practices, SEO). See `CLAUDE.md` for the rules and quality bar.

---

## Phase 0 — Foundation & shell

**Foundation files (this commit):**
- [x] `CLAUDE.md` — project memory, rules, conventions, "how to add a tool"
- [x] `app/globals.css` — AlgoCrew design tokens + utilities
- [x] `data/tools.ts` — registry of all 22 tools
- [x] `data/agency.ts` — services + tech stack + CTA URLs
- [x] `.env.example` + README + confirm `.env*` gitignored
- [x] `BUILD_PLAN.md`

**Layout shell & infra (done):**
- [x] `next/font` Inter wired in `app/layout.tsx` (no layout shift)
- [x] `<Header>` + `<Footer>` + `<ThemeToggle>` (cookie-based theme, no flash via pre-paint inline script)
- [x] Homepage scaffold — hero + searchable/filterable category grid driven by `data/tools.ts`
- [x] `<ToolLayout>` (page wrapper: heading, widget slot, SeoExplainer, JsonLd, CTA)
- [x] `<AgencyCTA>` + tech-stack marquee from `data/agency.ts`
- [x] Shared primitives: `<ToolCard>`, `<CopyButton>`, `<SeoExplainer>`, `<JsonLd>`, `<Logo>`
- [x] `/about` + `/contact` pages; contact form POSTs to the route with mailto fallback
- [x] Placeholder `/tools/[slug]` (generateStaticParams + generateMetadata, "coming soon" body)
- [x] `sitemap.ts` (25 URLs) + `robots.ts` (derive from registry)
- [x] Build-generated `app/opengraph-image.tsx` (sitewide OG/Twitter image)
- [x] GA via `NEXT_PUBLIC_GA_ID` (no-op when blank)
- [x] `app/api/contact/route.ts` — Resend Route Handler (the only server code)
- [x] **Gate:** build passes · no type/lint/console errors · four-pillar self-check

> Read `node_modules/next/dist/docs/` for Metadata API, sitemap/robots, Route Handlers,
> `next/font`, and dynamic import before writing each.

---

## Phase 1 — Developer Utilities (6 tools)
- [x] JSON Formatter & Validator — format/minify, line+column parse errors with caret
- [x] JSON → TypeScript — nested objects, array merging, optional/union/null handling
- [x] JWT Decoder — header+payload, human exp/iat/nbf, valid/expired badge, "not verified" note
- [x] Base64 Encoder / Decoder — text + file input, graceful invalid handling, UTF-8 safe
- [x] UUID Generator — v4, single + bulk (count), copy one or all
- [x] Cron Expression Builder — visual field builders + plain-English description
- [x] Pure logic in `/lib/tools/*`, widgets in `/components/tools/*`, dynamic-imported per route
- [x] **Gate:** build + typecheck + lint clean · all 6 routes 200, no console errors · four-pillar self-check

## Phase 2 — Frontend & Web (6 tools)
- [x] CSS Gradient Generator — linear/radial, add/remove/reposition stops, angle, live preview
- [x] Box-Shadow Generator — stacked layers (x/y/blur/spread/color/opacity/inset), live sample
- [x] Color Contrast Checker — ratio + WCAG AA/AAA × normal/large, palette suggestion, live preview
- [x] SVG → JSX — camelCase attrs, class→className, style objects, optional component wrapper
- [x] Favicon Generator — canvas resize, preview, client-side ZIP via dynamic-imported fflate
- [x] Meta Tag & OG Previewer — Google/Twitter/Facebook live cards + copy-ready tags
- [x] **Gate:** build + typecheck + lint clean · 6 routes 200, no console errors · fflate code-split · four-pillar self-check

## Phase 3 — AI & Vibecoding (4 tools)
- [x] Token Counter & Cost Estimator — dynamic-imported gpt-tokenizer, char/word counts, editable pricing presets
- [x] Prompt Template Builder — {{var}} auto-detect, live render, cookie save/load, JSON export/import
- [x] .env Example Generator — blanks values, keeps keys/comments/order, flags secret-like keys, in-browser only
- [x] Regex Tester & Explainer — live highlight + groups, token-by-token explanation, Web Worker + timeout guard
- [x] **Gate:** build + typecheck + lint clean · 4 routes 200, no console errors · tokenizer (1.9MB) is a pure dynamic import (absent from all page HTML) · four-pillar self-check

## Phase 4 — Converters & Formatters (6 tools)
- [x] Case Converter
- [x] Markdown → HTML
- [x] CSV → JSON
- [x] Timestamp / Epoch Converter
- [x] Image Compressor
- [x] QR Code Generator
- [x] **Gate:** build passes · no console errors · four-pillar self-check

## Phase 5 — Audit pass
- [x] Lighthouse 100/100 × 4 on homepage + a representative tool from each category
- [x] Full WCAG 2.1 AA accessibility sweep (keyboard, focus, aria-live, contrast)
- [x] SEO sweep — metadata, canonicals, OG/Twitter, JSON-LD, sitemap, robots
- [x] Best-practices sweep — no console errors, HTTPS links, image aspect ratios
- [x] Bundle check — heavy libs lazy-loaded, shared JS lean
