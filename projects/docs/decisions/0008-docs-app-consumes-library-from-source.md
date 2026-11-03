# ADR-0008: Docs app consumes the library from source

- **Status:** Accepted
- **Date:** 2026-10-31

## Context

By default the Angular CLI maps `maestral` to `dist/maestral` in the root
`tsconfig.json`, so a consuming app needs `ng build maestral --watch` running in
a second terminal. Secondary entry points also do not resolve cleanly through
that mapping.

## Decision

- `projects/docs/tsconfig.app.json` overrides `paths` to point at source:
  `maestral` → `../maestral/src/public-api.ts` and
  `maestral/*` → `../maestral/*/public-api.ts`.
- `angular.json` includes `projects/maestral/styles/maestral.css` directly in
  the docs app's global styles.
- The root `tsconfig.json` keeps the `dist` mapping, which the library build
  relies on.

## Alternatives considered

- **Consume the built package.** Closest to what users get, but slower
  feedback and two processes for every change.
- **Change paths in the root `tsconfig.json`.** Rejected: the library's
  `tsconfig.lib.json` extends it, and source paths there can break
  ng-packagr builds.

## Consequences

- One command (`ng serve docs`) and instant feedback.
- The docs app does not prove that the built package works. Before every
  release the package is built and checked with `npm pack` (planned for CI,
  see ADR-0009).
