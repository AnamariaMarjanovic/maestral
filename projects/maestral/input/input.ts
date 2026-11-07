import { Directive, computed, inject, input } from '@angular/core';
import { MsField } from 'maestral/field';

let nextId = 0;

/**
 * Styles a native `<input>` or `<textarea>`. Inside `<ms-field>` it takes
 * its id, `aria-describedby`, `aria-invalid` and `aria-required` from the
 * field, so the label, hint and error are connected automatically.
 */
@Directive({
  selector: 'input[msInput], textarea[msInput]',
  host: {
    class: 'ms-input',
    '[id]': 'effectiveId()',
    '[attr.aria-describedby]': 'field?.describedBy() ?? null',
    '[attr.aria-invalid]': 'field?.invalid() ? "true" : null',
    '[attr.aria-required]': 'field?.required() ? "true" : null',
  },
})
export class MsInput {
  /** Optional custom id. When omitted, an id is generated. */
  readonly id = input<string>();

  protected readonly field = inject(MsField, { optional: true });

  private readonly generatedId = this.field?.fallbackControlId ?? `ms-input-${nextId++}`;
  readonly effectiveId = computed(() => this.id() ?? this.generatedId);

  constructor() {
    this.field?.registerControl({ id: this.effectiveId });
  }
}
