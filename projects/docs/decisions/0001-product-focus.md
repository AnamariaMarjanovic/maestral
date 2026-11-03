# ADR-0001: Product focus: forms, accessibility and theming

- **Status:** Accepted
- **Date:** 2026-10-31

## Context

The Angular ecosystem already has strong component libraries. Angular Material
is the official one and by far the most used; PrimeNG wins on breadth; Spartan
brings the shadcn/ui approach; commercial suites (Syncfusion, Kendo, Ignite UI)
cover enterprise grids and charts. Newer libraries such as Needless UI build on
native elements and design tokens.

A one-person library cannot compete on component count. It needs a focus that
existing libraries treat as an afterthought.

## Decision

Maestral concentrates on two things:

1. **Forms as the core story.** A field wrapper that wires labels, hints,
   errors, `aria-invalid` and `aria-describedby` automatically; error messages
   that appear at the right time; an error summary that lists all errors on
   submit, links to each field and moves focus to the first one.
2. **Theming as a product.** A theme generator in the docs site: pick a brand
   color, radius and density, preview every component in light and dark mode,
   get contrast-checked tokens to paste into an app.

Components beyond what forms and common layouts need come later, if at all.

## Alternatives considered

- **General-purpose library competing on breadth.** Rejected: established
  libraries are years ahead, and a broad but shallow library proves little.
- **Forms only, no generator.** Viable, but the generator is the most visible
  part of the project and makes the theming architecture tangible.
- **Generator only.** Rejected: a generator needs components to theme.

## Consequences

- Design tokens must be the only source of colors, spacing and radius from day
  one, or the generator cannot work later (see ADR-0004).
- Accessibility is a requirement, not a feature: every component must pass
  WCAG 2.2 AA, including contrast in both color schemes.
- The roadmap is ordered: tokens → basic components → form field and error
  summary → theme generator.
