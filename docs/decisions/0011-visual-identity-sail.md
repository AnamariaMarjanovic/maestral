# ADR-0011: Visual identity: the sail

- **Status:** Accepted
- **Date:** 2026-11-03

## Context

The first token set used a sea-teal primary color with evenly rounded
corners. In the docs app it read as too close to other recent token-based
libraries: a palette alone does not make a library recognizable, and evenly
rounded buttons are the default almost everywhere.

The library is named after the maestral, the steady Adriatic summer wind that
fills sails. The identity should tell the same story as the name.

## Decision

- **Signature shape: the sail.** Controls round three corners with
  `--ms-radius-sail` and keep one corner sharp with `--ms-radius-tack`. The
  sharp corner sits at the bottom inline-start, named after the tack, the
  lower front corner of a sail. It uses the logical property
  `border-end-start-radius`, so it mirrors in right-to-left layouts.
- **Palette: Adriatic indigo** (hue 268) as primary, cool slate neutrals
  (hue 260) and a red danger color. Teal primitives were removed.
- Every semantic text/background pair was recomputed and passes WCAG 2.2 AA
  in both color schemes, with the lowest pair at 6.57:1.
- The general radius scale (`--ms-radius-sm` … `--ms-radius-full`) remains
  for surfaces such as cards; the sail applies to interactive controls.

## Alternatives considered

- **"Stone and sea"**: warm limestone neutrals, deep blue and terracotta,
  small radius with an inset bottom shadow. Distinctive in color, but the
  shape stays conventional.
- **"Pine"**: deep green, cream and sunset orange with pill-shaped controls.
  The warmest option, but pill buttons are common and the story is weaker.
- **Keep teal and change only the color.** Rejected: another palette is easy
  to copy; a signature shape is what makes a screenshot recognizable.

## Consequences

- The shape is pure tokens, so the theme generator can offer presets such as
  sail, rounded, square and pill by changing two values. No component code is
  involved.
- Every new interactive control (input, select, checkbox) must use the sail
  tokens to keep the identity consistent.
- The focus outline follows `border-radius`, so focus rings keep the sail
  shape without extra work.
- Supersedes nothing; ADR-0004 (token architecture) is unchanged. Only token
  values changed.
