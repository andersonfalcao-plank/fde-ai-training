# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@../AGENTS.md

## Commands

- `pnpm check` runs everything CI runs: lint, format:check, typecheck (`next typegen && tsc --noEmit`), test (Vitest), build. Run it before every commit.
- `main` is protected: the Lint and Test checks must pass before a PR can merge.

## Git and PRs

- Never commit on `main`; branch first.
- Conventional commits (`feat(scope): …`) with a subject line and a description body, authored as the person
  running the session, taken from their machine, never hard-coded:
  `--author="$(gh api user --jq .login) <$(git config user.email)>"`.
  If `gh` isn't logged in, omit `--author` so git uses the local `user.name` and `user.email`.
- Fill in `.github/pull_request_template.md` for every PR. Merge with a merge commit.
- Before merging, open the Vercel preview and check every changed page at desktop (~1280px) and phone (~390px) width.
  Previews are behind Vercel Authentication: use `vercel curl <url>` for HTTP, or send the
  `x-vercel-trusted-oidc-idp-token` header from a headless browser. Production is public.
- After merging, confirm production at https://fde-ai-training-pi.vercel.app/api/health: `commit` should equal the merge commit.

## Architecture notes

- `cacheComponents` is on (`next.config.ts`). Pages with no request-time data are prerendered at build, so values from
  `config.ts` reflect the deployment that built them. Route handlers that must run per request call `await connection()`
  (see `src/app/api/health/route.ts`). `usePathname` and similar hooks need a `<Suspense>` boundary under routes with
  dynamic params.
- Config flows `process.env` → `src/lib/env.ts` (server-only, validated) → `src/lib/config.ts` (derived values with local
  fallbacks) → pages and routes.
- shadcn/ui here is the Base UI flavour (`@base-ui/react`); `cn` comes from the `cn` package via `@/lib/utils`. When
  styling a `Link` or `<a>` with `buttonVariants()`, wrap it in `cn()`. Otherwise conflicting classes aren't merged, e.g. the outline
  variant's border stays transparent.
- Deploys: Vercel Git integration on project `anderson-plank/fde-ai-training`. Every branch push creates a preview; `main` deploys to production.
