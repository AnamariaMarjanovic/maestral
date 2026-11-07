# ADR-0002: Native elements and attribute directives

- **Status:** Accepted
- **Date:** 2026-10-31

## Context

Many libraries wrap native elements in their own components, for example
`<lib-button>` rendering a `<button>` inside. The wrapper then has to forward
`type`, `disabled`, `aria-*` attributes, form participation, focus and events.
Every forwarding gap becomes an accessibility or integration bug.

## Decision

Components that correspond to a native element are **attribute directives on
that element**: `<button msButton>`, `<input msInput>`, `<a msButton>`.
The directive adds a class and data attributes; behavior and semantics stay
native. Selectors are restricted to the elements that make sense
(`button[msButton], a[msButton]`), so `<div msButton>` fails at compile time.

Real components (`<ms-field>`, `<ms-error-summary>`) are used only where no
native element exists for the job.

## Alternatives considered

- **Wrapper components.** Rejected: duplicate the browser's work and leak
  attributes.
- **Unrestricted attribute selectors (`[msButton]`).** Rejected: would allow
  non-interactive elements to look like buttons without being buttons.

## Consequences

- Keyboard support, form submission, `disabled` and screen reader roles work
  without extra code.
- Developers keep full control of the element (attributes, events, `type`).
- A native `<button>` inside a `<form>` defaults to `type="submit"`. Maestral
  keeps that native behavior and documents it instead of overriding it.
- Directives cannot carry component styles, which fits ADR-0003.
