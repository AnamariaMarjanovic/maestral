import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MsDialog, MsDialogActions, MsDialogClose, MsDialogTitle } from './dialog';

/**
 * jsdom does not implement <dialog>. This stand-in covers what the directive
 * relies on: showModal, close with a return value, and the close event.
 * Inert backgrounds, Escape and the backdrop are checked in a real browser.
 */
function installDialogStub(): void {
  const proto = Object.getPrototypeOf(document.createElement('dialog')) as Record<string, unknown>;
  Object.defineProperty(proto, 'open', {
    configurable: true,
    get(this: HTMLElement) {
      return this.hasAttribute('open');
    },
  });
  proto['returnValue'] = '';
  proto['showModal'] = function (this: HTMLElement) {
    this.setAttribute('open', '');
    this.querySelector<HTMLElement>('[autofocus]')?.focus();
  };
  proto['close'] = function (this: HTMLElement & { returnValue: string }, value?: string) {
    if (!this.hasAttribute('open')) {
      return;
    }
    if (value !== undefined) {
      this.returnValue = value;
    }
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
  };
}

@Component({
  imports: [MsDialog, MsDialogActions, MsDialogClose, MsDialogTitle],
  template: `
    <button id="trigger" (click)="open.set(true)">Delete project</button>
    <dialog msDialog [(open)]="open" (closed)="results.push($event)">
      <h2 msDialogTitle>Delete this project?</h2>
      <p>This cannot be undone.</p>
      <div msDialogActions>
        <button id="cancel" msDialogClose autofocus>Cancel</button>
        <button id="delete" msDialogClose="delete">Delete</button>
      </div>
    </dialog>
  `,
})
class Host {
  readonly open = signal(false);
  readonly results: string[] = [];
}

describe('MsDialog', () => {
  beforeAll(installDialogStub);

  async function setup() {
    const fixture = TestBed.createComponent(Host);
    document.body.appendChild(fixture.nativeElement);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const dialog = root.querySelector('dialog')!;
    const click = async (selector: string) => {
      root.querySelector<HTMLElement>(selector)!.click();
      await fixture.whenStable();
    };
    return { fixture, root, dialog, click };
  }

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('is closed until opened', async () => {
    const { dialog } = await setup();
    expect(dialog.hasAttribute('open')).toBe(false);
    expect(dialog.classList).toContain('ms-dialog');
  });

  it('is named by its title', async () => {
    const { dialog } = await setup();
    const title = dialog.querySelector('h2')!;
    expect(title.id).toBeTruthy();
    expect(dialog.getAttribute('aria-labelledby')).toBe(title.id);
  });

  it('opens when the bound signal is set', async () => {
    const { dialog, click } = await setup();
    await click('#trigger');
    expect(dialog.hasAttribute('open')).toBe(true);
    expect(document.activeElement?.id).toBe('cancel');
  });

  it('closes with the value of the button that was pressed', async () => {
    const { fixture, dialog, click } = await setup();
    await click('#trigger');
    await click('#delete');
    expect(dialog.hasAttribute('open')).toBe(false);
    expect(fixture.componentInstance.open()).toBe(false);
    expect(fixture.componentInstance.results).toEqual(['delete']);
  });

  it('closes with an empty value from a plain close button', async () => {
    const { fixture, click } = await setup();
    await click('#trigger');
    await click('#cancel');
    expect(fixture.componentInstance.results).toEqual(['']);
  });

  it('closes when the bound signal is cleared', async () => {
    const { fixture, dialog, click } = await setup();
    await click('#trigger');
    fixture.componentInstance.open.set(false);
    await fixture.whenStable();
    expect(dialog.hasAttribute('open')).toBe(false);
    expect(fixture.componentInstance.results).toEqual(['']);
  });

  it('syncs the binding when the browser closes it, for example with Escape', async () => {
    const { fixture, dialog, click } = await setup();
    await click('#trigger');
    (dialog as HTMLDialogElement).close();
    await fixture.whenStable();
    expect(fixture.componentInstance.open()).toBe(false);
  });

  it('returns focus to the element that opened it', async () => {
    const { root, click } = await setup();
    const trigger = root.querySelector<HTMLElement>('#trigger')!;
    trigger.focus();
    await click('#trigger');
    await click('#delete');
    expect(document.activeElement).toBe(trigger);
  });

  it('makes close buttons non-submitting', async () => {
    const { root } = await setup();
    expect(root.querySelector('#delete')!.getAttribute('type')).toBe('button');
  });
});
