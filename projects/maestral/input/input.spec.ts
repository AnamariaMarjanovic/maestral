import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormField, email, form, minLength, required } from '@angular/forms/signals';
import { MsField, provideMsErrorMessages } from 'maestral/field';
import { MsInput } from './input';

@Component({
  imports: [FormField, MsField, MsInput],
  template: `
    <ms-field id="name" label="Full name">
      <input msInput [formField]="contactForm.name" />
    </ms-field>
    <ms-field id="email" label="Email">
      <input msInput type="email" [formField]="contactForm.email" />
    </ms-field>
    <ms-field id="message" label="Message">
      <textarea msInput [formField]="contactForm.message"></textarea>
    </ms-field>
    <input msInput id="standalone" aria-label="Standalone" />
  `,
})
class Host {
  readonly model = signal({ name: '', email: '', message: '' });
  readonly contactForm = form(this.model, (path) => {
    required(path.name, { message: 'Enter your full name' });
    required(path.email);
    email(path.email);
    minLength(path.message, 10);
  });
}

describe('MsInput', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const field = (id: string) => {
      const host = root.querySelector<HTMLElement>(`#${id}`)!;
      return {
        label: host.querySelector('label')!,
        control: host.querySelector<HTMLInputElement>('.ms-input')!,
        error: () => host.querySelector('.ms-field__error')?.textContent?.replace('Error: ', '').trim() ?? null,
      };
    };
    const type = async (control: HTMLInputElement | HTMLTextAreaElement, value: string) => {
      control.value = value;
      control.dispatchEvent(new Event('input'));
      await fixture.whenStable();
    };
    const blur = async (control: HTMLElement) => {
      control.dispatchEvent(new Event('blur'));
      await fixture.whenStable();
    };
    return { fixture, root, field, type, blur };
  }

  it('styles a native input outside a field without ARIA state', async () => {
    const { root } = await setup();
    const input = root.querySelector<HTMLInputElement>('#standalone')!;
    expect(input.classList).toContain('ms-input');
    expect(input.hasAttribute('aria-invalid')).toBe(false);
  });

  describe('with Signal Forms', () => {
    it('takes required from the schema', async () => {
      const { field } = await setup();
      expect(field('name').control.getAttribute('aria-required')).toBe('true');
      expect(field('name').label.querySelector('.ms-field__required')).not.toBeNull();
      expect(field('message').control.hasAttribute('aria-required')).toBe(false);
    });

    it('does not show errors while the user is still typing', async () => {
      const { field, type } = await setup();
      const { control, error } = field('email');
      await type(control, 'ana@');
      expect(error()).toBeNull();
      expect(control.hasAttribute('aria-invalid')).toBe(false);
    });

    it('shows the error once the user leaves the field', async () => {
      const { field, type, blur } = await setup();
      const { control, error } = field('email');
      await type(control, 'ana@');
      await blur(control);
      expect(error()).toBe('Enter an email address in the correct format, like name@example.com');
      expect(control.getAttribute('aria-invalid')).toBe('true');
    });

    it('prefers the message from the schema', async () => {
      const { field, blur } = await setup();
      const { control, error } = field('name');
      await blur(control);
      expect(error()).toBe('Enter your full name');
    });

    it('removes the error as soon as the value is valid', async () => {
      const { field, type, blur } = await setup();
      const { control, error } = field('email');
      await type(control, 'ana@');
      await blur(control);
      await type(control, 'ana@example.com');
      expect(error()).toBeNull();
      expect(control.hasAttribute('aria-invalid')).toBe(false);
    });

    it('shows one error at a time', async () => {
      const { root, field, blur } = await setup();
      await blur(field('email').control);
      expect(root.querySelectorAll('#email .ms-field__error')).toHaveLength(1);
      expect(field('email').error()).toBe('This field is required');
    });
  });

  describe('with custom messages', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [provideMsErrorMessages({ required: () => 'Polje je obavezno' })],
      });
    });

    it('uses the provided message and keeps the other defaults', async () => {
      const { field, type, blur } = await setup();
      await blur(field('email').control);
      expect(field('email').error()).toBe('Polje je obavezno');

      await type(field('message').control, 'short');
      await blur(field('message').control);
      expect(field('message').error()).toBe('Enter at least 10 characters');
    });
  });
});
