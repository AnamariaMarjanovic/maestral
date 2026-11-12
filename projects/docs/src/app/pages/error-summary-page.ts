import { Component } from '@angular/core';
import { ContactForm } from '../examples/contact-form/contact-form';
import { ApiRow, ApiTable } from '../shared/api-table';

@Component({
  selector: 'docs-error-summary-page',
  imports: [ContactForm, ApiTable],
  template: `
    <h1>Error summary</h1>
    <p class="lead">
      After a failed submit, lists every problem at the top of the form and takes the user
      straight to it.
    </p>
    <pre><code>import {{ '{' }} MsErrorSummary {{ '}' }} from 'maestral/error-summary';</code></pre>

    <h2>Example</h2>
    <p>
      Press <strong>Send</strong> with empty fields. Focus moves to the summary; each link
      focuses its field and scrolls its label into view. Items disappear as you fix them.
    </p>
    <docs-contact-form />

    <h2>Usage</h2>
    <p>Place the summary at the top of the form and give it the form's field tree:</p>
    <pre><code>{{ usage }}</code></pre>

    <h2>Why it matters</h2>
    <p>
      Without a summary, focus stays on the submit button after a failed submit. Screen reader
      users hear nothing, and sighted users may not see errors further down the page. The
      pattern follows the GOV.UK Design System, which has been tested widely with users of
      assistive technology.
    </p>

    <h2>Accessibility</h2>
    <ul>
      <li>The summary is a region labelled by its heading, and receives focus after every failed submit.</li>
      <li>Each item uses the same message as its field.</li>
      <li>Messages set with the <code>error</code> input of <code>&lt;ms-field&gt;</code> are not part of the form's validation, so they are not listed.</li>
    </ul>

    <h2>API</h2>
    <docs-api-table caption="MsErrorSummary inputs" [rows]="api" />
  `,
})
export default class ErrorSummaryPage {
  protected readonly usage = `<form novalidate (submit)="onSubmit($event)">
  <ms-error-summary [form]="contactForm" />

  <ms-field label="Full name">
    <input msInput [formField]="contactForm.name" />
  </ms-field>
  ...
  <button msButton type="submit">Send</button>
</form>`;

  protected readonly api: ApiRow[] = [
    { name: 'form', type: 'FieldTree<unknown>', description: 'Required. The Signal Forms field tree to summarise.' },
    { name: 'title', type: 'string', default: "'There is a problem'", description: 'Heading of the summary.' },
  ];
}
