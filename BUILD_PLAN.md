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

**Layout shell & infra (next):**
- [ ] `next/font` Inter wired in `app/layout.tsx` (no layout shift)
- [ ] `<Header>` + `<Footer>` + `<ThemeToggle>` (cookie-based theme, no flash)
- [ ] Homepage scaffold — hero + category grid driven by `data/tools.ts`
- [ ] `<ToolLayout>` (page wrapper: heading, widget slot, SeoExplainer, JsonLd, CTA)
- [ ] `<AgencyCTA>` + tech-stack marquee from `data/agency.ts`
- [ ] Shared primitives: `<ToolCard>`, `<CopyButton>`, `<SeoExplainer>`, `<JsonLd>`
- [ ] `sitemap.ts` + `robots.ts` (derive from registry)
- [ ] GA via `NEXT_PUBLIC_GA_ID` (no-op when blank)
- [ ] `app/api/contact/route.ts` — Resend Route Handler (the only server code)
- [ ] **Gate:** build passes · no console errors · four-pillar self-check

> Read `node_modules/next/dist/docs/` for Metadata API, sitemap/robots, Route Handlers,
> `next/font`, and dynamic import before writing each.

---

## Phase 1 — Developer Utilities (6 tools)
- [ ] JSON Formatter & Validator
- [ ] JSON → TypeScript
- [ ] JWT Decoder
- [ ] Base64 Encoder / Decoder
- [ ] UUID Generator
- [ ] Cron Expression Builder
- [ ] **Gate:** build passes · no console errors · four-pillar self-check

## Phase 2 — Frontend & Web (6 tools)
- [ ] CSS Gradient Generator
- [ ] Box-Shadow Generator
- [ ] Color Contrast Checker
- [ ] SVG → JSX
- [ ] Favicon Generator
- [ ] Meta Tag & OG Previewer
- [ ] **Gate:** build passes · no console errors · four-pillar self-check

## Phase 3 — AI & Vibecoding (4 tools)
- [ ] Token Counter & Cost Estimator
- [ ] Prompt Template Builder
- [ ] .env Example Generator
- [ ] Regex Tester & Explainer
- [ ] **Gate:** build passes · no console errors · four-pillar self-check

## Phase 4 — Converters & Formatters (6 tools)
- [ ] Case Converter
- [ ] Markdown → HTML
- [ ] CSV → JSON
- [ ] Timestamp / Epoch Converter
- [ ] Image Compressor
- [ ] QR Code Generator
- [ ] **Gate:** build passes · no console errors · four-pillar self-check

## Phase 5 — Audit pass
- [ ] Lighthouse 100/100 × 4 on homepage + a representative tool from each category
- [ ] Full WCAG 2.1 AA accessibility sweep (keyboard, focus, aria-live, contrast)
- [ ] SEO sweep — metadata, canonicals, OG/Twitter, JSON-LD, sitemap, robots
- [ ] Best-practices sweep — no console errors, HTTPS links, image aspect ratios
- [ ] Bundle check — heavy libs lazy-loaded, shared JS lean
