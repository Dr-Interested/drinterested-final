# Task List — Resolving All 26 Issues

## Batch 1 — package.json / Config (A1, A2, A21, A26)
- [x] A1: Remove vue + vue-router from package.json
- [x] A2: Pin all "latest" packages to real semver versions
- [x] A21: Rename package name from "my-v0-project" to "drinterested-org"
- [x] A26: Delete pnpm-lock.yaml

## Batch 2 — next.config.mjs (A20, A22)
- [x] A20: Remove v0.dev scaffolding import code
- [x] A22: Add CSP + security headers

## Batch 3 — layout.tsx (A4, A5, A14, A19)
- [x] A4: Move GA ID to NEXT_PUBLIC_GA_ID env var
- [x] A5: Remove placeholder google verification value
- [x] A14: Remove hardcoded canonical link from root layout
- [x] A19: Remove duplicate SeoSchema from home-page.tsx

## Batch 4 — home-page.tsx (A13, A23, A25)
- [x] A13: Move scaleIn variant inside component
- [x] A23: Remove window.scrollTo test code
- [x] A25: Replace inline SVG with Lucide component

## Batch 5 — Files across app (A3, A6, A12, A24, A18)
- [x] A3: Fix supabase-client.ts to throw if env vars missing
- [x] A6: Set revalidate=60 on events, revalidate=300 on blog listing, homepage, and topic pages
- [x] A12: Remove stale hardcoded event schema from events/page.tsx
- [x] A24: Dynamic copyright year in footer
- [x] A18: Fix OG image to 1200x630 (generateSeoMetadata supports large images)

## Batch 6 — UX: loading + error states (A16, A17)
- [x] A16: Add loading.tsx globally
- [x] A17: Add error.tsx globally

## Batch 7 — Security: apply form (A10)
- [x] A10: Server-side validation + rate limiting — /api/members/apply validates every field (zod), forces approved=false, rejects duplicates, rate limits per IP, and inserts with the service role

## Batch 8 — Follow-ups (site-wide review)
- [x] A7: Split home-page.tsx into components/home/* sections
- [x] A8: Split dashboard — sign-in screen (PortalLogin) and My Tasks + completion modal (MyTasksTab) extracted; dead legacy admin-task code removed
- [x] A9: Remove TypeScript `any` from the dashboard and portal tabs
- [x] A11: CAPTCHA — Cloudflare Turnstile on apply + contact (turns on when NEXT_PUBLIC_TURNSTILE_SITE_KEY and TURNSTILE_SECRET_KEY are set)
- [ ] A15: CSS dark mode refactor — still deferred: dark mode works through ~100 global override rules in app/globals.css; replacing them with per-component `dark:` classes touches every page and needs a visual pass of each

## Manual setup (outside the code)
- [ ] Remove the anon INSERT policy on public.members once the new apply route is deployed (applications are now inserted server-side)
- [ ] Paste docs/email-templates/* into Supabase Auth email templates; set up custom SMTP through Resend (see docs/email-templates/README.md)
- [ ] Set RESEND_FROM_EMAIL to an address on the verified drinterested.org domain
- [ ] Optional: Turnstile keys in Vercel
