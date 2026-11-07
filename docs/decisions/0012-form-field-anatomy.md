# ADR-0012: Form field anatomy and wiring

- **Status:** Accepted
- **Date:** 2026-11-04

## Context

Forms are Maestral's core story (ADR-0001). In most apps, every field repeats
the same wiring by hand: a label with `for`, a hint and an error with ids,
`aria-describedby` pointing at them, `aria-invalid` when there is an error.
It is tedious and easy to get wrong, and the mistakes are invisible to
sighted developers.

## Decision

- **`<ms-field>`** is a real component (no native element does this job,
  see ADR-0002). It renders the label, hint and error and projects the
  control. It lives in its own entry point, `maestral/field`.
- **`msInput`** is an attribute directive on native `<input>` and
  `<textarea>`, in `maestral/input`. Inside a field it injects `MsField` and
  takes its `id`, `aria-describedby`, `aria-invalid` and `aria-required`
  from it. Outside a field it only styles the element.
- **Order: label, hint, error, control.** Hint and error sit above the
  control, as in the GOV.UK Design System, so they are read before the
  control receives focus and are not hidden by browser autofill popups or
  the on-screen keyboard.
- **Ids are generated** per field. A control may keep its own `id`; it
  registers it with the field so the label's `for` always matches.
- **Errors are announced as errors**: the message carries a visually hidden
  "Error:" prefix, so screen readers do not rely on its red color.
- **Invalid state is never color alone**: the control border also gets
  thicker, and a text message is shown.
- **Required fields** get `aria-required="true"` and a decorative asterisk
  hidden from screen readers. The native `required` attribute is left to the
  developer, because it triggers browser validation bubbles that conflict
  with the field's own error messages.
- **Control boundary token.** Form controls use a new semantic token,
  `--ms-color-border-control`, which meets the 3:1 non-text contrast minimum
  (WCAG 1.4.11): 4.65:1 in light and 3.24:1 in dark mode. The existing
  `--ms-color-border` (1.29:1) stays for decorative borders.
- In this first version the error message is passed explicitly through the
  `error` input. Automatic errors from Angular forms come in a later step.

## Alternatives considered

- **Error below the control.** The most common pattern, but the message can
  end up under autofill popups and the on-screen keyboard, and is read after
  the control.
- **`<ms-input>` wrapper that renders label and input together.** Rejected:
  hides the native element (ADR-0002) and makes custom controls impossible.
- **Native `required` attribute.** Rejected for the reason above.
- **The field finds its control with `contentChild(MsInput)`.** Rejected:
  `maestral/field` would depend on `maestral/input` while the input already
  depends on the field, creating a cycle between entry points. Controls
  register themselves through the `MsFieldControl` interface instead, so new
  control types (select, checkbox) can join without changing the field.

## Consequences

- One `<ms-field>` replaces all manual id and ARIA wiring.
- `maestral/input` depends on `maestral/field`; the field depends on nothing.
- `msInput` currently overwrites any `aria-describedby` set by the developer
  on a control inside a field. Merging both values is a known follow-up.
- Generated ids use a module-level counter, which is stable as long as
  server and client render fields in the same order.
