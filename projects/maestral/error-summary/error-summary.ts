import {
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import type { FieldTree } from '@angular/forms/signals';
import { MS_ERROR_MESSAGES, msResolveErrorMessage } from 'maestral/field';

interface MsErrorSummaryItem {
  readonly key: number;
  readonly message: string;
  readonly targetId: string | null;
  /** The element the field is bound to with `[formField]`, if any. */
  readonly element: HTMLElement | null;
}

let nextId = 0;

/**
 * Lists every invalid field after the user tries to submit a form, and
 * moves focus to the list so screen reader users hear about the problem
 * straight away. Each item links to its field.
 *
 * Place it at the top of the `<form>` it summarises:
 *
 * ```html
 * <form novalidate (submit)="onSubmit($event)">
 *   <ms-error-summary [form]="contactForm" />
 *   ...
 * </form>
 * ```
 */
@Component({
  selector: 'ms-error-summary',
  template: `
    @if (visible()) {
      <section
        #summary
        class="ms-error-summary"
        tabindex="-1"
        [attr.aria-labelledby]="titleId"
      >
        <h2 class="ms-error-summary__title" [id]="titleId">{{ title() }}</h2>
        <ul class="ms-error-summary__list">
          @for (item of items(); track item.key) {
            <li>
              @if (item.targetId) {
                <a
                  class="ms-error-summary__link"
                  [href]="'#' + item.targetId"
                  (click)="focusField($event, item)"
                  >{{ item.message }}</a
                >
              } @else {
                {{ item.message }}
              }
            </li>
          }
        </ul>
      </section>
    }
  `,
})
export class MsErrorSummary {
  /** The Signal Forms field tree of the form to summarise. */
  readonly form = input.required<FieldTree<unknown>>();
  readonly title = input('There is a problem');

  private readonly messages = inject(MS_ERROR_MESSAGES);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly titleId = `ms-error-summary-${nextId++}-title`;
  private readonly summary = viewChild<ElementRef<HTMLElement>>('summary');

  /** Becomes true on the first submit attempt. */
  private readonly attempted = signal(false);

  /** One item per invalid field, in form order, with that field's first error. */
  protected readonly items = computed<MsErrorSummaryItem[]>(() => {
    const errors = this.form()().errorSummary();
    const seen = new Set<unknown>();
    const items: MsErrorSummaryItem[] = [];
    for (const error of errors) {
      if (seen.has(error.fieldTree)) {
        continue;
      }
      seen.add(error.fieldTree);
      const element = error.fieldTree().formFieldBindings()[0]?.element ?? null;
      items.push({
        key: items.length,
        message: msResolveErrorMessage(error, this.messages),
        targetId: element?.id || null,
        element,
      });
    }
    return items;
  });

  protected readonly visible = computed(() => this.attempted() && this.items().length > 0);

  constructor() {
    afterNextRender(() => {
      const formElement = this.host.nativeElement.closest('form');
      if (!formElement) {
        return;
      }
      const onSubmit = () => this.onSubmitAttempt();
      formElement.addEventListener('submit', onSubmit);
      this.destroyRef.onDestroy(() => formElement.removeEventListener('submit', onSubmit));
    });
  }

  private onSubmitAttempt(): void {
    this.attempted.set(true);
    // Wait until the summary is rendered, then move focus to it.
    afterNextRender(() => this.summary()?.nativeElement.focus(), { injector: this.injector });
  }

  protected focusField(event: Event, item: MsErrorSummaryItem): void {
    const element = item.element;
    if (!element) {
      return;
    }
    event.preventDefault();
    // Scroll to the whole field so the label and hint are visible too.
    (element.closest('.ms-field') ?? element).scrollIntoView({ block: 'start' });
    element.focus({ preventScroll: true });
  }
}
