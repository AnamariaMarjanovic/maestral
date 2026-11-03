# ADR-0007: Custom docs app instead of Storybook

- **Status:** Accepted
- **Date:** 2026-10-31

## Context

The project needs a showcase with every component and option, and a theme
generator (ADR-0001).

## Decision

Build the documentation site as a regular Angular application (`projects/docs`)
that hosts component pages, live examples, API tables and, later, the theme
generator.

## Alternatives considered

- **Storybook.** Strong for isolated development and visual tests, but the
  theme generator would sit awkwardly next to it, it adds its own configuration
  and build, and its support for new Angular versions can lag. Not ruled out
  later as a development and testing tool.
- **Both from day one.** Rejected: two tools to maintain before there is
  anything to show.

## Consequences

- One place where a theme change instantly previews across all components.
- The docs site looks like a product and can be deployed to its own domain.
- Examples, API tables and navigation must be built by hand.
- The docs app uses only Maestral's tokens and components, so it doubles as a
  real-world test of the library.
