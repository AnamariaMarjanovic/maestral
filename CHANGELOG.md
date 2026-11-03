# Changelog

All notable changes to this project are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and the project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
Every entry says **what** changed and **why**. Larger architectural choices are
recorded as decision records in [`docs/decisions/`](docs/decisions/README.md)
and linked from here.

## [Unreleased]

### Added

- **`msButton` directive** (`maestral/button`) with `primary`, `secondary`,
  `ghost` and `danger` variants and `sm`, `md`, `lg` sizes.
  Applied to native `<button>` and `<a>` elements only, so keyboard handling,
  form submission and screen reader semantics come from the browser
  ([ADR-0002](docs/decisions/0002-native-elements-and-attribute-directives.md)).
  The selector deliberately rejects other elements (e.g. `<div msButton>`),
  turning an accessibility mistake into a compile error.
- **Button styles** in `styles/components/button.css`, in the
  `maestral.components` layer. Variants only swap four private custom
  properties (`--_bg`, `--_bg-hover`, `--_fg`, `--_border`) instead of
  repeating rules, which keeps each variant to a few lines and makes new
  variants cheap. Includes a visible `:focus-visible` ring, disabled and
  `aria-disabled` states, and a `forced-colors` fallback for Windows High
  Contrast. All variant color pairs were checked against WCAG 2.2 AA in
  light and dark mode.
- **Secondary entry point per component**, starting with `maestral/button`,
  so apps only ship what they import
  ([ADR-0005](docs/decisions/0005-secondary-entry-points.md)).
- **Design tokens** in `styles/tokens.css`: a primitive palette and a semantic
  layer (colors, radius, spacing, control height, typography, motion).
  Components may only use semantic tokens, so themes and dark mode can change
  the look without touching components
  ([ADR-0004](docs/decisions/0004-two-tier-design-tokens.md)).
- **Automatic dark mode** via `color-scheme` and `light-dark()`, with a manual
  override through `data-ms-theme="light" | "dark"` on any ancestor.
- **Reduced motion support**: durations drop to `0ms` under
  `prefers-reduced-motion: reduce`.
- **Stylesheet entry point** `maestral/styles/maestral.css` that declares the
  layer order `maestral.tokens, maestral.base, maestral.components`. Consumer
  styles outside any layer always win, without `!important`
  ([ADR-0003](docs/decisions/0003-framework-free-css-in-cascade-layers.md)).
- **Package metadata** in `projects/maestral/package.json`: description,
  license, author, repository, keywords, `sideEffects` for CSS and an
  `exports` entry for `./styles/*` so modern bundlers allow importing the
  stylesheets.
- **`docs` application** as the future documentation site, component
  showcase and theme generator
  ([ADR-0007](docs/decisions/0007-custom-docs-app-instead-of-storybook.md)).
  It reads the library from source through `tsconfig.app.json` paths, so
  changes show up instantly without a separate watch build
  ([ADR-0008](docs/decisions/0008-docs-app-consumes-library-from-source.md)).
- **MIT license**, copied into the library so it ships with the npm package
  ([ADR-0010](docs/decisions/0010-mit-license-and-english-as-project-language.md)).
- **Workspace** generated with Angular CLI 22 without a default application,
  plus `CLAUDE.md` and Angular MCP server configuration for AI-assisted
  development.

### Removed

- Generated placeholder `Maestral` component and its spec from the primary
  entry point. Components live in their own secondary entry points; the
  primary entry point now only exports `MAESTRAL_VERSION`.
- Angular's default welcome page in the `docs` app. It hardcoded colors for a
  light background and was unreadable in dark mode; it was replaced with a
  page that uses the library's own tokens.

### Fixed

- Wrong stylesheet path in `angular.json` (`styles/styles.css` →
  `styles/maestral.css`) that broke the `docs` build.
