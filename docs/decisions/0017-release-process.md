# ADR-0017: Release process

- **Status:** Accepted
- **Date:** 2026-11-12
- **Supersedes:** ADR-0009

## Context

ADR-0009 proposed publishing from GitHub Actions with npm trusted publishing.
Two things have changed since:

- npm introduced **staged publishing** (generally available since npm CLI
  11.15): CI submits a version to a staging area, and it is published only
  after a maintainer approves it with 2FA. Trusted publisher configurations
  created after 3 September 2026 allow `npm stage publish` by default.
- A trusted publisher is configured in the package's settings on npmjs.com,
  so the package has to exist first.

Packing the library before the first release also showed how easy it is to
ship a broken package: a missing `assets` entry in `ng-package.json` drops
every stylesheet without any build error.

## Decision

- **First release (0.1.0) is published by hand** from the maintainer's
  machine with `npm publish` and 2FA, after checking the tarball with
  `npm pack --dry-run`.
- **Every later release goes through CI:** pushing a `vX.Y.Z` tag runs
  `.github/workflows/release.yml`, which tests, builds, checks that the tag
  matches the package version and runs `npm stage publish` with trusted
  publishing (OIDC, no stored token). The maintainer then approves the staged
  version with 2FA on npmjs.com or with `npm stage approve`.
- **The trusted publisher allows staged publishing only**, and publishing
  access is set to "Require two-factor authentication and disallow tokens".
- **CI checks the package contents** on every push: the tarball must contain
  `styles/maestral.css`, `styles/tokens.css`, `LICENSE` and `README.md`.
- Provenance attestations are generated automatically, because the
  repository and the package are public.

## Alternatives considered

- **Direct `npm publish` from CI.** Simpler, but a compromised workflow could
  publish without a human. Staged publishing keeps a 2FA approval step.
- **First release through staged publishing.** Possible, but npm publishes a
  public `0.0.0-stage` placeholder for brand new packages, and the trusted
  publisher cannot be configured before the package exists.
- **Automation token in GitHub Secrets.** Rejected in ADR-0009 already.

## Consequences

- No publish credentials exist anywhere in the repository or in GitHub.
- A release needs a person with 2FA, by design.
- Releasing becomes: update the changelog and version, commit, tag, push the
  tag, approve.
