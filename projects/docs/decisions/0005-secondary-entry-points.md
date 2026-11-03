# ADR-0005: One secondary entry point per component

- **Status:** Accepted
- **Date:** 2026-10-31

## Context

A single entry point (`import { MsButton, MsField } from 'maestral'`) relies on
tree shaking to drop unused code, which is not always reliable, and it couples
all components into one compilation unit.

## Decision

Each component gets its own secondary entry point, built by ng-packagr from a
folder with its own `ng-package.json`:

```ts
import { MsButton } from 'maestral/button';
```

The primary entry point (`maestral`) only exports shared utilities and the
version constant.

## Alternatives considered

- **Single entry point.** Rejected for the reasons above.
- **One npm package per component.** Rejected: heavy versioning and release
  overhead for a small library.

## Consequences

- Apps ship only what they import.
- Imports are explicit and self-documenting.
- Each new component needs a folder with `ng-package.json` and
  `public-api.ts`. If entry points depend on each other, they must import each
  other by package path (`maestral/x`), never by relative path.
