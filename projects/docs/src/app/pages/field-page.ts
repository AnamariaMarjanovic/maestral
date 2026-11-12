import { Component, signal } from '@angular/core';
import { FormField, form, minLength, required } from '@angular/forms/signals';
import { MsField } from 'maestral/field';
import { MsInput } from 'maestral/input';
import { ApiRow, ApiTable } from '../shared/api-table';
import { DocExample } from '../shared/doc-example';

@Component({
  selector: 'docs-field-page',
  imports: [FormField, MsField, MsInput, ApiTable, DocExample],
  template: `
    <h1>Field and input</h1>
    <p class="lead">
      <code>&lt;ms-field&gt;</code> gives a control its label, hint and error message, and connects
      them for screen readers. <code>msInput</code> styles native inputs and text areas.
    </p>
    <pre><code>{{ imports }}</code></pre>

    <h2>Basic field</h2>
    <p>
      The label is connected to the input, so clicking it focuses the input and screen readers
      announce it. The hint is announced as the input's description.
    </p>
    <docs-example [code]="basic">
      <div class="docs-stack">
        <ms-field label="Full name" hint="As it appears on your ID.">
          <input msInput autocomplete="name" />
        </ms-field>
      </div>
    </docs-example>

    <h2>Validation with Signal Forms</h2>
    <p>
      Bind the control with <code>[formField]</code> and the field does the rest: the asterisk and
      <code>aria-required</code> come from <code>required()</code>, and errors appear once the user
      leaves the field, never while they are still typing. Type a short username and press Tab.
    </p>
    <docs-example [code]="validation">
      <div class="docs-stack">
        <ms-field label="Username" hint="At least 3 characters.">
          <input msInput [formField]="signupForm.username" autocomplete="username" />
        </ms-field>
      </div>
    </docs-example>
    <pre><code>{{ validationTs }}</code></pre>

    <h2>Explicit error</h2>
    <p>
      Set <code>error</code> to show a message that does not come from validation, for example
      one returned by a server. It takes precedence over validation errors.
    </p>
    <docs-example [code]="explicit">
      <div class="docs-stack">
        <ms-field label="Email" error="This email address is already registered">
          <input msInput type="email" value="ana@example.com" />
        </ms-field>
      </div>
    </docs-example>

    <h2>Text area</h2>
    <docs-example [code]="textarea">
      <div class="docs-stack">
        <ms-field label="Message">
          <textarea msInput></textarea>
        </ms-field>
      </div>
    </docs-example>

    <h2>Error messages</h2>
    <p>
      Built-in validators have plain English messages that say what to do. A
      <code>message</code> set in the schema wins. To translate or reword messages, provide your
      own per error kind; the rest keep their defaults.
    </p>
    <pre><code>{{ messages }}</code></pre>

    <h2>Accessibility</h2>
    <ul>
      <li>Order is label, hint, error, control, so the hint and error are read before the control and are not hidden by autofill popups or the on-screen keyboard.</li>
      <li>Errors start with a visually hidden "Error:" so screen readers announce them as errors.</li>
      <li>The invalid state is shown with a thicker border as well as color.</li>
      <li>Only the first error is shown. Fixing it may reveal the next one.</li>
      <li>Use <code>novalidate</code> on forms so browser bubbles do not compete with these messages.</li>
    </ul>

    <h2>API</h2>
    <docs-api-table caption="MsField inputs" [rows]="fieldApi" />
    <docs-api-table caption="MsInput inputs" [rows]="inputApi" />
    <docs-api-table caption="Error message helpers" [rows]="messageApi" />
  `,
})
export default class FieldPage {
  protected readonly signup = signal({ username: '' });
  protected readonly signupForm = form(this.signup, (path) => {
    required(path.username);
    minLength(path.username, 3);
  });

  protected readonly imports = `import { MsField } from 'maestral/field';
import { MsInput } from 'maestral/input';`;

  protected readonly basic = `<ms-field label="Full name" hint="As it appears on your ID.">
  <input msInput autocomplete="name" />
</ms-field>`;

  protected readonly validation = `<ms-field label="Username" hint="At least 3 characters.">
  <input msInput [formField]="signupForm.username" autocomplete="username" />
</ms-field>`;

  protected readonly validationTs = `readonly signup = signal({ username: '' });

readonly signupForm = form(this.signup, (path) => {
  required(path.username);
  minLength(path.username, 3);
});`;

  protected readonly explicit = `<ms-field label="Email" error="This email address is already registered">
  <input msInput type="email" />
</ms-field>`;

  protected readonly textarea = `<ms-field label="Message">
  <textarea msInput></textarea>
</ms-field>`;

  protected readonly messages = `// app.config.ts
import { provideMsErrorMessages } from 'maestral/field';

providers: [
  provideMsErrorMessages({
    required: () => 'Polje je obavezno',
    minLength: (error) => 'Unesite barem ' + error['minLength'] + ' znakova',
  }),
]`;

  protected readonly fieldApi: ApiRow[] = [
    { name: 'label', type: 'string', description: 'Required. Text of the label.' },
    { name: 'hint', type: 'string', description: 'Extra guidance shown under the label.' },
    { name: 'error', type: 'string', description: 'Explicit error message. Wins over validation errors.' },
    { name: 'required', type: 'boolean', default: 'false', description: 'Marks the field as required without a required() rule.' },
  ];

  protected readonly inputApi: ApiRow[] = [
    { name: 'id', type: 'string', description: 'Custom id. When omitted, one is generated and the label follows it either way.' },
  ];

  protected readonly messageApi: ApiRow[] = [
    { name: 'provideMsErrorMessages()', type: '(messages: MsErrorMessages) => Provider', description: 'Overrides or translates messages per error kind.' },
    { name: 'MS_DEFAULT_ERROR_MESSAGES', type: 'MsErrorMessages', description: 'The built-in English messages.' },
  ];
}
