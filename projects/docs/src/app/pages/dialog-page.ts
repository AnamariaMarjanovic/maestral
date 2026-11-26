import { Component, signal } from '@angular/core';
import { FormField, form, required, submit } from '@angular/forms/signals';
import { MsButton } from 'maestral/button';
import { MsDialog, MsDialogActions, MsDialogClose, MsDialogTitle } from 'maestral/dialog';
import { MsErrorSummary } from 'maestral/error-summary';
import { MsField } from 'maestral/field';
import { MsInput } from 'maestral/input';
import { ApiRow, ApiTable } from '../shared/api-table';
import { DocExample } from '../shared/doc-example';

@Component({
  selector: 'docs-dialog-page',
  imports: [
    FormField,
    MsButton,
    MsDialog,
    MsDialogActions,
    MsDialogClose,
    MsDialogTitle,
    MsErrorSummary,
    MsField,
    MsInput,
    ApiTable,
    DocExample,
  ],
  template: `
    <h1>Dialog</h1>
    <p class="lead">
      A modal dialog on the native <code>&lt;dialog&gt;</code> element. The browser makes the page
      behind it inert and closes it with Escape; Maestral returns focus to where you were.
    </p>
    <pre><code>import {{ '{' }} MsDialog, MsDialogActions, MsDialogClose, MsDialogTitle {{ '}' }} from 'maestral/dialog';</code></pre>

    <h2>Confirm a destructive action</h2>
    <p>
      Focus starts on <strong>Cancel</strong> through <code>autofocus</code>, so pressing Enter by
      accident does not delete anything. <code>closed</code> reports which button closed the
      dialog. Try Escape and clicking outside the dialog too.
    </p>
    <docs-example [code]="confirm">
      <div class="docs-row">
        <button msButton variant="danger" type="button" (click)="confirmOpen.set(true)">Delete project</button>
        <span role="status">{{ confirmResult() }}</span>
      </div>
      <dialog msDialog [(open)]="confirmOpen" (closed)="onConfirmClosed($event)">
        <h2 msDialogTitle>Delete this project?</h2>
        <p>The project and its 12 forms will be removed. This cannot be undone.</p>
        <div msDialogActions>
          <button msButton variant="secondary" msDialogClose autofocus>Cancel</button>
          <button msButton variant="danger" msDialogClose="delete">Delete project</button>
        </div>
      </dialog>
    </docs-example>

    <h2>A form in a dialog</h2>
    <p>
      Fields, validation and the error summary work inside a dialog like anywhere else. The
      dialog closes only when the form is valid.
    </p>
    <docs-example [code]="formExample">
      <div class="docs-row">
        <button msButton type="button" (click)="renameOpen.set(true)">Rename project</button>
        <span>Current name: <strong>{{ projectName() }}</strong></span>
      </div>
      <dialog msDialog [(open)]="renameOpen" (closed)="resetRename()">
        <form class="docs-stack" novalidate (submit)="onRename($event)">
          <h2 msDialogTitle>Rename project</h2>
          <ms-error-summary [form]="renameForm" />
          <ms-field label="Project name" hint="Shown to everyone in your team.">
            <input msInput [formField]="renameForm.name" autocomplete="off" />
          </ms-field>
          <div msDialogActions>
            <button msButton variant="secondary" msDialogClose>Cancel</button>
            <button msButton type="submit">Save</button>
          </div>
        </form>
      </dialog>
    </docs-example>

    <h2>Accessibility</h2>
    <ul>
      <li>The dialog is opened with <code>showModal()</code>: the rest of the page is inert, so Tab and screen readers stay inside it.</li>
      <li>Escape closes it. Clicking the backdrop closes it too, unless <code>[closeOnBackdrop]="false"</code>.</li>
      <li>Its accessible name comes from the element marked <code>msDialogTitle</code>.</li>
      <li>Focus moves into the dialog when it opens, to the first focusable element or the one with <code>autofocus</code>, and returns to the element that opened it when it closes.</li>
      <li>The page behind the dialog does not scroll, and the opening animation is turned off for people who prefer reduced motion.</li>
      <li>For a dialog that interrupts with an urgent question, add <code>role="alertdialog"</code>.</li>
    </ul>

    <h2>API</h2>
    <docs-api-table caption="MsDialog" [rows]="dialogApi" />
    <docs-api-table caption="Related directives" [rows]="directivesApi" />
  `,
})
export default class DialogPage {
  protected readonly confirmOpen = signal(false);
  protected readonly confirmResult = signal('');

  protected readonly projectName = signal('Maestral docs');
  protected readonly renameOpen = signal(false);
  protected readonly rename = signal({ name: '' });
  protected readonly renameForm = form(this.rename, (path) => {
    required(path.name, { message: 'Enter a project name' });
  });

  protected onConfirmClosed(value: string): void {
    this.confirmResult.set(value === 'delete' ? 'Project deleted (not really).' : 'Nothing was deleted.');
  }

  protected onRename(event: Event): void {
    event.preventDefault();
    submit(this.renameForm, async () => {
      this.projectName.set(this.rename().name);
      this.renameOpen.set(false);
    });
  }

  protected resetRename(): void {
    this.rename.set({ name: '' });
    this.renameForm().reset();
  }

  protected readonly confirm = `<button msButton variant="danger" (click)="open.set(true)">Delete project</button>

<dialog msDialog [(open)]="open" (closed)="onClosed($event)">
  <h2 msDialogTitle>Delete this project?</h2>
  <p>The project and its 12 forms will be removed. This cannot be undone.</p>
  <div msDialogActions>
    <button msButton variant="secondary" msDialogClose autofocus>Cancel</button>
    <button msButton variant="danger" msDialogClose="delete">Delete project</button>
  </div>
</dialog>`;

  protected readonly formExample = `<dialog msDialog [(open)]="renameOpen">
  <form novalidate (submit)="onRename($event)">
    <h2 msDialogTitle>Rename project</h2>
    <ms-error-summary [form]="renameForm" />
    <ms-field label="Project name" hint="Shown to everyone in your team.">
      <input msInput [formField]="renameForm.name" />
    </ms-field>
    <div msDialogActions>
      <button msButton variant="secondary" msDialogClose>Cancel</button>
      <button msButton type="submit">Save</button>
    </div>
  </form>
</dialog>

onRename(event: Event) {
  event.preventDefault();
  submit(this.renameForm, async () => {
    this.projectName.set(this.rename().name);
    this.renameOpen.set(false);
  });
}`;

  protected readonly dialogApi: ApiRow[] = [
    { name: '[(open)]', type: 'boolean', default: 'false', description: 'Opens and closes the dialog; updated when the user closes it.' },
    { name: 'closeOnBackdrop', type: 'boolean', default: 'true', description: 'Close when the user clicks outside the dialog box.' },
    { name: '(closed)', type: 'string', description: "Emits on close with the closing button's value, or an empty string." },
    { name: 'close(value?)', type: 'method', description: 'Closes the dialog from code. Available through #ref="msDialog".' },
  ];

  protected readonly directivesApi: ApiRow[] = [
    { name: 'msDialogTitle', type: 'heading', description: 'Names the dialog for screen readers.' },
    { name: 'msDialogClose', type: 'button', description: 'Closes the dialog; its value is emitted by (closed). Never submits a form.' },
    { name: 'msDialogActions', type: 'element', description: 'Lays out buttons at the end of the dialog.' },
  ];
}
