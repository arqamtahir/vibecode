# Vibecode

**22 free, 100% client-side developer tools** — and an SEO + lead-generation asset for
the software agency [AlgoCrew](https://algocrew.io).

Every tool runs entirely in the browser: no backend, no external API calls, no telemetry.
Tools work offline after first load and cost **$0** to host on the Vercel free tier. The
only server code is a single contact-form Route Handler that emails leads via Resend.

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **Resend** for the contact form (the only server-side dependency)

> ⚠️ This project pins a modern Next.js whose APIs differ from older (v14) docs. See
> `AGENTS.md` — read the guides in `node_modules/next/dist/docs/` before writing
> framework code. Project conventions and rules live in `CLAUDE.md`; the build plan is
> in `BUILD_PLAN.md`.

## Environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

| Variable             | Purpose                                                        |
| -------------------- | -------------------------------------------------------------- |
| `RESEND_API_KEY`     | Resend API key — used only by the contact Route Handler.       |
| `CONTACT_TO_EMAIL`   | Inbox that receives contact-form submissions.                  |
| `CONTACT_FROM_EMAIL` | Verified Resend sender address.                                |
| `NEXT_PUBLIC_GA_ID`  | Google Analytics ID (public). Leave blank to disable analytics. |

Secrets are **never** committed — `.env*` is gitignored. Only `NEXT_PUBLIC_*` values are
exposed to the browser.

## Local development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint     # eslint
```

## Deploying to Vercel

1. Push the repo to GitHub and import it into [Vercel](https://vercel.com/new).
2. Add the environment variables from the table above in **Project → Settings →
   Environment Variables** (set `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, and
   `CONTACT_FROM_EMAIL` for Production; add `NEXT_PUBLIC_GA_ID` if using analytics).
3. Deploy. The framework preset (Next.js) and build command are detected automatically.
4. The contact form works once the Resend variables are set and the sender domain is
   verified in Resend.
