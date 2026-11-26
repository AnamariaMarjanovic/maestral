import { Component, signal } from '@angular/core';
import { FormField, form, required } from '@angular/forms/signals';
import { MsCheckbox, MsChoice, MsRadio } from 'maestral/choice';
import { MsFieldset } from 'maestral/field';
import { ApiRow, ApiTable } from '../shared/api-table';
import { DocExample } from '../shared/doc-example';

@Component({
  selector: 'docs-choice-page',
  imports: [FormField, MsCheckbox, MsChoice, MsFieldset, MsRadio, ApiTable, DocExample],
  template: `
    <h1>Checkbox and radio</h1>
    <p class="lead">
      <code>msCheckbox</code> and <code>msRadio</code> style native inputs.
      <code>&lt;ms-fieldset&gt;</code> groups them under a legend, with a hint and an error.
    </p>
    <pre><code>{{ imports }}</code></pre>

    <h2>Radio group</h2>
    <p>
      Use radio buttons when exactly one option must be chosen. Give every radio in the group the
      same <code>[formField]</code> and its own <code>value</code>. Use the arrow keys to move
      between options, then Tab out of the group to see the error.
    </p>
    <docs-example [code]="radios">
      <ms-fieldset legend="Plan" hint="You can change your plan at any time.">
        @for (plan of plans; track plan.value) {
          <label msChoice>
            <input type="radio" msRadio [value]="plan.value" [formField]="demoForm.plan" />
            {{ plan.label }}
          </label>
        }
      </ms-fieldset>
    </docs-example>
    <pre><code>{{ radiosTs }}</code></pre>

    <h2>Checkboxes</h2>
    <p>
      Use checkboxes when any number of options can be chosen. Each checkbox binds to its own
      boolean.
    </p>
    <docs-example [code]="checkboxes">
      <ms-fieldset legend="Notifications" hint="Select all that apply.">
        <label msChoice>
          <input type="checkbox" msCheckbox [formField]="demoForm.notifyReleases" />
          New releases
        </label>
        <label msChoice>
          <input type="checkbox" msCheckbox [formField]="demoForm.notifyDocs" />
          Documentation updates
        </label>
      </ms-fieldset>
    </docs-example>

    <h2>A single required checkbox</h2>
    <p>
      For agreements, <code>required()</code> treats an unticked checkbox as missing. Put the
      checkbox in a fieldset so the error has a place to appear.
    </p>
    <docs-example [code]="agreement">
      <ms-fieldset legend="Terms">
        <label msChoice>
          <input type="checkbox" msCheckbox [formField]="demoForm.terms" />
          I accept the terms of use
        </label>
      </ms-fieldset>
    </docs-example>

    <h2>On its own</h2>
    <p>A checkbox that needs no validation can stand alone in its label.</p>
    <docs-example [code]="standalone">
      <label msChoice>
        <input type="checkbox" msCheckbox />
        Remember me on this device
      </label>
    </docs-example>

    <h2>Accessibility</h2>
    <ul>
      <li>The controls are native, so Space toggles a checkbox and the arrow keys move between radio buttons.</li>
      <li>Wrapping the input in <code>&lt;label msChoice&gt;</code> makes the whole text clickable and names the control.</li>
      <li>The legend is announced when focus enters the group; the hint and error describe the group.</li>
      <li>The checkbox keeps the sail shape at half size. In Windows High Contrast mode the system's own controls are shown.</li>
    </ul>

    <h2>API</h2>
    <docs-api-table caption="MsFieldset inputs" [rows]="fieldsetApi" />
    <docs-api-table caption="Directives" [rows]="directiveApi" />
  `,
})
export default class ChoicePage {
  protected readonly plans = [
    { value: 'free', label: 'Free' },
    { value: 'team', label: 'Team' },
    { value: 'enterprise', label: 'Enterprise' },
  ];

  protected readonly demo = signal({
    plan: '',
    notifyReleases: true,
    notifyDocs: false,
    terms: false,
  });

  protected readonly demoForm = form(this.demo, (path) => {
    required(path.plan, { message: 'Choose a plan' });
    required(path.terms, { message: 'Accept the terms of use to continue' });
  });

  protected readonly imports = `import { MsCheckbox, MsChoice, MsRadio } from 'maestral/choice';
import { MsFieldset } from 'maestral/field';`;

  protected readonly radios = `<ms-fieldset legend="Plan" hint="You can change your plan at any time.">
  @for (plan of plans; track plan.value) {
    <label msChoice>
      <input type="radio" msRadio [value]="plan.value" [formField]="demoForm.plan" />
      {{ plan.label }}
    </label>
  }
</ms-fieldset>`;

  protected readonly radiosTs = `readonly demo = signal({ plan: '' });

readonly demoForm = form(this.demo, (path) => {
  required(path.plan, { message: 'Choose a plan' });
});`;

  protected readonly checkboxes = `<ms-fieldset legend="Notifications" hint="Select all that apply.">
  <label msChoice>
    <input type="checkbox" msCheckbox [formField]="demoForm.notifyReleases" />
    New releases
  </label>
  <label msChoice>
    <input type="checkbox" msCheckbox [formField]="demoForm.notifyDocs" />
    Documentation updates
  </label>
</ms-fieldset>`;

  protected readonly agreement = `<ms-fieldset legend="Terms">
  <label msChoice>
    <input type="checkbox" msCheckbox [formField]="demoForm.terms" />
    I accept the terms of use
  </label>
</ms-fieldset>`;

  protected readonly standalone = `<label msChoice>
  <input type="checkbox" msCheckbox />
  Remember me on this device
</label>`;

  protected readonly fieldsetApi: ApiRow[] = [
    { name: 'legend', type: 'string', description: 'Required. Names the group.' },
    { name: 'hint', type: 'string', description: 'Extra guidance for the whole group.' },
    { name: 'error', type: 'string', description: 'Explicit error message. Wins over validation errors.' },
    { name: 'required', type: 'boolean', default: 'false', description: 'Marks the group as required without a required() rule.' },
  ];

  protected readonly directiveApi: ApiRow[] = [
    { name: 'msCheckbox', type: 'input[type=checkbox]', description: 'Styles a checkbox and reports its validation state to the fieldset.' },
    { name: 'msRadio', type: 'input[type=radio]', description: 'Styles a radio button and reports its validation state to the fieldset.' },
    { name: 'msChoice', type: 'label', description: 'Lays out a label beside its checkbox or radio button.' },
  ];
}
