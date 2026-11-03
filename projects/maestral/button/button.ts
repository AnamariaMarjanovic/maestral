import { Directive, input } from '@angular/core';

export type MsButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type MsButtonSize = 'sm' | 'md' | 'lg';

@Directive({
  selector: 'button[msButton], a[msButton]',
  host: {
    class: 'ms-button',
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
  },
})
export class MsButton {
  readonly variant = input<MsButtonVariant>('primary');
  readonly size = input<MsButtonSize>('md');
}