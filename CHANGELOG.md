# Changelog

All notable changes to this project are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and the project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
Every entry says **what** changed and **why**. Larger architectural choices are
recorded as decision records in [`docs/decisions/`](docs/decisions/README.md)
and linked from here.

## [Unreleased]

### Added

- **Automatic validation errors from Signal Forms.** When a control inside
  `<ms-field>` is bound with `[formField]`, the field shows its validation
  error without any extra wiring. Errors appear once the field is touched
  (on blur or on submit), never while the user is still typing, and
  disappear as soon as the value is valid. One message is shown at a time
  ([ADR-0013](docs/decisions/0013-signal-forms-integration.md)).
- **Error messages for built-in validators** (`required`, `email`,
  `minLength`, `maxLength`, `min`, `max`, `pattern`) in plain English that
  say what to do. A `message` set in the form schema takes precedence.
- **`provideMsErrorMessages()`** to override or translate messages per
  error kind, for example `provideMsErrorMessages({ required: () => 'Polje
  je obavezno' })`.
- **Required state from the schema**: a `required()` rule shows the
  asterisk and sets `aria-required` without repeating `required` on
  `<ms-field>`.
- **`@angular/forms` peer dependency**, needed by `maestral/input` for the
  Signal Forms integration. `maestral/field` itself does not import it.
- **`<ms-field>` component** (`maestral/field`) that renders a label, an
  optional hint and an optional error message around a form control, and
  wires their ids and ARIA attributes automatically. Order is label, hint,
  error, control, so the hint and error are read before the control and are
  not covered by autofill popups or the on-screen keyboard. Errors carry a
  visually hidden "Error:" prefix for screen readers. Required fields get
  `aria-required` and a decorative asterisk
  ([ADR-0012](docs/decisions/0012-form-field-anatomy.md)).
- **`msInput` directive** (`maestral/input`) for native `<input>` and
  `<textarea>`, with the sail shape. Inside `<ms-field>` it receives its id,
  `aria-describedby`, `aria-invalid` and `aria-required` from the field; a
  custom `id` on the control is kept and the label follows it. The invalid
  state uses a thicker border as well as the danger color, so it is not
  communicated by color alone.
- **`--ms-color-border-control` token** for form control boundaries. The
  existing `--ms-color-border` is only 1.29:1 against the background, fine
  for decoration but too faint to show where a field is. The new token meets
  the WCAG 1.4.11 minimum of 3:1 (4.65:1 light, 3.24:1 dark).
- **`styles/base.css`** in the `maestral.base` layer, starting with the
  `.ms-visually-hidden` utility used for screen-reader-only text.
- **`msButton` directive** (`maestral/button`) with `primary`, `secondary`,
  `ghost` and `danger` variants and `sm`, `md`, `lg` sizes.
  Applied to native `<button>` and `<a>` elements only, so keyboard handling,
  form submission and screen reader semantics come from the browser
  ([ADR-0002](docs/decisions/0002-native-elements-and-attribute-directives.md)).
  The selector deliberately rejects other elements (e.g. `<div msButton>`),
  turning an accessibility mistake into a compile error.
- **Button styles** in `styles/components/button.css`, in the
  `maestral.components` layer, using the sail shape (see Changed). Variants only swap four private custom
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

### Changed

- **New visual identity: the sail**
  ([ADR-0011](docs/decisions/0011-visual-identity-sail.md)). The first teal
  palette with evenly rounded corners looked too much like other recent
  libraries. Controls now round three corners (`--ms-radius-sail`) and keep
  the bottom inline-start corner sharp (`--ms-radius-tack`), like a sail
  filled by the maestral wind. The sharp corner uses a logical property, so
  it mirrors in right-to-left layouts.
- **Palette replaced**: Adriatic indigo primary and cool slate neutrals
  instead of teal and gray. All semantic color pairs were recomputed and pass
  WCAG 2.2 AA in light and dark mode (lowest pair 6.57:1).
- `--ms-radius-md` and `--ms-radius-lg` raised to `8px` and `14px` to match
  the softer sail corners on surfaces.

### Removed

- `--ms-teal-*` and `--ms-gray-*` primitive tokens, replaced by
  `--ms-indigo-*` and `--ms-slate-*`.
- Generated placeholder `Maestral` component and its spec from the primary
  entry point. Components live in their own secondary entry points; the
  primary entry point now only exports `MAESTRAL_VERSION`.
- Angular's default welcome page in the `docs` app. It hardcoded colors for a
  light background and was unreadable in dark mode; it was replaced with a
  page that uses the library's own tokens.

### Fixed

- Wrong stylesheet path in `angular.json` (`styles/styles.css` →
  `styles/maestral.css`) that broke the `docs` build.
