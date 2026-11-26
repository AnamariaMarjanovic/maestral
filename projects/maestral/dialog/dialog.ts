import {
  DOCUMENT,
  Directive,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';

let nextId = 0;

/**
 * A modal dialog on the native `<dialog>` element.
 *
 * The browser provides the hard parts once the dialog is shown with
 * `showModal()`: the rest of the page becomes inert, Escape closes the
 * dialog, and it sits above everything else. Maestral adds two-way binding,
 * a closing value, closing by clicking the backdrop, an accessible name from
 * the title, and returning focus to the element that opened it.
 *
 * ```html
 * <button msButton (click)="open.set(true)">Delete project</button>
 *
 * <dialog msDialog [(open)]="open" (closed)="onClosed($event)">
 *   <h2 msDialogTitle>Delete this project?</h2>
 *   <p>This cannot be undone.</p>
 *   <div msDialogActions>
 *     <button msButton variant="secondary" msDialogClose autofocus>Cancel</button>
 *     <button msButton variant="danger" msDialogClose="delete">Delete</button>
 *   </div>
 * </dialog>
 * ```
 */
@Directive({
  selector: 'dialog[msDialog]',
  exportAs: 'msDialog',
  host: {
    class: 'ms-dialog',
    '[attr.aria-labelledby]': 'labelledBy()',
    '(close)': 'onNativeClose()',
    '(click)': 'onClick($event)',
  },
})
export class MsDialog {
  /** Whether the dialog is open. Bind with `[(open)]`. */
  readonly open = model(false);
  /** Close when the user clicks outside the dialog box. */
  readonly closeOnBackdrop = input(true);
  /**
   * Emits when the dialog closes, with the value of the `msDialogClose`
   * button that closed it, or an empty string (Escape, backdrop, `open` set
   * to false).
   */
  readonly closed = output<string>();

  private readonly element = inject<ElementRef<HTMLDialogElement>>(ElementRef).nativeElement;
  private readonly document = inject(DOCUMENT);

  private readonly titleId = signal<string | null>(null);
  protected readonly labelledBy = computed(() => this.titleId());

  /** The element that had focus when the dialog opened. */
  private returnFocusTo: HTMLElement | null = null;
  private pendingValue = '';

  constructor() {
    effect(() => {
      const open = this.open();
      const dialog = this.element;
      if (open && !dialog.open) {
        this.returnFocusTo = this.document.activeElement as HTMLElement | null;
        dialog.showModal();
      } else if (!open && dialog.open) {
        dialog.close(this.pendingValue);
      }
    });
  }

  /** Closes the dialog with an optional value, which `closed` emits. */
  close(value = ''): void {
    this.pendingValue = value;
    if (this.element.open) {
      this.element.close(value);
    } else {
      this.open.set(false);
    }
  }

  /** Called by `msDialogTitle` to name the dialog. */
  registerTitle(id: string): void {
    this.titleId.set(id);
  }

  protected onNativeClose(): void {
    const value = this.element.returnValue || this.pendingValue;
    this.pendingValue = '';
    this.element.returnValue = '';
    this.open.set(false);
    this.closed.emit(value);
    // Browsers increasingly restore focus themselves; do it explicitly so
    // keyboard users always land back on the control that opened the dialog.
    const target = this.returnFocusTo;
    this.returnFocusTo = null;
    if (target?.isConnected && typeof target.focus === 'function') {
      target.focus();
    }
  }

  protected onClick(event: MouseEvent): void {
    // A click on the backdrop targets the dialog itself, outside its box.
    if (!this.closeOnBackdrop() || event.target !== this.element) {
      return;
    }
    const box = this.element.getBoundingClientRect();
    const outside =
      event.clientX < box.left ||
      event.clientX > box.right ||
      event.clientY < box.top ||
      event.clientY > box.bottom;
    if (outside) {
      this.close();
    }
  }
}

/** The dialog's heading. It gives the dialog its accessible name. */
@Directive({
  selector: '[msDialogTitle]',
  host: {
    class: 'ms-dialog__title',
    '[id]': 'id',
  },
})
export class MsDialogTitle {
  protected readonly id = `ms-dialog-title-${nextId++}`;

  constructor() {
    inject(MsDialog).registerTitle(this.id);
  }
}

/** A row of buttons at the end of the dialog. */
@Directive({
  selector: '[msDialogActions]',
  host: { class: 'ms-dialog__actions' },
})
export class MsDialogActions {}

/**
 * Closes the surrounding dialog when clicked. The attribute value becomes
 * the value that `closed` emits: `<button msDialogClose="delete">`.
 */
@Directive({
  selector: 'button[msDialogClose]',
  host: {
    type: 'button',
    '(click)': 'dialog.close(msDialogClose())',
  },
})
export class MsDialogClose {
  readonly msDialogClose = input('');
  protected readonly dialog = inject(MsDialog);
}
