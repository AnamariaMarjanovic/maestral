import { Directive, OnInit, computed, inject, input } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { MsField, msValidationRequired, msVisibleErrors } from 'maestral/field';

let nextId = 0;

/**
 * Styles a native `<input>`, `<textarea>` or `<select>`.
 *
 * Inside `<ms-field>` it takes its id, `aria-describedby`, `aria-invalid` and
 * `aria-required` from the field. When the element is also bound to a Signal
 * Forms field (`[formField]`), it reports that field's validation state to
 * `<ms-field>`, which then shows the matching error message.
 */
@Directive({
  selector: 'input[msInput], textarea[msInput], select[msInput]',
  host: {
    class: 'ms-input',
    '[id]': 'effectiveId()',
    '[attr.aria-describedby]': 'field?.describedBy() ?? null',
    '[attr.aria-invalid]': 'field?.invalid() ? "true" : null',
    '[attr.aria-required]': 'field?.isRequired() ? "true" : null',
  },
})
export class MsInput implements OnInit {
  /** Optional custom id. When omitted, an id is generated. */
  readonly id = input<string>();

  protected readonly field = inject(MsField, { optional: true });
  private readonly formField = inject(FormField, { self: true, optional: true });

  private readonly generatedId = this.field?.fallbackControlId ?? `ms-input-${nextId++}`;
  readonly effectiveId = computed(() => this.id() ?? this.generatedId);

  // Connect in ngOnInit, not the constructor: by then Angular has set the
  // [formField] input on this element, so the field can read its state.
  ngOnInit(): void {
    const state = () => this.formField?.state();
    this.field?.registerControl({
      id: this.effectiveId,
      errors: msVisibleErrors(state),
      required: msValidationRequired(state),
    });
  }
}
