import {
  Component,
  Signal,
  booleanAttribute,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { MS_ERROR_MESSAGES, MsValidationError, msResolveErrorMessage } from './error-messages';

/** A control that can be placed inside `<ms-field>`, such as `MsInput`. */
export interface MsFieldControl {
  /** The control's effective id, used for the label's `for` attribute. */
  readonly id: Signal<string>;
  /**
   * Validation errors the field should show now. The control decides the
   * timing (for example only after the user has left the field).
   */
  readonly errors?: Signal<readonly MsValidationError[]>;
  /** Whether the control's validation rules make it required. */
  readonly required?: Signal<boolean>;
}

let nextId = 0;

/**
 * Wraps a form control with its label, hint and error message, and wires
 * up the ids and ARIA attributes between them.
 *
 * Order follows proven public-sector patterns: label, hint, error, control,
 * so screen readers and sighted users meet them in the same order.
 *
 * The error comes from the `error` input when set, otherwise from the first
 * validation error the control reports (see `MsFieldControl.errors`).
 */
@Component({
  selector: 'ms-field',
  host: {
    class: 'ms-field',
    '[attr.data-invalid]': 'invalid() ? "" : null',
  },
  template: `
    <label class="ms-field__label" [attr.for]="controlId()">
      {{ label() }}
      @if (isRequired()) {
        <span class="ms-field__required" aria-hidden="true">*</span>
      }
    </label>
    @if (hint()) {
      <p class="ms-field__hint" [id]="hintId">{{ hint() }}</p>
    }
    @if (errorMessage(); as message) {
      <p class="ms-field__error" [id]="errorId">
        <span class="ms-visually-hidden">Error: </span>{{ message }}
      </p>
    }
    <ng-content />
  `,
})
export class MsField {
  readonly label = input.required<string>();
  readonly hint = input<string>();
  /** Explicit error message. Takes precedence over validation errors. */
  readonly error = input<string>();
  /** Marks the field as required even without a `required` validator. */
  readonly required = input(false, { transform: booleanAttribute });

  private readonly messages = inject(MS_ERROR_MESSAGES);

  private readonly baseId = `ms-field-${nextId++}`;
  readonly hintId = `${this.baseId}-hint`;
  readonly errorId = `${this.baseId}-error`;
  /** Id a control should use when it has no id of its own. */
  readonly fallbackControlId = `${this.baseId}-control`;

  private readonly control = signal<MsFieldControl | null>(null);

  readonly controlId = computed(() => this.control()?.id() ?? this.fallbackControlId);

  readonly isRequired = computed(() => this.required() || !!this.control()?.required?.());

  /** One message at a time: the first error is the one to fix first. */
  readonly errorMessage = computed(() => {
    const explicit = this.error();
    if (explicit) {
      return explicit;
    }
    const [first] = this.control()?.errors?.() ?? [];
    return first ? msResolveErrorMessage(first, this.messages) : null;
  });

  readonly invalid = computed(() => this.errorMessage() !== null);

  readonly describedBy = computed(() => {
    const ids = [this.hint() ? this.hintId : null, this.invalid() ? this.errorId : null].filter(
      (id): id is string => id !== null,
    );
    return ids.length ? ids.join(' ') : null;
  });

  /** Called by a control inside the field to connect itself. */
  registerControl(control: MsFieldControl): void {
    this.control.set(control);
  }
}
