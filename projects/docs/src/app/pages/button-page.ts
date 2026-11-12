import { Component } from '@angular/core';
import { MsButton } from 'maestral/button';
import { ApiRow, ApiTable } from '../shared/api-table';
import { DocExample } from '../shared/doc-example';

@Component({
  selector: 'docs-button-page',
  imports: [MsButton, ApiTable, DocExample],
  template: `
    <h1>Button</h1>
    <p class="lead">Styles a native <code>&lt;button&gt;</code> or <code>&lt;a&gt;</code>.</p>
    <pre><code>import {{ '{' }} MsButton {{ '}' }} from 'maestral/button';</code></pre>

    <h2>Variants</h2>
    <p>Use one primary button per view for the main action. Other actions use secondary or ghost.</p>
    <docs-example [code]="variants">
      <div class="docs-row">
        <button msButton>Save</button>
        <button msButton variant="secondary">Preview</button>
        <button msButton variant="ghost">Cancel</button>
        <button msButton variant="danger">Delete</button>
      </div>
    </docs-example>

    <h2>Sizes</h2>
    <docs-example [code]="sizes">
      <div class="docs-row">
        <button msButton size="sm">Small</button>
        <button msButton>Medium</button>
        <button msButton size="lg">Large</button>
      </div>
    </docs-example>

    <h2>Links that look like buttons</h2>
    <p>
      Use <code>&lt;a msButton&gt;</code> when the action navigates somewhere. It stays a link for
      screen readers and keeps link behaviour such as opening in a new tab.
    </p>
    <docs-example [code]="link">
      <a msButton variant="secondary" href="https://github.com/AnamariaMarjanovic/maestral">View on GitHub</a>
    </docs-example>

    <h2>Toggle buttons</h2>
    <p>
      Add <code>aria-pressed</code> to show which option is on. The theme switch at the top of
      this page is built this way.
    </p>
    <docs-example [code]="toggle">
      <div class="docs-row" role="group" aria-label="Text alignment">
        <button msButton variant="secondary" aria-pressed="true">Left</button>
        <button msButton variant="secondary" aria-pressed="false">Center</button>
        <button msButton variant="secondary" aria-pressed="false">Right</button>
      </div>
    </docs-example>

    <h2>Disabled</h2>
    <p>
      Prefer leaving buttons enabled and explaining what is missing when they are used. Disabled
      buttons cannot be focused, so keyboard and screen reader users may not find out why.
    </p>
    <docs-example [code]="disabled">
      <button msButton disabled>Save</button>
    </docs-example>

    <h2>Accessibility</h2>
    <ul>
      <li>Only <code>&lt;button&gt;</code> and <code>&lt;a&gt;</code> accept <code>msButton</code>. Using it on a <code>&lt;div&gt;</code> is a compile error.</li>
      <li>Focus is shown with a ring that follows the sail shape.</li>
      <li>A button inside a <code>&lt;form&gt;</code> submits it by default. Add <code>type="button"</code> to buttons that should not.</li>
      <li>In Windows High Contrast mode, buttons keep a visible border.</li>
    </ul>

    <h2>API</h2>
    <docs-api-table caption="MsButton inputs" [rows]="api" />
  `,
})
export default class ButtonPage {
  protected readonly variants = `<button msButton>Save</button>
<button msButton variant="secondary">Preview</button>
<button msButton variant="ghost">Cancel</button>
<button msButton variant="danger">Delete</button>`;

  protected readonly sizes = `<button msButton size="sm">Small</button>
<button msButton>Medium</button>
<button msButton size="lg">Large</button>`;

  protected readonly link = `<a msButton variant="secondary" href="https://github.com/AnamariaMarjanovic/maestral">
  View on GitHub
</a>`;

  protected readonly toggle = `<div role="group" aria-label="Text alignment">
  <button msButton variant="secondary" aria-pressed="true">Left</button>
  <button msButton variant="secondary" aria-pressed="false">Center</button>
  <button msButton variant="secondary" aria-pressed="false">Right</button>
</div>`;

  protected readonly disabled = `<button msButton disabled>Save</button>`;

  protected readonly api: ApiRow[] = [
    {
      name: 'variant',
      type: "'primary' | 'secondary' | 'ghost' | 'danger'",
      default: "'primary'",
      description: 'Visual weight of the button.',
    },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Height and padding.' },
  ];
}
