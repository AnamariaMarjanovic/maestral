# ADR-0006: Package name `maestral`, unscoped, prefix `ms`

- **Status:** Accepted
- **Date:** 2026-10-31

## Context

The npm username `anamaria` was taken, so a personal scope like
`@anamaria/ui` was not available. The name should be short, memorable and tell
a story.

## Decision

- Package name: **`maestral`**, unscoped. The maestral is a steady, pleasant
  summer wind on the Adriatic: reliable and never in the way, which is what a
  UI library should be.
- Selector and class prefix: **`ms`** (`msButton`, `ms-field`, `.ms-button`,
  `--ms-*` tokens).
- The npm account name is independent of the package name.

## Alternatives considered

- **Scoped personal name** (`@anamaria-orsulic/ui`). Rejected: long imports,
  no story.
- **Other Adriatic winds** (`tramontana`, `bura`). `tramontana` is long to
  type; `bura` was taken and the bora is a destructive wind.
- **`kvarner-ui`.** Rejected: weaker metaphor.

## Consequences

- Imports read well: `import { MsButton } from 'maestral/button'`.
- The name was available at decision time but is not reserved until the first
  real release, which should happen early. npm may still reject names it deems
  too similar to existing ones; `npm publish --dry-run` confirms before
  release.
