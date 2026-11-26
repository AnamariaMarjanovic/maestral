import { DestroyRef, Directive, OnInit, computed, inject, input } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { MsFieldset, msValidationRequired, msVisibleErrors } from 'maestral/field';

/**
 * A label that sits beside its checkbox or radio button. Wrapping the control
 * makes the whole text clickable and gives the control its accessible name.
 *
 * ```html
 * <label msChoice>
 *   <input type="checkbox" msCheckbox [formField]="form.newsletter" />
 *   Send me the newsletter
 * </label>
 * ```
 */
@Directive({
  selector: 'label[msChoice]',
  host: { class: 'ms-choice' },
})
export class MsChoice {}

let nextId = 0;

/**
 * Shared behaviour of checkboxes and radio buttons: inside `<ms-fieldset>`
 * they report their Signal Forms validation state to the group and take the
 * group's invalid state.
 */
@Directive()
abstract class MsChoiceControl implements OnInit {
  /**
   * Optional custom id. When omitted, one is generated, so the error summary
   * can always link to the control.
   */
  readonly id = input<string>();
  private readonly generatedId = `ms-choice-${nextId++}`;
  protected readonly effectiveId = computed(() => this.id() ?? this.generatedId);

  private readonly fieldset = inject(MsFieldset, { optional: true });
  private readonly formField = inject(FormField, { self: true, optional: true });
  private readonly destroyRef = inject(DestroyRef);

  protected readonly invalid = computed(() => !!this.fieldset?.invalid());

  // Connect in ngOnInit, not the constructor: by then Angular has set the
  // [formField] input on this element, so the group can read its state.
  ngOnInit(): void {
    const state = () => this.formField?.state();
    const disconnect = this.fieldset?.registerControl({
      errors: msVisibleErrors(state),
      required: msValidationRequired(state),
    });
    if (disconnect) {
      this.destroyRef.onDestroy(disconnect);
    }
  }
}

/** Styles a native checkbox. */
@Directive({
  selector: 'input[type=checkbox][msCheckbox]',
  host: {
    class: 'ms-checkbox',
    '[id]': 'effectiveId()',
    '[attr.aria-invalid]': 'invalid() ? "true" : null',
  },
})
export class MsCheckbox extends MsChoiceControl {}

/** Styles a native radio button. Group radio buttons in `<ms-fieldset>`. */
@Directive({
  selector: 'input[type=radio][msRadio]',
  host: {
    class: 'ms-radio',
    '[id]': 'effectiveId()',
    '[attr.aria-invalid]': 'invalid() ? "true" : null',
  },
})
export class MsRadio extends MsChoiceControl {}
