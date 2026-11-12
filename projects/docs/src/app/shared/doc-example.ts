import { Component, input, signal } from '@angular/core';
import { MsButton } from 'maestral/button';

/** A live example with its source code and a copy button. */
@Component({
  selector: 'docs-example',
  imports: [MsButton],
  template: `
    <figure class="example">
      <div class="example__preview">
        <ng-content />
      </div>
      <div class="example__code">
        <pre><code>{{ code() }}</code></pre>
        <button msButton type="button" variant="ghost" size="sm" class="example__copy" (click)="copy()">
          {{ copied() ? 'Copied' : 'Copy' }}
        </button>
        <span class="example__status" role="status">{{ copied() ? 'Code copied to clipboard' : '' }}</span>
      </div>
    </figure>
  `,
  styles: `
    .example {
      margin: var(--ms-space-4) 0 var(--ms-space-6);
      border: 1px solid var(--ms-color-border);
      border-radius: var(--ms-radius-lg);
      overflow: hidden;
    }

    .example__preview {
      padding: var(--ms-space-8) var(--ms-space-6);
      background: var(--ms-color-bg);
    }

    .example__code {
      position: relative;
      border-block-start: 1px solid var(--ms-color-border);
    }

    .example__code pre {
      margin: 0;
      padding-inline-end: 6rem;
      border: 0;
      border-radius: 0;
    }

    .example__copy {
      position: absolute;
      inset-block-start: var(--ms-space-2);
      inset-inline-end: var(--ms-space-2);
    }

    .example__status {
      position: absolute;
      inline-size: 1px;
      block-size: 1px;
      overflow: hidden;
      clip-path: inset(50%);
    }
  `,
})
export class DocExample {
  readonly code = input.required<string>();
  protected readonly copied = signal(false);

  protected async copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.code());
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    } catch {
      // Clipboard can be blocked; the code stays selectable by hand.
    }
  }
}
