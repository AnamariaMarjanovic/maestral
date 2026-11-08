# ADR-0013: Validation errors from Signal Forms

- **Status:** Accepted
- **Date:** 2026-11-07

## Context

ADR-0012 introduced `<ms-field>` with an explicit `error` input. In real
forms the errors come from validation rules, and showing them at the wrong
moment is one of the most common form usability problems: an error that
appears while the user is still typing their email address is noise.

Signal Forms (`@angular/forms/signals`) are stable in Angular 22 and are the
recommended way to build new forms. A field bound with `[formField]` exposes
its state as signals, including `errors()`, `touched()` and `required()`.

## Decision

- **Zero extra wiring.** `msInput` injects the `FormField` directive from
  its own element (`inject(FormField, { self: true, optional: true })`). If
  the control is bound with `[formField]`, its state flows to `<ms-field>`
  automatically. No extra input on the field is needed.
- **Timing: after touch.** Errors are shown only once the field is touched,
  which Signal Forms does on blur and on `submit()`. Once shown, an error
  disappears as soon as the value becomes valid.
- **One message at a time.** The field shows the first error; fixing it may
  reveal the next one. Several messages under one control are hard to scan
  and to announce.
- **Message precedence:** the field's explicit `error` input, then the
  `message` set in the form schema, then the configured message for the
  error kind, then a generic fallback ("Check this field").
- **Configurable messages.** Defaults for built-in validators are in plain
  English and say what to do ("Enter at least 10 characters").
  `provideMsErrorMessages()` overrides or translates them per kind.
- **Required from the schema.** A `required()` rule shows the asterisk and
  sets `aria-required` without repeating `required` on the field.
- **`maestral/field` stays free of `@angular/forms`.** The field knows only
  the `MsFieldControl` interface and a minimal `MsValidationError` shape.
  The dependency on Signal Forms lives in `maestral/input`, and
  `@angular/forms` becomes a peer dependency.

## Alternatives considered

- **Pass the field state explicitly** (`<ms-field [state]="form.email">`).
  Rejected: repeats what `[formField]` already says and can drift out of
  sync with the bound control.
- **Show errors on every keystroke (dirty).** Rejected for the reason above.
- **Show all errors of a field.** Rejected: harder to read and to announce.
- **Support Reactive Forms (`NgControl`) now.** Postponed: Signal Forms are
  the recommended API for new forms. Reactive Forms can be added later by
  reading `NgControl` the same way, without changing `<ms-field>`.

## Consequences

- A Signal Forms form needs only `[formField]` on the control; label, hint,
  error, `aria-invalid`, `aria-required` and `aria-describedby` follow.
- Signal Forms set the native `required` attribute on bound elements. Forms
  should use `novalidate` so browser validation bubbles do not compete with
  Maestral's messages; the docs examples do.
- Focus is not moved to the first invalid field on submit yet. That is the
  job of the error summary, the next form component.
