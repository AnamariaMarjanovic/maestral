# ADR-0021: Dialog on the native element

- **Status:** Accepted
- **Date:** 2026-11-26

## Context

Modal dialogs are where accessible behaviour is most often broken: focus
escapes to the page behind, Escape does nothing, screen readers read the
whole page, focus is lost when the dialog closes. Libraries have spent years
re-implementing focus traps and `aria-modal` handling.

All evergreen browsers now support `<dialog>` with `showModal()`, which puts
the dialog in the top layer, makes the rest of the page inert, closes it on
Escape and moves focus into it.

## Decision

- **`dialog[msDialog]`**, an attribute directive on the native element
  (ADR-0002), in its own entry point `maestral/dialog`.
- **What the browser does, the browser keeps doing:** modality, inertness,
  Escape and initial focus (the first focusable element, or the one with
  `autofocus`).
- **What Maestral adds:**
  - `[(open)]` two-way binding, kept in sync when the browser closes the
    dialog (Escape) or the user clicks the backdrop;
  - `msDialogClose="value"` on buttons and a `(closed)` output carrying that
    value, so a confirmation dialog reports what was chosen;
  - closing on a backdrop click (`closeOnBackdrop`, on by default), detected
    as a click on the dialog element outside its box;
  - an accessible name from `msDialogTitle` through `aria-labelledby`;
  - returning focus to the element that opened the dialog, explicitly,
    because browser support for restoring focus has been uneven;
  - no page scrolling while a dialog is open (`html:has(.ms-dialog[open])`)
    and an opening animation with `@starting-style` that follows the motion
    tokens, so reduced motion turns it off.
- **New tokens:** `--ms-color-backdrop` and `--ms-shadow-overlay`, both with
  light and dark values.
- `msDialogClose` buttons get `type="button"`, so a close button inside a
  form never submits it.

## Alternatives considered

- **A dialog service that renders components** (like CDK Dialog). Powerful,
  but hides the element, needs portals and injectors, and is a much larger
  API. Declarative markup covers confirmations and form dialogs.
- **A hand-written focus trap with `aria-modal`.** What libraries did before
  `showModal()`; more code and more ways to get it wrong.
- **`<form method="dialog">` for closing buttons.** Native and works, but
  conflicts with forms inside the dialog that submit to the app.
- **`closedby="any"` for backdrop clicks.** The emerging native attribute;
  not yet available in every browser Maestral supports. Can replace the
  click handler later.

## Consequences

- Tests in jsdom use a small stand-in for the `<dialog>` API (jsdom does not
  implement it), the same approach as `scrollIntoView` (ADR-0015). Inertness,
  Escape, backdrop clicks and focus were checked in a real browser, with axe,
  in both color schemes.
- Building the docs page surfaced a bug in `<ms-error-summary>`: it stayed
  visible after the form was reset. It now shows only while the form is
  touched.
- It also surfaced, for the second time after link colors, that broad
  unlayered styles in an app (`.docs-page h2 { … }`) override Maestral's
  component styles, by design (ADR-0003). The docs now scope such rules to
  elements without a class, and the package README tells users to do the
  same.
