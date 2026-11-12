# Architecture Decision Records

This folder records the significant decisions behind Maestral: what was
decided, why, which alternatives were rejected and what follows from it.
Records are never rewritten after the fact. When a decision changes, a new
record supersedes the old one and both stay in the history.

**Statuses:** `Proposed` (agreed in principle, not implemented yet) ·
`Accepted` · `Superseded by ADR-XXXX`

| #    | Decision                                                                                   | Status   |
| ---- | ------------------------------------------------------------------------------------------ | -------- |
| 0001 | [Product focus: forms, accessibility and theming](0001-product-focus.md)                   | Accepted |
| 0002 | [Native elements and attribute directives](0002-native-elements-and-attribute-directives.md) | Accepted |
| 0003 | [Framework-free CSS in cascade layers](0003-framework-free-css-in-cascade-layers.md)       | Accepted |
| 0004 | [Two-tier design tokens in OKLCH](0004-two-tier-design-tokens.md)                          | Accepted |
| 0005 | [One secondary entry point per component](0005-secondary-entry-points.md)                  | Accepted |
| 0006 | [Package name `maestral`, unscoped, prefix `ms`](0006-package-name-and-prefix.md)          | Accepted |
| 0007 | [Custom docs app instead of Storybook](0007-custom-docs-app-instead-of-storybook.md)       | Accepted |
| 0008 | [Docs app consumes the library from source](0008-docs-app-consumes-library-from-source.md) | Accepted |
| 0009 | [Publish from CI with npm trusted publishing](0009-publish-with-trusted-publishing.md)     | Proposed |
| 0010 | [MIT license and English as project language](0010-mit-license-and-english-as-project-language.md) | Accepted |
| 0011 | [Visual identity: the sail](0011-visual-identity-sail.md)                                  | Accepted |
| 0012 | [Form field anatomy and wiring](0012-form-field-anatomy.md)                                | Accepted |
| 0013 | [Validation errors from Signal Forms](0013-signal-forms-integration.md)                    | Accepted |
| 0014 | [Error summary](0014-error-summary.md)                                                     | Accepted |
| 0015 | [Testing approach](0015-testing-approach.md)                                               | Accepted |

## Template

```markdown
# ADR-XXXX: Title

- **Status:** Proposed | Accepted | Superseded by ADR-XXXX
- **Date:** YYYY-MM-DD

## Context
What problem or question forced a decision?

## Decision
What we do.

## Alternatives considered
What else was on the table and why it lost.

## Consequences
What becomes easier, what becomes harder, what we must keep doing.
```
