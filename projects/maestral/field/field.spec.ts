import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MsInput } from 'maestral/input';
import { MsField } from './field';

@Component({
  imports: [MsField, MsInput],
  template: `
    <ms-field id="name" label="Full name" hint="As it appears on your ID." [required]="true">
      <input msInput />
    </ms-field>

    <ms-field id="email" label="Email" [error]="emailError()">
      <input msInput type="email" />
    </ms-field>

    <ms-field id="custom" label="Message">
      <textarea msInput id="my-message"></textarea>
    </ms-field>
  `,
})
class Host {
  readonly emailError = signal<string | undefined>(undefined);
}

describe('MsField', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const field = (id: string) => {
      const host = root.querySelector<HTMLElement>(`#${id}`)!;
      return {
        host,
        label: host.querySelector('label')!,
        control: host.querySelector<HTMLElement>('.ms-input')!,
        hint: host.querySelector<HTMLElement>('.ms-field__hint'),
        error: host.querySelector<HTMLElement>('.ms-field__error'),
      };
    };
    return { fixture, field };
  }

  it('connects the label to the control', async () => {
    const { field } = await setup();
    const { label, control } = field('name');
    expect(control.id).toBeTruthy();
    expect(label.htmlFor).toBe(control.id);
  });

  it('keeps a custom control id and points the label at it', async () => {
    const { field } = await setup();
    const { label, control } = field('custom');
    expect(control.id).toBe('my-message');
    expect(label.htmlFor).toBe('my-message');
  });

  it('describes the control with its hint', async () => {
    const { field } = await setup();
    const { control, hint } = field('name');
    expect(hint?.textContent).toContain('As it appears on your ID.');
    expect(control.getAttribute('aria-describedby')).toBe(hint!.id);
  });

  it('marks required fields with aria-required and a hidden asterisk', async () => {
    const { field } = await setup();
    const { control, label } = field('name');
    expect(control.getAttribute('aria-required')).toBe('true');
    expect(label.querySelector('.ms-field__required')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('has no error state until an error is set', async () => {
    const { field } = await setup();
    const { control, error, host } = field('email');
    expect(error).toBeNull();
    expect(control.hasAttribute('aria-invalid')).toBe(false);
    expect(control.hasAttribute('aria-describedby')).toBe(false);
    expect(host.hasAttribute('data-invalid')).toBe(false);
  });

  it('shows an explicit error and wires it up for screen readers', async () => {
    const { fixture, field } = await setup();
    fixture.componentInstance.emailError.set('Enter a valid email');
    await fixture.whenStable();

    const { control, error } = field('email');
    expect(error?.textContent?.trim()).toBe('Error: Enter a valid email');
    expect(error?.querySelector('.ms-visually-hidden')?.textContent).toBe('Error: ');
    expect(control.getAttribute('aria-invalid')).toBe('true');
    expect(control.getAttribute('aria-describedby')).toBe(error!.id);
  });
});
