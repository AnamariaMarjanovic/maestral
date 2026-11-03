# ADR-0009: Publish from CI with npm trusted publishing

- **Status:** Proposed
- **Date:** 2026-10-31

## Context

npm is restricting tokens that bypass two-factor authentication and is changing
direct publishing from January 2027. Long-lived publish tokens stored as CI
secrets are also a common supply-chain risk.

## Decision

- Releases are published from GitHub Actions using npm **trusted publishing**
  (OIDC): the workflow proves its identity to npm, so no publish token is
  stored anywhere.
- Two-factor authentication stays enabled on the npm account.
- The release workflow builds the library, runs tests and inspects the package
  with `npm pack` before publishing.

## Alternatives considered

- **Manual `npm publish` from a laptop.** Rejected: not reproducible, and it is
  being restricted.
- **Automation token in GitHub Secrets.** Rejected: a long-lived secret that
  can leak.

## Consequences

- Every release is traceable to a commit and a workflow run.
- The npm package must be linked to the GitHub repository and workflow before
  the first automated release.
