# ADR-0010: MIT license and English as project language

- **Status:** Accepted
- **Date:** 2026-10-31

## Context

Maestral is public: on GitHub as a portfolio project and on npm for anyone to
use. Its license and language decide who can use and contribute to it.

## Decision

- **License: MIT.** The `LICENSE` file lives in the repository root and is
  copied into `projects/maestral/` so ng-packagr ships it with the package.
- **Language: English** for code, comments, commit messages, documentation,
  this changelog and these records.
- Commit messages follow the
  [Conventional Commits](https://www.conventionalcommits.org/) style
  (`feat(button): ...`, `fix(tokens): ...`, `chore: ...`), which maps directly
  onto changelog sections and semantic versions.

## Alternatives considered

- **Apache 2.0.** Adds a patent grant, but is longer and less common for UI
  libraries.
- **GPL family.** Rejected: copyleft discourages adoption in commercial apps.

## Consequences

- Anyone may use, modify and ship Maestral, including commercially, as long as
  the license notice is kept.
- The project is readable by the widest audience of users and reviewers.
