import { Directive, computed, inject, input } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { MsField } from 'maestral/field';

let nextId = 0;

/**
 * Styles a native `<input>` or `<textarea>`.
 *
 * Inside `<ms-field>` it takes its id, `aria-describedby`, `aria-invalid` and
 * `aria-required` from the field. When the element is also bound to a Signal
 * Forms field (`[formField]`), it reports that field's validation state to
 * `<ms-field>`, which then shows the matching error message.
 */
@Directive({
  selector: 'input[msInput], textarea[msInput]',
  host: {
    class: 'ms-input',
    '[id]': 'effectiveId()',
    '[attr.aria-describedby]': 'field?.describedBy() ?? null',
    '[attr.aria-invalid]': 'field?.invalid() ? "true" : null',
    '[attr.aria-required]': 'field?.isRequired() ? "true" : null',
  },
})
export class MsInput {
  /** Optional custom id. When omitted, an id is generated. */
  readonly id = input<string>();

  protected readonly field = inject(MsField, { optional: true });
  private readonly formField = inject(FormField, { self: true, optional: true });

  private readonly generatedId = this.field?.fallbackControlId ?? `ms-input-${nextId++}`;
  readonly effectiveId = computed(() => this.id() ?? this.generatedId);

  /**
   * Errors are shown only once the field is touched, which happens when the
   * user leaves it or when the form is submitted. Nobody is told they made a
   * mistake while they are still typing.
   */
  private readonly visibleErrors = computed(() => {
    const state = this.formField?.state();
    return state?.touched() ? state.errors() : [];
  });

  private readonly validationRequired = computed(() => !!this.formField?.state().required());

  constructor() {
    this.field?.registerControl({
      id: this.effectiveId,
      errors: this.visibleErrors,
      required: this.validationRequired,
    });
  }
}
