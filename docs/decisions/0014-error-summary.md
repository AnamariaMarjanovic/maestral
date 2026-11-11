# ADR-0014: Error summary

- **Status:** Accepted
- **Date:** 2026-11-08

## Context

Inline errors (ADR-0012, ADR-0013) tell users what is wrong with a field
once they reach it. After a failed submit, though, nothing tells them that
the form has problems or where they are. Sighted users may not see errors
below the fold; screen reader users hear nothing at all, because focus stays
on the submit button. WCAG 3.3.1 (Error Identification) and 2.4.3 (Focus
Order) are hard to meet with inline errors alone.

## Decision

- **`<ms-error-summary>`**, a component in its own entry point
  (`maestral/error-summary`), placed at the top of the form and given the
  Signal Forms field tree: `<ms-error-summary [form]="contactForm" />`.
- **Shown after a submit attempt.** It listens to the `submit` event of its
  closest `<form>`. Before the first attempt it renders nothing.
- **Focus moves to the summary** after every submit attempt with errors. It
  is a `<section>` labelled by its heading ("There is a problem", via the
  `title` input), so screen readers announce the heading and the list.
- **One item per invalid field**, in form order, with the same message the
  field shows (shared `MS_ERROR_MESSAGES` and `msResolveErrorMessage`).
- **Every item links to its field.** Activating a link scrolls the whole
  `<ms-field>` into view, so label and hint are visible, and focuses the
  control. The control is found through Signal Forms'
  `formFieldBindings()`, so no ids need to be passed around.
- **Live updates.** Items disappear as fields become valid; the summary
  hides when none are left.
- The pattern follows the GOV.UK Design System error summary, which has
  been tested extensively with users of assistive technology.

## Alternatives considered

- **`role="alert"` without moving focus.** Announces the problem but leaves
  keyboard users on the submit button, far from the first error.
- **Focus the first invalid field instead.** Common, but users do not learn
  how many problems there are, and screen reader users hear only one.
- **Read `error.formField` from the validation errors.** Tried first: in
  Angular 22 the errors returned by `errorSummary()` do not carry the bound
  directive, so links were missing. `formFieldBindings()` on the field state
  provides the element reliably.
- **Freeze the list until the next submit** (GOV.UK behaviour). Rejected for
  now: a live list confirms each fix and is simpler.

## Consequences

- A complete accessible form needs three things: `[formField]` on controls,
  `<ms-field>` around them and `<ms-error-summary>` at the top.
- Errors set through the `error` input of `<ms-field>` are not part of the
  form's validation state, so they do not appear in the summary. Server-side
  errors should be added to the form schema (for example with `validate()`
  or a submit action that returns errors) to be listed.
- Forms should use `novalidate` (see ADR-0013); otherwise browser validation
  can stop the `submit` event before the summary sees it.
