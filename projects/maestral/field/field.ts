import { Component, Signal, booleanAttribute, computed, input, signal } from '@angular/core';

/** A control that can be placed inside `<ms-field>`, such as `MsInput`. */
export interface MsFieldControl {
  /** The control's effective id, used for the label's `for` attribute. */
  readonly id: Signal<string>;
}

let nextId = 0;

/**
 * Wraps a form control with its label, hint and error message, and wires
 * up the ids and ARIA attributes between them.
 *
 * Order follows proven public-sector patterns: label, hint, error, control,
 * so screen readers and sighted users meet them in the same order.
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
      @if (required()) {
        <span class="ms-field__required" aria-hidden="true">*</span>
      }
    </label>
    @if (hint()) {
      <p class="ms-field__hint" [id]="hintId">{{ hint() }}</p>
    }
    @if (error()) {
      <p class="ms-field__error" [id]="errorId">
        <span class="ms-visually-hidden">Error: </span>{{ error() }}
      </p>
    }
    <ng-content />
  `,
})
export class MsField {
  readonly label = input.required<string>();
  readonly hint = input<string>();
  readonly error = input<string>();
  readonly required = input(false, { transform: booleanAttribute });

  private readonly baseId = `ms-field-${nextId++}`;
  readonly hintId = `${this.baseId}-hint`;
  readonly errorId = `${this.baseId}-error`;
  /** Id a control should use when it has no id of its own. */
  readonly fallbackControlId = `${this.baseId}-control`;

  private readonly control = signal<MsFieldControl | null>(null);

  readonly controlId = computed(() => this.control()?.id() ?? this.fallbackControlId);
  readonly invalid = computed(() => !!this.error());
  readonly describedBy = computed(() => {
    const ids = [this.hint() ? this.hintId : null, this.error() ? this.errorId : null].filter(
      (id): id is string => id !== null,
    );
    return ids.length ? ids.join(' ') : null;
  });

  /** Called by a control inside the field to connect itself. */
  registerControl(control: MsFieldControl): void {
    this.control.set(control);
  }
}
