# ADR-0020: Theme builder

- **Status:** Accepted
- **Date:** 2026-11-26

## Context

Theming as a product is the second half of Maestral's focus (ADR-0001).
Tokens (ADR-0004) make theming possible, but choosing a brand color that
works everywhere is hard: it carries white text in light mode, is itself
text on the page and on subtle backgrounds, and needs a different shade for
dark mode. Most people pick a color they like and discover the contrast
problems later.

## Decision

- A **theme builder page** in the docs site (`/theme`). It is part of the
  docs app, not the npm package, so it needs no library release.
- **Inputs:** a primary color (hex text field and native color picker bound
  to the same Signal Forms field), shape (sail, rounded, square, pill) and
  density (control height). The form is built from Maestral's own
  components.
- **Palette from one color in OKLCH.** Light mode keeps the chosen color and
  darkens it only as far as needed for 4.5:1 against white text, the white
  page and the subtle hover background. Dark mode starts from Maestral's own
  dark lightness (76%, chroma capped at 0.11) and lightens until it reaches
  4.5:1 against the dark page and its subtle background. Hover and subtle
  shades follow the same hue.
- **Honest about changes.** When the light-mode color had to be darkened,
  the page shows both colors and says why. Ten contrast checks are listed
  with their ratios and minimums, as text, not color alone.
- **Live preview** of buttons, a field with an error, a select, a checkbox
  and a radio in a light and a dark pane side by side. Each pane sets
  `data-ms-theme` and the generated tokens, so `light-dark()` resolves per
  pane.
- **Export** as a `:root` block that overrides semantic tokens only, to be
  added after `maestral.css`.
- **Color math is implemented in the docs app** (`shared/color.ts`, about
  120 lines): sRGB and OKLCH conversion, gamut mapping by reducing chroma,
  and WCAG contrast. It was checked against the culori library to three
  decimals, and a test builds themes for 48 colors across hues and
  lightnesses and asserts that every check passes.

## Alternatives considered

- **A color library dependency** (culori, colorjs.io). Reliable, but adds a
  dependency for a few functions that are well defined and now tested.
- **Fail instead of adjusting.** Showing a red "Fail" without a fix leaves
  users to guess a shade. Adjusting to the nearest passing lightness keeps
  the hue they chose.
- **Exposing every token.** More control, but most themes need only the
  primary color, shape and density; the rest of the palette is neutral by
  design.

## Consequences

- The builder found a bug on its first use: checkboxes became circles in
  pill themes. Their radius is now capped in the library.
- Generated colors depend on Maestral's neutral palette (white page, dark
  page). If the neutrals change, the builder's constants must change with
  them.
