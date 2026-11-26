import { Component, Signal, booleanAttribute, computed, inject, input, signal } from '@angular/core';
import { MS_ERROR_MESSAGES, MsValidationError, msResolveErrorMessage } from './error-messages';

/** A control inside `<ms-fieldset>`, such as `MsRadio` or `MsCheckbox`. */
export interface MsFieldsetControl {
  /** Validation errors the group should show now. */
  readonly errors?: Signal<readonly MsValidationError[]>;
  /** Whether the control's validation rules make it required. */
  readonly required?: Signal<boolean>;
}

let nextId = 0;

/**
 * Groups related controls, such as radio buttons or checkboxes, under one
 * legend, with an optional hint and error message. Screen readers announce
 * the legend when entering the group.
 *
 * The error comes from the `error` input when set, otherwise from the first
 * validation error any control in the group reports.
 */
@Component({
  selector: 'ms-fieldset',
  host: {
    class: 'ms-fieldset',
    '[attr.data-invalid]': 'invalid() ? "" : null',
  },
  template: `
    <fieldset class="ms-fieldset__group" [attr.aria-describedby]="describedBy()">
      <legend class="ms-fieldset__legend">
        {{ legend() }}
        @if (isRequired()) {
          <span class="ms-field__required" aria-hidden="true">*</span>
        }
      </legend>
      @if (hint()) {
        <p class="ms-field__hint" [id]="hintId">{{ hint() }}</p>
      }
      @if (errorMessage(); as message) {
        <p class="ms-field__error" [id]="errorId">
          <span class="ms-visually-hidden">Error: </span>{{ message }}
        </p>
      }
      <div class="ms-fieldset__options">
        <ng-content />
      </div>
    </fieldset>
  `,
})
export class MsFieldset {
  readonly legend = input.required<string>();
  readonly hint = input<string>();
  /** Explicit error message. Takes precedence over validation errors. */
  readonly error = input<string>();
  /** Marks the group as required even without a `required` validator. */
  readonly required = input(false, { transform: booleanAttribute });

  private readonly messages = inject(MS_ERROR_MESSAGES);

  private readonly baseId = `ms-fieldset-${nextId++}`;
  readonly hintId = `${this.baseId}-hint`;
  readonly errorId = `${this.baseId}-error`;

  private readonly controls = signal<readonly MsFieldsetControl[]>([]);

  readonly isRequired = computed(
    () => this.required() || this.controls().some((control) => control.required?.()),
  );

  /** One message for the whole group: the first error any control reports. */
  readonly errorMessage = computed(() => {
    const explicit = this.error();
    if (explicit) {
      return explicit;
    }
    for (const control of this.controls()) {
      const [first] = control.errors?.() ?? [];
      if (first) {
        return msResolveErrorMessage(first, this.messages);
      }
    }
    return null;
  });

  readonly invalid = computed(() => this.errorMessage() !== null);

  readonly describedBy = computed(() => {
    const ids = [this.hint() ? this.hintId : null, this.invalid() ? this.errorId : null].filter(
      (id): id is string => id !== null,
    );
    return ids.length ? ids.join(' ') : null;
  });

  /** Called by a control inside the group. Returns a function that disconnects it. */
  registerControl(control: MsFieldsetControl): () => void {
    this.controls.update((controls) => [...controls, control]);
    return () => this.controls.update((controls) => controls.filter((item) => item !== control));
  }
}
