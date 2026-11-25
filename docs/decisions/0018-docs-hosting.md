# ADR-0018: Hosting the documentation site

- **Status:** Accepted
- **Date:** 2026-11-25

## Context

The docs app (ADR-0007) only ran locally. A live site is needed so the README,
the npm page and anyone evaluating the library can try the components,
especially the form behaviour, without cloning the repository.

## Decision

- The docs site is hosted on **Vercel**, connected to the GitHub repository.
  Every push to `main` deploys production; every pull request gets a preview
  URL.
- Build settings live in **`vercel.json`** in the repository, not in the
  Vercel dashboard: `npm ci`, `npx ng build docs`, output
  `dist/docs/browser`.
- A **catch-all rewrite to `index.html`** lets deep links such as
  `/components/field` load directly. Vercel serves existing files first, so
  scripts, styles and the favicon are unaffected.
- The site is served from a subdomain of the maintainer's domain,
  `maestral.anamaria.dev`.

## Alternatives considered

- **GitHub Pages.** Free and close to the code, but needs its own deploy
  workflow, a `/maestral/` base href and a `404.html` copy of the app for
  deep links, and has no pull request previews.
- **Netlify.** Equivalent to Vercel; Vercel was chosen because the
  maintainer already hosts her portfolio there.

## Consequences

- No deploy secrets or workflows in the repository.
- The site is client-rendered. Prerendering the pages for search engines
  and faster first paint is a possible follow-up.
