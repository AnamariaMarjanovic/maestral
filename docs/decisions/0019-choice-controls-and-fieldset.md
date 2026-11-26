# ADR-0019: Select, checkbox, radio and fieldset

- **Status:** Accepted
- **Date:** 2026-11-25

## Context

Forms are Maestral's core (ADR-0001), but until now only text inputs and text
areas were supported. Real forms also need a select, checkboxes, radio
buttons and a way to group related controls with one question.

## Decision

- **Select through `msInput`.** `select[msInput]` gets the same sail shape,
  label wiring and validation as text inputs. The chevron is drawn with two
  gradients in `--ms-color-text-muted`, so it follows the theme; it mirrors in
  right-to-left layouts and falls back to the system arrow in forced-colors
  mode. A separate `msSelect` directive was not needed: the behaviour is
  identical.
- **`maestral/choice`** holds `msCheckbox`, `msRadio` and `msChoice` (the
  label beside the control). They are one entry point because they share
  their label pattern, styles and behaviour.
- **Native controls, custom look.** `appearance: none` with a `::before`
  mark: the checkbox is a small sail (half the control radii), the radio is
  round with a dot. Space, arrow keys and form submission stay native. In
  forced-colors mode the system controls come back.
- **`<ms-fieldset>`** in `maestral/field` renders a native `<fieldset>` and
  `<legend>` with the same hint, error and required marker as `<ms-field>`.
  Its `aria-describedby` points at the hint and error, so they are announced
  when focus enters the group. The group shows one error: the first one any
  of its controls reports.
- **Generated ids for every checkbox and radio**, so the error summary can
  link to a group (it targets the first option) and scroll the whole fieldset
  into view.
- **Controls connect to their field or fieldset in `ngOnInit`**, not in the
  constructor. Reading Signal Forms state before Angular has set
  `[formField]` throws `NG0950`; the group reads every connected control, so
  a control connected too early broke its siblings. Tests caught this.
- **Shared helpers** `msVisibleErrors()` and `msValidationRequired()` in
  `maestral/field` hold the "errors after touch" rule for every control. They
  type Signal Forms state structurally, so `maestral/field` still does not
  depend on `@angular/forms`.

## Alternatives considered

- **`accent-color` on unstyled native controls.** Simplest and very robust,
  but the controls would not match the sail identity or sizing.
- **Custom elements with `role="checkbox"` / `role="radio"`.** Rejected by
  ADR-0002: re-implementing keyboard and form behaviour.
- **Separate `maestral/checkbox` and `maestral/radio` entry points.** Would
  split one small, shared implementation in two.
- **One error per checkbox or radio.** Rejected: the group answers one
  question, so it gets one message.

## Consequences

- A required single checkbox ("I agree") works with `required()`, because
  Signal Forms treat `false` as empty; it needs a fieldset to show its error.
- Checkbox groups bind one boolean per option; a rule across the group (for
  example "choose at least one") needs a custom validator on the parent.
