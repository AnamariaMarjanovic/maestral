# ADR-0015: Testing approach

- **Status:** Accepted
- **Date:** 2026-11-11

## Context

The form components carry behaviour that is easy to break silently: ids and
ARIA links between label, hint, error and control; when errors appear; where
focus goes after a failed submit. None of it is visible in a quick look at
the docs page, and most of it matters only to keyboard and screen reader
users.

## Decision

- **Vitest through Angular's unit-test builder** (`npx ng test maestral`),
  the default for new Angular 22 workspaces, running in jsdom.
- **Specs live next to their source** in each entry point
  (`field/field.spec.ts`). `angular.json` includes `../**/*.spec.ts`
  relative to the library's `src/`, and `tsconfig.spec.json` maps
  `maestral/*` to source so entry points can import each other in tests.
- **Test behaviour through a host component**, the way an app uses the
  library: render real templates with `[formField]`, type, blur, submit and
  assert on the DOM (text, ARIA attributes, `document.activeElement`).
  Internal signals and private methods are not tested directly.
- **Name tests after user-visible behaviour** ("does not show errors while
  the user is still typing"), so a failing test explains what broke for
  users.
- Browser APIs that jsdom lacks (such as `scrollIntoView`) are replaced with
  recording stubs, and the recorded calls are asserted.

## Alternatives considered

- **Karma and Jasmine.** The previous Angular default; deprecated in favour
  of Vitest.
- **Testing component internals** (calling `computed` signals directly).
  Rejected: couples tests to implementation and misses wiring bugs in
  templates and host bindings.
- **Only end-to-end tests in a real browser.** Slower and harder to run on
  every change. Real-browser checks of visuals and focus rings remain a
  candidate for later, alongside an automated axe audit.

## Consequences

- Each new entry point ships with a spec next to it.
- The suite was checked against a deliberate regression (showing errors
  before blur) and failed as expected.
- jsdom does not do layout or real focus rings, so visual and contrast
  checks still need a real browser.
