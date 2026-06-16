@AGENTS.md

# Vibecode — Project Memory

> Read this file at the start of every session. It is the source of truth for what
> Vibecode is, the rules that may not be broken, and how to add to it.

---

## PROJECT

**Vibecode** — a collection of **22 free, 100% client-side developer tools**. It exists
as an **SEO + lead-generation asset** for the software agency **AlgoCrew**. Every tool
page is built to rank for a specific search query and funnel qualified developer traffic
toward AlgoCrew.

- Primary link (CTA): **https://algocrew.io**
- CTA target (contact): **https://algocrew.io/contact**

**Actual stack (verify before coding):** Next.js **16.2.9** (App Router), React 19,
TypeScript, **Tailwind CSS v4** (`@import "tailwindcss"` + `@theme`, configured via
`@tailwindcss/postcss`). ⚠️ This is NOT Next.js 14 — APIs, conventions, and file
structure differ from older training data. **Always read the relevant guide in
`node_modules/next/dist/docs/` before writing framework code** (Metadata API,
`sitemap.ts`, `robots.ts`, Route Handlers, `next/font`, dynamic import, etc.).

---

## NON-NEGOTIABLE RULES

1. **All 22 tools run 100% client-side.** No backend, no external API calls, no
   telemetry inside tools. Each tool must work **offline after load** and cost **$0** to
   run on the Vercel free tier.
2. **The ONLY server code allowed** is a single Route Handler at
   `/app/api/contact/route.ts` that sends email via **Resend**, reading
   `process.env.RESEND_API_KEY`, `process.env.CONTACT_TO_EMAIL`, and
   `process.env.CONTACT_FROM_EMAIL`. **Secrets are NEVER hardcoded and NEVER committed.**
3. **No `localStorage`/`sessionStorage` for SSR-sensitive state.** Use **cookies** for
   theme (so the server renders the correct theme with no flash/hydration mismatch).

---

## QUALITY BAR (every page must hit this)

**Lighthouse 100/100 on all four pillars — Performance, Accessibility, Best Practices,
SEO. This is a hard requirement, not aspirational.** After building each batch, list
exactly what was done to protect each of the four scores.

### Accessibility (WCAG 2.1 AA)
- Semantic HTML5 landmarks (`header`, `nav`, `main`, `footer`), correct heading order.
- A `<label>` tied to **every** input via `htmlFor`/`id`.
- `aria-label` on every icon-only button.
- Visible focus rings; full keyboard operability for every interaction.
- `role` / `aria-live` for dynamic results and copy confirmations.
- `prefers-reduced-motion` respected for **all** animations.
- `alt` text on all images. Color contrast meets AA (design tokens already satisfy this).

### Performance
- **Server components by default.** `'use client'` only where interactivity needs it
  (the tool widgets).
- **Lazy-load heavy tool libraries** with `dynamic import` so they don't bloat shared JS.
- `next/font` for **Inter** (no layout shift). Explicit `width`/`height` on images,
  `loading="lazy"` where appropriate. No blocking scripts.

### SEO
- Unique `<title>` + meta description per page via the **Metadata API**.
- Canonical URLs. Open Graph + Twitter cards sitewide.
- **JSON-LD `SoftwareApplication`** on every tool page.
- Dynamic `sitemap.ts` + `robots.ts`. Semantic markup, descriptive link text.

### Best Practices
- No console errors. HTTPS-only links. Correct image aspect ratios. No deprecated APIs.

---

## ARCHITECTURE CONVENTIONS

```
/app          — routes (App Router)
/components    — shared UI + tool widgets
/lib           — tool logic: pure functions, unit-testable, NO React
/data          — the registry (tools.ts) and agency data (agency.ts)
```

- **Logic / UI split:** every tool's pure logic lives in `/lib/tools/<tool>.ts`; the
  React widget in `/components/tools/<Tool>.tsx` imports it. This keeps logic
  client-side, framework-free, and reusable.
- **Single source of truth:** `/data/tools.ts` — an array of tool objects
  `{ slug, name, category, shortDescription, seoTitle, seoDescription, searchQuery }`.
  The homepage, `sitemap.ts`, and every tool page derive from this array. **Adding a tool
  = add one entry + one widget.**
- **Shared components:** `<ToolLayout>`, `<AgencyCTA>`, `<Header>`, `<Footer>`,
  `<ThemeToggle>`, `<CopyButton>`, `<ToolCard>`, `<SeoExplainer>`, `<JsonLd>`.

### How to add a new tool (follow this exactly)
1. Add an entry to `/data/tools.ts` with all fields (write real, keyword-targeted
   `seoTitle`/`seoDescription` and the target `searchQuery`).
2. Implement pure logic in `/lib/tools/<slug>.ts` (no React, unit-testable).
3. Build the widget in `/components/tools/<Tool>.tsx` (`'use client'`), importing the
   logic. Lazy-load any heavy dependency via `dynamic import`.
4. Create the route `/app/tools/<slug>/page.tsx` — a **server component** that exports
   `metadata` (Metadata API), renders `<ToolLayout>` wrapping the widget, includes
   `<SeoExplainer>`, `<JsonLd>` (SoftwareApplication), and `<AgencyCTA>`.
5. Confirm the tool appears on the homepage and in the sitemap automatically (both
   derive from `/data/tools.ts`).
6. Self-check the four Lighthouse pillars and accessibility checklist above.

---

## BUILD STATUS

See `BUILD_PLAN.md` for the phased checklist. Currently: **Phase 0 — foundation files
created.** Layout shell, sitemap/robots, GA, and contact route are next.
