import { Signal, computed } from '@angular/core';
import { MsValidationError } from './error-messages';

/**
 * The parts of a Signal Forms field state that Maestral reads. Typed
 * structurally, so this entry point does not depend on `@angular/forms`.
 */
export interface MsFormFieldStateLike {
  touched(): boolean;
  errors(): readonly MsValidationError[];
  required(): boolean;
}

/**
 * Errors to show for a field: none until the field is touched (on blur or
 * submit), so nobody is told they made a mistake while still typing.
 */
export function msVisibleErrors(
  state: () => MsFormFieldStateLike | undefined,
): Signal<readonly MsValidationError[]> {
  return computed(() => {
    const current = state();
    return current?.touched() ? current.errors() : [];
  });
}

/** Whether the field's validation rules make it required. */
export function msValidationRequired(state: () => MsFormFieldStateLike | undefined): Signal<boolean> {
  return computed(() => !!state()?.required());
}
