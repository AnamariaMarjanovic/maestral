# ADR-0003: Framework-free CSS in cascade layers

- **Status:** Accepted
- **Date:** 2026-10-31

## Context

Component libraries usually ship styles inside Angular components
(emulated encapsulation) or through Sass mixins. Both make overriding styles
hard: consumers fight specificity, reach for `::ng-deep` or `!important`, and
the styles cannot be reused outside Angular.

## Decision

- All styles are **plain CSS files** shipped in the package under `styles/`,
  imported once through `maestral/styles/maestral.css`.
- Everything lives in **cascade layers**, declared in order:
  `@layer maestral.tokens, maestral.base, maestral.components;`
- Directives only add classes and data attributes (`.ms-button`,
  `data-variant`, `data-size`); CSS does the rest.
- No Sass, no Tailwind, no CSS-in-JS in the library or the docs app.

## Alternatives considered

- **Component styles with view encapsulation.** Rejected: impossible with
  attribute directives (ADR-0002) and hard to override.
- **Sass.** Rejected: modern CSS (custom properties, `color-mix()`,
  `light-dark()`, nesting, layers) covers what Sass was needed for, and a
  build-time language cannot change themes at runtime.
- **Tailwind in the docs app.** Rejected: the docs app must use the library's
  own tokens and components, so gaps in the library become visible instead of
  being papered over.

## Consequences

- Consumer styles outside any layer always win over Maestral, with no
  specificity battles.
- The same stylesheet could later serve React or plain HTML.
- Consumers must import one stylesheet; this is documented in the README.
- Requires browsers with cascade layer support (all evergreen browsers).
